import { Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { PG_MASTER_DB } from '../database/database.constants';
import { ClientProxy } from '@nestjs/microservices';
import { IUser } from '../common/user.interface';
import { FEED_WS_SERVICE } from '../rmq-client/rmq-client.const';

@Injectable()
export class FriendService {
  constructor(
    @Inject(PG_MASTER_DB) readonly pgMaster: Pool,
    @Inject(FEED_WS_SERVICE) private readonly feedClient: ClientProxy,
  ) {}

  async addFriend(userId: string, friendId: string): Promise<any> {
    const { rows } = await this.pgMaster.query(
      `
      INSERT INTO public.friend (user_id, friend_id)
      VALUES ($1, $2)
      RETURNING user_id, friend_id;
      `,
      [userId, friendId],
    );
    this.publishEventToFeedService({ id: userId });
    return rows[0];
  }

  async removeFriend(userId: string, friendId: string): Promise<any> {
    const { rows } = await this.pgMaster.query(
      `
      DELETE FROM public.friend
      WHERE user_id = $1
        AND friend_id = $2
      RETURNING user_id, friend_id;
      `,
      [userId, friendId],
    );
    this.publishEventToFeedService({ id: userId });
    return rows[0];
  }

  async publishEventToFeedService(user: IUser) {
    this.feedClient.emit('friend_changes', { user });
  }
}
