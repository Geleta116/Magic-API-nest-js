import { z } from 'zod';

export const createTaskSchema = z.object({
    title: z.string(),
    description: z.string(),
    due_date: z.string().datetime()
});

export type CreateTaskDto = z.infer<typeof createTaskSchema>;