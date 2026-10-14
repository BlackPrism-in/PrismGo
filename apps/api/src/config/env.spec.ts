import { isLiveProduction, validateEnv } from './env';

const base = {
  DATABASE_URL: 'postgresql://x',
  REDIS_URL: 'redis://x',
  JWT_ACCESS_SECRET: 'a',
  JWT_REFRESH_SECRET: 'b',
};

describe('validateEnv', () => {
  it('accepts a complete config', () => {
    expect(validateEnv(base)).toBe(base);
  });

  it('names every missing variable', () => {
    expect(() => validateEnv({ DATABASE_URL: 'x' })).toThrow(
      'REDIS_URL, JWT_ACCESS_SECRET, JWT_REFRESH_SECRET',
    );
  });

  it('rejects placeholder secrets in production', () => {
    expect(() =>
      validateEnv({ ...base, NODE_ENV: 'production', JWT_ACCESS_SECRET: 'change-me' }),
    ).toThrow('JWT_ACCESS_SECRET');
  });
});

describe('isLiveProduction', () => {
  const env = (vars: Record<string, string>) => (k: string) => vars[k];

  it('is true only for production builds not marked staging', () => {
    expect(isLiveProduction(env({ NODE_ENV: 'production' }))).toBe(true);
    expect(isLiveProduction(env({ NODE_ENV: 'production', APP_ENV: 'staging' }))).toBe(false);
    expect(isLiveProduction(env({ NODE_ENV: 'development' }))).toBe(false);
  });
});
