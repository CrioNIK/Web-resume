# Changelog

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
- Lazy Runtime Pulse, WASM Forge, Signal Science, Local AI, and Signal Run modules.
- One-shot compute workers for Rust/WASM and the bounded JavaScript fallback, plus module-worker OLS analytics, browser-native AI capability bridge, and canvas mini-game.
- Reproducible WASM path remapping so checked-in binaries remain byte-identical across different Cargo homes.
- Strict TypeScript, Vitest, Rust and Go tests, bundle budgets, Node 24 CI actions, verified tool downloads, Dependabot, CSP, sitemap, hreflang, and operating documentation.

### Removed

- Astro routes, content collections, MDX, React islands, Three.js dependencies, and the legacy 3D scene.
- Approximately 31 MB of unused game-derived WAV assets, unlicensed custom fonts, and duplicate model files.
- Route transition delays, opt-out audio, and decorative UI systems that competed with the work.

All removed tracked assets remain recoverable from Git history.
