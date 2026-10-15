/** Validates required environment variables at startup so a bad deploy fails fast. */
const REQUIRED = ['DATABASE_URL', 'REDIS_URL', 'JWT_ACCESS_SECRET', 'JWT_REFRESH_SECRET'] as const;

export function validateEnv(config: Record<string, unknown>): Record<string, unknown> {
  const missing = REQUIRED.filter((key) => !config[key]);
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
  if (config['GPS_PULL_PROVIDER'] === 'trakzee') {
    const vendor = [
      'GPS_VENDOR_BASE_URL',
      'GPS_VENDOR_USERNAME',
      'GPS_VENDOR_PASSWORD',
      'GPS_VENDOR_PROJECT_ID',
    ].filter((key) => !config[key]);
    if (vendor.length > 0) {
      throw new Error(`GPS_PULL_PROVIDER=trakzee needs: ${vendor.join(', ')}`);
    }
  }
  if (config['NODE_ENV'] === 'production') {
    if (config['THROTTLE_DISABLED'] === 'true') {
      throw new Error('THROTTLE_DISABLED must not be set in production');
    }
    for (const key of ['JWT_ACCESS_SECRET', 'JWT_REFRESH_SECRET', 'GPS_WEBHOOK_SECRET'] as const) {
      if (String(config[key]).startsWith('change-me')) {
        throw new Error(`${key} must be set to a real secret in production`);
      }
    }
  }
  return config;
}

/**
 * Real production: NODE_ENV=production and APP_ENV is not "staging".
 * Staging (UAT) runs production builds but may use console login codes and messages.
 */
export function isLiveProduction(get: (key: string) => unknown): boolean {
  return get('NODE_ENV') === 'production' && get('APP_ENV') !== 'staging';
}
