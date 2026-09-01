# CrioMant — Horizon Lab

The live portfolio and browser-systems lab of **Mykyta Baturin / CrioMant**.

[Open the English experience](https://web-resume-murex.vercel.app/en/) · [Відкрити українську версію](https://web-resume-murex.vercel.app/uk/) · [GitHub profile](https://github.com/CrioNIK)

Horizon Lab is an English-first, fully Ukrainian-localized portfolio built as a measured product system. It makes shipped work, public evidence, current progress, and experimental boundaries inspectable instead of hiding them behind adjectives.

## What changed in v3

Version 3 extends the Vite/React rebuild from v2 into a twelve-module runtime lab and a ten-target frontier matrix:

- **Vite 8.2.2 + React 19.2.8 remain the canonical production path.** The Rust-native `oj` 0.1.11 builder has a pinned Linux parity workflow, but that lane is unverified until its first CI run passes repeatedly and does not imply a universally Node-free Vite/plugin stack.
- **Twelve intent-gated lab modules** cover Go, Rust/WASM, data science, local AI, Canvas, IndexedDB, browser TypeScript, WebMCP, accessible spatial DOM, WebGPU neural compute, WebContainers, and the Wasm Component Model.
- **Browser TypeScript** uses self-hosted ES Module Shims 2.8.4. Its embedded Amaro 0.5.3 transformer is a deferred 4,768,287-byte asset; it strips types but does not type-check. Project validation separately uses Amaro 1.1.11.
- **Two draft WebMCP tools** expose the same public project and progress data shown on the page. Both are read-only, accept no input properties, and are registered only when `document.modelContext` exists.
- **Accessible GPU co-rendering** keeps semantic, focusable DOM controls over an `aria-hidden` Canvas/WebGPU scene. The evolving HTML-in-Canvas API is detected as an experiment, not used as the production accessibility layer.
- **A real WebContainer adapter** can mount a deterministic two-file `node:http` project, request its preview, and terminate it. Production keeps it disabled until commercial licensing and cross-origin isolation are explicitly satisfied.
- **Deno 2.9.5 release artifacts** provide a literal single-file Windows local-server launcher plus a separately packaged native Desktop/WebView build. Those are different distribution shapes and are documented as such.
- **A WIT-defined Component Model proof** connects Rust normalization and Go checksum components at build time. Browser code never claims native Component Model execution, and documentation distinguishes pure application functions from ambient WASI Preview 2 imports retained by upstream runtimes.
- **Browser-provided AI** is negotiated at execution time with explicit language and download states; unavailable or failed sessions use a labelled deterministic planner, never a hidden network service.
- **A deterministic 4→8→4 MLP** runs through WebGPU compute and instanced rendering, validates its first result against the JavaScript reference, and falls back to Canvas when the GPU path is unavailable.

No screen claims literal zero latency. The interface reports real device and network timing, labels synthetic signals, and treats “instant” as a performance budget rather than mythology.

## Frontier status at a glance

| Target | Repository status | Honest boundary |
| --- | --- | --- |
| `oj` 0.1.11 | Linux parity workflow | Vite is canonical; the new lane is unverified until CI proves repeatable output |
| Vinext 1.0.0-beta.8 | Isolated compatibility fixture | Canonical Node/Vinext build is required; Vinext-on-oj is informational and may fail |
| Browser TypeScript | Live, intent-gated | Strip-only ES Module Shims runtime; the 4.8 MB transformer is never an initial-route cost |
| WebMCP | Live where supported | Two read-only draft tools; no polyfill, mutation, secrets, or private data |
| HTML-in-Canvas | Accessible production analogue | Real DOM overlay ships; the proposal API remains capability-detected research |
| WebContainers | Implemented, gated | Requires explicit licensing, HTTPS, cross-origin isolation, and shared memory |
| Deno Desktop | Build proof | One-file local server and native Desktop package remain separate artifacts |
| Wasm Components | Multi-language build proof | WIT/Rust/Go composition is locally validated; Jco browser ESM remains CI evidence, not native execution |
| Browser AI | Progressive enhancement | Browser-owned model when available; deterministic local planner otherwise |
| WebGPU Neural | Live | Real compute/render pipeline with JavaScript/Canvas reference fallback |

The detailed evidence, versions, primary references, and release boundaries live in [Frontier runtime](docs/FRONTIER_RUNTIME.md).

## Twelve lazy lab systems

The deck begins inert. Selecting a tab downloads only that module and starts only the requested experiment:

1. Runtime Pulse — measured browser → Go API round-trip and cache behavior.
2. WASM Forge — deterministic Rust/WebAssembly compute in a one-shot worker.
3. Signal Science — seeded data generation and OLS regression off the main thread.
4. Local AI — browser-provided model negotiation or an explicit offline planner.
5. Signal Run — keyboard/touch Canvas mini-game.
6. Local Vault — opt-in IndexedDB transactions over synthetic data with explicit deletion.
7. Browser TypeScript — self-hosted type stripping and execution through ES Module Shims.
8. Agent Tools — read-only project and progress access through the WebMCP draft.
9. Spatial DOM — real accessible HTML controls projected over a GPU-rendered scene.
10. Neural Field — deterministic WebGPU 4→8→4 MLP compute and rendering.
11. Node in a Tab — license- and isolation-gated WebContainer proof.
12. Component Mesh — WIT/Rust/Go build proof with an honest browser-host fallback.

## Public proof represented in the portfolio

- 23 pull requests merged upstream into [Yoonmoonsik/bg3dnd](https://github.com/Yoonmoonsik/bg3dnd): 4 Ukrainian and 19 Polish.
- 5,355 verified localization handles per locale, or 10,710 reviewed localized entries in total.
- Public evidence includes [PR #1305](https://github.com/Yoonmoonsik/bg3dnd/pull/1305), [#1310](https://github.com/Yoonmoonsik/bg3dnd/pull/1310), [#1324](https://github.com/Yoonmoonsik/bg3dnd/pull/1324), and [#1344](https://github.com/Yoonmoonsik/bg3dnd/pull/1344).
- A live [TableTop BRAMA foundation](https://app-zeta-gules-57.vercel.app/) whose broader source remains private.

Attribution boundary: `Yoonmoonsik/bg3dnd` belongs to and is maintained by Yoonmoonsik. CrioNIK / TableTop BRAMA contributed localization and QA; the portfolio does not claim ownership of the upstream project.

## Architecture

```text
Canonical hosted release
Vercel global CDN
├── /en/ + /uk/       indexed Vite entry documents
├── /assets/*         hashed React/CSS/worker/WASM chunks
└── /api/pulse        stateless Go Vercel Function (fra1)

Browser
├── base shell        projects, progress, frontier status, locale parity
├── WebMCP adapter    two read-only tools when document.modelContext exists
├── lazy lab deck     one module requested on selection
├── GPU paths         WebGPU render/compute → Canvas → static fallbacks
├── local state       synthetic IndexedDB only after explicit intent
└── optional runtime  browser AI, ESMS TypeScript, or gated WebContainer

Release and research lanes
├── oj 0.1.11         unverified Linux parity workflow; Vite stays canonical
├── Vinext beta       isolated compatibility fixture; never the portfolio runtime
├── Deno 2.9.5        one-file local server + separate native Desktop package
└── Wasm components   WIT/Rust/Go build-time evidence + browser host fallback
```

See [Architecture](docs/ARCHITECTURE.md), [frontier runtime boundaries](docs/FRONTIER_RUNTIME.md), [performance budgets](docs/PERFORMANCE.md), the [measured quality report](docs/QUALITY_REPORT.md), [desktop distribution](docs/DESKTOP.md), [content/localization guide](docs/CONTENT_GUIDE.md), and the [Go API contract](docs/GO_API.md).

## Local development

Requirements:

- Node.js 24 and npm 11+
- Optional: Go 1.26.7 for the live pulse endpoint
- Optional: Rust 1.98, the `wasm32-unknown-unknown` target, and wasm-pack 0.15 for rebuilding the checked-in core WASM package
- Optional: Deno 2.9.5 for reproducing Windows local-server and Desktop artifacts
- Optional: `oj` 0.1.11 on a supported Rust host for the experimental parity build

```bash
npm install
npm run dev
```

`predev` copies the pinned ES Module Shims browser runtime from `node_modules` into the ignored `public/vendor/` working directory. The frontend runs at `http://127.0.0.1:4173/en/`. Without the optional Go process, Runtime Pulse shows its designed offline state while the rest of the portfolio remains functional.

Run the local API in a second terminal:

```bash
npm run dev:api
```

Vite proxies `/api/*` to `127.0.0.1:8787` in development.

## Validation

```bash
npm run check       # strict TypeScript project references
npm run test        # deterministic browser/runtime contract tests
npm run build       # canonical Vite build + gzip bundle budgets
npm run validate    # all frontend gates
npm run test:go     # Go tests when a Go toolchain is installed
cargo test --manifest-path crates/horizon-engine/Cargo.toml
```

The current local v3 candidate passes 10 Vitest files and 32 tests. Its measured canonical build is documented in [Performance](docs/PERFORMANCE.md) and [Quality report](docs/QUALITY_REPORT.md).

Additional evidence lanes:

```bash
npm run build:oj    # experimental oj output; requires oj 0.1.11
npm run verify:oj   # verifies routes, referenced assets, and a WASM artifact
```

The `frontier.yml` workflow runs the canonical Vite build and a pinned Linux oj parity build. The oj result must not be described as verified until CI completes successfully and repeatably. The separate Vinext 1.0.0-beta.8 fixture passes its local compatibility check, TypeScript build, canonical five-stage build, and production-server smoke response; `vinext-probe.yml` records those required checks before attempting oj as informational. Neither fixture nor workflow changes the production framework.

## Rebuild the Rust/WASM package

```bash
rustup target add wasm32-unknown-unknown
npm run build:wasm
```

Generated bindings live in `src/generated/horizon-engine/` so Vercel does not need a Rust toolchain during the frontend build. Vite follows the generated `new URL(..., import.meta.url)` reference, emits a content-hashed WASM asset, and keeps compute off the main thread. The source of truth is `crates/horizon-engine/`; generated files must change only as a consequence of that crate or the pinned toolchain workflow.

## Performance and privacy

- Initial production budget: largest JS chunk ≤ 90 KiB gzip, all JS ≤ 175 KiB gzip, CSS ≤ 45 KiB gzip.
- The current canonical build contains 118.4 KiB of JavaScript gzip in total; the 219.61 KiB raw main chunk is 69.90 KiB gzip. CSS is 31.79 KiB raw / 7.38 KiB gzip.
- The core Rust/WASM asset is 47.01 KiB raw / 19.55 KiB gzip and remains interaction-gated.
- The 4,768,287-byte browser TypeScript transformer is a separately deferred vendor asset and is not hidden inside the initial JavaScript budget.
- Device pixel ratio is capped; animation freezes under `prefers-reduced-motion`.
- `/api/pulse` is GET/HEAD only, `no-store`, has no application persistence, and derives no visitor signal.
- No analytics vendor, cookies, fingerprinting, visitor database, or AI proxy is included. Local Vault stores only synthetic records in the visitor's own IndexedDB and exposes a clear action.
- WebMCP tools are read-only and return only public page-owned data. The WebContainer proof never mounts this repository, credentials, or user code.
- A strict CSP, permissions policy, HSTS, no-sniff, and frame denial are configured in `vercel.json`.

## Deployment

The repository is linked to the existing Vercel project. A push to `master` triggers production deployment. `vercel.json` pins Vite as the framework, fixes the build/output contract, and places the Go function in Frankfurt. Frontend, worker, and WASM assets are content-hashed and immutable.

Deno artifacts are a separate release channel and do not replace Vercel. The one-file launcher serves the already-built EN/UK site on loopback; the native Desktop/WebView package has a different artifact shape. See [Desktop distribution](docs/DESKTOP.md).

## Repository policy

The repository currently declares no repository-wide license. Do not assume permission to reuse the implementation or brand assets beyond what applicable law allows. Public upstream work linked above retains its own ownership and licensing terms.
