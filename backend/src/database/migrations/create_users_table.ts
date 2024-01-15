import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  // Migration code
  sql<any>`
    CREATE TABLE public.users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      first_name VARCHAR(255) NOT NULL,
      second_name VARCHAR(255),
      birthdate DATE NOT NULL,
      biography TEXT ,
      city VARCHAR(255) NOT NULL,
      password VARCHAR(255) NOT NULL
    );
  `.execute(db);
}

export async function down(db: Kysely<any>): Promise<void> {
  // Migration code
  await sql<any>`DROP TABLE public.users`.execute(db);
}
