import { Body, Controller, Get, HttpCode, NotFoundException, Param, ParseUUIDPipe, Post, Query } from '@nestjs/common';
import { UserRegisterDto } from './dto/user-register.dto';
import { UserService } from './user.service';
import { UserSearchParamsDto } from './dto/search-params.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  @HttpCode(200)
  async registerUser(@Body() userRegisterDto: UserRegisterDto) {
    try {
      const result = await this.userService.createUser(userRegisterDto);
      return result;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  @Get('get/:id')
  async getUserById(@Param('id', ParseUUIDPipe) id: string) {
    try {
      const [user] = await this.userService.findUserById(id);
      if (!user) {
        throw new NotFoundException('Анкета не найдена');
      }
      return user;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  @Get('search')
  async getUsersByPrefix(@Query() { first_name, last_name }: UserSearchParamsDto) {
    try {
      const users = await this.userService.findUsersByPrefix(first_name, last_name);
      return users;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
}
