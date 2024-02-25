import { Controller } from '@nestjs/common';
import { Ctx, EventPattern, Payload, KafkaContext } from '@nestjs/microservices';
import { PostService } from './post.service';
import { IUser } from '../common/user.interface';
import { IPost } from '../common/post.interface';

@Controller()
export class PostController {
  constructor(private readonly postService: PostService) {}

  @EventPattern('post_changes')
  postChanges(@Payload() { post }: { post: IPost }, @Ctx() context: KafkaContext) {
    this.postService.updateManyFeedByFriend(post);
  }

  @EventPattern('friend_changes')
  friendChanges(@Payload() { user }: { user: IUser }, @Ctx() context: KafkaContext) {
    this.postService.updateFeedCacheByUser(user);
  }
}
