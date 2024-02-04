import { ModuleMetadata } from '@nestjs/common';
import { Generated } from 'kysely';
import { PoolConfig } from 'pg';

export interface IDatabaseConfig {
  pgMasterConfig: PoolConfig;
  pgReplicaConfig: PoolConfig;
}

export interface IDatabaseModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  useFactory: (...args: any[]) => Promise<IDatabaseConfig> | IDatabaseConfig;
  inject?: any[];
}

export interface SocialWebDatabase {
  user: UserTable;
}

export interface UserTable {
  id: Generated<string>;

  first_name: string;

  second_name: string;

  birthdate: Date;

  biography: string;

  city: string;

  password: string;
}
