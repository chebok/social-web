import { Body, Controller, Get, HttpCode, NotFoundException, Param, ParseUUIDPipe, Post } from '@nestjs/common';
import { UserRegisterDto } from './dto/user-register.dto';
import { UserService } from './user.service';

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
      const user = await this.userService.findUserById(id);
      if (!user) {
        throw new NotFoundException('Анкета не найдена');
      }
      return user;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
}
