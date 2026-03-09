export const languages = ['uk', 'en'] as const;

export type Lang = (typeof languages)[number];

export function isLang(value: string): value is Lang {
	return (languages as readonly string[]).includes(value);
}

export interface NavItem {
	label: string;
	href: string;
}

export interface SkillGroup {
	title: string;
	items: string[];
}

export interface ExperienceJob {
	role: string;
	company: string;
	period: string;
	location: string;
	points: string[];
}

export interface AboutCard {
	title: string;
	text: string;
}

export interface SiteCopy {
	meta: {
		title: string;
		description: string;
	};
	brandMeta: string;
	navigationLabel: string;
	navItems: NavItem[];
	languageLabel: string;
	languageNames: Record<Lang, string>;
	hero: {
		eyebrow: string;
		name: string;
		summary: string;
		actions: {
			email: string;
			project: string;
		};
		facts: Array<{
			label: string;
			value: string;
		}>;
	};
	skills: {
		eyebrow: string;
		title: string;
		groups: SkillGroup[];
	};
	experience: {
		eyebrow: string;
		title: string;
		jobs: ExperienceJob[];
	};
	projects: {
		eyebrow: string;
		title: string;
		note: string;
		labels: {
			openProject: string;
			showDetails: string;
			hideDetails: string;
			openRepository: string;
			empty: string;
		};
	};
	about: {
		eyebrow: string;
		title: string;
		cards: AboutCard[];
	};
	contact: {
		eyebrow: string;
		title: string;
		items: Array<{
			label: string;
			value: string;
			href: string;
		}>;
	};
}

const sharedSkillItems = {
	core: ['JavaScript (ES6+)', 'TypeScript', 'HTML5', 'CSS3'],
	ui: ['React 19', 'Next.js', 'Vite', 'Tailwind CSS', 'Framer Motion', 'React Router'],
	state: ['TanStack Query', 'React Hook Form', 'Zod'],
	infra: ['Node.js', 'Vercel', 'Docker', 'Git / GitHub', 'PWA', 'SSR / SSG']
};

