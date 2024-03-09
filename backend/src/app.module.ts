import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { getDatabaseConfig } from './configs/database.config';
import { PostModule } from './post/post.module';
import { FriendModule } from './friend/friend.module';
import { KafkaModule } from './kafka/kafka.module';
import { RedisModule } from './redis/redis.module';
import { getRedisConfig } from './configs/redis.config';
import { DialogModule } from './dialog/dialog.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '../.env',
      isGlobal: true,
    }),
    UserModule,
    DatabaseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: getDatabaseConfig,
    }),
    AuthModule,
    PostModule,
    FriendModule,
    KafkaModule,
    RedisModule.registerAsync({
      inject: [ConfigService],
      useFactory: getRedisConfig,
    }),
    DialogModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
