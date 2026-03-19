---
order: 1
title:
  uk: "DND Codex Guide"
  en: "DND Codex Guide"
summary:
  uk: "Онлайн-довідник для D&D з великим каталогом класів, видів і довідкових матеріалів, SSR-рендером, пошуком, кешуванням і окремим API-контуром."
  en: "An online D&D guide with a large catalog of classes, species, and reference content, plus SSR rendering, search, caching, and a separate API layer."
period:
  uk: "2025 - теперішній час"
  en: "2025 - Present"
url: "https://www.dnd-codex.guide/"
tags:
  - "React 19"
  - "TypeScript"
  - "Vite SSR"
  - "TanStack Query"
  - "React Router 7"
  - "PWA"
  - "Django API"
highlight:
  uk:
    - "Велика довідкова поверхня з класами, видами й пов'язаними knowledge-секціями."
    - "SSR, пошук, кешування і стабільна робота з даними в продуктовому інтерфейсі."
    - "Окремий контентний pipeline для довідкових матеріалів і feature docs."
    - "Backend API для auth, profiles, comments, notifications і контрактної роботи з даними."
  en:
    - "A large reference surface with classes, species, and related knowledge sections."
    - "SSR, search, caching, and stable data behavior in a product-facing interface."
    - "A separate content pipeline for reference materials and feature docs."
    - "A backend API for auth, profiles, comments, notifications, and data contracts."
accent: "#ff3f5a"
role:
  uk: "Product frontend / Content architecture / Delivery"
  en: "Product frontend / Content architecture / Delivery"
status:
  uk: "Live / Active development"
  en: "Live / Active development"
overview:
  uk: "Живий продуктовий кейс із великою довідковою поверхнею, де поєднані клієнтський рендер, редакторський контент, пошук, маршрутизація і окремий API."
  en: "A live product case with a large reference surface, combining client rendering, editorial content, search, routing, and a separate API."
responsibilities:
  uk:
    - "Спроєктував клієнтську частину довідника на React/Vite SSR."
    - "Налаштував роботу з даними через TanStack Query і контрольовані cache/state сценарії."
    - "Побудував контентний контур для knowledge-секцій і feature docs."
    - "Зв'язав frontend з окремим backend API для користувацьких і системних сценаріїв."
  en:
    - "Designed the client side of the guide on React/Vite SSR."
    - "Configured data behavior through TanStack Query and controlled cache/state flows."
    - "Built the content layer for knowledge sections and feature docs."
    - "Integrated the frontend with a separate backend API for user and system flows."
architecture:
  uk:
    - "React/Vite SSR для основного продуктового інтерфейсу."
    - "Контентні knowledge-секції з окремим delivery-path для довідкових сторінок."
    - "Гнучка контентна структура для classes/species/features."
    - "Окремий API-контур для auth, comments, notifications і профільних сценаріїв."
  en:
    - "React/Vite SSR for the main product interface."
    - "Knowledge sections with a separate delivery path for reference pages."
    - "A flexible content structure for classes, species, and features."
    - "A dedicated API layer for auth, comments, notifications, and profile flows."
delivery:
  uk:
    - "PWA-поведінка і build-flow для клієнтського застосунку."
    - "Окремий маршрут розвитку для knowledge-секцій без переписування всього продукту."
    - "Backend delivery через Django/DRF/JWT/Docker/Fly.io."
  en:
    - "PWA behavior and build flow for the client application."
    - "A separate evolution path for knowledge sections without rewriting the whole product."
    - "Backend delivery through Django/DRF/JWT/Docker/Fly.io."
impact:
  uk:
    - "Довідник масштабується як продукт, а не як набір розрізнених сторінок."
    - "Контент, UI і data-contracts розділені по ролях і не злипаються в один шар."
    - "Проєкт можна розвивати по частинах без великого risky rewrite."
  en:
    - "The guide scales as a product, not as a loose set of pages."
    - "Content, UI, and data contracts stay separated by responsibility."
    - "The project can evolve in slices without a large risky rewrite."
caseStudySlug: "dnd-codex-guide"
codeLanguage: "ts"
codeSnippet: |
  export const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000,
        retry: 1,
        refetchOnWindowFocus: true,
      },
    },
  });
---
