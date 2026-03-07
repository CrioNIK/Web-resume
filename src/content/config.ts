import { defineCollection, z } from 'astro:content';

const projects = defineCollection({
	type: 'content',
	schema: z.object({
		order: z.number().int().nonnegative().default(0),
		title: z.string(),
		summary: z.string(),
		period: z.string(),
		url: z.string().url(),
		repo: z.string().url().optional(),
		tags: z.array(z.string()).min(1),
		highlight: z.array(z.string()).min(2).max(5),
		accent: z.string().regex(/^#([0-9a-fA-F]{6})$/)
	})
});

export const collections = {
	projects
};
