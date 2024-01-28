import { Pool, PoolConfig } from 'pg';
import * as fsp from 'fs/promises';
import * as fs from 'fs';
import { setTimeout } from 'timers/promises'
import { fetch, request } from 'undici';
import { omit, chunk as lodashChunk } from 'lodash';
import { filesCount } from './generator';
import path from 'path';

const CHUNK_SIZE_PG_UPLOAD = 100000;

const userRegisterUrl = 'http://localhost:3001/user/register'

const dbConfig: PoolConfig = {
  host: '0.0.0.0',
  port: 5432,
  user: 'admin',
  password: 'admin',
  database: 'social_web',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 20000,
};

async function main() {
  // подключение к мастер пг базе.
  const pool = new Pool(dbConfig);
  
  // читаем батч
  let count = 1;
  for (let i = 1; i <= filesCount; i++) {
    const rawUsersData = fs.readFileSync(path.join('./seed-data', `user-${i}.json`), { encoding: 'utf8' });
    const usersData = JSON.parse(rawUsersData);
    
    
    const chunks = lodashChunk(usersData, 5000)
    for (const chunk of chunks) {
      for (const userData of chunk) {
        await request(userRegisterUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData)
        });
      }
      console.log(`Батч ${count} успешно обработан`);
      count ++;
    }
    

  }
}

main();