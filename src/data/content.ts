export type Locale = 'en' | 'uk';

export interface LocalizedText {
  en: string;
  uk: string;
}

export interface Project {
  id: string;
  index: string;
  title: string;
  kind: LocalizedText;
  summary: LocalizedText;
  role: LocalizedText;
  status: LocalizedText;
  proof: LocalizedText[];
  tags: string[];
  accent: string;
  accentInk: string;
  liveUrl?: string;
  repoUrl?: string;
  evidence?: Array<{ label: LocalizedText; url: string }>;
}

export const projects: Project[] = [
  {
    id: 'tabletop-brama',
    index: '01',
    title: 'TableTop BRAMA',
    kind: {
      en: 'Live product · private source',
      uk: 'Живий продукт · приватний код',
    },
    summary: {
      en: 'A Ukrainian tabletop product foundation connecting a searchable rules surface, guided play flows, and community-led localization.',
      uk: 'Українська продуктова основа для настільних рольових ігор, що поєднує пошук правил, керовані сценарії гри та локалізацію спільнотою.',
    },
    role: {
      en: 'Product direction · interface systems · release quality',
      uk: 'Продуктовий напрям · системи інтерфейсу · якість релізів',
    },
    status: {
      en: 'Public foundation online · broader product in active private development',
      uk: 'Публічна основа онлайн · ширший продукт активно розвивається приватно',
    },
    proof: [
      {
        en: 'A public product surface visitors can use now.',
        uk: 'Публічна продуктова поверхня, якою вже можна користуватися.',
      },
      {
        en: 'Multilingual product and content architecture.',
        uk: 'Мультимовна продуктова та контентна архітектура.',
      },
    ],
    tags: ['React', 'TypeScript', 'i18n', 'Product systems'],
    accent: '#ff5c44',
    accentInk: '#8a2f24',
    liveUrl: 'https://app-zeta-gules-57.vercel.app/',
  },
  {
    id: 'bg3dnd-localization',
    index: '02',
    title: 'bg3dnd / UA + PL',
    kind: {
      en: 'Public upstream contribution',
      uk: 'Публічний внесок в upstream',
    },
    summary: {
      en: 'Complete Ukrainian and Polish localization tracks delivered to Yoonmoonsik/bg3dnd through an auditable upstream history.',
      uk: 'Повні українська та польська локалізації для Yoonmoonsik/bg3dnd, доставлені через прозору upstream-історію.',
    },
    role: {
      en: 'Contributor · translation coordination · localization QA',
      uk: 'Автор внеску · координація перекладу · localization QA',
    },
    status: {
      en: '23 / 23 pull requests merged upstream',
      uk: '23 / 23 pull request злито в upstream',
    },
    proof: [
      {
        en: '4 Ukrainian and 19 Polish pull requests merged.',
        uk: 'Злито 4 українські та 19 польських pull request.',
      },
      {
        en: '5,355 verified localization handles per locale.',
        uk: 'Перевірено 5 355 локалізаційних handle на кожну локаль.',
      },
    ],
    tags: ['Localization', 'XML', 'GitHub', 'Ukrainian', 'Polish'],
    accent: '#52e6b8',
    accentInk: '#236c55',
    repoUrl: 'https://github.com/Yoonmoonsik/bg3dnd',
    evidence: [
      { label: { en: 'PR #1305 · complete Ukrainian locale', uk: 'PR #1305 · повна українська локаль' }, url: 'https://github.com/Yoonmoonsik/bg3dnd/pull/1305' },
      { label: { en: 'PR #1310 · Ukrainian QA pass', uk: 'PR #1310 · QA української локалі' }, url: 'https://github.com/Yoonmoonsik/bg3dnd/pull/1310' },
      { label: { en: 'PR #1324 · complete Polish locale', uk: 'PR #1324 · повна польська локаль' }, url: 'https://github.com/Yoonmoonsik/bg3dnd/pull/1324' },
      { label: { en: 'PR #1344 · final terminology pass', uk: 'PR #1344 · фінальна перевірка термінології' }, url: 'https://github.com/Yoonmoonsik/bg3dnd/pull/1344' },
    ],
  },
  {
    id: 'horizon-lab',
    index: '03',
    title: 'Horizon Lab',
    kind: {
      en: 'Open-source browser systems lab',
      uk: 'Open-source лабораторія браузерних систем',
    },
    summary: {
      en: 'This portfolio rebuilt as a small distributed system: a Rust-powered build and WASM kernel, browser-native GPU rendering, worker analytics, a local database, and a Go API.',
      uk: 'Це портфоліо, перебудоване як мала розподілена система: Rust-збірка й WASM-ядро, браузерний GPU-рендеринг, worker-аналітика, локальна база та Go API.',
    },
    role: {
      en: 'Concept · systems architecture · product engineering',
      uk: 'Концепція · системна архітектура · продуктова розробка',
    },
    status: {
      en: 'Live on Vercel · public source · continuously measured',
      uk: 'Live на Vercel · публічний код · постійні вимірювання',
    },
    proof: [
      {
        en: 'English-first with complete Ukrainian product parity.',
        uk: 'Англійська за замовчуванням із повним українським відповідником.',
      },
      {
        en: 'Experimental layers are capability-gated and every demo has a fallback.',
        uk: 'Експериментальні шари вмикаються за можливостями браузера, кожне демо має fallback.',
      },
    ],
    tags: ['Vite 8', 'React 19', 'Rust/WASM', 'Go beta', 'WebGPU'],
    accent: '#8e7dff',
    accentInk: '#514596',
    liveUrl: 'https://web-resume-murex.vercel.app/en/',
    repoUrl: 'https://github.com/CrioNIK/Web-resume',
  },
  {
    id: 'dnd-overlay',
    index: '04',
    title: 'D&D Beyond UA Overlay',
    kind: {
      en: 'Private browser-extension prototype',
      uk: 'Приватний прототип browser extension',
    },
    summary: {
      en: 'A controlled experiment in Ukrainian terminology, DOM-level localization, and isolated extension UI on an existing product surface.',
      uk: 'Контрольований експеримент з українською термінологією, DOM-локалізацією та ізольованим extension UI на наявній продуктовій поверхні.',
    },
    role: {
      en: 'Prototype design · frontend · localization system',
      uk: 'Дизайн прототипу · frontend · система локалізації',
    },
    status: {
      en: 'Private prototype · no public release claim',
      uk: 'Приватний прототип · без заяви про публічний реліз',
    },
    proof: [
      {
        en: 'Separates injected UI from page-localization behavior.',
        uk: 'Відокремлює injected UI від логіки локалізації сторінки.',
      },
      {
        en: 'Source and unreleased implementation details remain private.',
        uk: 'Код і деталі невипущеної реалізації залишаються приватними.',
      },
    ],
    tags: ['WXT', 'React', 'Browser extension', 'Localization'],
    accent: '#f3b85a',
    accentInk: '#76541c',
  },
];

