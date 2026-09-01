# Quality report

## Completion baseline — 2026-09-01

This report records the measured state of the Horizon Lab v2 completion candidate. It separates repeatable build evidence, simulated lab metrics, and manual browser checks so none of them are presented as field telemetry.

## Automated gates

`npm run validate` passed on Node 24:

- strict TypeScript project references;
- 4 Vitest files and 11 deterministic tests;
- Vite production build;
- bundle budget enforcement.

The measured production build contains 87.5 KiB of JavaScript gzip in total and 6.4 KiB of CSS gzip. The Rust/WASM binary remains a separate, interaction-gated 47.01 KiB asset (19.55 KiB gzip).

## Mobile Lighthouse lab run

Lighthouse 13.4.1 ran against the local production build in its default simulated mobile profile with Headless Chrome 152.

| Category or metric | Result |
| --- | ---: |
| Performance | 100 |
| Accessibility | 100 |
| Best Practices | 100 |
| SEO | 100 |
| First Contentful Paint | 1.2 s |
| Largest Contentful Paint | 1.5 s |
| Speed Index | 1.2 s |
| Total Blocking Time | 0 ms |
| Cumulative Layout Shift | 0 |
| Lab module chunks on initial navigation | 0 |

This is reproducible lab evidence, not real-user Core Web Vitals. INP requires field interaction data and is not inferred from Total Blocking Time.

## Browser interaction matrix

The final local production build was checked through the in-app Chromium browser at desktop size and at 390 × 844:

- English is the default experience and the Ukrainian route has localized content, metadata, controls, and accessibility labels.
- Direct hash navigation restores the intended section after React mounts.
- The mobile menu closes after an anchor selection.
- Ukrainian display headings fit the mobile viewport without page-level clipping.
- WebGPU motion exposes a localized pause/resume control; the operating-system reduced-motion path remains static.
- The lab opens in an inert state and requests a system chunk only after visitor intent.
- Keyboard and pointer selection both reach the six system launchers.
- Local Vault wrote 2,000 deterministic records to IndexedDB, returned 501 matches through the `band` secondary index, reported actual transaction timings, and deleted its database through the clear action.
- Browser console output remained free of warnings and errors during the final flow.

## Honest boundaries

- Network and device latency are always non-zero and are displayed as measured values.
- Local Vault demonstrates browser-database transactions with synthetic data; it does not connect to or imitate the private TableTop BRAMA Supabase project.
- The experimental browser `LanguageModel` path is capability-gated. The deterministic planner is explicitly identified whenever a native session cannot start.
- Lighthouse simulation does not replace production monitoring or real-user field data.

