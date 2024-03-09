import { Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { PG_MASTER_DB } from '../database/database.constants';

@Injectable()
export class DialogService {
  constructor(@Inject(PG_MASTER_DB) private readonly pgMaster: Pool) {}

  async createDialogMessage(from: string, to: string, text: string) {
    const dialogId = await this.getDialogId(from, to);

    // создали сообщение
    await this.pgMaster.query(
      `
      INSERT INTO message (dialog_id, sender_id, recipient_id, text)
      VALUES
      ($1, $2, $3, $4);
    `,
      [dialogId, from, to, text],
    );
  }

  async getDialogList(from: string, to: string) {
    const dialogId = await this.getDialogId(from, to);

    const { rows: messages } = await this.pgMaster.query(
      `
      SELECT
        sender_id AS from,
        recipient_id AS to,
        text
      FROM message
      WHERE dialog_id = $1
      ORDER BY created_at DESC;
    `,
      [dialogId],
    );
    // получили диалог
    return messages;
  }

  async getDialogId(user1: string, user2: string) {
    // Получаем dialog_id.
    const findResult = await this.pgMaster.query(
      `
      SELECT dialog_id
      FROM dialog
      WHERE participants_sorted_text =  array_to_string(sorted_uuids($1, $2), ',');
    `,
      [user1, user2],
    );

    if (findResult.rows.length > 0) {
      // Диалог найден
      return findResult.rows[0].dialog_id;
    } else {
      // Создание нового диалога
      const insertQuery = `
        INSERT INTO dialog (participant_ids, participants_sorted_text)
        VALUES (
          ARRAY[$1, $2]::UUID[], 
          array_to_string(sorted_uuids($1, $2), ',')
        )
        RETURNING dialog_id
      `;
      const insertResult = await this.pgMaster.query(insertQuery, [user1, user2]);
      return insertResult.rows[0].dialog_id;
    }
  }
}