export const siteCopy: Record<Lang, SiteCopy> = {
	uk: {
		meta: {
			title: 'Батурін Микита | Middle Frontend Developer (React / Next.js)',
			description:
				'Інтерактивне веб-резюме Middle Frontend Developer з акцентом на React, Next.js, TypeScript, PWA, SSR та продуктивний UI/UX.'
		},
		brandMeta: 'Frontend Engineer',
		navigationLabel: 'Головна навігація',
		navItems: [
			{ label: 'Навички', href: '#skills' },
			{ label: 'Досвід', href: '#experience' },
			{ label: 'Проєкти', href: '#projects' },
			{ label: 'Про мене', href: '#about' },
			{ label: 'Контакти', href: '#contacts' }
		],
		languageLabel: 'Мова',
		languageNames: {
			uk: 'Українська',
			en: 'Англійська'
		},
		hero: {
			eyebrow: 'Middle Frontend Developer (React / Next.js)',
			name: 'Батурін Микита',
			summary:
				'Frontend розробник, який створює складні веб-застосунки з фокусом на швидкодію, плавну взаємодію та архітектуру, що масштабується. Закриваю повний цикл від системного дизайну до production-релізу.',
			actions: {
				email: 'Написати на email',
				project: 'Відкрити DND Codex'
			},
			facts: [
				{ label: 'Локація', value: 'Київ, Україна' },
				{ label: 'Формат роботи', value: 'Віддалено / Офіс / Гібрид' },
				{ label: 'Фокус', value: 'React, Next.js, TypeScript, Performance' }
			]
		},
		skills: {
			eyebrow: 'Tech Stack',
			title: 'Стек, який дає швидкий UI та стабільний production',
			groups: [
				{ title: 'Основні технології', items: sharedSkillItems.core },
				{ title: 'Фреймворки та UI', items: sharedSkillItems.ui },
				{ title: 'Стан, форми, валідація', items: sharedSkillItems.state },
				{ title: 'Інфраструктура', items: sharedSkillItems.infra }
			]
		},
		experience: {
			eyebrow: 'Experience',
			title: 'Досвід, який підтверджує інженерну глибину',
			jobs: [
				{
					role: 'Frontend Developer',
					company: 'Власні проєкти / Pet Projects',
					period: '2025 - теперішній час',
					location: 'Україна',
					points: [
						'Спроєктував і розробив масштабований PWA-довідник для D&D на React 19 + TypeScript.',
						'Побудував SSR-пайплайн на Vite для швидшого стартового рендеру та кращого SEO.',
						'Оптимізував кешування через stale-while-revalidate у TanStack Query.',
						'Реалізував систему анімацій на Framer Motion з кастомними spring-параметрами.'
					]
				},
				{
					role: 'Unity Developer',
					company: 'AGORA software',
					period: '2019 - 2022',
					location: 'Україна',
					points: [
						'Розробляв і підтримував інтерактивні застосунки на Unity.',
						'Писав ігрову та бізнес-логіку на C#.',
						'Працював над оптимізацією продуктивності та 3D/2D asset pipeline.',
						'Співпрацював з командою над розробкою та інтеграцією нового функціоналу.'
					]
				}
			]
		},
		projects: {
			eyebrow: 'Projects',
			title: 'Шоукейс рішень: продуктивність + UX-інтерактив',
			note:
				'React-острови підвантажуються тільки коли секція входить у viewport (`client:visible`), щоб не перевантажувати стартовий рендер.',
			labels: {
				openProject: 'Відкрити проєкт',
				showDetails: 'Показати деталі',
				hideDetails: 'Сховати деталі',
				openRepository: 'Відкрити репозиторій',
				empty: 'Проєкти скоро будуть додані.'
			}
		},
		about: {
			eyebrow: 'About',
			title: 'Коротко про підхід до роботи',
			cards: [
				{
					title: 'Позиціонування',
					text:
						'Беруся за фронтенд, де важливі не лише пікселі, а й масштабована архітектура. Мені цікаво приймати технічні рішення, які впливають на весь продукт.'
				},
				{
					title: 'Освіта',
					text:
						'Національний авіаційний університет (КІТУ НАУ), спеціальність 121 - Інженерія програмного забезпечення.'
				},
				{
					title: 'Мови',
					text:
						'Українська - рідна. Англійська - рівень читання технічної документації (Pre-Intermediate / Intermediate).'
				}
			]
		},
		contact: {
			eyebrow: 'Contact',
			title: 'Готовий до співпраці та нових викликів',
			items: [
				{ label: 'Email', value: 'coldboycrio314@gmail.com', href: 'mailto:coldboycrio314@gmail.com' },
				{ label: 'Телефон', value: '+380 (95) 314-73-81', href: 'tel:+380953147381' },
				{ label: 'Відкритий проєкт', value: 'dnd-codex.guide', href: 'https://www.dnd-codex.guide/' }
			]
		}
	},
	en: {
		meta: {
			title: 'Mykyta Baturin | Middle Frontend Developer (React / Next.js)',
			description:
				'Interactive web resume for a Middle Frontend Developer focused on React, Next.js, TypeScript, PWA, SSR, and polished UX motion.'
		},
		brandMeta: 'Frontend Engineer',
		navigationLabel: 'Primary navigation',
		navItems: [
			{ label: 'Skills', href: '#skills' },
			{ label: 'Experience', href: '#experience' },
			{ label: 'Projects', href: '#projects' },
			{ label: 'About', href: '#about' },
			{ label: 'Contact', href: '#contacts' }
		],
		languageLabel: 'Language',
		languageNames: {
			uk: 'Ukrainian',
			en: 'English'
		},
		hero: {
			eyebrow: 'Middle Frontend Developer (React / Next.js)',
			name: 'Mykyta Baturin',
			summary:
				'Frontend developer focused on complex web applications with strong performance, smooth interaction, and scalable architecture. I cover the full cycle from system design to production release.',
			actions: {
				email: 'Send email',
				project: 'Open DND Codex'
			},
			facts: [
				{ label: 'Location', value: 'Kyiv, Ukraine' },
				{ label: 'Work format', value: 'Remote / Office / Hybrid' },
				{ label: 'Focus', value: 'React, Next.js, TypeScript, Performance' }
			]
		},
		skills: {
			eyebrow: 'Tech Stack',
			title: 'A stack built for fast UI and stable production delivery',
			groups: [
				{ title: 'Core technologies', items: sharedSkillItems.core },
				{ title: 'Frameworks and UI', items: sharedSkillItems.ui },
				{ title: 'State, forms, validation', items: sharedSkillItems.state },
				{ title: 'Infrastructure', items: sharedSkillItems.infra }
			]
		},
		experience: {
			eyebrow: 'Experience',
			title: 'Experience that proves engineering depth',
			jobs: [
				{
					role: 'Frontend Developer',
					company: 'Own Projects / Pet Projects',
					period: '2025 - Present',
					location: 'Ukraine',
					points: [
						'Designed and built a scalable D&D PWA guide on React 19 + TypeScript.',
						'Implemented a Vite-based SSR pipeline for faster initial render and better SEO.',
						'Optimized caching behavior with a stale-while-revalidate approach in TanStack Query.',
						'Built a motion system in Framer Motion with tuned spring parameters.'
					]
				},
				{
					role: 'Unity Developer',
					company: 'AGORA software',
					period: '2019 - 2022',
					location: 'Ukraine',
					points: [
						'Developed and maintained interactive applications in Unity.',
						'Implemented gameplay and business logic in C#.',
						'Worked on performance optimization and 3D/2D asset pipelines.',
						'Collaborated with the team on feature development and integration.'
					]
				}
			]
		},
		projects: {
			eyebrow: 'Projects',
			title: 'Solution showcase: performance + UX interaction',
			note:
				'React islands hydrate only when the section enters the viewport (`client:visible`), keeping the initial render lighter.',
			labels: {
				openProject: 'Open project',
				showDetails: 'Show details',
				hideDetails: 'Hide details',
				openRepository: 'Open repository',
				empty: 'Projects will be added soon.'
			}
		},
		about: {
			eyebrow: 'About',
			title: 'A short note on how I work',
			cards: [
				{
					title: 'Positioning',
					text:
						'I take on frontend work where pixel quality matters, but scalable architecture matters just as much. I like making technical decisions that shape the whole product.'
				},
				{
					title: 'Education',
					text:
						'National Aviation University (KITU NAU), specialty 121 - Software Engineering.'
				},
				{
					title: 'Languages',
					text:
						'Ukrainian - native. English - comfortable with reading technical documentation (Pre-Intermediate / Intermediate).'
				}
			]
		},
		contact: {
			eyebrow: 'Contact',
			title: 'Open to collaboration and strong product work',
			items: [
				{ label: 'Email', value: 'coldboycrio314@gmail.com', href: 'mailto:coldboycrio314@gmail.com' },
				{ label: 'Phone', value: '+380 (95) 314-73-81', href: 'tel:+380953147381' },
				{ label: 'Open project', value: 'dnd-codex.guide', href: 'https://www.dnd-codex.guide/' }
			]
		}
	}
};

