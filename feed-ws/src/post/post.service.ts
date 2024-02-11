import { Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { RedisClientType } from 'redis';
import { PG_MASTER_DB } from '../database/database.constants';
import { REDIS_SRC } from '../redis/redis.const';
import { IUser } from '../common/user.interface';
import { POST_FEED_TTL } from '../common/ttl.const';

@Injectable()
export class PostService {
  constructor(
    @Inject(PG_MASTER_DB) private readonly pgMaster: Pool,
    @Inject(REDIS_SRC) private readonly redisClient: RedisClientType,
  ) {}

  async updateManyFeedByFriend({ user }: { user: IUser }) {
    // Определяем юзеров, для которых текущий является другом
    const { rows: users } = await this.pgMaster.query(
      `
      SELECT
        user_id as id
      FROM public.friend
      WHERE friend_id = $1;
    `,
      [user.id],
    );
    // Для каждого переcтраиваем кэш
    const promises = users.map((userToRebuild) => {
      return this.updateFeedCacheByUser(userToRebuild);
    });
    await Promise.all(promises);
  }

  async updateFeedCacheByUser(user: IUser) {
    const { rows } = await this.pgMaster.query(
      `
      SELECT
        p.id,
        p.text,
        p.author_user_id
      FROM public.post AS p
      LEFT JOIN public.friend AS f ON p.author_user_id = f.friend_id
      WHERE f.user_id = $1
      ORDER BY p.updated_at
      LIMIT 1000;
    `,
      [user.id],
    );
    const redisKey = `postFeed:${user.id}`;
    await this.redisClient.set(redisKey, JSON.stringify(rows), {
      EX: POST_FEED_TTL,
    });
  }
}
