import { Inject, Injectable } from '@nestjs/common';
import { PG_MASTER_DB } from './database.constants';
import { Pool } from 'pg';

@Injectable()
export class DatabaseService {
  constructor(@Inject(PG_MASTER_DB) readonly pgPool: Pool) {}
}
