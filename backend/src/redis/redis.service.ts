import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';
import { REDIS_SRC } from './redis.const';

@Injectable()
export class CommonRedisService implements OnModuleInit {
  constructor(@Inject(REDIS_SRC) private readonly redisClient: Redis) {}

  onModuleInit() {
    this.redisClient.on('error', (err) => console.log('Redis Client Error', err));
  }
}
