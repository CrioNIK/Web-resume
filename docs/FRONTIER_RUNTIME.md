# Frontier runtime ledger

## Purpose

Horizon Lab v3 tracks ten frontier targets without treating “present in the repository” as equivalent to “production-ready.” This ledger records what runs, what is only build evidence, what is deliberately gated, and what remains research.

The canonical public product is the Vite-built English/Ukrainian portfolio deployed to Vercel. Every other runtime must preserve that baseline or remain isolated from it.

## Status language

| Status | Meaning in this repository |
| --- | --- |
| **Live** | Implemented in the portfolio and exercised only when its runtime/capability is available |
| **Build proof** | Source, tooling, workflow, or artifact demonstrates a reproducible non-default path; it does not automatically replace production |
| **Gated** | Implemented, but disabled until an explicit license, security, deployment, or platform requirement is satisfied |
| **Research** | Isolated compatibility observation with no production support claim |

Unsupported capability is not converted into a fake success state. Each system either provides a labelled fallback or explains the unmet gate.

## Version ledger

| System | Pinned or current version | Role |
| --- | --- | --- |
| Vite | 8.2.2 | Canonical production builder |
| React | 19.2.8 | Canonical browser shell |
| TypeScript | 7.0.2 | Project type checking |
| Rust | 1.98 | Core WASM and component source toolchain |
| Go | 1.26.7 | Hosted pulse service and checksum component source |
| Deno | 2.9.5 | Windows local-server and Desktop artifact tooling |
| `oj` | 0.1.11 | Experimental Rust-native parity builder |
| Vinext | 1.0.0-beta.8 | Isolated Next-compatible research fixture |
| ES Module Shims | 2.8.4 | Self-hosted browser TypeScript loader |
| Embedded Amaro | 0.5.3 | ESMS browser type-strip transformer, TypeScript 5.8 grammar |
| Project Amaro | 1.1.11 | Build/test parity for the browser fixture |
| WebContainers API | 1.6.4 | License- and isolation-gated in-tab Node proof |
| wit-bindgen | 0.61.1 | Rust Component Model bindings |
| componentize-go | 0.4.1 | Go component bindings and build |
| wac-cli | 0.10.1 | Rust/Go component composition |
| wasm-tools | 1.258.0 | Component validation and WIT inspection |
| Jco | 1.32.1 | CI transpilation to browser ESM/core Wasm |
| preview2-shim | 0.22.0 | Host for generated WASI Preview 2 imports |

Dependency ranges may permit compatible installs, but release automation and runtime checks should keep evidence tied to the versions recorded here.

## Release evidence snapshot

