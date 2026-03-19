---
order: 3
title:
  uk: "Interactive Resume Lab"
  en: "Interactive Resume Lab"
summary:
  uk: "Персональний showcase-сайт з HUD-інтерфейсом, 3D-сценою, звуковим feedback, досьє проєктів і бібліотекою reusable-асетів."
  en: "A personal showcase site with a HUD interface, a 3D scene, sound feedback, project dossiers, and a reusable asset library."
period:
  uk: "2026"
  en: "2026"
url: "https://www.dnd-codex.guide/"
tags:
  - "Astro"
  - "React Islands"
  - "Three.js"
  - "React Three Fiber"
  - "Framer Motion"
  - "Scroll-Driven CSS"
highlight:
  uk:
    - "HUD-інтерфейс із 3D-фоном, glitch-переходами й звуковим feedback."
    - "Досьє проєктів із технічними розборами, таблицями, кодовими блоками й кастомними контентними секціями."
    - "Каталог асетів і UI-заготовок для reusable-патернів і подальшої публікації."
    - "Static-first frontend з islands тільки там, де потрібна жива взаємодія."
  en:
    - "A HUD interface with a 3D background, glitch transitions, and sound feedback."
    - "Project dossiers with technical breakdowns, tables, code blocks, and custom content sections."
    - "An asset catalog and UI building blocks prepared for reuse and future publishing."
    - "A static-first frontend with islands only where live interaction is actually needed."
accent: "#ff525f"
role:
  uk: "Концепт / UI system / Frontend architecture"
  en: "Concept / UI system / Frontend architecture"
status:
  uk: "Live / Iterating"
  en: "Live / Iterating"
overview:
  uk: "Персональний proof-of-work продукт, через який показані реальні кейси, стек, UI-підхід, інтерактивні патерни й власні заготовки для інтерфейсів."
  en: "A personal proof-of-work product that presents real case studies, stack choices, UI direction, interaction patterns, and custom interface assets."
responsibilities:
  uk:
    - "Зібрав static-first каркас на Astro з двомовною маршрутизацією."
    - "Підключив React-islands для рендеру 3D, detail-panels і richer workstations."
    - "Побудував HUD-візуальну систему зі шрифтами, glitch-ефектами й scanline-overlays."
  en:
    - "Built a static-first Astro shell with bilingual routing."
    - "Connected React islands for 3D rendering, detail panels, and richer workstations."
    - "Created a HUD-style visual system with custom fonts, glitch effects, and scanline overlays."
architecture:
  uk:
    - "Кожен модуль у шапці відкривається як окрема сторінка, але все працює в єдиному візуальному runtime."
    - "Глобальний layout відповідає за 3D background, аудіо-шину і route transition overlay."
    - "Projects та Assets існують як окремі workstations з правими detail-панелями."
    - "Окремі `projectDocs` entries на MDX генерують самостійні технічні сторінки для проєктів."
  en:
    - "Each header module opens as a separate page, while everything still runs inside a single visual runtime."
    - "The global layout owns the 3D background, audio bus, and route transition overlay."
    - "Projects and Assets work as dedicated workstations with right-side detail panels."
    - "Dedicated MDX-based `projectDocs` entries generate standalone technical pages for projects."
delivery:
  uk:
    - "Мультимовність із визначенням мови за браузером та збереженням останнього вибору."
    - "Glitch-route transitions з інтерцептом внутрішніх лінків."
    - "Підключення Cyberpunk-style sounds до hover, click, open і route change подій."
    - "Підтримка `@astrojs/mdx` для контентних case-study сторінок поруч зі звичайними markdown-entry."
  en:
    - "Localization with browser-language detection and persisted language selection."
    - "Glitch route transitions through internal link interception."
    - "Cyberpunk-style sounds wired into hover, click, open, and route change events."
    - "Support for `@astrojs/mdx` so richer case-study pages can live next to regular markdown entries."
impact:
  uk:
    - "Сайт працює як proof-of-work showcase, а не як сухе CV."
    - "Кейси, UI-асети й контентні сторінки можна розвивати незалежно без втрати цілісності."
    - "Є база для публікації власних компонентів, кейсів і візуальних експериментів."
  en:
    - "The site works as a proof-of-work showcase instead of a dry CV."
    - "Case studies, UI assets, and content pages can evolve independently without losing cohesion."
    - "It provides a base for publishing custom components, case studies, and visual experiments."
codeLanguage: "astro"
codeSnippet: |
  <ProjectsWorkbench
    client:visible
    projects={projects}
    labels={page.projectsWorkbench}
  />
---
