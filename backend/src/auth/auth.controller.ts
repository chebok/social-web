import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Ctx, KafkaContext, MessagePattern, Payload } from '@nestjs/microservices';
import { IUser } from '../common/user.interface';
import { User } from '../decorators/user.decorator';
import { CommonJwtAuthGuard } from './guards/common-jwt.guard';

@Controller('/login')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(200)
  @Post()
  async login(@Body() loginDto: LoginDto) {
    const { id } = await this.authService.validateUser(loginDto);

    return this.authService.login(id);
  }

  @UseGuards(CommonJwtAuthGuard)
  @MessagePattern('authenticate')
  async authenticate(@User() user: IUser) {
    return user;
  }
}