export const copy = {
  en: {
    skip: 'Skip to main content',
    home: 'Home',
    manifest: 'System manifest',
    highlights: 'Verified highlights',
    moduleLoading: 'MODULE / LOADING…',
    brandMeta: 'MYKYTA BATURIN · CRIOMANT',
    brandSub: 'HORIZON LAB / KYIV',
    navigation: 'Primary navigation',
    nav: [
      ['Work', '#work'],
      ['Lab', '#lab'],
      ['Trajectory', '#trajectory'],
      ['Contact', '#contact'],
    ],
    language: 'Language',
    menu: 'Menu',
    availability: 'Open to product engineering roles · selected collaborations',
    heroEyebrow: 'Product engineer · systems builder · independent maker',
    heroTitle: ['I turn hard systems', 'into fast, human products.'],
    heroLead: 'I’m Mykyta Baturin, working as CrioMant. I connect interface architecture, multilingual content, browser-native compute, data, and delivery—then leave proof you can inspect.',
    enterLab: 'Enter the live lab',
    traceWork: 'Trace the work',
    heroNote: 'Not a static CV. A measured product surface that evolves with the work.',
    proofs: [
      ['23', 'merged upstream PRs'],
      ['10,710', 'localized entries reviewed'],
      ['EN / UK', 'complete product parity'],
      ['6', 'live lab systems'],
    ],
    workEyebrow: 'Selected work / verified boundaries',
    workTitle: 'Products with receipts, not mythology.',
    workLead: 'Live links, public contribution history, clear ownership, and honest labels for private work.',
    openLive: 'Open live product',
    openSource: 'Inspect public source',
    showProof: 'Evidence',
    technologies: 'Technologies',
    privateSource: 'Private source',
    labEyebrow: 'Horizon deck / browser-native experiments',
    labTitle: 'Six systems. Loaded only when you ask.',
    labLead: 'Each module exercises a real runtime or browser primitive. Unsupported experiments fall back cleanly instead of faking capability.',
    labEmpty: 'Choose a system to request its code and start the experiment. Nothing in this deck runs before your intent.',
    labTabs: {
      pulse: ['01', 'Runtime pulse', 'Measure browser → Go API round-trip and cache behavior.'],
      compute: ['02', 'WASM forge', 'Run a deterministic Rust compute kernel in this tab.'],
      analytics: ['03', 'Signal science', 'Generate and regress a dataset off the main thread.'],
      ai: ['04', 'Local AI', 'Use browser-native AI when available, otherwise an explicit offline planner.'],
      game: ['05', 'Signal run', 'A tiny keyboard/touch game rendered directly to canvas.'],
      database: ['06', 'Local vault', 'Write and query a real IndexedDB database without leaving this device.'],
    },
    runtimeLabels: {
      title: 'Runtime pulse',
      intro: 'The endpoint is a privacy-first Go function. It stores nothing and returns only runtime metadata and deterministic signal data.',
      action: 'Ping Go edge',
      loading: 'MEASURING…',
      loadingLabel: 'Loading',
      disclaimer: 'NO COOKIES · NO PERSISTENCE · NO FINGERPRINTING',
      telemetry: 'TELEMETRY / LIVE',
      signalLabel: 'Deterministic diagnostic signal',
      pending: 'Waiting for a measured request.',
      failed: 'The Go endpoint is unavailable in this environment. The client remains fully functional.',
      rtt: 'Round trip',
      server: 'Server compute',
      runtime: 'Runtime',
      cache: 'Cache policy',
    },
    trajectoryEyebrow: 'Trajectory / shipped → learned → next',
    trajectoryTitle: 'Progress is a system, not a mood.',
    trajectory: [
      ['NOW', 'Horizon Lab v2', 'Replaced the old Astro shell with a Vite 8 / React 19 platform, Rust/WASM compute, Go APIs, WebGPU, worker analytics, and bilingual product copy.', 'Shipping'],
      ['AUG 2026', 'Two complete localization tracks', 'Twenty-three public pull requests merged upstream across Ukrainian and Polish delivery and QA.', 'Verified'],
      ['2025—NOW', 'TableTop BRAMA', 'A live tabletop product foundation and a broader private product track shaped through continuous delivery.', 'Building'],
      ['2019—2022', 'Unity systems', 'Built interactive applications, gameplay and business logic, and performance-aware asset pipelines in C#.', 'Foundation'],
    ],
    principlesEyebrow: 'Operating system',
    principlesTitle: 'How I build when the brief is ambiguous.',
    principles: [
      ['Proof before adjectives', 'A live URL, a merged PR, a measured budget, or a working interaction beats a loud claim.'],
      ['Future-facing, fallback-first', 'Experimental capability is useful only when the baseline remains fast, accessible, and honest.'],
      ['Whole-product thinking', 'Interface, content, data, localization, runtime, and release are one system.'],
    ],
    contactEyebrow: 'Open channel',
    contactTitle: 'Bring me the problem that does not fit in a tidy box.',
    contactLead: 'Product engineering, multilingual platforms, technically ambitious interfaces, and experiments that deserve a route to production.',
    email: 'Start a conversation',
    github: 'GitHub / CrioNIK',
    footer: 'Designed and engineered by Mykyta Baturin · Kyiv, Ukraine',
  },
  uk: {
    skip: 'Перейти до основного вмісту',
    home: 'Головна',
    manifest: 'Системний маніфест',
    highlights: 'Перевірені результати',
    moduleLoading: 'МОДУЛЬ / ЗАВАНТАЖЕННЯ…',
    brandMeta: 'МИКИТА БАТУРІН · CRIOMANT',
    brandSub: 'HORIZON LAB / КИЇВ',
    navigation: 'Головна навігація',
    nav: [
      ['Роботи', '#work'],
      ['Лабораторія', '#lab'],
      ['Траєкторія', '#trajectory'],
      ['Контакт', '#contact'],
    ],
    language: 'Мова',
    menu: 'Меню',
    availability: 'Відкритий до product engineering ролей · вибрані колаборації',
    heroEyebrow: 'Продуктовий інженер · системний розробник · незалежний мейкер',
    heroTitle: ['Перетворюю складні системи', 'на швидкі людяні продукти.'],
    heroLead: 'Я Микита Батурін, працюю як CrioMant. Поєдную архітектуру інтерфейсу, мультимовний контент, браузерні обчислення, дані та delivery — і залишаю докази, які можна перевірити.',
    enterLab: 'Увійти в лабораторію',
    traceWork: 'Переглянути роботи',
    heroNote: 'Не статичне CV. Вимірювана продуктова поверхня, що розвивається разом із роботою.',
    proofs: [
      ['23', 'злиті upstream PR'],
      ['10 710', 'перевірених локалізованих записів'],
      ['EN / UK', 'повний продуктовий відповідник'],
      ['6', 'живих лабораторних систем'],
    ],
    workEyebrow: 'Вибрані роботи / перевірні межі',
    workTitle: 'Продукти з доказами, а не міфологією.',
    workLead: 'Живі посилання, публічна історія внесків, чітка атрибуція та чесні позначки приватної роботи.',
    openLive: 'Відкрити живий продукт',
    openSource: 'Переглянути публічний код',
    showProof: 'Докази',
    technologies: 'Технології',
    privateSource: 'Приватний код',
    labEyebrow: 'Horizon deck / браузерні експерименти',
    labTitle: 'Шість систем. Лише на твій запит.',
    labLead: 'Кожен модуль використовує реальний runtime або browser primitive. Непідтримувані експерименти мають чесний fallback.',
    labEmpty: 'Обери систему, щоб завантажити її код і запустити експеримент. До твоєї дії ця лабораторія нічого не виконує.',
    labTabs: {
      pulse: ['01', 'Runtime pulse', 'Виміряй round-trip браузер → Go API та поведінку кешу.'],
      compute: ['02', 'WASM forge', 'Запусти детерміноване Rust-ядро безпосередньо в цій вкладці.'],
      analytics: ['03', 'Signal science', 'Згенеруй датасет і регресію поза main thread.'],
      ai: ['04', 'Локальний ШІ', 'Використай browser-native AI, якщо доступний, або явний offline planner.'],
      game: ['05', 'Signal run', 'Мала клавіатурна/touch-гра з прямим canvas-рендерингом.'],
      database: ['06', 'Локальна база', 'Запиши й опитай справжню IndexedDB-базу без передавання даних із пристрою.'],
    },
    runtimeLabels: {
      title: 'Runtime pulse',
      intro: 'Endpoint — privacy-first Go function. Він нічого не зберігає та повертає лише метадані runtime і детермінований сигнал.',
      action: 'Виміряти Go edge',
      loading: 'ВИМІРЮВАННЯ…',
      loadingLabel: 'Завантаження',
      disclaimer: 'БЕЗ COOKIE · БЕЗ ЗБЕРІГАННЯ · БЕЗ FINGERPRINTING',
      telemetry: 'ТЕЛЕМЕТРІЯ / LIVE',
      signalLabel: 'Детермінований діагностичний сигнал',
      pending: 'Очікую виміряний запит.',
      failed: 'Go endpoint недоступний у цьому середовищі. Клієнт продовжує працювати повністю.',
      rtt: 'Повний запит',
      server: 'Server-обчислення',
      runtime: 'Середовище',
      cache: 'Політика кешу',
    },
    trajectoryEyebrow: 'Траєкторія / запущено → вивчено → далі',
    trajectoryTitle: 'Прогрес — це система, а не настрій.',
    trajectory: [
      ['ЗАРАЗ', 'Horizon Lab v2', 'Замінив стару Astro-оболонку платформою Vite 8 / React 19 із Rust/WASM, Go API, WebGPU, worker-аналітикою та двомовним продуктом.', 'Реліз'],
      ['СЕРПЕНЬ 2026', 'Дві повні локалізації', 'Двадцять три публічні pull request злито в upstream у межах українського й польського delivery та QA.', 'Перевірено'],
      ['2025—ЗАРАЗ', 'TableTop BRAMA', 'Жива продуктова основа для настільних ігор і ширший приватний трек, що розвивається через безперервне delivery.', 'Розробка'],
      ['2019—2022', 'Unity-системи', 'Створював інтерактивні застосунки, gameplay і business logic та performance-aware asset pipelines на C#.', 'Основа'],
    ],
    principlesEyebrow: 'Операційна система',
    principlesTitle: 'Як я будую, коли бриф не вкладається в рамки.',
    principles: [
      ['Докази раніше за прикметники', 'Живий URL, злитий PR, виміряний бюджет чи робоча взаємодія важать більше за гучну заяву.'],
      ['У майбутнє — з fallback', 'Експеримент корисний лише тоді, коли базовий досвід лишається швидким, доступним і чесним.'],
      ['Мислення цілим продуктом', 'Інтерфейс, контент, дані, локалізація, runtime і release — одна система.'],
    ],
    contactEyebrow: 'Відкритий канал',
    contactTitle: 'Принось проблему, яка не влазить у зручну коробку.',
    contactLead: 'Product engineering, мультимовні платформи, технічно амбітні інтерфейси й експерименти, яким потрібен шлях у production.',
    email: 'Почати розмову',
    github: 'GitHub / CrioNIK',
    footer: 'Дизайн і розробка — Микита Батурін · Київ, Україна',
  },
} as const;

export function localeFromPath(pathname: string): Locale {
  return pathname.split('/').filter(Boolean)[0] === 'uk' ? 'uk' : 'en';
}

export function localize(value: LocalizedText, locale: Locale): string {
  return value[locale];
}
