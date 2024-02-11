import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { RmqOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const host = configService.get('RABBITMQ_HOST');
  const port = configService.get('RABBITMQ_PORT');
  const user = configService.get('RABBITMQ_DEFAULT_USER');
  const pass = configService.get('RABBITMQ_DEFAULT_PASS');
  const queue = configService.get('RABBITMQ_FEED_QUEUE');
  app.connectMicroservice<RmqOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [`amqp://${user}:${pass}@${host}:${port}`],
      queue,
      prefetchCount: 10,
    },
  });
  await app.startAllMicroservices();
  await app.init();
}
bootstrap();
