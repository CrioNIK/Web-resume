# Quality report

## v3 local candidate — 2026-09-01

This report records the measured local state of Horizon Lab v3 before final CI and production-deployment sign-off. It separates repeatable build evidence, targeted browser checks, research workflows, and the historical v2 Lighthouse run so none is presented as field telemetry or stronger proof than it is.

## Automated frontend gates

The three canonical frontend gates passed locally on Node 24:

- strict TypeScript project references through `npm run check`;
- 10 Vitest files and 32 deterministic tests through `npm run test`;
- Vite 8.2.2 production output and gzip budget enforcement through `npm run build`.

The tests cover analytics, the deterministic planner, browser `LanguageModel` negotiation, Browser TypeScript transformation, neural reference inference, WebContainer gating, WebMCP schemas/registration/cancellation, Component Mesh contracts, and existing system utilities.

## Canonical build evidence

| Asset boundary | Measured result | Budget or delivery state |
| --- | ---: | --- |
| Main JavaScript | 219.61 KiB raw / 69.90 KiB gzip | Below 90 KiB largest-chunk gzip budget |
| All JavaScript chunks | 118.4 KiB gzip | Below 175 KiB total budget |
| CSS | 31.79 KiB raw / 7.38 KiB gzip | Below 45 KiB gzip budget |
| Core Rust/WASM | 47.01 KiB raw / 19.55 KiB gzip | Separate, interaction-gated asset |
| ESMS TypeScript transformer | 4,768,287 bytes raw | Separate vendor asset, deferred until Browser TypeScript intent |

The JavaScript budget includes all generated JS chunks below `dist/assets/`, including lazy modules. It does not include the copied ES Module Shims vendor files; their large transformer is reported explicitly instead of being hidden outside the budget.

## Targeted browser checks completed

The local production preview was exercised through the in-app Chromium browser:

- `/en/` rendered the v3 Frontier Matrix with ten targets and the inert twelve-system Horizon Deck.
- Browser TypeScript loaded the self-hosted runtime after intent, completed in approximately 45.3 ms for loader setup and 433.9 ms for strip-and-execute in that run, and returned the deterministic fixture result: checksum `5450`, strongest item `agent`, count `3`.
- The browser accepted both WebMCP registrations and exposed `portfolio.list_projects` and `portfolio.get_progress` as read-only tools. The Agent Tools module reported `document.modelContext / registered / live`.

These timings are single-device interaction evidence, not stable performance promises. They must not be generalized to other hardware, cache states, or browser versions.

## Frontier evidence status

| Lane | Current evidence | Boundary |
| --- | --- | --- |
| Canonical Vite | Local check, 32 tests, and production build pass | Production path |
| `oj` 0.1.11 | Pinned Linux parity workflow and output verifier are present | **Unverified until CI runs successfully**; Vite remains canonical |
| Vinext 1.0.0-beta.8 | Local 4/4 compatibility check, TypeScript validation, canonical five-stage build, HTTP 200 RSC smoke response, and zero-vulnerability audit pass | oj attempt remains informational and may fail; fixture is not the portfolio runtime |
| Browser TypeScript | Targeted browser run and Amaro unit test pass | ESMS embeds Amaro 0.5.3 / TS 5.8 grammar; strip-only, not type-checking; CI uses Amaro 1.1.11 |
| WebMCP | Unit tests and native in-app browser registration pass | Draft API, two read-only public-data tools, no polyfill or mutations |
| HTML-in-Canvas | Accessible DOM-overlay implementation is present | Production uses real DOM; proposal API remains experimental and separately detected |
| WebContainers | Adapter and gate tests pass | Production remains license/isolation gated and does not boot by default |
| Deno 2.9.5 | Format, lint, check, self-test, compile, and clean-directory HTTP smoke validation completed locally | One-file artifact is a local-server launcher; native Desktop package remains separate |
| Wasm Components | Go and Rust components validate; local `wac plug` composition validates and removes the private checksum import; TypeScript reference and Go tests pass | Jco browser ESM execution is encoded in dedicated CI but not locally verified; no browser-native claim |
| Browser AI | Availability, creation, language-contract, and cancellation paths have deterministic tests | Browser-owned progressive enhancement; explicit local planner fallback |
| WebGPU Neural | Reference inference tests and canonical build pass | GPU execution remains capability-dependent; JavaScript/Canvas fallback is first-class |

