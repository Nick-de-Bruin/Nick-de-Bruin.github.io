import { defineCollection, z } from "astro:content";

const blogCollection = defineCollection({
    type: "content",
    schema: z.object({
        title: z.string(),
        author: z.string().optional(),
        desc: z.any().optional(),
        date: z.string(),
        published: z.boolean().optional().default(false)
    })
});

export const collections = {
    'blog': blogCollection
};