import type { Lang } from './siteCopy';

export const pageKeys = ['home', 'skills', 'experience', 'projects', 'about', 'assets', 'contacts'] as const;
export const navPageKeys = ['skills', 'experience', 'projects', 'about', 'assets', 'contacts'] as const;

export type PageKey = (typeof pageKeys)[number];
export type NavPageKey = (typeof navPageKeys)[number];

export function buildPagePath(lang: Lang, page: PageKey) {
	return page === 'home' ? `/${lang}/` : `/${lang}/${page}/`;
}

interface ModuleCardCopy {
	title: string;
	summary: string;
	node: string;
}

interface BannerCopy {
	eyebrow: string;
	title: string;
	summary: string;
	node: string;
}

export interface PageCopy {
	signalLabel: string;
	nav: Record<NavPageKey, string>;
	home: BannerCopy & {
		modulesEyebrow: string;
		modulesTitle: string;
		modulesSummary: string;
		moduleAction: string;
		moduleCards: Record<NavPageKey, ModuleCardCopy>;
	};
	pages: Record<NavPageKey, BannerCopy>;
		projectsWorkbench: {
			openDossier: string;
			closeDossier: string;
			selectPrompt: string;
		role: string;
		status: string;
		overview: string;
		responsibilities: string;
		architecture: string;
			delivery: string;
			impact: string;
			stack: string;
			codeSample: string;
			openCaseStudy: string;
			openProject: string;
			openRepository: string;
		};
	assetsWorkbench: {
		openSpec: string;
		closeSpec: string;
		selectPrompt: string;
		category: string;
		status: string;
		preview: string;
		useCases: string;
		codeSample: string;
		exampleOutput: string;
		tags: string;
	};
}

