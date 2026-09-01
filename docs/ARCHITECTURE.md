# Architecture

## Intent

Horizon Lab is small enough to audit and broad enough to demonstrate cooperation between browser, server, native, and build-time runtimes. The architecture optimizes five things:

1. Positioning, verified work, and progress must render before any experiment is requested.
2. English is the default route and Ukrainian has complete product parity, not a partial translation layer.
3. Expensive or experimental modules must sit behind visitor intent, capability checks, and honest status labels.
4. Browser, server, build-time, and release-artifact claims must remain distinguishable.
5. Unsupported capability must degrade into a useful, accessible state without fabricated results.

## System map

```text
                              ┌──────────────────────────────┐
                              │ GitHub evidence lanes        │
                              │ CI · oj · Vinext · components│
                              │ Deno release artifacts       │
                              └──────────────┬───────────────┘
                                             │ build proof only
                                             v
┌──────────────────────────────────────────────────────────────────────┐
│ Canonical Vite 8.2.2 production build                              │
│ root redirect · /en/ · /uk/ · hashed JS/CSS/workers/WASM          │
└───────────────────────────────┬──────────────────────────────────────┘
                                │
              ┌─────────────────┴─────────────────┐
              v                                   v
┌────────────────────────────┐      ┌──────────────────────────────────┐
│ Vercel static CDN          │      │ Deno 2.9.5 release channel      │
│ EN/UK site + /assets/*     │      │ one-file loopback server        │
│ /api/pulse → Go function   │      │ separate native Desktop package│
└─────────────┬──────────────┘      └──────────────────────────────────┘
              │
              v
┌──────────────────────────────────────────────────────────────────────┐
│ React 19.2.8 browser shell                                          │
│ public evidence · progress · locale switch · frontier status        │
│ WebMCP registration when document.modelContext exists               │
├──────────────────────────────────────────────────────────────────────┤
│ Intent-gated Horizon Deck                                           │
│ one React.lazy module requested at a time                           │
│ workers · WASM · WebGPU · IndexedDB · ESMS · optional WebContainer │
└──────────────────────────────────────────────────────────────────────┘
```

The hosted Vercel build is the product. The oj, Vinext, Component Model, and Deno lanes provide compatibility or release evidence without silently replacing the canonical runtime.

## Delivery layers

| Layer | Technology | Responsibility and boundary |
| --- | --- | --- |
| Documents | Three Vite inputs | Root locale redirect plus independently indexed English and Ukrainian documents |
| Client shell | React 19.2.8 | Navigation, project evidence, progress, frontier matrix, localization, and module orchestration |
| Canonical builder | Vite 8.2.2 / Rolldown / Oxc | Production transformation, workers, lazy chunks, and content-hashed assets |
| Builder research | `oj` 0.1.11 | Clean Linux output and Frontier 33541570230 pass with explicit worker/WASM entries; repeated parity is required before promotion |
| Framework research | Vinext 1.0.0-beta.8 | Separate fixture whose canonical Vinext and informational oj builds both passed CI; still not the portfolio runtime |
| Hero renderer | WebGPU / WGSL | Browser-owned procedural atmosphere with Canvas and reduced-motion fallbacks |
| Neural renderer | WebGPU compute + render | Fixed 4→8→4 MLP inference, first-result reference validation, and instanced drawing |
| Visual accessibility | Semantic DOM over `aria-hidden` GPU/Canvas | Keyboard, focus, text, and assistive-technology ownership stay in HTML; HTML-in-Canvas remains separately detected research |
| Core compute | Rust 1.98 / wasm-bindgen | Deterministic particles, latency and signal statistics, and timeline layout |
| Component proof | WIT / Rust / Go / Component Model tooling | Multi-language interfaces and build-time composition; no browser-native component execution claim |
| Data science | ES module worker | Seeded dataset generation, OLS regression, and residual percentiles |
| Browser TypeScript | ES Module Shims 2.8.4 / embedded Amaro 0.5.3 | Intent-loaded strip-only TypeScript execution; project CI uses Amaro 1.1.11 separately |
| Agent interface | WebMCP draft | Two read-only tools over public page-owned projects and progress, registered only on native support |
| Optional in-tab Node | WebContainers 1.6.4 | Deterministic two-file proof gated by licensing, HTTPS, cross-origin isolation, and shared memory |
| Local database | IndexedDB | Opt-in synthetic records, transactional writes, indexed reads, and explicit deletion |
| Hosted service | Go 1.26.7 | Stateless privacy and runtime-pulse contract |
| Hosted deployment | Vercel | Global static CDN and a Frankfurt Go Function |
| Windows distribution | Deno 2.9.5 | One-file loopback local-server launcher plus a separately packaged native Desktop/WebView artifact |

