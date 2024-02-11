import { ConfigService } from '@nestjs/config';
import { IRedisConfig } from '../redis/redis.interface';

export const getRedisConfig = async (configService: ConfigService): Promise<IRedisConfig> => {
  const host = configService.get('REDIS_HOST');
  const port = configService.get<number>('REDIS_PORT') ?? 6379;
  return { host, port };
};
