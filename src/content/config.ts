import { defineCollection, z } from 'astro:content';

const localizedString = z.object({
	uk: z.string(),
	en: z.string()
});

const localizedStringList = z.object({
	uk: z.array(z.string()).min(2).max(5),
	en: z.array(z.string()).min(2).max(5)
});

const stringOrLocalizedString = z.union([z.string(), localizedString]);
const stringArrayOrLocalizedStringList = z.union([z.array(z.string()).min(2).max(5), localizedStringList]);

const projects = defineCollection({
	type: 'content',
	schema: z.object({
		order: z.number().int().nonnegative().default(0),
		title: stringOrLocalizedString,
		summary: stringOrLocalizedString,
		period: stringOrLocalizedString,
		url: z.string().url(),
		repo: z.string().url().optional(),
		tags: z.array(z.string()).min(1),
		highlight: stringArrayOrLocalizedStringList,
		accent: z.string().regex(/^#([0-9a-fA-F]{6})$/)
	})
});

export const collections = {
	projects
};
