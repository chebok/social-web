import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

export const LoginSchema = z
  .object({
    id: z.string().uuid(),
    password: z.string(),
  })
  .required();

export class LoginDto extends createZodDto(LoginSchema) {}
