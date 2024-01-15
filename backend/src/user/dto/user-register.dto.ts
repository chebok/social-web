import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

export const UserRegisterSchema = z
  .object({
    first_name: z.string(),
    second_name: z.string(),
    biography: z.string(),
    birthdate: z.dateString().format('date'),
    city: z.string(),
    password: z.string(),
  })
  .required();

export class UserRegisterDto extends createZodDto(UserRegisterSchema) {}
