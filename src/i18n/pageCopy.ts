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
			eyebrow: 'Frontend Engineer',
			title: 'Фронтенд-розробник для продуктових інтерфейсів',
			summary:
				'React, TypeScript, SSR, контентні системи, data flow, 3D і інтерактивні інтерфейси. Кейси, стек, досвід і робочі артефакти з реальних задач.',
			node: 'NODE // HOME-00',
			modulesEyebrow: 'Profile Surface',
			modulesTitle: 'Кейси, стек і робоча практика',
			modulesSummary:
				'Продуктова розробка, UI-системи, контент, дані й reusable-артефакти з реальної роботи.',
			moduleAction: 'Відкрити розділ',
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
					summary: 'Product-кейси з архітектурою, data flow, delivery і технічними trade-offs.',
					node: 'NODE // PRJ-34'
				},
				about: {
					title: 'Про мене',
					summary: 'Короткий контекст: як мислю, як беру відповідальність і що важливо в роботі над продуктом.',
					node: 'NODE // BIO-55'
				},
				assets: {
					title: 'Асети',
					summary: 'UI-заготовки, мікровзаємодії, кодові фрагменти й reusable-патерни для реальних інтерфейсів.',
					node: 'NODE // AST-89'
				},
				contacts: {
					title: 'Контакти',
					summary: 'Канали звʼязку для співпраці, продуктового найму, фрилансу й технічних задач.',
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
				eyebrow: 'Project Cases',
				title: 'Production-кейси й технічні рішення',
				summary: 'Проєкти з фокусом на архітектуру, інженерні компроміси, delivery і вплив на продукт.',
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
				summary: 'UI-компоненти, заготовки й кодові патерни, які можна перевикористовувати в реальних інтерфейсах.',
				node: 'NODE // AST-89'
			},
			contacts: {
				eyebrow: 'Contact Node',
				title: 'Контакти для роботи й співпраці',
				summary: 'Пошта, месенджери й точки входу для комунікації по продукту, фрилансу й найму.',
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
			eyebrow: 'Frontend Engineer',
			title: 'Frontend engineer for product interfaces',
			summary:
				'React, TypeScript, SSR, content systems, data flow, 3D, and interactive interface work. Case studies, stack, experience, and working assets from real product tasks.',
			node: 'NODE // HOME-00',
			modulesEyebrow: 'Profile Surface',
			modulesTitle: 'Case studies, stack, and working practice',
			modulesSummary:
				'Product development, UI systems, content, data, and reusable artifacts from real work.',
			moduleAction: 'Open section',
			moduleCards: {
				skills: { title: 'Skills', summary: 'Technology stack, tooling, infrastructure, and the areas where I am strongest in frontend work.', node: 'NODE // SKL-11' },
				experience: { title: 'Experience', summary: 'A timeline of real work: product building, SSR, caching strategy, and Unity foundation.', node: 'NODE // EXP-21' },
				projects: { title: 'Projects', summary: 'Product cases covering architecture, data flow, delivery, and engineering trade-offs.', node: 'NODE // PRJ-34' },
				about: { title: 'About', summary: 'A compact context page covering how I think, how I take ownership, and what matters in product work.', node: 'NODE // BIO-55' },
				assets: { title: 'Assets', summary: 'UI building blocks, interaction patterns, code snippets, and reusable pieces for real interfaces.', node: 'NODE // AST-89' },
				contacts: { title: 'Contact', summary: 'Contact channels for collaboration, freelance work, hiring, and technical conversations.', node: 'NODE // CNT-13' }
			}
		},
		pages: {
			skills: { eyebrow: 'Skills Matrix', title: 'A technology module with a real production angle', summary: 'Not a buzzword list, but a stack that can actually support interface work, data flow, SSR, caching, and release delivery.', node: 'NODE // SKL-11' },
			experience: { eyebrow: 'Experience Log', title: 'A timeline of decisions, not just job labels', summary: 'The focus is on what was built, what engineering problems were solved, and how those solutions scaled.', node: 'NODE // EXP-21' },
			projects: { eyebrow: 'Project Cases', title: 'Production case studies and technical decisions', summary: 'Projects with a focus on architecture, engineering trade-offs, delivery, and product impact.', node: 'NODE // PRJ-34' },
			about: { eyebrow: 'Profile Core', title: 'Context, work style, and engineering temperament', summary: 'A short page without corporate filler: who I am, how I make decisions, and what matters to me in product work.', node: 'NODE // BIO-55' },
			assets: { eyebrow: 'Assets Deck', title: 'A catalog of building blocks, UI assets, and code examples', summary: 'UI components, interaction patterns, and reusable code that can be carried into real interfaces.', node: 'NODE // AST-89' },
			contacts: { eyebrow: 'Contact Node', title: 'Contacts for work and collaboration', summary: 'Email, messengers, and entry points for product work, freelance requests, and hiring conversations.', node: 'NODE // CNT-13' }
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
