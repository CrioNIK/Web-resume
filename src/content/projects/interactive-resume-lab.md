---
order: 3
title:
  uk: "Interactive Resume Lab"
  en: "Interactive Resume Lab"
summary:
  uk: "Персональне веб-резюме на Astro з multipage-навігацією, workbench-модулями, HUD-ефектами та окремими MDX case-study сторінками."
  en: "A personal web resume built with Astro, multi-page navigation, workbench modules, HUD effects, and dedicated MDX case-study pages."
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
    - "Розділення на легкий статичний каркас і динамічні islands лише там, де потрібен JS."
    - "MDX case-study route для проєктів з красивим TOC, таблицями, кодовими блоками й кастомними Astro-компонентами."
    - "Інтерактивні workbench-модулі для проєктів та асетів із detail-панелями."
    - "3D background runtime, glitch-route transitions і звуковий feedback як частина єдиного HUD-інтерфейсу."
  en:
    - "Split into a lightweight static shell and dynamic islands only where JavaScript is actually needed."
    - "An MDX case-study route for projects with a styled TOC, tables, code blocks, and custom Astro components."
    - "Interactive workbench modules for projects and assets with detail panels."
    - "A 3D background runtime, glitch route transitions, and sound feedback inside one consistent HUD interface."
accent: "#ff525f"
role:
  uk: "Концепт / UI system / Astro architecture"
  en: "Concept / UI system / Astro architecture"
status:
  uk: "Live / Iterating"
  en: "Live / Iterating"
overview:
  uk: "Це саме це веб-резюме: полігон для перевірки multipage-навігації, 3D-background layer, glitch-переходів, звукового feedback і asset-like showcase-підходу."
  en: "This very web resume acts as a lab for testing multi-page navigation, a 3D background layer, glitch transitions, sound feedback, and an asset-style showcase approach."
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
    - "Сайт перестає бути просто резюме й стає proof-of-work інтерфейсом."
    - "Окремі сторінки дають глибший фокус на кожен блок замість однієї довгої стрічки."
    - "Asset-page створює основу для публікації власних UI-напрацювань у майбутньому."
  en:
    - "The site stops being just a resume and becomes a proof-of-work interface."
    - "Dedicated pages create deeper focus for each area instead of a single long scroll."
    - "The assets page creates a base for publishing your own UI building blocks over time."
codeLanguage: "astro"
codeSnippet: |
  <ProjectsWorkbench
    client:visible
    projects={projects}
    labels={page.projectsWorkbench}
  />
---
