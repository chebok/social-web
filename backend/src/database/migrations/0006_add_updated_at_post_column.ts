import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  // Migration code
  sql<any>`
    ALTER TABLE public.post
    ADD COLUMN updated_at TIMESTAMP NOT NULL DEFAULT now();
  `.execute(db);
}

export async function down(db: Kysely<any>): Promise<void> {
  // Migration code
  await sql<any>`
    ALTER TABLE public.post
    DROP COLUMN updated_at;
  `.execute(db);
}
