import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { PostGateway } from './post.gateway';

@Module({
  controllers: [PostController],
  providers: [PostGateway, PostService],
})
export class PostModule {}
