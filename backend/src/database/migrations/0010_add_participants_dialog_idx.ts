import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  // Migration code
  sql<any>`
  CREATE UNIQUE INDEX idx_dialog_participants_sorted ON dialog(participants_sorted_text);
  `.execute(db);
}

export async function down(db: Kysely<any>): Promise<void> {
  // Migration code
  await sql<any>`DROP INDEX IF EXISTS idx_dialog_participants_sorted;`.execute(db);
}