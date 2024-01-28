import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  // Migration code
  sql<any>`
    CREATE INDEX user_names_idx ON public.user (first_name text_pattern_ops, second_name text_pattern_ops);
  `.execute(db);
}

export async function down(db: Kysely<any>): Promise<void> {
  // Migration code
  await sql<any>`DROP INDEX IF EXISTS user_names_idx;`.execute(db);
}
