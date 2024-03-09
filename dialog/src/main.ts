import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { KafkaOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const KAFKA_HOST = configService.get('KAFKA_HOST');
  const KAFKA_PORT = configService.get('KAFKA_PORT');
  app.connectMicroservice<KafkaOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'dialog',
        brokers: [`${KAFKA_HOST}:${KAFKA_PORT}`],
      },
      consumer: {
        groupId: 'dialog-consumer',
      },
    },
  });
  await app.startAllMicroservices();
}
bootstrap();
