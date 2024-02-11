import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PostCreateDto } from './dto/post-create.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { User } from '../decorators/user.decorator';
import { PostService } from './post.service';
import { IUser } from '../common/user.interface';
import { PostUpdateDto } from './dto/post-update.dto';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @UseGuards(JwtAuthGuard)
  @Get('feed')
  async getPostFeed(
    @User() user: IUser,
    @Query('offset', new ParseIntPipe({ optional: true })) offset: number = 0,
    @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 10,
  ) {
    const posts = await this.postService.getPostFeed(user, { limit, offset });
    return posts;
  }

  @UseGuards(JwtAuthGuard)
  @Post('create')
  @HttpCode(200)
  async createPost(@User() user: IUser, @Body() postCreateDto: PostCreateDto) {
    const post = await this.postService.createPost(user, postCreateDto);
    return post.id;
  }

  @UseGuards(JwtAuthGuard)
  @Put('update')
  @HttpCode(200)
  async updatePost(@User() user: IUser, @Body() postUpdateDto: PostUpdateDto) {
    const post = await this.postService.updatePost(user, postUpdateDto);
    return post;
  }

  @UseGuards(JwtAuthGuard)
  @Put('delete/:id')
  @HttpCode(200)
  async deletePost(@User() user: IUser, @Param('id', ParseUUIDPipe) id: string) {
    await this.postService.deletePost(user, id);
  }

  @Get('get/:id')
  async getPost(@Param('id', ParseUUIDPipe) id: string) {
    const [post] = await this.postService.getPostbyId(id);
    if (!post) {
      new HttpException('Post not found', HttpStatus.NOT_FOUND);
    }
    return post;
  }
}
