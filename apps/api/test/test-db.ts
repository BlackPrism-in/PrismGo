import 'dotenv/config';

/** The dev DATABASE_URL with the database name suffixed "_test". */
export function testDatabaseUrl(): string {
  const base = process.env['DATABASE_URL'];
  if (!base) throw new Error('DATABASE_URL is not set');
  const url = new URL(base);
  if (!url.pathname.endsWith('_test')) url.pathname = `${url.pathname}_test`;
  return url.toString();
}
