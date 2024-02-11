import { ModuleMetadata } from '@nestjs/common';

export interface IRedisConfig {
  host: string;
  port: number;
}

export interface IRedisModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  useFactory: (...args: any[]) => Promise<IRedisConfig> | IRedisConfig;
  inject?: any[];
}
