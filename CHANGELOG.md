# Changelog

## 3.0.0 — 2026-09-01

### Added

- A ten-target Frontier Matrix that distinguishes live capabilities, build proofs, gated systems, and research fixtures.
- Six additional intent-loaded modules, bringing the Horizon Deck to twelve: Browser TypeScript, Agent Tools, Spatial DOM, Neural Field, Node in a Tab, and Component Mesh.
- Self-hosted ES Module Shims 2.8.4 browser TypeScript execution. Its embedded Amaro 0.5.3 / TypeScript 5.8 transformer is strip-only and deferred until visitor intent; project tests separately use Amaro 1.1.11.
- Two site-wide, read-only draft WebMCP tools: `portfolio.list_projects` and `portfolio.get_progress`. They expose only public page data and register only when `document.modelContext` exists.
- An accessible spatial interface with real semantic DOM controls projected over an `aria-hidden` GPU scene, plus separate capability detection for the experimental HTML-in-Canvas API.
- A WebContainer 1.6.4 adapter that mounts a deterministic two-file `node:http` proof, requests the preview, and terminates the process without mounting this repository, credentials, or user code.
- A deterministic WebGPU compute/render pipeline for a fixed 4→8→4 MLP, first-result validation against the JavaScript reference, timestamp-query-aware metrics, Canvas fallback, and device-loss handling.
- A WIT-defined Component Model proof with Rust normalization and Go checksum components composed at build time, plus an explicitly non-native browser fallback.
- A Deno 2.9.5 Windows release pipeline for a literal single-file local-server launcher and a separately packaged native Desktop/WebView artifact.
- A pinned `oj` 0.1.11 Linux parity workflow and an isolated Vinext 1.0.0-beta.8 compatibility fixture.

### Changed

- Upgraded the portfolio positioning and progress narrative to Horizon Lab v3 while preserving complete English/Ukrainian route, content, metadata, control, and accessibility parity.
- Expanded Local AI into explicit availability, download, streaming, cancellation, and teardown states. Unsupported or failed browser sessions use a labelled deterministic planner; cancelled work never silently changes runtime.
- Expanded the lab navigation, keyboard model, responsive layout, documentation, privacy boundaries, and quality gates for twelve independent systems.
- Kept Vite 8.2.2 and React 19.2.8 as the canonical production stack. Neither the oj lane nor the Vinext fixture changes the deployed framework.

### Verified release evidence

