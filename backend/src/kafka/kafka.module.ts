import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { FEED_WS_SERVICE } from './kafka.const';
import { Partitioners } from 'kafkajs';

@Global()
@Module({
  providers: [
    {
      provide: FEED_WS_SERVICE,
      useFactory: (configService: ConfigService) => {
        const host = configService.get('KAFKA_HOST');
        const port = configService.get('KAFKA_PORT');
        return ClientProxyFactory.create({
          transport: Transport.KAFKA,
          options: {
            client: {
              brokers: [`${host}:${port}`],
              clientId: 'feed-ws',
            },
            producer: {
              createPartitioner: Partitioners.DefaultPartitioner,
            },
            producerOnlyMode: true,
          },
        });
      },
      inject: [ConfigService],
    },
  ],
  exports: [FEED_WS_SERVICE],
})
export class KafkaModule {}
