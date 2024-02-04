import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { compare } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly dbService: DatabaseService,
    private readonly jwtService: JwtService,
  ) {}

  async login(id: string) {
    const payload = { id };
    const token = await this.jwtService.signAsync(payload);
    return { token };
  }

  async validateUser({ id, password }: LoginDto): Promise<{ id: string }> {
    const user = await this.dbService
      .getDb()
      .selectFrom('user')
      .select(['id', 'password as passwordHash'])
      .where('id', '=', id)
      .executeTakeFirst();
    if (!user) {
      throw new NotFoundException();
    }
    const isCorrectPassword = await compare(password, user.passwordHash);
    if (!isCorrectPassword) {
      throw new BadRequestException();
    }
    return { id };
  }
}
