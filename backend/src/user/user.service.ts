import { Inject, Injectable } from '@nestjs/common';
import { PG_MASTER_DB, PG_REPLICA_DB } from '../database/database.constants';
import { sql } from 'kysely';
import { UserRegisterDto } from './dto/user-register.dto';
import { hash } from 'bcryptjs';
import { DatabaseService } from '../database/database.service';
import { Pool } from 'pg';

@Injectable()
export class UserService {
  constructor(
    @Inject(PG_MASTER_DB) readonly pgMaster: Pool,
    @Inject(PG_REPLICA_DB) readonly pgReplica: Pool,
    private readonly dbService: DatabaseService,
  ) {}

  async createUser({ first_name, second_name, biography, birthdate, city, password }: UserRegisterDto) {
    const passwordHash = await hash(password, 8);
    return this.dbService
      .getDb()
      .insertInto('user')
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
    const { rows } = await this.pgReplica.query(
      `
      SELECT 
        id, 
        first_name, 
        second_name, 
        TO_CHAR(birthdate, 'YYYY-MM-DD') as birthdate,
        biography,
        city
      FROM "user"
      WHERE id = $1;
    `,
      [userId],
    );
    return rows;
    // return this.dbService
    //   .getDb()
    //   .selectFrom('user')
    //   .select([
    //     'id',
    //     'first_name',
    //     'second_name',
    //     sql<string>`TO_CHAR(birthdate, 'YYYY-MM-DD')`.as('birthdate'),
    //     'biography',
    //     'city',
    //   ])
    //   .where('id', '=', userId)
    //   .executeTakeFirst();
  }

  async findUsersByPrefix(first_name: string, second_name: string) {
    const { rows } = await this.pgReplica.query(
      `
      SELECT 
        id, 
        first_name, 
        second_name, 
        TO_CHAR(birthdate, 'YYYY-MM-DD') as birthdate,
        biography,
        city
      FROM "user"
      WHERE first_name like $1
        AND second_name like $2
      ORDER BY id;
    `,
      [`${first_name}%`, `${second_name}%`],
    );
    return rows;
  }
}
