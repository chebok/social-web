import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  // Migration code
  sql<any>`
    CREATE INDEX updated_at_idx ON public.post (updated_at);
  `.execute(db);
}

export async function down(db: Kysely<any>): Promise<void> {
  // Migration code
  await sql<any>`DROP INDEX IF EXISTS updated_at_idx;`.execute(db);
}
