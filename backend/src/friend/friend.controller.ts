import { BadRequestException, Body, Controller, HttpCode, Param, ParseUUIDPipe, Post, Put, UseGuards } from '@nestjs/common';
import { FriendService } from './friend.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { IUser } from '../common/user.interface';
import { User } from '../decorators/user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('friend')
export class FriendController {
  constructor(private readonly friendService: FriendService) {}

  @Put('set/:friend_id')
  @HttpCode(200)
  async addFriend(@User() user: IUser, @Param('friend_id', ParseUUIDPipe) friendId: string): Promise<any> {
    const friend = await this.friendService.addFriend(user.id, friendId);
    if (!friend) {
      throw new BadRequestException();
    }
  }

  @Put('delete/:friend_id')
  @HttpCode(200)
  async removeFriend(@User() user: IUser, @Param('friend_id', ParseUUIDPipe) friendId: string): Promise<any> {
    const friend = await this.friendService.removeFriend(user.id, friendId);
    if (!friend) {
      throw new BadRequestException();
    }
  }
}
