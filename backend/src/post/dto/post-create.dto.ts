import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

export const PostCreateSchema = z
  .object({
    text: z.string().trim().min(1),
  })
  .required();

export class PostCreateDto extends createZodDto(PostCreateSchema) {}
