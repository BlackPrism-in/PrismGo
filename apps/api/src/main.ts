import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { RedisIoAdapter } from './realtime/redis-io.adapter';
import { API_PREFIX, buildOpenApi, setupApp } from './setup-app';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  setupApp(app);
  const io = new RedisIoAdapter(app, app.get(ConfigService).getOrThrow('REDIS_URL'));
  await io.connect();
  app.useWebSocketAdapter(io);
  SwaggerModule.setup(`${API_PREFIX}/docs`, app, buildOpenApi(app));
  await app.listen(process.env['PORT'] ?? 4000);
}
void bootstrap();
