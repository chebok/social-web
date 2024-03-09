import { DynamicModule, Global, Module, Provider } from '@nestjs/common';
import { Pool } from 'pg';
import { DatabaseService } from './database.service';
import { PG_MASTER_DB } from './database.constants';
import { IDatabaseModuleAsyncOptions } from './database.interface';

@Global()
@Module({})
export class DatabaseModule {
  static forRootAsync(options: IDatabaseModuleAsyncOptions): DynamicModule {
    const MasterDbSource = this.createAsyncPgMasteProvider(options);
    return {
      module: DatabaseModule,
      imports: options.imports,
      providers: [DatabaseService, MasterDbSource],
      exports: [DatabaseService, MasterDbSource],
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
}
