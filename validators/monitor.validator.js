import { z } from 'zod';

export const pingWebsiteSchema = z.object({
    body: z.object({
        url: z.string().url("Must be a valid URL"),
    })
});
