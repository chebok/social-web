import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  // Migration code
  sql<any>`
    CREATE TABLE public.post (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      author_user_id UUID NOT NULL,
      text TEXT NOT NULL,
      FOREIGN KEY (author_user_id) REFERENCES public.user(id)
    );
  `.execute(db);
}

export async function down(db: Kysely<any>): Promise<void> {
  // Migration code
  await sql<any>`DROP TABLE public.post`.execute(db);
}
