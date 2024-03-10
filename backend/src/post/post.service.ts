import { Inject, Injectable } from '@nestjs/common';
import { IUser } from '../common/user.interface';
import { PostCreateDto } from './dto/post-create.dto';
import { PostUpdateDto } from './dto/post-update.dto';
import { Pool } from 'pg';
import { PG_MASTER_DB } from '../database/database.constants';
import { ClientKafka } from '@nestjs/microservices';
import { FEED_WS_SERVICE } from '../kafka/kafka.const';
import { PostFeedParamsDto } from './dto/post-feed-params.dto';
import { REDIS_SRC } from '../redis/redis.const';
import { POST_FEED_TTL } from '../common/ttl.const';
import { IPost } from '../common/post.interface';
import { Redis } from 'ioredis';

@Injectable()
export class PostService {
  constructor(
    @Inject(PG_MASTER_DB) private readonly pgMaster: Pool,
    @Inject(REDIS_SRC) private readonly redisClient: Redis,
    @Inject(FEED_WS_SERVICE) private readonly feedClient: ClientKafka,
  ) {}

  async getPostFeed(user: IUser, { limit, offset }: PostFeedParamsDto) {
    let postFeed: any[];
    // Запрос в кэш
    const redisKey = `postFeed:${user.id}`;
    const postFeedJson = await this.redisClient.get(redisKey);
    if (postFeedJson) {
      postFeed = JSON.parse(postFeedJson);
    } else {
      postFeed = await this.buildPostFeed(user);
      await this.redisClient.setex(redisKey, POST_FEED_TTL, JSON.stringify(postFeed));
    }

    // Выбираем нужную часть данных с использованием limit и offset
    const selectedPosts = postFeed.slice(offset, offset + limit);

    return selectedPosts;
  }

  async getPostbyId(id: string) {
    const { rows } = await this.pgMaster.query(
      `
      SELECT
        id,
        text,
        author_user_id
      FROM public.post
      WHERE id = $1
    `,
      [id],
    );
    return rows;
  }

  async deletePost(user: IUser, id: string) {
    const { rows } = await this.pgMaster.query(
      `
      DELETE
      FROM public.post
      WHERE id = $1
        AND author_user_id = $2
        RETURNING id, author_user_id, text;
    `,
      [id, user.id],
    );

    if (rows[0]) {
      this.publishEventToFeedService(rows[0]);
    }
  }

  async updatePost(user: IUser, { id, text }: PostUpdateDto) {
    const { rows } = await this.pgMaster.query(
      `
      UPDATE public.post
      SET text = $1
      WHERE id = $2
        AND author_user_id = $3
      RETURNING id, author_user_id, text;
    `,
      [text, id, user.id],
    );

    if (rows[0]) {
      this.publishEventToFeedService(rows[0]);
    }

    return rows[0];
  }

  async createPost(user: IUser, { text }: PostCreateDto) {
    const { rows } = await this.pgMaster.query(
      `
      INSERT INTO public.post (author_user_id, text)
      VALUES ($1, $2)
      RETURNING id, author_user_id, text;
    `,
      [user.id, text],
    );

    if (rows[0]) {
      this.publishEventToFeedService(rows[0]);
    }

    return rows[0];
  }

  async buildPostFeed(user: IUser) {
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
    return rows;
  }

  async publishEventToFeedService(post: IPost) {
    this.feedClient.emit('post_changes', { post });
  }
}
