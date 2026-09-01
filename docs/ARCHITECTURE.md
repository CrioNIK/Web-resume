# Architecture

## Intent

Horizon Lab is intentionally small enough to understand and broad enough to demonstrate how different runtimes can cooperate without forcing every visitor to download every experiment.

The architecture optimizes four things:

1. The positioning and evidence must render quickly.
2. Experimental modules must be isolated behind user intent and capability checks.
3. Browser compute and server compute must be distinguishable.
4. Unsupported capability must degrade into a useful, clearly labelled state.

## Delivery layers

| Layer | Technology | Responsibility |
| --- | --- | --- |
| Documents | Three Vite inputs | Root locale redirect plus independently indexed English and Ukrainian documents |
| Client shell | React 19 | Navigation, project evidence, progress, and module orchestration |
| Build engine | Vite 8 / Rolldown / Oxc | Rust-powered bundling, transformation, workers, and lazy chunks |
| GPU renderer | WebGPU / WGSL | Browser-owned procedural hero field |
| Visual fallback | Canvas 2D | Equivalent atmosphere when WebGPU is absent |
| Compute kernel | Rust 1.98 / wasm-bindgen | Deterministic particles, latency and signal statistics, timeline layout |
| Data science | ES module worker | Seeded dataset generation, OLS regression, residual percentiles |
| Service | Go 1.26.7 | Stateless privacy and runtime pulse contract |
| Deployment | Vercel | Global static CDN and a Frankfurt Go Function |

## Capability negotiation

```text
Hero renderer
  reduced motion requested? ── yes ──> one static Canvas frame
            │ no
            v
  navigator.gpu available? ── yes ──> WebGPU shader
            │ no/error
            v
       Canvas 2D loop

AI mapper
  global LanguageModel available? ── yes ──> browser-owned session
                │ no/error
                v
       deterministic local planner
```

The fallback path is part of the product, not an error screen.

## Runtime boundaries

### Browser

- Owns all visual rendering and interaction state.
- Loads one lab module at a time through `React.lazy`.
- Runs analytics in a dedicated module worker.
- Runs the Rust/WASM forge in a fresh dedicated worker, then terminates it after result, failure, timeout, or cancellation.
- Emits the checked-in generated WASM package as a content-hashed Vite asset and loads it only after an explicit forge run.
- Does not send AI prompts to this application server.

### Go function

- Accepts GET and HEAD only.
- Returns measured handler preparation timing plus documented runtime metadata.
- Generates a fixed-seed synthetic diagnostic sample independent of the request.
- Persists nothing and performs no visitor tracking.

### Supabase boundary

The portfolio does not connect to the private TableTop BRAMA database. The deployment audit confirmed that infrastructure exists for that separate product, but coupling a public portfolio to it would create unnecessary operational and privacy risk. If a future portfolio data feature needs persistence, it should receive a dedicated project, schema, RLS policies, retention policy, and threat review.

## Content boundary

All public portfolio content is in `src/data/content.ts`. Private projects expose only safe product scope, role, status, and public surface. They never expose repository URLs, schema names, credentials, providers, internal topology, or unreleased customer details.

## Failure behavior

- A failed Go request produces an offline message without disabling the lab.
- A missing WASM package invokes a labelled JavaScript fallback.
- WebGPU initialization errors are swallowed only at the capability boundary, then Canvas starts.
- Browser AI initialization errors invoke the deterministic planner and disclose the change of mode.
- Every expensive module is initiated by the visitor, so failures do not block the core portfolio.
