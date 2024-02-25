import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { KafkaOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const ws_port = configService.get('WS_PORT');
  const KAFKA_HOST = configService.get('KAFKA_HOST');
  const KAFKA_PORT = configService.get('KAFKA_PORT');
  app.connectMicroservice<KafkaOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: [`${KAFKA_HOST}:${KAFKA_PORT}`],
      },
      consumer: {
        groupId: 'feed-consumer',
      },
    },
  });
  await app.startAllMicroservices();
  await app.listen(ws_port);
}
bootstrap();