export const pageCopy: Record<Lang, PageCopy> = {
	uk: {
		signalLabel: 'АКТИВНИЙ СИГНАЛ',
		nav: {
			skills: 'Навички',
			experience: 'Досвід',
			projects: 'Проєкти',
			about: 'Про мене',
			assets: 'Асети',
			contacts: 'Контакти'
		},
		home: {
			eyebrow: 'Command Hub',
			title: 'Кібердека резюме: окремі вузли замість однієї довгої сторінки',
			summary:
				'Головний екран став навігаційним вузлом. Кожен розділ відкривається як окрема сторінка з власним фокусом, 3D-фоном, glitch-переходами та окремим набором взаємодій.',
			node: 'NODE // HOME-00',
			modulesEyebrow: 'Точки доступу',
			modulesTitle: 'Доступні модулі системи',
			modulesSummary:
				'Перемикайся між технічними вузлами як у внутрішньоігровому інтерфейсі: стек, досвід, production-кейси, асети й контактний модуль.',
			moduleAction: 'Відкрити вузол',
			moduleCards: {
				skills: {
					title: 'Навички',
					summary: 'Технологічний стек, інструменти, інфраструктура й зона сили у frontend-розробці.',
					node: 'NODE // SKL-11'
				},
				experience: {
					title: 'Досвід',
					summary: 'Хронологія реальної роботи: pet/product work, SSR, кешування, Unity foundation.',
					node: 'NODE // EXP-21'
				},
				projects: {
					title: 'Проєкти',
					summary: 'Project workstation із правою панеллю рішень, архітектури, delivery-flow і технічних trade-offs.',
					node: 'NODE // PRJ-34'
				},
				about: {
					title: 'Про мене',
					summary: 'Короткий контекст: як мислю, як беру відповідальність і що важливо в роботі над продуктом.',
					node: 'NODE // BIO-55'
				},
				assets: {
					title: 'Асети',
					summary: 'Вітрина UI-заготовок, мікровзаємодій, кодових фрагментів і reusable-патернів.',
					node: 'NODE // AST-89'
				},
				contacts: {
					title: 'Контакти',
					summary: 'Фінальний вузол із каналами звʼязку й точкою входу для співпраці.',
					node: 'NODE // CNT-13'
				}
			}
		},
		pages: {
			skills: {
				eyebrow: 'Skills Matrix',
				title: 'Технологічний модуль з реальним production-фокусом',
				summary: 'Не список buzzwords, а стек, яким реально можна тягнути інтерфейс, дані, SSR, кешування й реліз.',
				node: 'NODE // SKL-11'
			},
			experience: {
				eyebrow: 'Experience Log',
				title: 'Хронологія рішень, а не просто назв посад',
				summary: 'Ключовий акцент на тому, що саме будувалось, які інженерні проблеми вирішувались і як це масштабувалось.',
				node: 'NODE // EXP-21'
			},
			projects: {
				eyebrow: 'Projects Workstation',
				title: 'Розбір production-кейсів через технічне досьє',
				summary: 'Кожен проєкт можна відкрити в праву панель і подивитися не тільки стек, а й архітектурні рішення, delivery та наслідки для продукту.',
				node: 'NODE // PRJ-34'
			},
			about: {
				eyebrow: 'Profile Core',
				title: 'Контекст, підхід до роботи й інженерний темперамент',
				summary: 'Це коротка сторінка без корпоративного шуму: хто я, як приймаю рішення і що мені важливо в роботі над продуктом.',
				node: 'NODE // BIO-55'
			},
			assets: {
				eyebrow: 'Assets Deck',
				title: 'Каталог заготовок, UI-компонентів і кодових прикладів',
				summary: 'Окремий модуль під reusable-асети: можна показувати приклад, код, use-case і розвивати його як власну бібліотеку.',
				node: 'NODE // AST-89'
			},
			contacts: {
				eyebrow: 'Contact Node',
				title: 'Фінальний вузол для співпраці',
				summary: 'Контактна точка лишилась окремою сторінкою, щоб завершення маршруту теж відчувалось як частина інтерфейсу.',
				node: 'NODE // CNT-13'
			}
		},
		projectsWorkbench: {
			openDossier: 'Відкрити досьє',
			closeDossier: 'Закрити панель',
			selectPrompt: 'Обери проєкт ліворуч, щоб відкрити інженерне досьє.',
			role: 'Роль',
			status: 'Статус',
			overview: 'Огляд',
			responsibilities: 'Зона відповідальності',
			architecture: 'Архітектурні рішення',
			delivery: 'Delivery / Infra',
			impact: 'Результат',
			stack: 'Стек',
			codeSample: 'Фрагмент коду / патерн',
			openCaseStudy: 'Відкрити case study',
			openProject: 'Відкрити live',
			openRepository: 'Репозиторій'
		},
		assetsWorkbench: {
			openSpec: 'Відкрити специфікацію',
			closeSpec: 'Закрити специфікацію',
			selectPrompt: 'Обери asset, щоб побачити приклад, код і сценарії використання.',
			category: 'Категорія',
			status: 'Статус',
			preview: 'Preview',
			useCases: 'Де використовувати',
			codeSample: 'Кодовий приклад',
			exampleOutput: 'Що саме показує приклад',
			tags: 'Теги'
		}
	},
	en: {
		signalLabel: 'LIVE SIGNAL',
		nav: {
			skills: 'Skills',
			experience: 'Experience',
			projects: 'Projects',
			about: 'About',
			assets: 'Assets',
			contacts: 'Contact'
		},
		home: {
			eyebrow: 'Command Hub',
			title: 'Resume cyberdeck: each section becomes its own focused page',
			summary:
				'The landing screen now works like a command hub. Each section opens as a dedicated page with its own focus, 3D background layer, glitch transitions, and page-specific interactions.',
			node: 'NODE // HOME-00',
			modulesEyebrow: 'Access Nodes',
			modulesTitle: 'Available system modules',
			modulesSummary:
				'Switch between technical nodes like an in-game interface: stack, experience, production case studies, assets, and contact endpoint.',
			moduleAction: 'Access node',
			moduleCards: {
				skills: { title: 'Skills', summary: 'Technology stack, tooling, infrastructure, and the areas where I am strongest in frontend work.', node: 'NODE // SKL-11' },
				experience: { title: 'Experience', summary: 'A timeline of real work: product building, SSR, caching strategy, and Unity foundation.', node: 'NODE // EXP-21' },
				projects: { title: 'Projects', summary: 'A project workstation with a right-side dossier for architecture, delivery flow, and engineering trade-offs.', node: 'NODE // PRJ-34' },
				about: { title: 'About', summary: 'A compact context page covering how I think, how I take ownership, and what matters in product work.', node: 'NODE // BIO-55' },
				assets: { title: 'Assets', summary: 'A showcase for UI building blocks, interaction patterns, code snippets, and reusable pieces.', node: 'NODE // AST-89' },
				contacts: { title: 'Contact', summary: 'The final node with collaboration channels and a clean handoff into conversation.', node: 'NODE // CNT-13' }
			}
		},
		pages: {
			skills: { eyebrow: 'Skills Matrix', title: 'A technology module with a real production angle', summary: 'Not a buzzword list, but a stack that can actually support interface work, data flow, SSR, caching, and release delivery.', node: 'NODE // SKL-11' },
			experience: { eyebrow: 'Experience Log', title: 'A timeline of decisions, not just job labels', summary: 'The focus is on what was built, what engineering problems were solved, and how those solutions scaled.', node: 'NODE // EXP-21' },
			projects: { eyebrow: 'Projects Workstation', title: 'Production case studies through technical dossiers', summary: 'Each project opens into a right-side panel with stack, architecture choices, delivery notes, and product impact.', node: 'NODE // PRJ-34' },
			about: { eyebrow: 'Profile Core', title: 'Context, work style, and engineering temperament', summary: 'A short page without corporate filler: who I am, how I make decisions, and what matters to me in product work.', node: 'NODE // BIO-55' },
			assets: { eyebrow: 'Assets Deck', title: 'A catalog of building blocks, UI assets, and code examples', summary: 'A dedicated module for reusable pieces, with examples, code, and use cases that can grow into a personal component library.', node: 'NODE // AST-89' },
			contacts: { eyebrow: 'Contact Node', title: 'The final node for collaboration', summary: 'The contact endpoint remains a dedicated page so the end of the route feels like a designed part of the interface.', node: 'NODE // CNT-13' }
		},
		projectsWorkbench: {
			openDossier: 'Open dossier',
			closeDossier: 'Close panel',
			selectPrompt: 'Choose a project on the left to inspect the engineering dossier.',
			role: 'Role',
			status: 'Status',
			overview: 'Overview',
			responsibilities: 'Responsibilities',
			architecture: 'Architecture decisions',
			delivery: 'Delivery / Infra',
			impact: 'Impact',
			stack: 'Stack',
			codeSample: 'Code sample / pattern',
			openCaseStudy: 'Open case study',
			openProject: 'Open live',
			openRepository: 'Repository'
		},
		assetsWorkbench: {
			openSpec: 'Open spec',
			closeSpec: 'Close spec',
			selectPrompt: 'Select an asset to inspect the preview, code sample, and usage ideas.',
			category: 'Category',
			status: 'Status',
			preview: 'Preview',
			useCases: 'Where to use it',
			codeSample: 'Code sample',
			exampleOutput: 'What the example demonstrates',
			tags: 'Tags'
		}
	}
};
