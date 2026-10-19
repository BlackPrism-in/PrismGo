import { createVerify, generateKeyPairSync } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import { FcmPushSender, parseServiceAccount } from './push';

const { privateKey, publicKey } = generateKeyPairSync('rsa', { modulusLength: 2048 });
const account = {
  project_id: 'prismgo-test',
  client_email: 'push@prismgo-test.iam.gserviceaccount.com',
  private_key: privateKey.export({ type: 'pkcs8', format: 'pem' }).toString(),
};
const message = {
  title: 'PG-1042 approved',
  body: 'A vehicle will be assigned soon.',
  data: { requestId: 'r1' },
};

function fakeGoogle(sendStatus: number, sendBody = '{}') {
  const calls: { url: string; body: string; auth?: string }[] = [];
  const fetchFn = (async (url: string, init: RequestInit) => {
    const body = String(init.body);
    calls.push({ url, body, auth: (init.headers as Record<string, string>)['Authorization'] });
    if (url.includes('oauth2')) {
      return new Response(JSON.stringify({ access_token: 'access-1', expires_in: 3600 }));
    }
    return new Response(sendBody, { status: sendStatus });
  }) as typeof fetch;
  return { calls, fetchFn };
}

describe('FCM push sender', () => {
  it('signs a valid service-account JWT and sends with the access token', async () => {
    const google = fakeGoogle(200);
    const sender = new FcmPushSender(account, google.fetchFn);
    expect(await sender.send('device-token-abc', message)).toBe('ok');
    await sender.send('device-token-def', message);

    const auth = google.calls.filter((c) => c.url.includes('oauth2'));
    expect(auth).toHaveLength(1); // token cached
    const assertion = new URLSearchParams(auth[0]!.body).get('assertion')!;
    const [h, p, s] = assertion.split('.');
    const valid = createVerify('RSA-SHA256')
      .update(`${h}.${p}`)
      .verify(publicKey, Buffer.from(s!, 'base64url'));
    expect(valid).toBe(true);
    expect(JSON.parse(Buffer.from(p!, 'base64url').toString())).toMatchObject({
      iss: account.client_email,
      scope: 'https://www.googleapis.com/auth/firebase.messaging',
    });

    const send = google.calls.find((c) => c.url.includes('fcm.googleapis.com'))!;
    expect(send.url).toBe('https://fcm.googleapis.com/v1/projects/prismgo-test/messages:send');
    expect(send.auth).toBe('Bearer access-1');
    expect(JSON.parse(send.body).message).toMatchObject({
      token: 'device-token-abc',
      notification: { title: message.title, body: message.body },
      data: { requestId: 'r1' },
    });
  });

  it('reports uninstalled apps as invalid tokens and throws on other errors', async () => {
    const gone = fakeGoogle(
      404,
      '{"error":{"status":"NOT_FOUND","details":[{"errorCode":"UNREGISTERED"}]}}',
    );
    expect(await new FcmPushSender(account, gone.fetchFn).send('t', message)).toBe('invalid-token');

    const down = fakeGoogle(503, 'unavailable');
    await expect(new FcmPushSender(account, down.fetchFn).send('t', message)).rejects.toThrow(
      'FCM 503',
    );
  });

  it('reads the service account as JSON or base64', () => {
    const json = JSON.stringify(account);
    expect(parseServiceAccount(json).project_id).toBe('prismgo-test');
    expect(parseServiceAccount(Buffer.from(json).toString('base64')).client_email).toBe(
      account.client_email,
    );
    expect(() => parseServiceAccount('{"project_id":"x"}')).toThrow('missing');
    expect(() => parseServiceAccount('{"project_info":{"project_id":"x"},"client":[]}')).toThrow(
      'google-services.json',
    );
    // A parse error must not echo the input (it holds a private key).
    expect(() => parseServiceAccount('{"private_key":"-----BEGIN SECRET')).toThrow(
      /^FCM_SERVICE_ACCOUNT_JSON is not valid JSON/,
    );
    try {
      parseServiceAccount('{"private_key":"-----BEGIN SECRET');
    } catch (e) {
      expect((e as Error).message).not.toContain('SECRET');
    }
  });
});
