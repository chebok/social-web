import { DynamicModule, Global, Module, Provider } from '@nestjs/common';
import { Pool } from 'pg';
import { Kysely, PostgresDialect } from 'kysely';
import { DatabaseService } from './database.service';
import { POSTGRE_DB_SOURCE } from './database.constants';
import { IDatabaseModuleAsyncOptions, SocialWebDatabase } from './database.interface';

@Global()
@Module({})
export class DatabaseModule {
  static forRootAsync(options: IDatabaseModuleAsyncOptions): DynamicModule {
    const DbSource = this.createAsyncOptionsProvider(options);
    return {
      module: DatabaseModule,
      imports: options.imports,
      providers: [DatabaseService, DbSource],
      exports: [DatabaseService, DbSource],
    };
  }

  private static createAsyncOptionsProvider(options: IDatabaseModuleAsyncOptions): Provider {
    return {
      provide: POSTGRE_DB_SOURCE,
      useFactory: async (...args: any[]) => {
        try {
          const dbConfig = await options.useFactory(...args);
          const dialect = new PostgresDialect({
            pool: new Pool(dbConfig),
          });
          const db = new Kysely<SocialWebDatabase>({
            dialect,
            log: ['query'],
          });
          return db;
        } catch (e) {
          console.error(e);
          throw e;
        }
      },
      inject: options.inject || [],
    };
  }
}
