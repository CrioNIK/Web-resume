# Content and localization guide

## Source of truth

Public project data and interface copy live in `src/data/content.ts`.

- `copy.en` is the default product surface.
- `copy.uk` must remain structurally equivalent.
- `projects` stores shared facts once and localizes only reader-facing text.
- `localeFromPath()` accepts `/uk/`; every other route safely resolves to English.

## Add a project

Add one `Project` record with:

- stable `id` and display `index`;
- localized kind, summary, role, status, and proof;
- a small factual tag list;
- a live URL only when a public deployment exists;
- a repository URL only when the repository is public and ownership is accurately represented;
- evidence links for independently verifiable claims.

Private-source projects must omit `repoUrl`. Never link a placeholder, unrelated repository, or personal fork as if it were the owned upstream project.

## Evidence standard

Prefer, in order:

1. a working public product;
2. upstream pull requests or release history;
3. a public repository with relevant source;
4. a clearly labelled prototype statement.

Metrics need a stable public source or a documented verification date. Avoid vanity counts when a smaller operational fact explains the work better.

## Localization standard

- English is the default URL and root redirect target.
- Locale preference is stored only in local browser storage.
- Ukrainian is authored product copy, not an automatic translation layer.
- Technical terms may remain English when that is the established working term, but sentence structure and interface intent must be natural Ukrainian.
- Every new navigation item, project fact, module control, empty state, error state, and accessibility label needs both languages.

## Ownership and privacy

- `Yoonmoonsik/bg3dnd` is attributed to Yoonmoonsik; CrioNIK / TableTop BRAMA is described as an external localization contributor.
- TableTop BRAMA can be described through its live public surface and safe product scope. Its private repository and backend topology are not portfolio content.
- The D&D Beyond overlay is an independent private prototype and must not imply a partnership or public release.
- Do not place secrets, database identifiers, private URLs, internal schema names, or customer data in this file.

## SEO parity

When title or meta positioning changes, update both `en/index.html` and `uk/index.html`, including canonical, Open Graph, and hreflang values. Keep `public/sitemap.xml` in sync with supported indexable locales.
