import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { compare } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { Kysely } from 'kysely';
import { POSTGRE_DB_SOURCE } from '../database/database.constants';
import { SocialWebDatabase } from '../database/database.interface';

@Injectable()
export class AuthService {
  constructor(
    @Inject(POSTGRE_DB_SOURCE) readonly db: Kysely<SocialWebDatabase>,
    private readonly jwtService: JwtService,
  ) {}

  async login(id: string) {
    const payload = { id };
    const token = await this.jwtService.signAsync(payload);
    return { token };
  }

  async validateUser({ id, password }: LoginDto): Promise<{ id: string }> {
    const user = await this.db
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
