/**
 * Builds the Postman collection (docs/postman/PrismGo-API.postman_collection.json) from
 * openapi.json, adding descriptions, example bodies and responses, and scripts that keep
 * tokens and ids in collection variables.
 *
 *   pnpm --filter @prismgo/api openapi && pnpm --filter @prismgo/api postman
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

type Schema = Record<string, any>;
type Op = Record<string, any>;

const root = resolve(__dirname, '../../..');
const spec = JSON.parse(readFileSync(resolve(__dirname, '../openapi.json'), 'utf8'));
const OUT = resolve(root, 'docs/postman/PrismGo-API.postman_collection.json');

const TM = 'Transport Manager, Super Admin';
const ANY = 'Any signed-in user';

/** Per endpoint: name, who may call it, what it does, and scripts. Keyed "METHOD path". */
const DOCS: Record<
  string,
  { name: string; roles: string; doc: string; test?: string[]; pre?: string[] }
> = {
  'POST /auth/otp/request': {
    name: 'Request login code',
    roles: 'Public',
    doc: 'Sends a 6-digit login code to the phone on WhatsApp. The answer is the same for unregistered numbers, so it does not reveal who has an account. Rate-limited per phone and IP.\n\n`devCode` is returned only on the demo server (`OTP_EXPOSE_CODE=true`) when WhatsApp could not deliver; if present it is saved to `otpCode`.',
    test: [
      'const b = pm.response.json();',
      "if (b.devCode) pm.collectionVariables.set('otpCode', b.devCode);",
    ],
  },
  'POST /auth/otp/verify': {
    name: 'Verify login code',
    roles: 'Public',
    doc: 'Exchanges the code for tokens. Codes expire after 5 minutes; 5 wrong attempts invalidate the code.\n\nSaves `accessToken` (sent as `Authorization: Bearer` by every other request) and `refreshToken`. Web clients send `X-Client: web` and get the refresh token as an httpOnly cookie instead.',
    test: [
      'const b = pm.response.json();',
      "pm.collectionVariables.set('accessToken', b.accessToken);",
      "if (b.refreshToken) pm.collectionVariables.set('refreshToken', b.refreshToken);",
      "pm.collectionVariables.set('userId', b.user.id);",
    ],
  },
  'POST /auth/refresh': {
    name: 'Refresh tokens',
    roles: 'Public (needs a refresh token)',
    doc: 'Issues a new access token and rotates the refresh token. The old refresh token stops working.',
    test: [
      'const b = pm.response.json();',
      "pm.collectionVariables.set('accessToken', b.accessToken);",
      "if (b.refreshToken) pm.collectionVariables.set('refreshToken', b.refreshToken);",
    ],
  },
  'POST /auth/logout': {
    name: 'Log out',
    roles: 'Public (needs a refresh token)',
    doc: 'Revokes the refresh token. The access token stays valid until it expires (15 minutes).',
  },
  'GET /auth/me': {
    name: 'Current user',
    roles: ANY,
    doc: 'The signed-in user with roles and department.',
  },
  'GET /health': {
    name: 'Health check',
    roles: 'Public',
    doc: 'Database and Redis status. 200 when both are up, 503 otherwise. Use it for uptime monitoring.',
  },
  'GET /departments': {
    name: 'List departments',
    roles: ANY,
    doc: 'All departments with their HOD and member count.',
    test: firstId('departmentId'),
  },
  'POST /departments': {
    name: 'Create department',
    roles: TM,
    doc: 'Names are unique within the organisation. `hodUserId` must be a user with the `hod` role.',
    test: saveId('departmentId'),
  },
  'PATCH /departments/{id}': {
    name: 'Update department',
    roles: TM,
    doc: 'Changes name, cost centre or HOD. Send only the fields to change; `hodUserId: null` removes the HOD.',
  },
  'GET /users': {
    name: 'List users',
    roles: TM,
    doc: 'Filter by `role`, `departmentId`, `status` or search `q` (name or phone). Disable the query params you do not need.',
    test: firstId('userId'),
  },
  'POST /users': {
    name: 'Create user',
    roles: TM,
    doc: 'Phone numbers are unique and stored as +91XXXXXXXXXX. Requesters and HODs need a department.',
    test: saveId('userId'),
  },
  'GET /users/{id}': { name: 'Get user', roles: TM, doc: 'One user by id.' },
  'PATCH /users/{id}': {
    name: 'Update user',
    roles: TM,
    doc: 'Change details, roles or department. `status: inactive` blocks login and ends their sessions.',
  },
  'GET /vehicles': {
    name: 'List vehicles',
    roles: TM,
    doc: 'All vehicles with status and GPS device id.',
    test: firstId('vehicleId'),
  },
  'POST /vehicles': {
    name: 'Create vehicle',
    roles: TM,
    doc: 'Registration numbers are unique (stored uppercase without spaces). Leave `gpsDeviceId` empty: the tracker IMEI is filled in when the GPS vendor reports this registration number.',
    test: saveId('vehicleId'),
  },
  'PATCH /vehicles/{id}': {
    name: 'Update vehicle',
    roles: TM,
    doc: 'Vehicles in `maintenance` or `inactive` are not offered when assigning.',
  },
  'GET /drivers': {
    name: 'List drivers',
    roles: TM,
    doc: 'All drivers with status and default vehicle. Drivers have no login.',
    test: firstId('driverId'),
  },
  'POST /drivers': {
    name: 'Create driver',
    roles: TM,
    doc: 'Phone numbers are unique. The driver gets trip details on WhatsApp when assigned.',
    test: saveId('driverId'),
  },
  'PATCH /drivers/{id}': {
    name: 'Update driver',
    roles: TM,
    doc: 'Drivers `on_leave` or `inactive` are not offered when assigning.',
  },
  'GET /notifications': {
    name: 'List notifications',
    roles: ANY,
    doc: 'The signed-in user’s notifications, newest first.',
    test: firstId('notificationId'),
  },
  'GET /notifications/unread-count': {
    name: 'Unread count',
    roles: ANY,
    doc: 'Number of unread notifications (for the bell badge).',
  },
  'POST /notifications/{id}/read': {
    name: 'Mark notification read',
    roles: ANY,
    doc: 'Marks one notification as read.',
  },
  'POST /notifications/read-all': {
    name: 'Mark all read',
    roles: ANY,
    doc: 'Marks every notification of the signed-in user as read.',
  },
  'POST /devices': {
    name: 'Register device for push',
    roles: ANY,
    doc: 'Called by the mobile app after login with its Firebase (FCM) token, so the user gets push notifications.',
  },
  'DELETE /devices/{token}': {
    name: 'Unregister device',
    roles: ANY,
    doc: 'Called by the mobile app on logout.',
  },
  'GET /requests': {
    name: 'List requests',
    roles: ANY,
    doc: '`scope`:\n- `mine` (default): requests I raised\n- `approvals`: pending requests from departments I am HOD of\n- `all`: every request (Transport Manager, Super Admin)\n\nOptional `status` filter.',
    test: firstId('requestId'),
  },
  'POST /requests': {
    name: 'Create request',
    roles: 'Requester, HOD',
    doc: 'Creates a draft (`submit: false`) or submits it at once (`submit: true`). Pickup must be in the future; `returnAt` after `startAt`. A request raised by the HOD of the department is approved automatically.\n\nThe pre-request script sets `startAt` to 2 hours from now.',
    pre: [
      "pm.collectionVariables.set('startAt', new Date(Date.now() + 2 * 3600e3).toISOString());",
    ],
    test: saveId('requestId'),
  },
  'GET /requests/{id}': {
    name: 'Get request',
    roles: 'Requester (own), HOD (own department), Transport Manager, Super Admin',
    doc: 'Full request with timeline and trip (vehicle, driver). Others get 404.',
    test: [
      'const b = pm.response.json();',
      "if (b.trip) pm.collectionVariables.set('tripId', b.trip.id);",
    ],
  },
  'PATCH /requests/{id}': {
    name: 'Update draft',
    roles: 'Requester (own draft)',
    doc: 'Only drafts can be edited.',
  },
  'POST /requests/{id}/submit': {
    name: 'Submit draft',
    roles: 'Requester (own draft)',
    doc: 'Moves a draft to `pending_approval` and notifies the HOD.',
  },
  'POST /requests/{id}/cancel': {
    name: 'Cancel request',
    roles: 'Requester (own), Transport Manager, Super Admin',
    doc: 'Cancels a request before the trip starts; frees the vehicle and driver if assigned.',
  },
  'POST /requests/{id}/approve': {
    name: 'Approve request',
    roles: 'HOD of the request’s department',
    doc: 'Moves `pending_approval` to `approved`; notifies the requester and Transport Managers.',
  },
  'POST /requests/{id}/reject': {
    name: 'Reject request',
    roles: 'HOD of the request’s department',
    doc: 'A comment is required and shown to the requester.',
  },
  'GET /availability': {
    name: 'Check availability',
    roles: TM,
    doc: 'Vehicles and drivers for a time window. `available: false` comes with the clashing request in `conflict`; `fits` says whether the vehicle has enough seats for `passengers`.',
    pre: [
      "pm.collectionVariables.set('startAt', new Date(Date.now() + 2 * 3600e3).toISOString());",
      "pm.collectionVariables.set('endAt', new Date(Date.now() + 4 * 3600e3).toISOString());",
    ],
  },
  'POST /requests/{id}/assign': {
    name: 'Assign vehicle and driver',
    roles: TM,
    doc: 'Assigns an approved request. Double booking is refused (409). If two managers assign at once, one gets 409 "already assigned". Notifies the requester and the driver.',
    test: [
      'const b = pm.response.json();',
      "if (b.trip) pm.collectionVariables.set('tripId', b.trip.id);",
    ],
  },
  'POST /trips/{id}/reassign': {
    name: 'Reassign trip',
    roles: TM,
    doc: 'Changes the vehicle and/or driver of a scheduled trip.',
  },
  'POST /gps/webhook': {
    name: 'GPS push (vendor webhook)',
    roles: 'GPS vendor (X-GPS-Secret header)',
    doc: 'Where the GPS vendor (Uffizio) pushes positions. Up to 1,000 points per request. Points for devices not linked to a vehicle are counted in `rejected` and listed in `unknownDevices`. 401 without the correct secret.\n\nSet `gpsSecret` in the collection variables (Current value only).',
    pre: ["pm.collectionVariables.set('now', new Date().toISOString());"],
  },
  'GET /gps/trackers/unlinked': {
    name: 'Unlinked GPS trackers',
    roles: TM,
    doc: 'Trackers the vendor reported in the last 24 h whose registration number matches no vehicle.',
  },
  'GET /live/vehicles': {
    name: 'Live vehicles',
    roles: TM,
    doc: 'Every vehicle with its latest position, `stale` when no position for 5 minutes, and its current or next trip with ETA.',
  },
  'GET /trips/{id}/track': {
    name: 'Trip track',
    roles: 'Requester (own), Transport Manager, Super Admin',
    doc: 'Driven path and latest position for a trip; the vehicle position is shown from an hour before pickup.',
  },
  'POST /trips/{id}/start': {
    name: 'Start trip manually',
    roles: TM,
    doc: 'Trips start by themselves when the vehicle leaves pickup; this overrides it.',
  },
  'POST /trips/{id}/end': {
    name: 'End trip manually',
    roles: TM,
    doc: 'Trips end by themselves at drop (or back at pickup with a return); this overrides it.',
  },
};

