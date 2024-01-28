import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import * as path from 'path';
import { promises as fs } from 'fs';
import { FileMigrationProvider, Kysely, Migrator, PostgresDialect } from 'kysely';
import { POSTGRE_DB_SOURCE } from './database.constants';
import { SocialWebDatabase } from './database.interface';
import { Pool } from 'pg';

@Injectable()
export class DatabaseService implements OnModuleInit {
  private db: Kysely<SocialWebDatabase>;

  constructor(@Inject(POSTGRE_DB_SOURCE) readonly pgPool: Pool) {
    const dialect = new PostgresDialect({
      pool: this.pgPool,
    });
    this.db = new Kysely<SocialWebDatabase>({
      dialect,
      log: ['query'],
    });
  }

  public getDb() {
    return this.db;
  }

  async onModuleInit() {
    await this.migrateToLatest();
  }

  async migrateToLatest() {
    const migrator = new Migrator({
      db: this.db,
      provider: new FileMigrationProvider({
        fs,
        path,
        // This needs to be an absolute path.
        migrationFolder: path.join(__dirname, 'migrations'),
      }),
    });

    const { error, results } = await migrator.migrateToLatest();

    results?.forEach((it) => {
      if (it.status === 'Success') {
        console.log(`migration "${it.migrationName}" was executed successfully`);
      } else if (it.status === 'Error') {
        console.error(`failed to execute migration "${it.migrationName}"`);
      }
    });

    if (error) {
      console.error('failed to migrate');
      console.error(error);
      process.exit(1);
    }

    //await this.db.destroy();
  }
}
