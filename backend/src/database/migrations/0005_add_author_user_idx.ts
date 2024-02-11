import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  // Migration code
  sql<any>`
    CREATE INDEX author_user_id_idx ON public.post (author_user_id);
  `.execute(db);
}

export async function down(db: Kysely<any>): Promise<void> {
  // Migration code
  await sql<any>`DROP INDEX IF EXISTS author_user_id_idx;`.execute(db);
}
