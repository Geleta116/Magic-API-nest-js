import { z } from 'zod';

export const UpdateUserSchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
});

export const UpdateUserPasswordSchema = z.object({
  password: z.string().optional(),
});

export type UpdateUserDto = z.infer<typeof UpdateUserSchema>;
export type UpdateUserPasswordDto = z.infer<typeof UpdateUserPasswordSchema>;