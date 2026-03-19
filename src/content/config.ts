import { defineCollection, z } from 'astro:content';

const localizedString = z.object({
	uk: z.string(),
	en: z.string()
});

const localizedStringList = z.object({
	uk: z.array(z.string()).min(2),
	en: z.array(z.string()).min(2)
});

const stringOrLocalizedString = z.union([z.string(), localizedString]);
const stringArrayOrLocalizedStringList = z.union([z.array(z.string()).min(2), localizedStringList]);

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
		accent: z.string().regex(/^#([0-9a-fA-F]{6})$/),
		role: stringOrLocalizedString.optional(),
		status: stringOrLocalizedString.optional(),
		overview: stringOrLocalizedString.optional(),
		responsibilities: stringArrayOrLocalizedStringList.optional(),
		architecture: stringArrayOrLocalizedStringList.optional(),
		delivery: stringArrayOrLocalizedStringList.optional(),
		impact: stringArrayOrLocalizedStringList.optional(),
		caseStudySlug: z.string().optional(),
		codeLanguage: z.string().optional(),
		codeSnippet: z.string().optional()
	})
});

const projectDocs = defineCollection({
	type: 'content'
});

export const collections = {
	projects,
	projectDocs
};
