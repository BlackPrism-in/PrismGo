import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { RedisIoAdapter } from './realtime/redis-io.adapter';
import { API_PREFIX, buildOpenApi, setupApp } from './setup-app';
import { serveWebApp } from './web-app';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const config = app.get(ConfigService);
  // Behind Caddy or a platform load balancer: read the client IP from X-Forwarded-For,
  // so rate limits apply per user and not to the proxy as a whole.
  // TRUST_PROXY = number of proxy hops (Caddy: 1), or "true" where the hop count varies.
  const trustProxy = config.get<string>('TRUST_PROXY');
  if (trustProxy === 'true') app.set('trust proxy', true);
  else if (Number(trustProxy) > 0) app.set('trust proxy', Number(trustProxy));
  setupApp(app);
  const io = new RedisIoAdapter(app, config.getOrThrow('REDIS_URL'));
  await io.connect();
  app.useWebSocketAdapter(io);
  SwaggerModule.setup(`${API_PREFIX}/docs`, app, buildOpenApi(app));
  const webDir = config.get<string>('WEB_DIST_DIR');
  if (webDir) serveWebApp(app, webDir);
  await app.listen(process.env['PORT'] ?? 4000);
}
void bootstrap();
