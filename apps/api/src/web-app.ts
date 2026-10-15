import type { NestExpressApplication } from '@nestjs/platform-express';
import type { NextFunction, Request, Response } from 'express';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

const SECURITY_HEADERS: Record<string, string> = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
};

/**
 * Serves the built web app from the API (WEB_DIST_DIR), for single-service hosting
 * such as Render. The production Compose stack serves it from Caddy instead.
 * Hashed assets are cached for a year; every other non-API path gets index.html.
 */
export function serveWebApp(app: NestExpressApplication, dir: string): void {
  const index = join(dir, 'index.html');
  if (!existsSync(index)) throw new Error(`WEB_DIST_DIR has no index.html: ${dir}`);

  app.useStaticAssets(dir, {
    index: false,
    setHeaders: (res: Response, path: string) => {
      for (const [k, v] of Object.entries(SECURITY_HEADERS)) res.setHeader(k, v);
      res.setHeader(
        'Cache-Control',
        path.includes(`${join(dir, 'assets')}`)
          ? 'public, max-age=31536000, immutable'
          : 'no-cache',
      );
    },
  });
  app.use((req: Request, res: Response, next: NextFunction) => {
    if ((req.method !== 'GET' && req.method !== 'HEAD') || req.path.startsWith('/api/')) {
      return next();
    }
    res.set({ ...SECURITY_HEADERS, 'Cache-Control': 'no-cache' });
    res.sendFile(index);
  });
}
