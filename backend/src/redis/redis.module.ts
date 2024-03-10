import { DynamicModule, Global, Module, Provider } from '@nestjs/common';
import { Redis } from 'ioredis';
import { CommonRedisService } from './redis.service';
import { REDIS_SRC } from './redis.const';
import { IRedisModuleAsyncOptions } from './redis.interface';
import { DialogRedisService } from './services/dialog-redis.service';

@Global()
@Module({})
export class RedisModule {
  static registerAsync(options: IRedisModuleAsyncOptions): DynamicModule {
    const RedisSource = this.createAsyncRedisProvider(options);
    return {
      module: RedisModule,
      imports: options.imports,
      providers: [CommonRedisService, DialogRedisService, RedisSource],
      exports: [DialogRedisService, RedisSource],
    };
  }

  private static createAsyncRedisProvider(options: IRedisModuleAsyncOptions): Provider {
    return {
      provide: REDIS_SRC,
      useFactory: async (...args: any[]) => {
        try {
          const { host, port } = await options.useFactory(...args);
          const redisClient = new Redis({
            host,
            port,
          });
          return redisClient;
        } catch (e) {
          console.error(e);
          throw e;
        }
      },
      inject: options.inject || [],
    };
  }
}
