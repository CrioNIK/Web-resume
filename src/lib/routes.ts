import type { Lang } from '../i18n/siteCopy';
import { isLang, languages } from '../i18n/siteCopy';
import { buildPagePath, navPageKeys, type NavPageKey, type PageKey } from '../i18n/pageCopy';

export interface NavRouteItem {
	key: NavPageKey;
	label: string;
	href: string;
}

export function getStaticLangPaths() {
	return languages.map((lang) => ({ params: { lang } }));
}

export function resolveLang(value?: string): Lang {
	if (value && isLang(value)) {
		return value;
	}

	return 'en';
}

export function getAlternates(origin: URL, page: PageKey) {
	return languages.map((lang) => ({
		lang,
		href: new URL(buildPagePath(lang, page), origin).href
	}));
}

export function buildNavRoutes(lang: Lang, labels: Record<NavPageKey, string>): NavRouteItem[] {
	return navPageKeys.map((key) => ({
		key,
		label: labels[key],
		href: buildPagePath(lang, key)
	}));
}
