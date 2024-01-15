import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('/login')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(200)
  @Post()
  async login(@Body() loginDto: LoginDto) {
    const { id } = await this.authService.validateUser(loginDto);

    return this.authService.login(id);
  }
}