const FOLDERS: Record<string, string> = {
  auth: 'Auth',
  health: 'Health',
  departments: 'Departments',
  users: 'Users',
  vehicles: 'Vehicles',
  drivers: 'Drivers',
  requests: 'Requests',
  assignments: 'Assignments',
  live: 'Live tracking',
  gps: 'GPS webhook',
  notifications: 'Notifications',
};

/** Path params → the collection variable holding the id. */
const PATH_VARS: Record<string, string> = {
  departments: 'departmentId',
  users: 'userId',
  vehicles: 'vehicleId',
  drivers: 'driverId',
  requests: 'requestId',
  trips: 'tripId',
  notifications: 'notificationId',
  devices: 'deviceToken',
};

/** Example bodies that need live values rather than the schema examples. */
const BODIES: Record<string, unknown> = {
  'POST /auth/otp/request': { phone: '{{phone}}' },
  'POST /auth/otp/verify': { phone: '{{phone}}', code: '{{otpCode}}' },
  'POST /auth/refresh': { refreshToken: '{{refreshToken}}' },
  'POST /auth/logout': { refreshToken: '{{refreshToken}}' },
  'POST /requests': {
    pickup: { address: 'Hill Cart Road, Siliguri', lat: 26.7271, lng: 88.3953 },
    drop: { address: 'Bagdogra Airport, Siliguri', lat: 26.6812, lng: 88.3286 },
    startAt: '{{startAt}}',
    returnAt: null,
    passengers: 2,
    purpose: 'Client visit',
    submit: true,
  },
  'POST /requests/{id}/assign': { vehicleId: '{{vehicleId}}', driverId: '{{driverId}}' },
  'POST /trips/{id}/reassign': { vehicleId: '{{vehicleId}}', driverId: '{{driverId}}' },
  'POST /devices': { token: '{{deviceToken}}', platform: 'android' },
  'POST /gps/webhook': {
    points: [
      {
        deviceId: '<tracker IMEI>',
        recordedAt: '{{now}}',
        lat: 26.7271,
        lng: 88.3953,
        speedKmh: 32.5,
        heading: 304,
        ignition: true,
        odometerKm: 9050,
      },
    ],
  },
};

