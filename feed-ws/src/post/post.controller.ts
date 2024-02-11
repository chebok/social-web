import { Controller } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { PostService } from './post.service';
import { IUser } from '../common/user.interface';

@Controller()
export class PostController {
  constructor(private readonly postService: PostService) {}

  @EventPattern('post_changes')
  postChanges(@Payload() payload: { user: IUser }, @Ctx() context: RmqContext) {
    this.postService.updateManyFeedByFriend(payload);
  }

  @EventPattern('friend_changes')
  friendChanges(@Payload() { user }: { user: IUser }, @Ctx() context: RmqContext) {
    this.postService.updateFeedCacheByUser(user);
  }
}
