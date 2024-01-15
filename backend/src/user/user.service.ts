import { Inject, Injectable } from '@nestjs/common';
import { POSTGRE_DB_SOURCE } from '../database/database.constants';
import { Kysely, sql } from 'kysely';
import { SocialWebDatabase } from '../database/database.interface';
import { UserRegisterDto } from './dto/user-register.dto';
import { hash } from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(@Inject(POSTGRE_DB_SOURCE) readonly db: Kysely<SocialWebDatabase>) {}

  async createUser({ first_name, second_name, biography, birthdate, city, password }: UserRegisterDto) {
    const passwordHash = await hash(password, 8);
    return this.db
      .insertInto('users')
      .values({
        password: passwordHash,
        first_name,
        second_name,
        biography,
        birthdate: new Date(birthdate),
        city,
      })
      .returning(['id'])
      .executeTakeFirst();
  }

  async findUserById(userId: string) {
    return this.db
      .selectFrom('users')
      .select([
        'id',
        'first_name',
        'second_name',
        sql<string>`TO_CHAR(birthdate, 'YYYY-MM-DD')`.as('birthdate'),
        'biography',
        'city',
      ])
      .where('id', '=', userId)
      .executeTakeFirst();
  }
}
