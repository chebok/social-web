import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

export const UserSearchParamsSchema = z
  .object({
    first_name: z.string().trim().min(1),
    last_name: z.string().trim().min(1),
  })
  .required();

export class UserSearchParamsDto extends createZodDto(UserSearchParamsSchema) {}
