import { DynamicModule, Global, Module, Provider } from '@nestjs/common';
import { createClient } from 'redis';
import { RedisService } from './redis.service';
import { REDIS_SRC } from './redis.const';
import { IRedisModuleAsyncOptions } from './redis.interface';

@Global()
@Module({})
export class RedisModule {
  static registerAsync(options: IRedisModuleAsyncOptions): DynamicModule {
    const RedisSource = this.createAsyncRedisProvider(options);
    return {
      module: RedisModule,
      imports: options.imports,
      providers: [RedisService, RedisSource],
      exports: [RedisService, RedisSource],
    };
  }

  private static createAsyncRedisProvider(options: IRedisModuleAsyncOptions): Provider {
    return {
      provide: REDIS_SRC,
      useFactory: async (...args: any[]) => {
        try {
          const { host, port } = await options.useFactory(...args);
          const client = await createClient({
            url: `redis://${host}:${port}`,
          })
            .on('error', (err) => console.log('Redis Client Error', err))
            .connect();
          return client;
        } catch (e) {
          console.error(e);
          throw e;
        }
      },
      inject: options.inject || [],
    };
  }
}
