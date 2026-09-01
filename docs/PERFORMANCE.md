# Performance contract

“Zero latency” is not a physically meaningful production claim. Horizon Lab instead treats immediacy as a set of measured budgets with separate boundaries for transfer, main-thread work, rendering, and network round-trip.

## Build budgets

`scripts/check-bundle.mjs` fails production builds when any limit is exceeded:

| Asset class | Budget |
| --- | ---: |
| Largest JavaScript chunk | 90 KiB gzip |
| All JavaScript chunks | 175 KiB gzip |
| All CSS | 45 KiB gzip |

The WASM package is excluded from the JavaScript budget and reported separately in release notes. It is fetched only when the visitor opens WASM Forge.

## Runtime targets

These are targets, not hard-coded claims:

- Core shell remains interactive without loading a lab module.
- No lab computation runs before an explicit module selection.
- Analytics runs off the main thread.
- Rust/WASM and its bounded JavaScript fallback run off the main thread in a one-shot worker.
- Renderer DPR is capped at 1.5.
- WebGPU and Canvas animation stop on unmount; reduced motion renders one frame.
- API timing shows both client-observed round-trip and server-side preparation time because they measure different boundaries.

## How to verify

1. Run `npm run build` and inspect the emitted budget table.
2. Run `npm run preview` and use a clean browser profile.
3. Verify the English shell before opening any lab tab.
4. Open each tab and confirm only its chunk appears in the network panel.
5. Test with WebGPU enabled, WebGPU unavailable, and reduced motion enabled.
6. Test `/api/pulse` with and without a warm function; do not compare server timing to round-trip as if they were equivalent.
7. Use mobile CPU/network throttling and record LCP, INP, CLS, and long tasks.

## Caching

- Hashed `/assets/*` — including the compute worker and WASM binary — receive one-year immutable caching. Content hashes prevent glue/binary version skew.
- HTML remains deployment-controlled and is not assigned immutable caching.
- `/api/pulse` is deliberately `no-store` in both browser and Vercel CDN layers.

## Regression policy

A feature that breaks the build budget must either be split behind interaction, replace an equivalent dependency, or document and approve a new budget with measured evidence. Raising a number solely to make CI green is not an acceptable change.
