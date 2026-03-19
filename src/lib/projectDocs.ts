import type { Lang } from '../i18n/siteCopy';
import { languages } from '../i18n/siteCopy';

export function buildProjectDocPath(lang: Lang, slug: string) {
	return `/${lang}/projects/${slug}/`;
}

export function getProjectDocAlternates(origin: URL, slug: string) {
	return languages.map((lang) => ({
		lang,
		href: new URL(buildProjectDocPath(lang, slug), origin).href
	}));
}
