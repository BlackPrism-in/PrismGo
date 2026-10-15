import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import { PrismaExceptionFilter } from './common/prisma-exception.filter';

export const API_PREFIX = 'api/v1';

/** Shared by main.ts, the OpenAPI export and e2e tests so they all see the same app. */
export function setupApp(app: INestApplication): void {
  const config = app.get(ConfigService);
  app.setGlobalPrefix(API_PREFIX);
  // Render sets RENDER_EXTERNAL_URL to the service's own address.
  const origins = config.get<string>('WEB_ORIGIN') ?? config.get<string>('RENDER_EXTERNAL_URL');
  app.enableCors({
    origin: origins?.split(',') ?? true,
    credentials: true,
  });
  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }),
  );
  app.useGlobalFilters(new PrismaExceptionFilter());
  app.enableShutdownHooks();
}

export function buildOpenApi(app: INestApplication): OpenAPIObject {
  const doc = new DocumentBuilder()
    .setTitle('PrismGo API')
    .setDescription('Fleet request, approval, assignment and live tracking')
    .setVersion('0.1.0')
    .addBearerAuth()
    .build();
  return SwaggerModule.createDocument(app, doc);
}
