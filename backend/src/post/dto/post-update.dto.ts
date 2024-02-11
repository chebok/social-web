import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

export const PostUpdateSchema = z
  .object({
    id: z.string().uuid(),
    text: z.string().trim().min(1),
  })
  .required();

export class PostUpdateDto extends createZodDto(PostUpdateSchema) {}