const QUERY_VALUES: Record<string, string> = {
  from: '{{startAt}}',
  to: '{{endAt}}',
  passengers: '2',
  scope: 'mine',
};

function firstId(variable: string): string[] {
  return [
    'const b = pm.response.json();',
    `if (Array.isArray(b) && b.length) pm.collectionVariables.set('${variable}', b[0].id);`,
  ];
}

function saveId(variable: string): string[] {
  return [`pm.collectionVariables.set('${variable}', pm.response.json().id);`];
}

function ref(s: Schema): Schema {
  if (s?.$ref) return ref(spec.components.schemas[s.$ref.split('/').pop()]);
  if (s?.allOf?.length === 1) return { ...s, ...ref(s.allOf[0]), allOf: undefined };
  return s;
}

/** An example value for a schema: its example, else a plausible value by type. */
function example(raw: Schema, key = '', depth = 0): unknown {
  const s = ref(raw);
  if (s.example !== undefined) return s.example;
  if (s.enum) return s.enum[0];
  if (depth > 6) return null;
  switch (s.type) {
    case 'object': {
      const out: Record<string, unknown> = {};
      for (const [k, v] of Object.entries<Schema>(s.properties ?? {})) {
        out[k] = example(v, k, depth + 1);
      }
      return out;
    }
    case 'array':
      return s.items ? [example(s.items, key, depth + 1)] : [];
    case 'number':
    case 'integer':
      return 0;
    case 'boolean':
      return true;
    default:
      if (s.format === 'date-time') return '2026-10-24T09:30:00.000Z';
      if (s.format === 'date') return '2030-03-31';
      if (key === 'id' || key.endsWith('Id')) return 'cm2x8k1qz0001abcd1234efgh';
      return key || 'string';
  }
}

