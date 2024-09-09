import { z } from 'zod';

export const UpdateTaskSchema = z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    due_date: z.string().datetime().optional()
});

export type UpdateTaskDto = z.infer<typeof UpdateTaskSchema>;