| Lane | Run | Commit | Result |
| --- | --- | --- | --- |
| Canonical Vite | [CI 33541570215](https://github.com/CrioNIK/Web-resume/actions/runs/33541570215) | `d5b4ccb` | Success |
| Deno one-file server | [Desktop 33541570191](https://github.com/CrioNIK/Web-resume/actions/runs/33541570191) | `d5b4ccb` | Success; WebView intentionally skipped |
| Vinext fixture | [Vinext probe 33539678970](https://github.com/CrioNIK/Web-resume/actions/runs/33539678970) | `b2173ff` | Canonical Vinext and informational oj paths passed |
| Component Model | [Component Model 33541570203](https://github.com/CrioNIK/Web-resume/actions/runs/33541570203) | `d5b4ccb` | Rust/Go build, composition, Jco execution, and artifact passed |
| Portfolio oj parity | [Frontier 33541570230](https://github.com/CrioNIK/Web-resume/actions/runs/33541570230) | `d5b4ccb` | Success; Vite build, oj build, enhanced verifier, summary, and artifact upload passed |

The production Lighthouse run at `2026-09-01T17:55:29.970Z` recorded Performance 98 and 100 for Accessibility, Best Practices, SEO, and Agentic Browsing. These release facts do not change the status taxonomy: a passing research fixture remains research, and a passing build proof does not become the canonical product automatically.

## Ten targets

### 1. `oj` 0.1.11 — Rust-native builder parity

**Status: clean Linux build proof and first verified remote parity run.**

The production app still uses Vite 8.2.2. `oj.config.json`, `npm run build:oj`, and `npm run verify:oj` define an alternate `dist-oj/` path. Commit `d5b4ccb` makes the boundary portable by importing all module-worker entries through explicit `?worker` specifiers and providing the core WebAssembly package through an explicit URL entry rather than Vite-specific inference.

The Linux `frontier.yml` lane pins Rust 1.98 and oj 0.1.11, runs the canonical Vite build, then builds and verifies oj output. A clean Linux Docker run at `d5b4ccb` emitted root, EN, UK, three worker assets, a valid 47,019-byte WASM asset, and 33 files totaling 5,284,467 bytes. [Frontier run 33541570230](https://github.com/CrioNIK/Web-resume/actions/runs/33541570230) for the same commit then passed the Vite build, oj build, enhanced worker/WASM verifier, summary, and artifact upload. Therefore:

- Vite remains the only canonical deployment builder.
- Local and remote Linux results are passing compatibility proofs.
- This first remote pass is compatibility evidence, not automatic migration approval.
- A Rust-native transform/bundle core does not make every Vite plugin host or server-side path Node-free.
- Promotion requires repeatable artifact/route parity, plugin/worker/WASM coverage, acceptable build time, and a documented rollback path.

Primary source: [`oj`](https://github.com/raphamorim/oj).

### 2. Vinext 1.0.0-beta.8 — isolated compatibility probe

**Status: research.**

Vinext does not power Horizon Lab. `experiments/vinext-oj/` is a separate fixture whose required path is the canonical Vinext CLI. Its workflow then installs oj 0.1.11 and attempts the same configuration through oj as an informational, `continue-on-error` step.

The canonical fixture has been validated locally: `vinext check` reported 4/4 compatibility, TypeScript passed, the five-stage Node/Vinext build completed, its production server returned the expected RSC content with HTTP 200, and the dependency audit reported no vulnerabilities. [Vinext run 33539678970](https://github.com/CrioNIK/Web-resume/actions/runs/33539678970) at `b2173ff` then passed both the required canonical build and the informational oj probe. That proves the pinned fixture but does not prove a Node-free Vinext server runtime.

This structure prevents three misleading claims:

- successful canonical and oj paths for one fixture do not establish general compatibility;
- a passing fixture does not prove support for the portfolio's workers, WASM, routes, or deployment contract;
- a beta framework probe does not justify migrating the production SPA.

Promotion requires a stable upstream contract, a supported integration path, parity for localization and lazy runtime boundaries, and measured value greater than the migration cost.

Primary source: [Cloudflare Vinext](https://github.com/cloudflare/vinext).

### 3. Browser TypeScript — ES Module Shims + Amaro

**Status: live and intent-gated.**

`predev` and `prebuild` copy ES Module Shims 2.8.4 from the installed package into a self-hosted vendor directory. Selecting Browser TypeScript loads that runtime and imports a checked-in `.ts` demonstration fixture through `importShim` with `lang: "ts"`.

The important size and semantic boundaries are explicit:

- `es-module-shims-typescript.js` is **4,768,287 bytes raw** and is requested only after visitor intent.
- ES Module Shims 2.8.4 embeds Amaro 0.5.3 with TypeScript 5.8 grammar.
- The runtime strips erasable types; it does not type-check.
- Unsupported TypeScript transformations such as runtime enums or TSX are outside this demonstration contract.
- Project tests separately run the same fixture through Amaro 1.1.11; that newer package does not change the embedded browser version.

The fixture is repository-owned and deterministic. The module does not accept arbitrary remote code, credentials, or user source.

Primary sources: [ES Module Shims TypeScript stripping](https://github.com/guybedford/es-module-shims#typescript-type-stripping) and [Amaro](https://github.com/nodejs/amaro).

### 4. WebMCP — public, read-only agent tools

**Status: live where the draft API is natively available.**

The page registers two tools through `document.modelContext`:

| Tool | Result | Side effects |
| --- | --- | --- |
| `portfolio.list_projects` | The localized public project summaries, proof, tags, and public links already displayed on the page | None |
| `portfolio.get_progress` | The localized public trajectory, proof counters, and frontier/lab counts already displayed on the page | None |

Both tools:

- use strict empty object schemas and reject unexpected properties;
- honor the execution `AbortSignal`;
- read a fresh page-owned snapshot rather than private storage;
- expose no credentials, filesystem, repository, Supabase, or mutation capability;
- register only when the browser implements the draft API;
- do not install a fake `document.modelContext` polyfill.

The Agent Tools lab is a status and contract surface; the lightweight registration itself is site-wide so a supporting browser agent can inspect the portfolio without first clicking a tab.

Primary source: [WebMCP draft specification](https://webmachinelearning.github.io/webmcp/).

### 5. HTML-in-Canvas — accessible production analogue

**Status: live accessible path; proposal remains research.**

The production Spatial DOM module deliberately keeps ownership split:

- an `aria-hidden` Canvas/WebGPU scene owns atmosphere and spatial graphics;
- a real semantic DOM list owns labels, buttons, focus, pressed state, pointer hit testing, keyboard access, and assistive-technology output;
- mobile layouts collapse into an ordinary DOM grid when spatial overlay would reduce usability.

The module separately detects the evolving `drawElementImage` capability. It never makes accessibility depend on that proposal and never labels DOM-over-canvas as native HTML-in-Canvas support.

Promotion of the proposal path requires a stable standard, interoperable browser implementation, verified accessibility tree behavior, and a fallback that remains equivalent.

Primary sources: [WICG HTML-in-Canvas](https://github.com/WICG/html-in-canvas) and the [WHATWG HTML proposal](https://github.com/whatwg/html/pull/11588).

### 6. WebContainers — Node in a browser tab

**Status: implemented and gated.**

The Node in a Tab module contains a real adapter. When every gate passes, it dynamically imports `@webcontainer/api`, boots a container, mounts a deterministic two-file project, starts a small `node:http` server, requests the preview URL, reports the response, and terminates the process.

Production intentionally does not boot the runtime by default. Readiness requires:

1. `VITE_ENABLE_WEBCONTAINER_POC=true` at build time;
2. a secure HTTPS context;
3. `crossOriginIsolated === true`;
4. `SharedArrayBuffer` support;
5. an appropriate StackBlitz/WebContainers commercial license for the deployment context.

The fixture does not mount this repository, visitor files, arbitrary user code, secrets, or credentials. A failed gate reports the exact reason and keeps the dependency unloaded.

Primary sources: [WebContainers API](https://webcontainers.io/api) and [WebContainers commercial use](https://webcontainers.io/enterprise).

### 7. Deno 2.9.5 — one-file launcher and Desktop package

**Status: build proof.**

The Deno lane consumes the already-built Vite `dist/` output and produces two deliberately distinct Windows deliverables:

| Deliverable | Shape | Behavior |
| --- | --- | --- |
| Horizon Lab local-server launcher | One literal `.exe` | Serves embedded EN/UK assets on `127.0.0.1` and prints the URL for the user's browser |
| Horizon Lab Desktop/WebView | Native application directory/zip | Opens a platform WebView and ships with its required support files |

The one-file launcher was locally compiled and smoke-tested from a clean directory with health, locale, fallback, MIME, and `404` checks. [Desktop run 33541570191](https://github.com/CrioNIK/Web-resume/actions/runs/33541570191) at release-code commit `d5b4ccb` independently built, smoke-tested, and checksummed the same release path. Its compiled permissions allow loopback networking and deny filesystem, environment, subprocess, FFI, system-information, and remote-import access.

The hosted Go `/api/pulse` function is not embedded. The one-file launcher must not be renamed as a one-file native Desktop app; those are separate distribution models. The optional WebView job was intentionally skipped in the cited run, so it is neither part of that one-file proof nor misreported as a failure.

See [Deno local and desktop artifacts](DESKTOP.md). Primary sources: [Deno compile](https://docs.deno.com/runtime/reference/cli/compile/) and [Deno Desktop](https://docs.deno.com/runtime/desktop/).

### 8. Wasm Component Model — WIT, Rust, Go, and browser host

**Status: multi-language build proof.**

`components/wit/horizon.wit` defines two pure interfaces:

- Go exports an FNV-1a checksum over normalized words.
- Rust imports that checksum capability and exports bounded, fixed-point signal normalization.

The locally validated toolchain produced:

- a 2,685,908-byte Go component that passes `wasm-tools validate`;
- a 49,745-byte Rust `wasm32-wasip2` component that passes validation;
- a 2,740,261-byte `wac plug` composition exporting `criomant:horizon/normalize@0.1.0` with the private checksum import removed.

The dedicated Component Model workflow pins Jco 1.32.1 and preview2-shim 0.22.0 to transpile the composed component to browser ESM/core Wasm and invoke the generated binding. [Run 33541570203](https://github.com/CrioNIK/Web-resume/actions/runs/33541570203) at release-code commit `d5b4ccb` built Rust and Go, validated and composed them, executed the generated Jco browser binding, and uploaded the artifact. This is verified build/transpilation evidence, not evidence that a web browser natively executes Component Model binaries.

The application functions are pure and perform no I/O. However, the upstream Go and Rust WASIp2 runtimes retain ambient WASI Preview 2 imports in their generated binaries; the Jco host shim satisfies those imports. The project therefore does **not** claim an empty WASI import surface.

The public Component Mesh module starts a one-shot worker, uses the existing core Rust/WASM signal engine where available, and verifies the component contract with a TypeScript reference. The UI labels the component artifact as build-time/CI evidence.

Promotion to a browser-delivered composed component requires a stable artifact pipeline, size and startup measurements, integrity/version skew protection, and a host whose security boundary is no weaker than the existing worker.

Primary sources: [WebAssembly Component Model](https://component-model.bytecodealliance.org/) and [`jco` browser transpilation](https://bytecodealliance.github.io/jco/transpiling.html).

### 9. Browser-provided AI — local progressive enhancement

**Status: live progressive enhancement where supported.**

Local AI negotiates the browser's `LanguageModel` API at execution time. The same expected input/output language contract is supplied to availability checks and session creation. The interface distinguishes:

- `available`;
- `downloadable`;
- `downloading`, with user-triggered progress;
- `unavailable`;
- active streaming, cancellation, completion, and failure.

Prompt output uses streaming when a browser session exists. Cancellation aborts the request and destroys the session; it does not silently switch to another runtime. Unsupported or failed initialization uses a labelled deterministic planner. No application AI proxy, prompt persistence, or hidden network fallback is present.

The Ukrainian path asks for the Ukrainian language capability honestly. If the browser cannot promise it, the deterministic planner remains the correct fallback.

Primary source: [Chrome Prompt API](https://developer.chrome.com/docs/ai/prompt-api).

### 10. WebGPU Neural — graphics and compute

**Status: live where WebGPU is available, with first-class fallback.**

Neural Field implements a fixed deterministic multilayer perceptron:

```text
4 input values → 8 tanh hidden values → 4 tanh output values
```

The WebGPU path:

1. creates deterministic input and weight buffers;
2. runs MLP inference in a compute pass;
3. reads back the first output and compares it with the same JavaScript reference;
4. uses the output buffer for instanced particle rendering;
5. reports optional GPU timestamps only when `timestamp-query` is supported;
6. reports CPU submission timing under its own label rather than presenting it as GPU duration;
7. handles device loss and releases animation/listeners on unmount.

If WebGPU initialization or execution fails, the JavaScript reference drives a Canvas rendering path. Reduced-motion users receive a static state. The fallback uses the same deterministic model rather than unrelated decorative output.

Primary source: [WebGPU specification](https://gpuweb.github.io/gpuweb/).

## Twelve-module delivery ledger

| # | Lab | Heavy boundary | Data or permission boundary | Fallback or gate |
| ---: | --- | --- | --- | --- |
| 01 | Runtime Pulse | Go network request | No cookies, persistence, or visitor-derived sample | Offline status |
| 02 | WASM Forge | Worker + core WASM | Deterministic numeric request only | Labelled JavaScript worker |
| 03 | Signal Science | Analytics worker | Seeded synthetic dataset | Worker error state |
| 04 | Local AI | Browser model/session/download | Prompt stays inside browser API boundary | Labelled deterministic planner |
| 05 | Signal Run | Canvas animation | Local keyboard/touch input | Stops on unmount |
| 06 | Local Vault | IndexedDB transaction | Synthetic records; explicit deletion | Unsupported/error state |
| 07 | Browser TypeScript | 4.8 MB ESMS transformer | Checked-in fixture only | Loader/transform error |
| 08 | Agent Tools | Native WebMCP registration | Public read-only page snapshot | Unsupported status, no polyfill |
| 09 | Spatial DOM | WebGPU/Canvas scene | Real DOM remains accessibility owner | Canvas/static/mobile grid |
| 10 | Neural Field | WebGPU compute/render | Deterministic local numeric buffers | JavaScript + Canvas/static |
| 11 | Node in a Tab | WebContainer boot | Deterministic fixture; no repo/secrets/user code | License/isolation gate |
| 12 | Component Mesh | One-shot worker | Pure deterministic component contract | Core WASM + TypeScript reference |

## Promotion rules

A frontier target can move toward the canonical product only when all applicable conditions are met:

- repeatable CI evidence exists on the release commit;
- English and Ukrainian behavior remain equivalent;
- keyboard, screen-reader, reduced-motion, and mobile paths remain useful;
- transfer, startup, memory, and cleanup are measured;
- licensing and redistribution rights are documented;
- privacy and permission boundaries are no broader than the feature requires;
- failures produce an honest fallback or a precise gate;
- the rollback path returns to the current Vite/browser baseline without data loss.

No target is promoted because it is new, fast in an upstream benchmark, or impressive in isolation.
