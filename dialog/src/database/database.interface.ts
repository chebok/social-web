import { ModuleMetadata } from '@nestjs/common';
import { PoolConfig } from 'pg';

export interface IDatabaseConfig {
  pgMasterConfig: PoolConfig;
}

export interface IDatabaseModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  useFactory: (...args: any[]) => Promise<IDatabaseConfig> | IDatabaseConfig;
  inject?: any[];
}
