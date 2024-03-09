import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

export const SendMessageSchema = z
  .object({
    text: z.string().trim().min(1),
  })
  .required();

export class SendMessageDto extends createZodDto(SendMessageSchema) {}
