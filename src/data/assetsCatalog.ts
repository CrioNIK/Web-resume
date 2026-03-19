import type { Lang } from '../i18n/siteCopy';
import { pickLocalizedList, pickLocalizedValue, type LocalizedString, type LocalizedStringList } from '../lib/localize';

interface AssetEntry {
	id: string;
	accent: string;
	category: LocalizedString;
	status: LocalizedString;
	title: LocalizedString;
	summary: LocalizedString;
	description: LocalizedString;
	previewLabel: LocalizedString;
	useCases: LocalizedStringList;
	exampleOutput: LocalizedStringList;
	tags: string[];
	codeLanguage: string;
	code: string;
}

export interface AssetProfile {
	id: string;
	accent: string;
	category: string;
	status: string;
	title: string;
	summary: string;
	description: string;
	previewLabel: string;
	useCases: string[];
	exampleOutput: string[];
	tags: string[];
	codeLanguage: string;
	code: string;
}

const assets: AssetEntry[] = [
	{
		id: 'glitch-route-layer',
		accent: '#ff4a62',
		category: { uk: 'Route transition', en: 'Route transition' },
		status: { uk: 'Reusable', en: 'Reusable' },
		title: { uk: 'Glitch Route Layer', en: 'Glitch Route Layer' },
		summary: {
			uk: 'Повноекранний transition-слой для мультисторінкового UI з ламаною геометрією, scanline-проходом і синхронним звуком.',
			en: 'A full-screen transition layer for multi-page UI with fractured geometry, scanline sweeps, and synced sound.'
		},
		description: {
			uk: 'Патерн для переходів між сторінками, коли треба приховати жорстку зміну route і зробити інтерфейс схожим на in-game HUD.',
			en: 'A route transition pattern for hiding hard page swaps and making the interface feel closer to an in-game HUD.'
		},
		previewLabel: { uk: 'Transition overlay', en: 'Transition overlay' },
		useCases: {
			uk: ['Портфоліо з сильним moodboard', 'Game UI landing pages', 'Dashboard-и з route-based навігацією'],
			en: ['Portfolio sites with a strong moodboard', 'Game UI landing pages', 'Dashboards with route-based navigation']
		},
		exampleOutput: {
			uk: ['Гліч-екран перекриває сцену перед переходом', 'Після завантаження нової сторінки overlay плавно сходить нанівець'],
			en: ['A glitch screen covers the scene before navigation', 'After the new page loads, the overlay fades away smoothly']
		},
		tags: ['animation', 'routing', 'glitch', 'hud'],
		codeLanguage: 'ts',
		code: `document.addEventListener('click', (event) => {
  const link = (event.target as HTMLElement).closest('a[data-route-link]');
  if (!link) return;

  event.preventDefault();
  document.body.classList.add('is-routing');
  window.dispatchEvent(new CustomEvent('hud-sound', { detail: 'route' }));

  window.setTimeout(() => {
    window.location.href = link.getAttribute('href') ?? '/';
  }, 320);
});`
	},
	{
		id: 'angled-hud-card',
		accent: '#ff7b8f',
		category: { uk: 'UI component', en: 'UI component' },
		status: { uk: 'Ready to reuse', en: 'Ready to reuse' },
		title: { uk: 'Angled HUD Card', en: 'Angled HUD Card' },
		summary: {
			uk: 'Панель зі скошеними кутами, sweep-highlight, pseudo-grid і підсвіченим hover-станом.',
			en: 'A panel with angled corners, sweep highlight, pseudo-grid texture, and a lit hover state.'
		},
		description: {
			uk: 'Базовий блок для статистики, карток проєктів, лінків, інвентарних слотів або системних повідомлень.',
			en: 'A foundational block for stats, project cards, links, inventory slots, or system notices.'
		},
		previewLabel: { uk: 'HUD panel preview', en: 'HUD panel preview' },
		useCases: {
			uk: ['Картки проєктів', 'Меню профілю', 'Блоки командної панелі'],
			en: ['Project cards', 'Profile menus', 'Command deck blocks']
		},
		exampleOutput: {
			uk: ['Контрастний неоновий контур', 'Внутрішня scan-текстура', 'Плавний lift на hover'],
			en: ['A high-contrast neon border', 'An internal scan texture', 'A smooth lift on hover']
		},
		tags: ['card', 'panel', 'ui', 'cyberpunk'],
		codeLanguage: 'css',
		code: `.panel {
  background: linear-gradient(165deg, rgba(31, 8, 14, 0.94), rgba(11, 5, 8, 0.93));
  border: 1px solid rgba(255, 83, 105, 0.38);
  clip-path: polygon(0 12px, 12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%);
  box-shadow: 0 0 0 1px rgba(255, 76, 96, 0.22), 0 20px 70px rgba(255, 43, 79, 0.19);
}`
	},
	{
		id: 'audio-reactive-button',
		accent: '#4de6ff',
		category: { uk: 'Interaction pattern', en: 'Interaction pattern' },
		status: { uk: 'Prototype+', en: 'Prototype+' },
		title: { uk: 'Audio Reactive Button', en: 'Audio Reactive Button' },
		summary: {
			uk: 'Кнопка, що не тільки анімується, а й тригерить системний звук та підсилює відчуття фізичності інтерфейсу.',
			en: 'A button that not only animates, but also triggers a system sound and makes the interface feel more tactile.'
		},
		description: {
			uk: 'Корисний патерн для меню, detail-panels і будь-яких дій, де інтерфейс має відчуватися живим і реактивним.',
			en: 'A useful pattern for menus, detail panels, and any action where the interface should feel alive and responsive.'
		},
		previewLabel: { uk: 'Interactive button', en: 'Interactive button' },
		useCases: {
			uk: ['CTA-кнопки', 'Перемикачі в HUD', 'Дії у правій панелі'],
			en: ['CTA buttons', 'HUD toggles', 'Actions inside a right-side panel']
		},
		exampleOutput: {
			uk: ['Hover дає короткий hi-tech ping', 'Click запускає confirm- або open-sound'],
			en: ['Hover gives a short hi-tech ping', 'Click triggers a confirm or open sound']
		},
		tags: ['audio', 'button', 'interaction', 'feedback'],
		codeLanguage: 'ts',
		code: `export function emitHudSound(name: string) {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent('hud-sound', { detail: name }));
}

<button
  onMouseEnter={() => emitHudSound('hover')}
  onClick={() => emitHudSound('confirm')}
/>`
	}
];

export function getLocalizedAssets(lang: Lang): AssetProfile[] {
	return assets.map((asset) => ({
		id: asset.id,
		accent: asset.accent,
		category: pickLocalizedValue(asset.category, lang),
		status: pickLocalizedValue(asset.status, lang),
		title: pickLocalizedValue(asset.title, lang),
		summary: pickLocalizedValue(asset.summary, lang),
		description: pickLocalizedValue(asset.description, lang),
		previewLabel: pickLocalizedValue(asset.previewLabel, lang),
		useCases: pickLocalizedList(asset.useCases, lang),
		exampleOutput: pickLocalizedList(asset.exampleOutput, lang),
		tags: asset.tags,
		codeLanguage: asset.codeLanguage,
		code: asset.code
	}));
}
