import { z } from 'zod';

export const addTargetSchema = z.object({
    body: z.object({
        name: z.string().min(1, "Target name is required"),
        url: z.string().url("Must be a valid URL"),
    })
});
