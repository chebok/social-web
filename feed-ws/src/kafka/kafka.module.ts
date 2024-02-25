import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { AUTH_SERVICE } from './kafka.const';
import { Partitioners } from 'kafkajs';

@Global()
@Module({
  providers: [
    {
      provide: AUTH_SERVICE,
      useFactory: (configService: ConfigService) => {
        const host = configService.get('KAFKA_HOST');
        const port = configService.get('KAFKA_PORT');
        return ClientProxyFactory.create({
          transport: Transport.KAFKA,
          options: {
            client: {
              brokers: [`${host}:${port}`],
              clientId: 'auth',
            },
            producer: {
              createPartitioner: Partitioners.DefaultPartitioner,
            },
            consumer: {
              groupId: 'auth-consumer',
            }
          },
        });
      },
      inject: [ConfigService],
    },
  ],
  exports: [AUTH_SERVICE],
})
export class KafkaModule {}
