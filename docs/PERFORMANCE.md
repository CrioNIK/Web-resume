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

The 2026-09-01 local Vite 8.2.2 release candidate passed the configured budgets:

| Asset boundary | Raw | Gzip | Delivery behavior |
| --- | ---: | ---: | --- |
| Main JavaScript chunk | 219.61 KiB | 69.90 KiB | Initial application shell |
| All JavaScript chunks | — | 118.4 KiB | Includes all lazy chunks; 175 KiB budget |
| CSS | 31.79 KiB | 7.38 KiB | Initial stylesheet |
| Core Rust/WASM | 47.01 KiB | 19.55 KiB | Requested by the relevant worker experiment |
| ES Module Shims TypeScript transformer | 4,768,287 bytes | Not budgeted | Separate vendor file requested only after Browser TypeScript intent |

The transformer size is intentionally conspicuous. ES Module Shims 2.8.4 embeds Amaro 0.5.3 and TypeScript 5.8 grammar for browser-side type stripping. That runtime does not type-check, does not belong in the initial shell, and is not included in the `dist/assets/` JavaScript budget. Project tests use Amaro 1.1.11 separately.

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

## Historical Lighthouse baseline

Horizon Lab v2 scored 100 in Lighthouse 13.4.1 for Performance, Accessibility, Best Practices, and SEO against its local production build under the default simulated mobile profile. FCP was 1.2 s, LCP 1.5 s, Speed Index 1.2 s, Total Blocking Time 0 ms, and CLS 0.

That result is retained as historical evidence only. It predates the v3 shell and does **not** establish a v3 Lighthouse score. A new production run must be recorded after the v3 deployment; Lighthouse simulation remains lab data rather than field Core Web Vitals.

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
11. Run mobile Lighthouse and desktop interaction coverage against the final production URL, not only local preview.
12. Record browser version, viewport, throttling, capability state, and deployment commit with every published metric.

## Caching

- Hashed `/assets/*` files — including workers and the core WASM binary — receive one-year immutable caching. Content hashes prevent glue/binary version skew.
- HTML remains deployment-controlled and is not assigned immutable caching.
- Browser TypeScript source fixtures receive a one-hour cache; self-hosted ES Module Shims vendor files receive a one-day cache.
- `/api/pulse` is deliberately `no-store` in browser and Vercel CDN layers.

## Regression policy

A feature that breaks a budget must be split behind interaction, replace equivalent weight, or document and approve a new budget with measured evidence. Raising a number solely to make CI green is not acceptable. Deferred assets outside `dist/assets/` must remain visible in this document and the quality report; intent-gating is a delivery decision, not permission to hide their size.
