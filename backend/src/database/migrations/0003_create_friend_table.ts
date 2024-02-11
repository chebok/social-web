import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  // Migration code
  sql<any>`
    CREATE TABLE public.friend (
      user_id UUID,
      friend_id UUID,
      PRIMARY KEY (user_id, friend_id),
      FOREIGN KEY (user_id) REFERENCES public.user(id),
      FOREIGN KEY (friend_id) REFERENCES public.user(id)
    );
  `.execute(db);
}

export async function down(db: Kysely<any>): Promise<void> {
  // Migration code
  await sql<any>`DROP TABLE public.friend`.execute(db);
}
