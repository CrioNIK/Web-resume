# CrioMant — Horizon Lab

The live portfolio and browser-systems lab of **Mykyta Baturin / CrioMant**.

[Open the English experience](https://web-resume-murex.vercel.app/en/) · [Відкрити українську версію](https://web-resume-murex.vercel.app/uk/) · [GitHub profile](https://github.com/CrioNIK)

Horizon Lab is not a static résumé. It is a small, measured product system built to make shipped work, public evidence, current progress, and technical range inspectable.

## What changed in v2

The previous Astro portfolio was removed and used only as a content donor. Version 2 is a new implementation:

- **Vite 8 + React 19** for a small client shell and Rust-powered Rolldown builds.
- **Rust 1.98 → WebAssembly** for deterministic particles, signal analysis, latency statistics, and timeline layout.
- **Go 1.26.7** for a privacy-first Vercel pulse API.
- **WebGPU** for the hero field when supported, with a Canvas 2D fallback and a reduced-motion static mode.
- **Module Workers** for off-main-thread Rust/WASM compute, bounded JavaScript fallback, synthetic dataset generation, and regression.
- **Experimental browser-native AI** when a local `LanguageModel` API exists, with an explicitly labelled deterministic fallback.
- **English-first routing** with complete Ukrainian UI and content parity.
- **Five lazy lab modules**: Go runtime pulse, Rust/WASM forge, data-science bench, local AI mapper, and a canvas mini-game.

No screen claims literal zero latency. The UI measures real device and network timing, labels synthetic signals, and treats “instant” as a performance budget rather than mythology.

## Public proof represented in the portfolio

- 23 pull requests merged upstream into [Yoonmoonsik/bg3dnd](https://github.com/Yoonmoonsik/bg3dnd): 4 Ukrainian and 19 Polish.
- 5,355 verified localization handles per locale.
- Public evidence includes [PR #1305](https://github.com/Yoonmoonsik/bg3dnd/pull/1305), [#1310](https://github.com/Yoonmoonsik/bg3dnd/pull/1310), [#1324](https://github.com/Yoonmoonsik/bg3dnd/pull/1324), and [#1344](https://github.com/Yoonmoonsik/bg3dnd/pull/1344).
- A live [TableTop BRAMA foundation](https://app-zeta-gules-57.vercel.app/) whose broader source remains private.

Attribution boundary: `Yoonmoonsik/bg3dnd` belongs to and is maintained by Yoonmoonsik. CrioNIK / TableTop BRAMA contributed localization and QA; the portfolio does not claim ownership of the upstream project.

## Architecture

```text
Vercel global CDN
├── /en/ + /uk/       static Vite entry documents
├── /assets/*         hashed React/CSS/worker/WASM chunks
└── /api/pulse        stateless Go Vercel Function (fra1)

Browser
├── capability gate → WebGPU or Canvas 2D or static field
├── lazy lab deck    → one module downloaded on selection
├── analytics worker → deterministic OLS analytics
├── compute worker   → hashed Rust/WASM or honest JS fallback
└── optional AI      → browser LanguageModel or honest local ruleset
```

See [Architecture](docs/ARCHITECTURE.md), [performance budgets](docs/PERFORMANCE.md), [content/localization guide](docs/CONTENT_GUIDE.md), and the [Go API contract](docs/GO_API.md).

## Local development

Requirements:

- Node.js 24
- npm 11+
- Optional: Go 1.26.7 for the live pulse endpoint
- Optional: Rust 1.98, the `wasm32-unknown-unknown` target, and wasm-pack 0.15 for rebuilding the checked-in WASM package

```bash
npm install
npm run dev
```

The frontend runs at `http://127.0.0.1:4173/en/`. Without the optional Go process, the Runtime Pulse module shows its designed offline state while every other module remains functional.

Run the local API in a second terminal:

```bash
npm run dev:api
```

Vite proxies `/api/*` to `127.0.0.1:8787` in development.

## Validation

```bash
npm run check       # strict TypeScript project references
npm run test        # deterministic analytics and planner tests
npm run build       # Vite production build + gzip bundle budgets
npm run validate    # all frontend gates
npm run test:go     # Go tests when a Go toolchain is installed
cargo test --manifest-path crates/horizon-engine/Cargo.toml
```

The CI workflow also runs `go vet`, race-enabled Go tests, Rust tests, a reproducible WASM build, and checks that generated browser artifacts are committed.

## Rebuild the Rust/WASM package

```bash
rustup target add wasm32-unknown-unknown
npm run build:wasm
```

Generated bindings live in `src/generated/horizon-engine/` so Vercel does not need a Rust toolchain during the frontend build. Vite follows the generated `new URL(..., import.meta.url)` reference, emits a content-hashed WASM asset, and keeps compute off the main thread. The build script remaps machine-specific Cargo paths before compilation so CI can verify the checked-in binary byte-for-byte. The source of truth is `crates/horizon-engine/`; generated files must change only as a consequence of that crate or the pinned toolchain workflow.

## Performance and privacy

- Initial production budget: largest JS chunk ≤ 90 KiB gzip, all JS ≤ 175 KiB gzip, CSS ≤ 45 KiB gzip.
- Lab modules are split and loaded on interaction.
- Device pixel ratio is capped for the atmospheric renderer.
- Animation freezes under `prefers-reduced-motion`.
- `/api/pulse` is GET/HEAD only, `no-store`, has no application persistence, and derives no signal from the visitor.
- No analytics vendor, cookies, fingerprinting, visitor database, or AI proxy is included.
- A strict CSP, permissions policy, HSTS, no-sniff, and frame denial are configured in `vercel.json`.

## Deployment

The repository is linked to the existing Vercel project. A push to `master` triggers production deployment. `vercel.json` pins Vite as the framework, fixes the build/output contract, and places the Go function in Frankfurt. Frontend, worker, and WASM assets are content-hashed and immutable.

## Repository policy

The repository currently declares no repository-wide license. Do not assume permission to reuse the implementation or brand assets beyond what applicable law allows. Public upstream work linked above retains its own ownership and licensing terms.
