# Performance contract

“Zero latency” is not a physically meaningful production claim. Horizon Lab treats immediacy as measured budgets with separate boundaries for transfer, main-thread work, rendering, local compute, and network round-trip.

## Build budgets

`scripts/check-bundle.mjs` fails the canonical Vite production build when any limit is exceeded:

| Asset class | Budget |
| --- | ---: |
| Largest JavaScript chunk | 90 KiB gzip |
| All JavaScript chunks | 175 KiB gzip |
| All CSS | 45 KiB gzip |

The script measures JavaScript and CSS below `dist/assets/`. The checked-in Rust/WASM binary and self-hosted browser TypeScript vendor files are reported separately so a heavy deferred runtime cannot disappear inside an aggregate claim.

## v3 canonical build snapshot

The 2026-09-01 Vite 8.2.2 release-code build passed locally and in canonical [CI run 33541570215](https://github.com/CrioNIK/Web-resume/actions/runs/33541570215):

| Asset boundary | Raw | Gzip | Delivery behavior |
| --- | ---: | ---: | --- |
| Main JavaScript chunk | 214.65 KiB | 67.63 KiB | Initial application shell |
| All JavaScript chunks | — | 118.4 KiB | Includes all lazy chunks; 175 KiB budget |
| CSS | 31.31 KiB | 7.28 KiB | Initial stylesheet |
| Core Rust/WASM | 47.01 KiB | 19.55 KiB | Requested by the relevant worker experiment |
| ES Module Shims TypeScript transformer | 4,768,287 bytes | Not budgeted | Separate vendor file requested only after Browser TypeScript intent |

The transformer size is intentionally conspicuous. ES Module Shims 2.8.4 embeds Amaro 0.5.3 and TypeScript 5.8 grammar for browser-side type stripping. That runtime does not type-check, does not belong in the initial shell, and is not included in the `dist/assets/` JavaScript budget. Project tests use Amaro 1.1.11 separately.

The alternate oj 0.1.11 build is compatibility evidence rather than the budget authority. After the `d5b4ccb` explicit worker/WASM entry fix, a clean Linux container emitted 33 files totaling 5,284,467 bytes, including all three documents, three workers, and a validated 47,019-byte WASM asset. [Frontier run 33541570230](https://github.com/CrioNIK/Web-resume/actions/runs/33541570230) then passed the Vite build, oj build, enhanced worker/WASM verification, summary, and artifact upload. This first remote pass does not change the budgets: Vite continues to define production output, and repeated parity is required before promotion.

## Intent-loading contract

The Horizon Deck starts with no active module. Each of the twelve tabs maps to an independent `React.lazy` import. Selecting a tab may request its UI chunk; expensive execution still waits for an explicit run action where appropriate.

- Runtime Pulse performs no network request until its action.
- WASM Forge starts a one-shot worker and requests the core WASM package only on run.
- Signal Science creates its analytics worker only on run.
- Local AI does not create or download a browser model until the visitor requests it.
- Signal Run animates only while its module is mounted.
- Local Vault does not open IndexedDB until its benchmark action.
- Browser TypeScript does not request ES Module Shims or the 4,768,287-byte transformer before module intent.
- Agent Tools is a lightweight status view; the site-wide WebMCP adapter registers only small read-only descriptors.
- Spatial DOM initializes its renderer only while selected and retains real HTML controls as the accessibility layer.
- Neural Field initializes WebGPU only while mounted and tears down its device-owned work on cleanup.
- Node in a Tab dynamically imports WebContainers only after licensing and environment gates pass.
- Component Mesh starts a one-shot worker and terminates it after result, failure, timeout, or cancellation.

## Runtime targets

These are measurable targets, not hard-coded claims:

- The English or Ukrainian core shell remains interactive without requesting a lab runtime.
- No expensive lab computation begins before visitor intent.
- Analytics, Rust/WASM compute, and Component Mesh work stay off the main thread.
- IndexedDB reports real transaction and indexed-query timing over deterministic synthetic records.
- Renderer device-pixel ratio is capped at 1.5.
- WebGPU and Canvas animation stop on unmount; reduced motion renders a static state.
- Neural Field reports CPU submission timing separately from optional GPU timestamp-query evidence.
- API diagnostics display both client-observed round-trip and server-side preparation time because they measure different boundaries.
- Browser AI download, prompt streaming, cancellation, and fallback state are visible; none is reported as zero-cost local inference.

## Production Lighthouse baseline

The deployed v3 site was measured at `2026-09-01T17:55:29.970Z`:

| Category or metric | Production result |
| --- | ---: |
| Performance | 98 |
| Accessibility | 100 |
| Best Practices | 100 |
| SEO | 100 |
| Agentic Browsing | 100 |
| First Contentful Paint | 1.4 s |
| Largest Contentful Paint | 1.5 s |
| Speed Index | 3.9 s |
| Total Blocking Time | 0 ms |
| Cumulative Layout Shift | 0 |

This is production-URL lab evidence, not field Core Web Vitals. It records the tested deployment and simulated profile at one point in time; INP and population percentiles require real-user field data. The earlier v2 local baseline was 100/100/100/100 with FCP 1.2 s, LCP 1.5 s, Speed Index 1.2 s, TBT 0 ms, and CLS 0, and remains historical rather than directly comparable release telemetry.

## How to verify v3

1. Run `npm ci`, then `npm run build`; retain the emitted budget table.
2. Run `npm run preview` in a clean browser profile and load `/en/` and `/uk/` separately.
3. Record the initial network trace before opening the deck; confirm no lazy lab chunk, core WASM, ESMS transformer, or WebContainer runtime was requested.
4. Select each of the twelve tabs and confirm only its own UI/runtime boundary appears.
5. Run Browser TypeScript and record the separate ESMS loader and transformer requests.
6. Test WebGPU enabled, WebGPU unavailable, device loss where practical, and reduced motion.
7. Verify the Spatial DOM controls remain keyboard-accessible and meaningful with the canvas ignored by assistive technology.
8. Test `/api/pulse` with cold and warm function observations; do not compare server preparation time to round-trip as if they were equivalent.
9. Run and clear Local Vault; confirm its IndexedDB database appears only after interaction and is deleted by the clear action.
10. Confirm the WebContainer module remains gated on the hosted release unless licensing and isolation were deliberately enabled.
11. Repeat mobile Lighthouse and desktop interaction coverage against the production URL after material releases; compare environments before comparing scores.
12. Record browser version, viewport, throttling, capability state, and deployment commit with every published metric.

## Caching

- Hashed `/assets/*` files — including workers and the core WASM binary — receive one-year immutable caching. Content hashes prevent glue/binary version skew.
- HTML remains deployment-controlled and is not assigned immutable caching.
- Browser TypeScript source fixtures receive a one-hour cache; self-hosted ES Module Shims vendor files receive a one-day cache.
- `/api/pulse` is deliberately `no-store` in browser and Vercel CDN layers.

## Regression policy

A feature that breaks a budget must be split behind interaction, replace equivalent weight, or document and approve a new budget with measured evidence. Raising a number solely to make CI green is not acceptable. Deferred assets outside `dist/assets/` must remain visible in this document and the quality report; intent-gating is a delivery decision, not permission to hide their size.