## Deno artifact validation

The pinned Deno 2.9.5 Windows path was exercised beyond source inspection:

- formatting, linting, type checking, and the embedded-site self-test passed;
- a literal single-file Windows launcher was compiled with the Vite `dist/` directory embedded;
- the executable was copied into a clean directory and served health, English, Ukrainian, no-trailing-slash, locale fallback, JavaScript MIME, and real `404` checks;
- the runtime binds only to loopback and denies filesystem, environment, subprocess, FFI, system-information, and remote-import permissions after compilation.

The hosted Go `/api/pulse` function is not embedded in this artifact. The optional native Deno Desktop/WebView job creates a separate application directory/zip and must not be described as the same one-file deliverable.

## Component Model validation

The local multi-language build produced and validated:

- a 2,685,908-byte Go checksum component built with Go 1.26.7 and componentize-go 0.4.1;
- a 49,745-byte Rust normalizer component built with Rust 1.98.0 for `wasm32-wasip2` and wit-bindgen 0.61.1;
- a 2,740,261-byte composed component produced by wac-cli 0.10.1;
- an exported `criomant:horizon/normalize@0.1.0` interface with the private `criomant:horizon/checksum` import removed;
- successful validation through wasm-tools 1.258.0, four TypeScript reference tests, TypeScript checking, and the pure Go checksum tests.

The dedicated workflow pins Jco 1.32.1 and preview2-shim 0.22.0 to transpile and smoke-test the generated browser ESM. That final Jco execution was not reproduced locally because of host disk limits and remains CI evidence. The application functions perform no I/O, but generated Rust and Go components retain ambient WASI Preview 2 imports from their upstream runtimes; this report does not claim an empty WASI import surface.

## Remaining release sign-off

Before this report can be called the final production v3 baseline, release validation must add or reconfirm:

1. `npm ci` from the committed lockfile followed by the full validation sequence.
2. Green canonical CI, oj parity evidence or a documented failure, Vinext probe evidence, Component Model build evidence, and Deno artifact jobs on the release commit.
3. Complete desktop and mobile interaction passes for all twelve modules on both `/en/` and `/uk/`.
4. Locale-switch hash preservation, direct deep links, keyboard navigation, reduced motion, and page-level overflow checks.
5. Console/runtime-error inspection and production security/cache headers.
6. A fresh mobile Lighthouse run against the deployed v3 commit.

Until those checks are recorded, the automated local build and targeted browser results above are the authoritative v3 evidence. Workflow definitions alone are not passing results.

## Historical v2 Lighthouse baseline

Horizon Lab v2 was measured with Lighthouse 13.4.1 against its local production build under the default simulated mobile profile in Headless Chrome 152:

| Category or metric | v2 result |
| --- | ---: |
| Performance | 100 |
| Accessibility | 100 |
| Best Practices | 100 |
| SEO | 100 |
| First Contentful Paint | 1.2 s |
| Largest Contentful Paint | 1.5 s |
| Speed Index | 1.2 s |
| Total Blocking Time | 0 ms |
| Cumulative Layout Shift | 0 |
| Lab module chunks on initial navigation | 0 |

This remains historical evidence, not a v3 score and not real-user Core Web Vitals. INP requires field interaction data and is not inferred from Total Blocking Time.

## Privacy and integrity boundaries

- Network and device latency are always non-zero and are displayed as measured values.
- Local Vault uses deterministic synthetic data in browser-owned IndexedDB and never connects to the private TableTop BRAMA Supabase project.
- WebMCP exposes only public page-owned content through read-only tools and accepts no arbitrary parameters.
- Browser TypeScript runs a checked-in demonstration fixture; type stripping is not type safety.
- The WebContainer proof mounts only its deterministic two-file fixture and remains disabled until licensing and isolation are explicit.
- Browser AI does not use an application proxy or hidden network fallback.
- Component Model output is a build artifact; the browser lab discloses its worker/reference execution path.
- Lighthouse simulation and one-device timings never replace production monitoring or real-user field data.
