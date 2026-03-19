---
order: 2
title:
  uk: "DND Codex - backend API layer"
  en: "DND Codex - backend API layer"
summary:
  uk: "API-ядро для контенту та користувацьких даних: DRF, JWT-автентифікація, документація та Docker-деплой."
  en: "The API core for content and user data: DRF, JWT authentication, API docs, and Docker-based deployment."
period:
  uk: "2025 - теперішній час"
  en: "2025 - Present"
url: "https://www.dnd-codex.guide/"
tags:
  - "Django 5"
  - "Django REST Framework"
  - "Simple JWT"
  - "Docker"
  - "Gunicorn"
  - "OpenAPI"
highlight:
  uk:
    - "Спроєктовані API-модулі для постів, коментарів, сповіщень і статей."
    - "Реалізована безпечна JWT-авторизація та CORS-конфігурація для frontend-інтеграції."
    - "Підготовлена OpenAPI-документація через drf-spectacular для швидкої командної інтеграції."
    - "Контейнеризація через Docker і підготовка інфраструктури для стабільного релізу."
  en:
    - "Designed API modules for posts, comments, notifications, and article content."
    - "Implemented secure JWT authorization and CORS configuration for frontend integration."
    - "Prepared OpenAPI documentation with drf-spectacular for faster team onboarding."
    - "Containerized the service with Docker and prepared infrastructure for stable releases."
accent: "#ff6f7c"
role:
  uk: "API design / Auth / Docs / Delivery"
  en: "API design / Auth / Docs / Delivery"
status:
  uk: "Active / Supporting live frontend"
  en: "Active / Supporting live frontend"
overview:
  uk: "Backend-слой потрібен був не як формальність, а як контрольована основа для контенту, коментарів, профілів і майбутніх користувацьких сценаріїв."
  en: "The backend layer was built not as a formality, but as a controlled foundation for content, comments, profiles, and future user-facing flows."
responsibilities:
  uk:
    - "Спроєктував API-модулі для контенту, взаємодій і системних сутностей."
    - "Підняв JWT-автентифікацію для керованої клієнтської інтеграції."
    - "Налаштував OpenAPI-документацію для прозорої роботи з frontend-частиною."
    - "Зібрав контейнеризований delivery-процес через Docker і Gunicorn."
  en:
    - "Designed API modules for content, interactions, and system entities."
    - "Implemented JWT authentication for controlled client integration."
    - "Configured OpenAPI documentation for transparent frontend collaboration."
    - "Built a containerized delivery flow with Docker and Gunicorn."
architecture:
  uk:
    - "Чітке розділення між доменними моделями та REST-інтерфейсом для клієнта."
    - "JWT + CORS-політика як базовий security layer для SPA/PWA інтеграції."
    - "Контрактне документування API для зниження тертя між фронтом і бекендом."
  en:
    - "A clear separation between domain models and the REST interface used by the client."
    - "JWT and CORS policy as the baseline security layer for SPA/PWA integration."
    - "Contract-driven API documentation to reduce friction between frontend and backend."
delivery:
  uk:
    - "Dockerized-оточення для повторюваного запуску та оновлень."
    - "Gunicorn як стабільний application server для продакшн-сценаріїв."
    - "drf-spectacular для швидкої перевірки та передачі API-контракту."
  en:
    - "A Dockerized environment for repeatable startup and updates."
    - "Gunicorn as a stable application server for production scenarios."
    - "drf-spectacular for quick API contract validation and sharing."
impact:
  uk:
    - "Frontend отримав стабільний API-контур замість хаотичного прямого доступу до даних."
    - "Нові модулі можна розширювати без повного перегляду структури сервісу."
    - "Документований контракт пришвидшує подальшу розробку і тестування."
  en:
    - "The frontend gained a stable API boundary instead of chaotic direct data handling."
    - "New modules can be extended without fully reworking the service structure."
    - "A documented contract accelerates future development and testing."
codeLanguage: "py"
codeSnippet: |
  class PostViewSet(ModelViewSet):
      queryset = Post.objects.select_related('author').prefetch_related('tags')
      serializer_class = PostSerializer
      permission_classes = [IsAuthenticatedOrReadOnly]
      authentication_classes = [JWTAuthentication]
---
