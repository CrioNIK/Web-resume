import type { Lang } from '../i18n/siteCopy';

export interface LocalizedString {
	uk: string;
	en: string;
}

export interface LocalizedStringList {
	uk: string[];
	en: string[];
}

export function pickLocalizedValue(value: string | LocalizedString, lang: Lang) {
	if (typeof value === 'string') {
		return value;
	}

	return value[lang] ?? value.en ?? value.uk;
}

export function pickLocalizedList(value: string[] | LocalizedStringList, lang: Lang) {
	if (Array.isArray(value)) {
		return value;
	}

	return value[lang] ?? value.en ?? value.uk;
}
