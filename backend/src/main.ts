import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import * as fs from 'fs';
import { AppModule } from './app.module';
import { SwaggerModule } from '@nestjs/swagger';
import * as path from 'path';
import { ZodValidationPipe } from 'nestjs-zod';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());
  const configService = app.get(ConfigService);
  const PORT = configService.get<number>('API_PORT');
  app.useGlobalPipes(new ZodValidationPipe());
  const openApiSpec = JSON.parse(fs.readFileSync(path.join(__dirname, '../openapi-spec.json'), 'utf8'));
  SwaggerModule.setup('api-docs', app, openApiSpec);
  await app.listen(PORT || 3000, '0.0.0.0');
}

bootstrap();
