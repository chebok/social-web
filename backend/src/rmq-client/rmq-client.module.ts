import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { FEED_WS_SERVICE } from './rmq-client.const';

@Global()
@Module({
  providers: [
    {
      provide: FEED_WS_SERVICE,
      useFactory: (configService: ConfigService) => {
        const host = configService.get('RABBITMQ_HOST');
        const port = configService.get('RABBITMQ_PORT');
        const user = configService.get('RABBITMQ_DEFAULT_USER');
        const pass = configService.get('RABBITMQ_DEFAULT_PASS');
        const queue = configService.get('RABBITMQ_FEED_QUEUE');
        return ClientProxyFactory.create({
          transport: Transport.RMQ,
          options: {
            urls: [`amqp://${user}:${pass}@${host}:${port}`],
            queue,
          },
        });
      },
      inject: [ConfigService],
    },
  ],
  exports: [FEED_WS_SERVICE],
})
export class RmqClientModule {}
