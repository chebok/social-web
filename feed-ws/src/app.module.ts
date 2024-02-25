import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostModule } from './post/post.module';
import { getRedisConfig } from './configs/redis.config';
import { RedisModule } from './redis/redis.module';
import { getDatabaseConfig } from './configs/database.config';
import { DatabaseModule } from './database/database.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { KafkaModule } from './kafka/kafka.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '../.env',
      isGlobal: true,
    }),
    PostModule,
    KafkaModule,
    EventEmitterModule.forRoot(),
    RedisModule.registerAsync({
      inject: [ConfigService],
      useFactory: getRedisConfig,
    }),
    DatabaseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: getDatabaseConfig,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
