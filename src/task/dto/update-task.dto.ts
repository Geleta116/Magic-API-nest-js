import { z } from 'zod';

export const UpdateTaskSchema = z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    due_date: z.date().optional()
});

export type UpdateTaskDto = z.infer<typeof UpdateTaskSchema>;