function describeSchema(raw: Schema | undefined): string {
  const s = raw && ref(raw);
  if (!s?.properties) return '';
  const required = new Set<string>(s.required ?? []);
  const rows = Object.entries<Schema>(s.properties).map(([k, v]) => {
    const p = ref(v);
    const type = p.enum ? p.enum.map((e: string) => `\`${e}\``).join(' / ') : (p.type ?? 'object');
    return `| \`${k}\` | ${type}${p.nullable ? ', nullable' : ''} | ${required.has(k) ? 'yes' : ''} | ${p.description ?? ''} |`;
  });
  return ['| Field | Type | Required | Notes |', '| --- | --- | --- | --- |', ...rows].join('\n');
}

const folders = new Map<string, unknown[]>();
for (const [fullPath, ops] of Object.entries<Record<string, Op>>(spec.paths)) {
  const path = fullPath.replace(/^\/api\/v1/, '');
  for (const [method, op] of Object.entries(ops)) {
    const key = `${method.toUpperCase()} ${path}`;
    const meta = DOCS[key];
    if (!meta) throw new Error(`No docs for ${key}: add it to DOCS in scripts/postman.ts`);

    const segments = path.split('/').filter(Boolean);
    const variable: { key: string; value: string }[] = [];
    const urlPath = segments.map((seg, i) => {
      const m = /^\{(\w+)\}$/.exec(seg);
      if (!m) return seg;
      variable.push({ key: m[1]!, value: `{{${PATH_VARS[segments[i - 1]!] ?? m[1]}}}` });
      return `:${m[1]}`;
    });
    const query = (op.parameters ?? [])
      .filter((p: Schema) => p.in === 'query')
      .map((p: Schema) => ({
        key: p.name,
        value: QUERY_VALUES[p.name] ?? String(example(p.schema, p.name)),
        description: `${p.required ? 'Required. ' : ''}${ref(p.schema).enum?.join(' | ') ?? p.schema?.format ?? p.schema?.type ?? ''}`,
        disabled: !p.required && !(p.name in QUERY_VALUES),
      }));
    const url = {
      raw: `{{baseUrl}}/${urlPath.join('/')}${
        query.length
          ? '?' +
            query
              .filter((q: any) => !q.disabled)
              .map((q: any) => `${q.key}=${q.value}`)
              .join('&')
          : ''
      }`,
      host: ['{{baseUrl}}'],
      path: urlPath,
      ...(query.length ? { query } : {}),
      ...(variable.length ? { variable } : {}),
    };

    const bodySchema = op.requestBody?.content?.['application/json']?.schema;
    const header = bodySchema ? [{ key: 'Content-Type', value: 'application/json' }] : [];
    if (key === 'POST /gps/webhook') header.push({ key: 'X-GPS-Secret', value: '{{gpsSecret}}' });
    const body = bodySchema
      ? {
          mode: 'raw',
          raw: JSON.stringify(BODIES[key] ?? example(bodySchema), null, 2),
          options: { raw: { language: 'json' } },
        }
      : undefined;

    const isPublic = !op.security;
    const [code, res] = Object.entries<Schema>(op.responses)[0]!;
    const resSchema = res.content?.['application/json']?.schema;
    const description = [
      meta.doc,
      `**Who can call it:** ${meta.roles}`,
      bodySchema ? `**Body**\n\n${describeSchema(bodySchema)}` : '',
      `**Success:** ${code}${resSchema ? '' : ' (no body)'}`,
    ]
      .filter(Boolean)
      .join('\n\n');

    const request = {
      method: method.toUpperCase(),
      header,
      ...(body ? { body } : {}),
      url,
      description,
      ...(isPublic ? { auth: { type: 'noauth' } } : {}),
    };
    const event = [
      meta.pre && { listen: 'prerequest', script: { type: 'text/javascript', exec: meta.pre } },
      meta.test && {
        listen: 'test',
        script: {
          type: 'text/javascript',
          exec: ['if (pm.response.code < 300) {', ...meta.test.map((l) => '  ' + l), '}'],
        },
      },
    ].filter(Boolean);

    const tag = op.tags?.[0] ?? 'other';
    const items = folders.get(tag) ?? [];
    items.push({
      name: meta.name,
      ...(event.length ? { event } : {}),
      request,
      response: [
        {
          name: `${code} example`,
          originalRequest: request,
          status: Number(code) < 300 ? 'OK' : 'Error',
          code: Number(code),
          _postman_previewlanguage: 'json',
          header: [{ key: 'Content-Type', value: 'application/json' }],
          body: resSchema ? JSON.stringify(example(resSchema), null, 2) : '',
        },
      ],
    });
    folders.set(tag, items);
  }
}

