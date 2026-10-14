import swc from 'unplugin-swc';
import { defineConfig } from 'vitest/config';
import { testDatabaseUrl } from './test/test-db';

export default defineConfig({
  plugins: [swc.vite({ module: { type: 'es6' } })],
  test: {
    globals: true,
    include: ['test/**/*.e2e-spec.ts'],
    globalSetup: ['./test/global-setup.ts'],
    setupFiles: ['dotenv/config'],
    env: {
      THROTTLE_DISABLED: 'true',
      DATABASE_URL: testDatabaseUrl(),
      GPS_WEBHOOK_SECRET: 'test-gps-secret',
    },
    // Files share the seeded database and login state.
    fileParallelism: false,
  },
});