## Canonical build and evidence lanes

### Vite production path

`npm run build` is the release contract. It vendors the pinned browser runtime, produces the three document entries, emits workers and WASM under content hashes, and runs gzip budgets. Vercel is configured against this output.

### oj parity path

`npm run build:oj` targets `dist-oj/`; `npm run verify:oj` checks root, EN, UK, referenced assets, all three worker entries, and the WebAssembly magic header. Commit `d5b4ccb` makes worker and WASM discovery explicit: each module-worker entry is imported with `?worker`, and the core binary is provided through an explicit URL entry instead of relying on Vite-specific inference.

A clean Linux Docker build now emits all three documents, three worker assets, a valid 47,019-byte WASM asset, and 33 files totaling 5,284,467 bytes. [Frontier run 33541570230](https://github.com/CrioNIK/Web-resume/actions/runs/33541570230) at `d5b4ccb` independently passed the canonical Vite build, oj build, enhanced worker/WASM verifier, summary, and artifact upload. This is the first verified remote parity run; repeatability is still a promotion requirement, and Vite remains the canonical release builder.

oj's Rust/Oxc/Rolldown core does not make every compatible Vite configuration universally Node-free: plugin hosting and server-side runtime paths may still require Node. The parity lane measures this repository's output; it does not generalize a toolchain-wide claim.

### Vinext compatibility path

Vinext does not power the portfolio. `experiments/vinext-oj/` is a deliberately isolated 1.0.0-beta.8 fixture. Its local 4/4 compatibility check, TypeScript validation, canonical five-stage Node/Vinext build, production-server RSC response, and dependency audit pass. [CI run 33539678970](https://github.com/CrioNIK/Web-resume/actions/runs/33539678970) at `b2173ff` also passed both the required canonical build and the informational oj probe. That result proves the pinned fixture, not a Node-free Vinext runtime or support for the portfolio's routes, workers, and deployment contract.

### Component Model path

`components/wit/horizon.wit` defines checksum and normalization interfaces. Go supplies a pure checksum capability; Rust imports it and exports normalized signal data. Local tooling validated both component binaries and the `wac plug` composition, including removal of the private checksum import from the public component. [Component Model run 33541570203](https://github.com/CrioNIK/Web-resume/actions/runs/33541570203) at release-code commit `d5b4ccb` rebuilt Rust and Go, composed them, transpiled the result with Jco 1.32.1, executed the generated browser binding, and uploaded the evidence artifact. The public lab still uses a one-shot worker, the existing core Rust/WASM engine, and a TypeScript reference; it does not pretend that browsers natively host Component Model binaries.

The application functions perform no I/O, but the upstream Rust and Go WASIp2 runtimes still leave ambient WASI Preview 2 imports in generated components. Jco's pinned Preview 2 shim satisfies them. The architecture therefore claims a pure call path, not an empty WASI import surface.

### Deno release path

The canonical Vite output is embedded into Deno artifacts after it is built. The one-file Windows artifact is a loopback local-server launcher. [Desktop run 33541570191](https://github.com/CrioNIK/Web-resume/actions/runs/33541570191) at release-code commit `d5b4ccb` built that executable, smoke-tested it from a clean directory, and published its checksum. The separate native WebView job was intentionally skipped in that run; a skipped optional package is not a failed one-file release. Neither distribution includes the hosted Go `/api/pulse` function. See [Deno local and desktop artifacts](DESKTOP.md).

### Canonical release evidence

[CI run 33541570215](https://github.com/CrioNIK/Web-resume/actions/runs/33541570215) passed at release-code commit `d5b4ccb`, covering the canonical Node/Vite, TypeScript, Vitest, Go, Rust, and reproducible WASM gates. Frontier run 33541570230 also passed, but remains a compatibility lane independent of the canonical Vite release.

## Horizon Deck loading model

The deck starts with no active module. Each button maps to one `React.lazy` import:

| Index | Module | Runtime boundary |
| ---: | --- | --- |
| 01 | Runtime Pulse | Browser request to stateless Go endpoint |
| 02 | WASM Forge | One-shot worker → checked-in Rust/WASM package or labelled JavaScript fallback |
| 03 | Signal Science | Dedicated ES module worker |
| 04 | Local AI | Browser-owned `LanguageModel` session or explicit deterministic planner |
| 05 | Signal Run | Canvas animation with keyboard and touch input |
| 06 | Local Vault | IndexedDB opened only after the run action |
| 07 | Browser TypeScript | Self-hosted ES Module Shims and deferred 4.8 MB type-strip transformer |
| 08 | Agent Tools | Status surface for the site-wide, read-only WebMCP registration |
| 09 | Spatial DOM | Real DOM controls aligned to an `aria-hidden` GPU/Canvas scene |
| 10 | Neural Field | WebGPU compute/render pipeline or JavaScript/Canvas/static fallback |
| 11 | Node in a Tab | Dynamic WebContainer import after license and environment gates pass |
| 12 | Component Mesh | One-shot browser worker over the portable component contract |

Selecting a tab requests its module chunk; starting a costly operation may add another explicit action. Module selection does not grant filesystem, credential, repository, or private-data access.

## Capability negotiation

```text
Hero and spatial scene
  prefers-reduced-motion? ── yes ──> one static frame
            │ no
            v
  navigator.gpu available? ── yes ──> WebGPU
            │ no/error
            v
       Canvas 2D

Neural field
  WebGPU adapter/device/pipeline valid? ── yes ──> compute MLP → validate → render
                   │ no/error/device loss
                   v
          JavaScript reference → Canvas

Local AI
  LanguageModel API present? ── no ──> labelled deterministic planner
             │ yes
             v
  availability(language contract)
      ├── available ──> streaming browser session
      ├── downloadable/downloading ──> user-triggered download + progress
      └── unavailable/error ──> labelled deterministic planner

WebContainer
  feature explicitly enabled?
      │ yes
      v
  HTTPS + crossOriginIsolated + SharedArrayBuffer + license satisfied?
      ├── yes ──> mount deterministic fixture → run → request → terminate
      └── no  ──> explain exact gate; download/boot nothing
```

The fallback path is part of the product, not an error screen.

## Runtime boundaries

### Browser shell

- Owns visual rendering, interaction state, route localization, and the public content snapshot.
- Registers WebMCP tools only when the browser exposes `document.modelContext`; no fake polyfill is installed.
- Sends no AI prompt to this application's server.
- Does not connect to the private TableTop BRAMA database.

### Workers and WebAssembly

- Analytics runs in a dedicated module worker.
- WASM Forge runs in a fresh worker and terminates after result, failure, timeout, or cancellation.
- Component Mesh uses a one-shot worker and exposes its CI/build-time artifact boundary in the result.
- Generated Rust/WASM bindings are checked in; Vite emits the binary under a content hash and loads it only on demand.

### Browser-owned optional systems

- Browser TypeScript loads self-hosted ES Module Shims only after the module is selected. Type stripping is syntax transformation, not type safety.
- Local Vault opens IndexedDB only after a run, writes deterministic synthetic records, and provides deletion in the same interface.
- Local AI owns session download, streaming, abort, and destruction inside the browser API boundary.
- WebContainers remain production-disabled until explicit licensing and isolation configuration. The proof never mounts the repository, credentials, or arbitrary user code.

### Go function

- Accepts GET and HEAD only.
- Returns measured handler preparation timing plus documented runtime metadata.
- Generates a fixed-seed diagnostic sample independent of the request.
- Persists nothing and performs no visitor tracking.

### Supabase boundary

The portfolio does not connect to the private TableTop BRAMA database. Coupling public portfolio traffic to it would create unnecessary operational and privacy risk. Local Vault demonstrates browser-database mechanics with synthetic data; it is not a visitor database or a Supabase surrogate. A future persistent public feature must receive a dedicated project, schema, RLS policies, retention policy, and threat review.

## Content and localization boundary

Public portfolio content is defined centrally in `src/data/content.ts`. English and Ukrainian routes use the same typed structure, module inventory, links, status labels, and accessible controls. Private projects expose only safe product scope, role, status, and public surface. They never expose repository URLs, schema names, credentials, providers, internal topology, or unreleased customer details.

## Failure behavior

- A failed Go request produces an offline message without disabling the lab.
- A missing core WASM package invokes a labelled JavaScript fallback.
- WebGPU initialization or device-loss failures transition to Canvas or static rendering.
- Browser AI cancellation stops the request; unsupported or failed initialization invokes the labelled deterministic planner.
- IndexedDB failures produce an unsupported message and never invent benchmark results.
- Browser TypeScript reports loader or transform failures and does not pretend type checking occurred.
- WebMCP absence remains an unsupported status; it never installs a lookalike global.
- WebContainer gates explain the missing requirement and keep the heavy runtime unloaded.
- Component Mesh labels its build-time artifact status and does not claim browser-native execution.
- Every expensive module is visitor-initiated, so a failed experiment cannot block the core portfolio.