const collection = {
  info: {
    name: 'PrismGo API',
    description: [
      '# PrismGo API',
      'Vehicle requests, HOD approval, vehicle and driver assignment, and live GPS tracking.',
      '- **Demo / UAT:** `https://api.prismgo.blackprism.in/api/v1`',
      '- **Local:** `http://localhost:4000/api/v1` (set `baseUrl`)',
      '- **OpenAPI (Swagger):** `{{baseUrl}}/docs`',
      '## Getting started',
      '1. Set `phone` to a registered mobile number.',
      '2. **Auth → Request login code**. The code arrives on WhatsApp; put it in `otpCode` (on the demo server it is filled in automatically when WhatsApp could not deliver).',
      '3. **Auth → Verify login code**. The access token is saved and used by every request (Bearer auth on the collection). It lasts 15 minutes; run **Refresh tokens** when you get 401.',
      '4. List endpoints save the first id they return (`requestId`, `vehicleId`, …), so requests further down work without copying ids.',
      '## Roles',
      '`requester`, `hod`, `transport_manager`, `super_admin`. A user can hold several. Each request’s description says who can call it; others get 403 (or 404 for records outside their scope).',
      '## Request flow',
      '`draft` → `pending_approval` → `approved` / `rejected` → `assigned` → `in_progress` → `completed` (or `cancelled`). Trips start and end by themselves from GPS; Transport Managers can override.',
      '## Errors',
      'JSON `{ "statusCode": 400, "message": "…" }`. 400 invalid input (message names the field), 401 not signed in or token expired, 403 role not allowed, 404 not found, 409 conflict (double booking, duplicate registration number or phone), 429 too many attempts.',
      '## Realtime',
      'Socket.IO on the API origin, `auth: { token: <accessToken> }`. Events: `request.updated` `{ id, status }`, `vehicle.position`, `notification`.',
    ].join('\n\n'),
    schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json',
  },
  auth: { type: 'bearer', bearer: [{ key: 'token', value: '{{accessToken}}', type: 'string' }] },
  variable: [
    { key: 'baseUrl', value: 'https://api.prismgo.blackprism.in/api/v1' },
    { key: 'phone', value: '' },
    { key: 'otpCode', value: '' },
    { key: 'accessToken', value: '' },
    { key: 'refreshToken', value: '' },
    { key: 'gpsSecret', value: '' },
    ...Object.values(PATH_VARS).map((key) => ({ key, value: '' })),
    { key: 'startAt', value: '' },
    { key: 'endAt', value: '' },
    { key: 'now', value: '' },
  ],
  item: Object.entries(FOLDERS)
    .filter(([tag]) => folders.has(tag))
    .map(([tag, name]) => ({ name, item: folders.get(tag) })),
};

writeFileSync(OUT, JSON.stringify(collection, null, 2) + '\n');
const count = [...folders.values()].reduce((n, f) => n + f.length, 0);
console.log(`Wrote ${count} requests in ${folders.size} folders to ${OUT}`);
