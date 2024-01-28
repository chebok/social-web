import { fakerRU as faker } from '@faker-js/faker';
import { User } from './user.types';

export function createRandomUser(): User {
  const sex = faker.person.sex() as any;
  const [second_name] = faker.person.fullName({firstName: 'stub', sex }).split(' ').filter((val) => {
    return val !== 'stub' && !val.endsWith('вна') && !val.endsWith('вич')
  });
  return {
    first_name: faker.person.firstName(sex),
    second_name: second_name ?? 'Морозко',
    biography: faker.person.jobDescriptor() + ' ' + faker.person.jobType(),
    password: faker.internet.password(),
    birthdate: faker.date.birthdate().toISOString().slice(0, 10),
    city: faker.location.city(),
  };
}