---
order: 1
title:
  uk: "DND Codex Guide - фронтенд-платформа"
  en: "DND Codex Guide - frontend platform"
summary:
  uk: "Живий D&D guide на React 19 + Vite SSR, який паралельно отримав Astro-пілот, статичні knowledge routes і MDX-пайплайн для feature docs."
  en: "A live D&D guide on React 19 + Vite SSR that now also has an Astro pilot, static knowledge routes, and an MDX pipeline for feature docs."
period:
  uk: "2025 - теперішній час"
  en: "2025 - Present"
url: "https://www.dnd-codex.guide/"
tags:
  - "React 19"
  - "TypeScript"
  - "Vite SSR"
  - "TanStack Query"
  - "Astro 6 pilot"
  - "MDX"
  - "PWA"
highlight:
  uk:
    - "React/Vite SSR ядро для живого продукту з великою контентною поверхнею і керованими переходами між сторінками."
    - "Окремий Astro pilot для `classes` і `species`, щоб винести публічні knowledge routes у статичний delivery path."
    - "Класові фічі винесені в `ClassesFeatures/**/*.mdx` з manifest/fallback логікою."
    - "Паралельний розвиток frontend, MDX-контенту і backend API без тотального переписування всього продукту."
  en:
    - "A React/Vite SSR core for a live product with a large content surface and controlled page transitions."
    - "A dedicated Astro pilot for `classes` and `species`, moving public knowledge routes into a static delivery path."
    - "Class features extracted into `ClassesFeatures/**/*.mdx` with manifest and tree-fallback logic."
    - "Frontend, MDX content, and backend API evolving in parallel without forcing a total rewrite."
accent: "#ff3f5a"
role:
  uk: "Frontend architecture / Hybrid Astro migration / Content pipeline"
  en: "Frontend architecture / Hybrid Astro migration / Content pipeline"
status:
  uk: "Live / Active development"
  en: "Live / Active development"
overview:
  uk: "Поточний найповніше оформлений live-case у портфоліо. Саме на ньому вже видно React/Vite SSR основу, Astro migration pilot, MDX-контентний шар і реальний backend-контур."
  en: "The most fully documented live case in the portfolio right now. It already shows the React/Vite SSR foundation, the Astro migration pilot, the MDX content layer, and a real backend contour."
responsibilities:
  uk:
    - "Спроєктував React/Vite SSR-ядро для живого довідника з великою кількістю контентних маршрутів."
    - "Налаштував TanStack Query і загальну стратегію server-state без хаотичного мерехтіння інтерфейсу."
    - "Підняв окремий Astro pilot для публічних секцій, не ламаючи поточний продукт і його URL-структуру."
    - "Почав винесення редакторського контенту в MDX-дерево для класових фіч і knowledge pages."
  en:
    - "Designed the React/Vite SSR core for a live guide with a large content surface."
    - "Configured TanStack Query and a predictable server-state strategy without noisy UI flicker."
    - "Built a dedicated Astro pilot for public sections without breaking the current product or URL structure."
    - "Started moving editorial content into an MDX tree for class features and knowledge pages."
architecture:
  uk:
    - "Гібридна модель: React/Vite SSR для продуктового UI, Astro для public knowledge routes."
    - "Окремі `client:visible` islands у пілоті замість повної гідрації всіх сторінок."
    - "MDX + manifest/fallback-підхід для feature docs у `ClassesFeatures`."
    - "Збереження чинних slug і маршрутів під час переносу, щоб не ламати public surface."
  en:
    - "A hybrid model: React/Vite SSR for the product UI, Astro for public knowledge routes."
    - "Dedicated `client:visible` islands in the pilot instead of hydrating every public page."
    - "An MDX plus manifest/fallback approach for feature docs in `ClassesFeatures`."
    - "Existing slugs and routes are preserved during migration to avoid breaking the public surface."
delivery:
  uk:
    - "PWA-поведінка і build-процес для React/Vite frontend."
    - "Окремий `dnd-astro-pilot` як безпечний майданчик для перевірки нової delivery-моделі."
    - "Backend API живе окремо через Django/DRF/JWT/Docker/Fly.io flow."
  en:
    - "PWA behavior and build flow for the main React/Vite frontend."
    - "A separate `dnd-astro-pilot` as a safe environment for validating the new delivery model."
    - "The backend API runs independently through a Django/DRF/JWT/Docker/Fly.io flow."
impact:
  uk:
    - "Проєкт еволюціонує без великого risky-rewrite, бо кожен шар отримує власну роль."
    - "Knowledge-секції отримують шлях до легших статичних маршрутів і нижчої вартості гідрації."
    - "MDX-контент уже стає редакторським активом, а не побічним продуктом UI-коду."
  en:
    - "The project can evolve without a large risky rewrite because each layer gets a clearer role."
    - "Knowledge sections now have a path toward lighter static routes and lower hydration cost."
    - "MDX content is already becoming an editorial asset instead of a side effect of UI code."
caseStudySlug: "dnd-codex-guide"
codeLanguage: "ts"
codeSnippet: |
  const featureModules = import.meta.glob(
    "../../../../dnd/src/content/ClassesFeatures/**/*.mdx"
  );

  const manifestModules = {
    ...import.meta.glob("../../../../dnd/src/content/ClassesFeatures/manifest.ts"),
    ...import.meta.glob("../../../../dnd/src/content/ClassesFeatures/manifest.js"),
    ...import.meta.glob("../../../../dnd/src/content/ClassesFeatures/manifest.json"),
  };
---
