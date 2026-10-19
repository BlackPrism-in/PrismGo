import { Logger } from '@nestjs/common';
import { createSign } from 'node:crypto';

export interface PushMessage {
  title: string;
  body: string;
  /** String values only (FCM data payload); e.g. requestId for tap-to-open. */
  data: Record<string, string>;
}

/** "ok", or "invalid-token" when the device token is gone and should be deleted. */
export type PushResult = 'ok' | 'invalid-token';

/** Sends a push notification to one device. Throws on temporary failures (retried). */
export interface PushSender {
  readonly name: string;
  send(token: string, message: PushMessage): Promise<PushResult>;
}

export const PUSH_SENDER = Symbol('PUSH_SENDER');

/** No Firebase credentials configured: push is skipped (in-app and WhatsApp still work). */
export class LogPushSender implements PushSender {
  readonly name = 'log';
  private readonly logger = new Logger('Push');

  async send(token: string, message: PushMessage): Promise<PushResult> {
    this.logger.debug(`(not sent) → …${token.slice(-6)} ${message.title}`);
    return 'ok';
  }
}

interface ServiceAccount {
  project_id: string;
  client_email: string;
  private_key: string;
  token_uri?: string;
}

/** Accepts the service-account JSON as-is or base64-encoded (easier in some dashboards). */
export function parseServiceAccount(raw: string): ServiceAccount {
  const text = raw.trim().startsWith('{') ? raw : Buffer.from(raw, 'base64').toString('utf8');
  let sa: Partial<ServiceAccount> & { type?: string; project_info?: unknown };
  try {
    sa = JSON.parse(text) as typeof sa;
  } catch {
    // JSON.parse messages quote the input, which here holds a private key.
    throw new Error('FCM_SERVICE_ACCOUNT_JSON is not valid JSON (or base64 of JSON)');
  }
  if (sa.project_info) {
    throw new Error(
      'FCM_SERVICE_ACCOUNT_JSON holds google-services.json (the app config). Use the service-account key: Firebase → Project settings → Service accounts → Generate new private key',
    );
  }
  if (!sa.project_id || !sa.client_email || !sa.private_key) {
    throw new Error('FCM_SERVICE_ACCOUNT_JSON is missing project_id, client_email or private_key');
  }
  return sa as ServiceAccount;
}

const b64url = (v: string | Buffer) => Buffer.from(v).toString('base64url');

/**
 * Firebase Cloud Messaging HTTP v1. Signs a service-account JWT with node:crypto,
 * exchanges it for an access token (cached until shortly before expiry), then sends.
 */
export class FcmPushSender implements PushSender {
  readonly name = 'fcm';
  private accessToken: { value: string; expiresAt: number } | null = null;

  constructor(
    private readonly account: ServiceAccount,
    private readonly fetchFn: typeof fetch = fetch,
  ) {}

  async send(token: string, message: PushMessage): Promise<PushResult> {
    const res = await this.fetchFn(
      `https://fcm.googleapis.com/v1/projects/${this.account.project_id}/messages:send`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${await this.token()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: {
            token,
            notification: { title: message.title, body: message.body },
            data: message.data,
            android: { priority: 'high' },
          },
        }),
        signal: AbortSignal.timeout(10_000),
      },
    );
    if (res.ok) return 'ok';
    const text = await res.text();
    // The app was uninstalled or the token rotated: drop it rather than retrying.
    if (
      res.status === 404 ||
      (res.status === 400 && /UNREGISTERED|registration token/i.test(text))
    ) {
      return 'invalid-token';
    }
    if (res.status === 401) this.accessToken = null;
    throw new Error(`FCM ${res.status}: ${text.slice(0, 200)}`);
  }

  private async token(): Promise<string> {
    if (this.accessToken && Date.now() < this.accessToken.expiresAt) return this.accessToken.value;
    const tokenUri = this.account.token_uri ?? 'https://oauth2.googleapis.com/token';
    const now = Math.floor(Date.now() / 1000);
    const unsigned = `${b64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }))}.${b64url(
      JSON.stringify({
        iss: this.account.client_email,
        scope: 'https://www.googleapis.com/auth/firebase.messaging',
        aud: tokenUri,
        iat: now,
        exp: now + 3600,
      }),
    )}`;
    const signature = createSign('RSA-SHA256').update(unsigned).sign(this.account.private_key);
    const res = await this.fetchFn(tokenUri, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        assertion: `${unsigned}.${b64url(signature)}`,
      }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) throw new Error(`FCM auth ${res.status}: ${(await res.text()).slice(0, 200)}`);
    const body = (await res.json()) as { access_token: string; expires_in: number };
    this.accessToken = {
      value: body.access_token,
      expiresAt: Date.now() + (body.expires_in - 60) * 1000,
    };
    return body.access_token;
  }
}
