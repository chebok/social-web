import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

export const PostFeedParamsSchema = z.object({
  offset: z.number().min(0).optional().default(0),
  limit: z.number().min(1).optional().default(10),
});

export class PostFeedParamsDto extends createZodDto(PostFeedParamsSchema) {}
