import { DynamicModule, Global, Module, Provider } from '@nestjs/common';
import { Pool } from 'pg';
import { DatabaseService } from './database.service';
import { PG_MASTER_DB, PG_REPLICA_DB } from './database.constants';
import { IDatabaseModuleAsyncOptions } from './database.interface';

@Global()
@Module({})
export class DatabaseModule {
  static forRootAsync(options: IDatabaseModuleAsyncOptions): DynamicModule {
    const MasterDbSource = this.createAsyncPgMasteProvider(options);
    const ReplicaDbSource = this.createAsyncPgReplicaProvider(options);
    return {
      module: DatabaseModule,
      imports: options.imports,
      providers: [DatabaseService, MasterDbSource, ReplicaDbSource],
      exports: [DatabaseService, MasterDbSource, ReplicaDbSource],
    };
  }

  private static createAsyncPgMasteProvider(options: IDatabaseModuleAsyncOptions): Provider {
    return {
      provide: PG_MASTER_DB,
      useFactory: async (...args: any[]) => {
        try {
          const { pgMasterConfig } = await options.useFactory(...args);
          return new Pool(pgMasterConfig);
        } catch (e) {
          console.error(e);
          throw e;
        }
      },
      inject: options.inject || [],
    };
  }

  private static createAsyncPgReplicaProvider(options: IDatabaseModuleAsyncOptions): Provider {
    return {
      provide: PG_REPLICA_DB,
      useFactory: async (...args: any[]) => {
        try {
          const { pgReplicaConfig } = await options.useFactory(...args);
          return new Pool(pgReplicaConfig);
        } catch (e) {
          console.error(e);
          throw e;
        }
      },
      inject: options.inject || [],
    };
  }
}
