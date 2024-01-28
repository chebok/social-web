import { fakerRU as faker } from '@faker-js/faker';
import * as fsp from 'fs/promises'
import path from 'path';
import { createRandomUser } from './helpers/faker.helper';
import { User } from './helpers/user.types';

export const filesCount = 100;

const genConfig = {
  count: 10000
}

async function generate() {

  for (let i = 1; i <= filesCount; i++) {
    const users: User[] = faker.helpers.multiple(createRandomUser, genConfig);
    //console.log(users)
    await fsp.writeFile(path.join('./seed-data', `user-${i}.json`), JSON.stringify(users))
  }
}

generate();