- Strict TypeScript project references, 10 Vitest files, and 32 deterministic tests pass.
- The canonical Vite production build remains within budget: 118.4 KiB total JavaScript gzip, a 214.65 KiB raw / 67.63 KiB gzip main chunk, and 31.31 KiB raw / 7.28 KiB gzip CSS.
- The core Rust/WASM artifact remains 47.01 KiB raw / 19.55 KiB gzip.
- The 4,768,287-byte browser TypeScript transformer remains a separate, intent-gated vendor asset rather than an initial-route dependency.
- Canonical CI [run 33541570215](https://github.com/CrioNIK/Web-resume/actions/runs/33541570215) passed for release-code commit `d5b4ccb`.
- Desktop [run 33541570191](https://github.com/CrioNIK/Web-resume/actions/runs/33541570191) passed at `d5b4ccb`: the one-file Windows server was built, smoke-tested from a clean directory, and checksummed; the separate WebView job was intentionally skipped.
- Vinext [run 33539678970](https://github.com/CrioNIK/Web-resume/actions/runs/33539678970) passed at `b2173ff`, including the required canonical five-stage Vinext build and the informational oj 0.1.11 probe.
- Component Model [run 33541570203](https://github.com/CrioNIK/Web-resume/actions/runs/33541570203) passed at `d5b4ccb`, including Rust and Go component builds, `wac` composition, Jco browser execution, and artifact upload.
- Commit `d5b4ccb` fixes oj compatibility with explicit `?worker` entries and an explicit WASM URL. A clean Linux container emitted root, EN, UK, three worker assets, a valid 47,019-byte WASM asset, and 33 files totaling 5,284,467 bytes. [Frontier run 33541570230](https://github.com/CrioNIK/Web-resume/actions/runs/33541570230) then passed the canonical Vite build, oj build, enhanced worker/WASM verifier, summary, and artifact upload.
- Browser smoke checks completed for Rust/WASM Forge, worker analytics, Component Mesh, and both read-only WebMCP tools.
- The production Lighthouse run at `2026-09-01T17:55:29.970Z` scored Performance 98, Accessibility 100, Best Practices 100, SEO 100, and Agentic Browsing 100, with FCP 1.4 s, LCP 1.5 s, Speed Index 3.9 s, Total Blocking Time 0 ms, and CLS 0.

### Explicit boundaries

- The oj 0.1.11 build is verified locally and by its first passing remote Frontier run. Repeated parity remains required for promotion, and Vite remains canonical.
- Vinext-on-oj passed its informational CI probe, but remains research rather than a supported production stack or a Node-free runtime claim.
- The production spatial path uses accessible DOM over GPU/Canvas. HTML-in-Canvas itself remains experimental.
- WebContainers remain disabled in production until commercial licensing, HTTPS, cross-origin isolation, and shared-memory requirements are deliberately satisfied.
- Deno's one-file deliverable is a loopback local-server launcher. The native Desktop/WebView distribution is a separate directory-based package.
- Component Model composition is build-time evidence. The site does not claim that browsers natively execute component binaries.
- Component functions perform no application I/O, but upstream Rust and Go runtimes retain ambient WASI Preview 2 imports; the release does not claim an empty WASI import surface.
- Browser AI is progressive enhancement with no application AI proxy or hidden network fallback.

## 2.0.0 — 2026-09-01

### Rebuilt

- Replaced the Astro application with a Vite 8 / React 19 multi-entry client.
- Repositioned the portfolio as CrioMant Horizon Lab with English as the default and complete Ukrainian parity.
- Rewrote project evidence around TableTop BRAMA, 23 merged bg3dnd localization PRs, the new portfolio system, and a clearly labelled private prototype.

### Added

- Rust 1.98 WebAssembly compute crate with deterministic particle, latency, signal, and timeline APIs.
- Checked-in 47 KB WASM browser artifact built with wasm-pack 0.15 and emitted by Vite under a content hash.
- Go 1.26.7 privacy-first pulse API for Vercel's beta Go runtime.
- WebGPU procedural hero with Canvas 2D and reduced-motion fallbacks.
- Lazy Runtime Pulse, WASM Forge, Signal Science, Local AI, Signal Run, and Local Vault modules.
- A real, opt-in IndexedDB transaction benchmark with synthetic records, a secondary index, measured timings, and user-controlled deletion.
- One-shot compute workers for Rust/WASM and the bounded JavaScript fallback, plus module-worker OLS analytics, browser-native AI capability bridge, and canvas mini-game.
- Reproducible WASM path remapping so checked-in binaries remain byte-identical across different Cargo homes.
- Strict TypeScript, Vitest, Rust and Go tests, bundle budgets, Node 24 CI actions, verified tool downloads, Dependabot, CSP, sitemap, hreflang, and operating documentation.
- An inert lab launcher, user-controlled WebGPU motion, fixed mobile navigation and hash restoration, complete localized accessibility labels, and a recorded 100/100/100/100 mobile Lighthouse baseline.

### Removed

- Astro routes, content collections, MDX, React islands, Three.js dependencies, and the legacy 3D scene.
- Approximately 31 MB of unused game-derived WAV assets, unlicensed custom fonts, and duplicate model files.
- Route transition delays, opt-out audio, and decorative UI systems that competed with the work.

All removed tracked assets remain recoverable from Git history.
