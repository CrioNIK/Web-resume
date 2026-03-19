import { getCollection } from 'astro:content';
import type { Lang } from '../i18n/siteCopy';
import { pickLocalizedList, pickLocalizedValue } from './localize';
import { buildProjectDocPath } from './projectDocs';

export interface ProjectProfile {
	slug: string;
	title: string;
	summary: string;
	period: string;
	url: string;
	repo?: string;
	tags: string[];
	highlight: string[];
	accent: string;
	role: string;
	status: string;
	overview: string;
	responsibilities: string[];
	architecture: string[];
	delivery: string[];
	impact: string[];
	caseStudyPath?: string;
	codeLanguage?: string;
	codeSnippet?: string;
}

export async function getLocalizedProjects(lang: Lang): Promise<ProjectProfile[]> {
	const projectEntries = await getCollection('projects');

	return projectEntries
		.sort((a, b) => a.data.order - b.data.order)
		.map((entry) => ({
			slug: entry.slug,
			title: pickLocalizedValue(entry.data.title, lang),
			summary: pickLocalizedValue(entry.data.summary, lang),
			period: pickLocalizedValue(entry.data.period, lang),
			url: entry.data.url,
			repo: entry.data.repo,
			tags: entry.data.tags,
			highlight: pickLocalizedList(entry.data.highlight, lang),
			accent: entry.data.accent,
			role: entry.data.role ? pickLocalizedValue(entry.data.role, lang) : '',
			status: entry.data.status ? pickLocalizedValue(entry.data.status, lang) : '',
			overview: entry.data.overview ? pickLocalizedValue(entry.data.overview, lang) : '',
			responsibilities: entry.data.responsibilities ? pickLocalizedList(entry.data.responsibilities, lang) : [],
			architecture: entry.data.architecture ? pickLocalizedList(entry.data.architecture, lang) : [],
			delivery: entry.data.delivery ? pickLocalizedList(entry.data.delivery, lang) : [],
			impact: entry.data.impact ? pickLocalizedList(entry.data.impact, lang) : [],
			caseStudyPath: entry.data.caseStudySlug ? buildProjectDocPath(lang, entry.data.caseStudySlug) : undefined,
			codeLanguage: entry.data.codeLanguage,
			codeSnippet: entry.data.codeSnippet
		}));
}
