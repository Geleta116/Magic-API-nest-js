import { z } from 'zod';

export const UpdateUserSchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
});

export type UpdateUserDto = z.infer<typeof UpdateUserSchema>;