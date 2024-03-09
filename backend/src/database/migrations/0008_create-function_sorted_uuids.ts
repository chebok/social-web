import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  // Migration code
  sql<any>`
    CREATE OR REPLACE FUNCTION sorted_uuids(uuid, uuid)
    RETURNS UUID[] AS $$
    SELECT ARRAY[LEAST($1, $2), GREATEST($1, $2)];
    $$ LANGUAGE sql IMMUTABLE;
  `.execute(db);
}

export async function down(db: Kysely<any>): Promise<void> {
  // Migration code
  await sql<any>`DROP FUNCTION IF EXISTS sorted_uuids(uuid, uuid);`.execute(db);
}
