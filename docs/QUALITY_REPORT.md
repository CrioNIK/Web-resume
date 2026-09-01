# Quality report

## v3 release baseline — 2026-09-01

This report records the measured Horizon Lab v3 release state. It separates canonical production evidence, optional release artifacts, isolated research lanes, browser smoke checks, and simulated performance data so no result is presented as stronger proof than it is.

## Release evidence ledger

| Evidence | Commit | Result | Scope |
| --- | --- | --- | --- |
| [Canonical CI 33541570215](https://github.com/CrioNIK/Web-resume/actions/runs/33541570215) | `d5b4ccb` | Success | Node/Vite validation, TypeScript, Vitest, Go, Rust, and reproducible core WASM gates |
| [Desktop 33541570191](https://github.com/CrioNIK/Web-resume/actions/runs/33541570191) | `d5b4ccb` | Success | One-file Windows server built, clean-directory smoke-tested, and checksummed; optional WebView job intentionally skipped |
| [Vinext probe 33539678970](https://github.com/CrioNIK/Web-resume/actions/runs/33539678970) | `b2173ff` | Success | Required canonical Vinext build and informational oj build both passed for the isolated fixture |
| [Component Model 33541570203](https://github.com/CrioNIK/Web-resume/actions/runs/33541570203) | `d5b4ccb` | Success | Rust/Go component builds, validation, composition, Jco browser execution, and artifact upload |
| [Frontier 33541570230](https://github.com/CrioNIK/Web-resume/actions/runs/33541570230) | `d5b4ccb` | Success | Canonical Vite and oj builds, enhanced worker/WASM verification, summary, and artifact upload passed |
| Production Lighthouse | deployed v3 | Recorded at `2026-09-01T17:55:29.970Z` | 98 Performance and 100 for Accessibility, Best Practices, SEO, and Agentic Browsing |

Vite 8.2.2 remains the canonical production builder. The oj and Vinext results are compatibility evidence and do not silently redefine the deployment contract.

## Automated frontend gates

The canonical validation sequence passes locally and in CI on Node 24:

- strict TypeScript project references through `npm run check`;
- 10 Vitest files and 32 deterministic tests through `npm run test`;
- Vite 8.2.2 production output and gzip budget enforcement through `npm run build`.

The tests cover analytics, the deterministic planner, browser `LanguageModel` negotiation, Browser TypeScript transformation, neural reference inference, WebContainer gating, WebMCP schemas/registration/cancellation, Component Mesh contracts, and existing system utilities.

## Canonical build evidence

| Asset boundary | Measured result | Budget or delivery state |
| --- | ---: | --- |
| Main JavaScript | 214.65 KiB raw / 67.63 KiB gzip | Below 90 KiB largest-chunk gzip budget |
| All JavaScript chunks | 118.4 KiB gzip | Below 175 KiB total budget |
| CSS | 31.31 KiB raw / 7.28 KiB gzip | Below 45 KiB gzip budget |
| Core Rust/WASM | 47.01 KiB raw / 19.55 KiB gzip | Separate, interaction-gated asset |
| ESMS TypeScript transformer | 4,768,287 bytes raw | Separate vendor asset, deferred until Browser TypeScript intent |

The JavaScript budget includes all generated JS chunks below `dist/assets/`, including lazy modules. It does not include copied ES Module Shims vendor files; their large transformer is reported explicitly instead of being hidden outside the budget.

## Browser interaction evidence

The v3 build was exercised through the in-app Chromium browser:

- `/en/` rendered the ten-target Frontier Matrix and the inert twelve-system Horizon Deck.
- Browser TypeScript loaded its self-hosted runtime after intent in a production run, measured 388.0 ms for runtime loading and 1,533.7 ms for strip-and-execute, and returned checksum `5450`, strongest item `agent`, count `3`.
- WASM Forge exercised the real Rust/WebAssembly worker path after visitor intent.
- Signal Science exercised seeded analytics in its dedicated worker.
- Component Mesh completed its one-shot worker/reference contract without claiming native component execution.
- The browser accepted both WebMCP registrations and exposed `portfolio.list_projects` and `portfolio.get_progress` as read-only tools. Agent Tools reported `document.modelContext / registered / live`.

The timings are single-device interaction evidence, not stable performance promises. The browser smoke proves those selected runtime paths, not every possible GPU, AI, license, or unsupported-browser branch.

## Frontier evidence status

| Lane | Current evidence | Boundary |
| --- | --- | --- |
| Canonical Vite | Local validation and release CI 33541570215 pass | Production path |
| `oj` 0.1.11 | Clean Linux build and Frontier 33541570230 emit/verify all documents, workers, and valid WASM | First remote parity pass; repeated evidence is required before promotion and Vite remains canonical |
| Vinext 1.0.0-beta.8 | Canonical and informational oj paths both pass CI 33539678970 | Isolated research fixture; not a Node-free or production-stack claim |
| Browser TypeScript | Browser run and Amaro unit test pass | ESMS embeds Amaro 0.5.3 / TS 5.8 grammar; strip-only, not type-checking; CI uses Amaro 1.1.11 |
| WebMCP | Unit tests and native in-app browser registration pass | Draft API, two read-only public-data tools, no polyfill or mutations |
| HTML-in-Canvas | Accessible DOM-overlay implementation is present | Production uses real DOM; proposal API remains experimental and separately detected |
| WebContainers | Adapter and gate tests pass | Production remains license/isolation gated and does not boot by default |
| Deno 2.9.5 | Release Desktop CI 33541570191 built, smoke-tested, and checksummed the one-file server | Native WebView is a separate optional package and was intentionally skipped in this run |
| Wasm Components | Release CI 33541570203 built Rust/Go, composed, ran Jco browser output, and uploaded artifacts | Build-time/transpiled evidence; no browser-native execution claim |
| Browser AI | Availability, creation, language-contract, and cancellation paths have deterministic tests | Browser-owned progressive enhancement; explicit local planner fallback |
| WebGPU Neural | Reference inference tests and canonical build pass | GPU execution remains capability-dependent; JavaScript/Canvas fallback is first-class |

## oj compatibility validation

Commit `d5b4ccb` fixes the alternate builder boundary with explicit `?worker` entries and an explicit URL for the core WASM package. A clean Linux Docker build produced:

- root, English, and Ukrainian documents;
- three worker assets;
- a valid 47,019-byte WebAssembly asset;
- 33 output files totaling 5,284,467 bytes.

Rust/WASM Forge, Signal Science, Component Mesh, and WebMCP were subsequently browser-smoked against the resulting application behavior. [Frontier run 33541570230](https://github.com/CrioNIK/Web-resume/actions/runs/33541570230) for the exact commit also passed the Vite build, oj build, enhanced verifier, summary, and artifact upload. This is a verified first remote parity run, not a production migration decision.

## Deno artifact validation

[Desktop run 33541570191](https://github.com/CrioNIK/Web-resume/actions/runs/33541570191) at `d5b4ccb` passed:

- formatting, linting, type checking, and the embedded-site self-test;
- compilation of a literal single-file Windows launcher with the Vite `dist/` directory embedded;
- clean-directory health, English, Ukrainian, no-trailing-slash, locale fallback, JavaScript MIME, and real `404` smoke checks;
- publication of the executable checksum.

The hosted Go `/api/pulse` function is not embedded. The optional native Deno Desktop/WebView job was intentionally skipped, so this run proves the one-file local-server release and does not claim that the separate directory-based WebView package was built.

## Component Model validation

Local component evidence includes:

- a 2,685,908-byte Go checksum component built with Go 1.26.7 and componentize-go 0.4.1;
- a 49,745-byte Rust normalizer component built with Rust 1.98.0 for `wasm32-wasip2` and wit-bindgen 0.61.1;
- a 2,740,261-byte composed component produced by wac-cli 0.10.1;
- an exported `criomant:horizon/normalize@0.1.0` interface with the private `criomant:horizon/checksum` import removed;
- successful validation through wasm-tools 1.258.0, four TypeScript reference tests, TypeScript checking, and pure Go checksum tests.

[Component Model run 33541570203](https://github.com/CrioNIK/Web-resume/actions/runs/33541570203) at `d5b4ccb` independently rebuilt the Rust and Go components, validated and composed them, transpiled the result through Jco 1.32.1 with preview2-shim 0.22.0, executed the generated browser binding, and uploaded the component/browser artifacts.

The application functions perform no I/O, but generated Rust and Go components retain ambient WASI Preview 2 imports from upstream runtimes. Passing Jco execution does not turn that into an empty WASI import surface or native browser Component Model support.

## Production Lighthouse baseline

The deployed v3 site was measured at `2026-09-01T17:55:29.970Z`:

| Category or metric | Result |
| --- | ---: |
| Performance | 98 |
| Accessibility | 100 |
| Best Practices | 100 |
| SEO | 100 |
| Agentic Browsing | 100 |
| First Contentful Paint | 1.4 s |
| Largest Contentful Paint | 1.5 s |
| Speed Index | 3.9 s |
| Total Blocking Time | 0 ms |
| Cumulative Layout Shift | 0 |

This is production-URL lab evidence, not real-user Core Web Vitals. INP and population percentiles require field interaction data and are not inferred from Total Blocking Time.

## Promotion and ongoing evidence

No recorded v3 release-code gate remains open: canonical CI, Desktop, Component Model, and Frontier runs pass for `d5b4ccb`, the isolated Vinext canonical/informational paths pass, browser smoke checks complete, and production Lighthouse is recorded.

Frontier 33541570230 is the **first** remote oj parity pass. Builder promotion still requires repeated parity across future changes, output review, performance comparison, and a rollback path; Vite remains canonical. The optional Deno WebView package remains intentionally gated to its release/manual path. Real-user monitoring and future regression runs remain ongoing quality work rather than missing evidence for the recorded release.

## Historical v2 Lighthouse baseline

Horizon Lab v2 measured 100 for Performance, Accessibility, Best Practices, and SEO in its earlier local Lighthouse run, with FCP 1.2 s, LCP 1.5 s, Speed Index 1.2 s, Total Blocking Time 0 ms, and CLS 0. That result is preserved as historical context and is not directly comparable to the v3 production-URL run.

## Privacy and integrity boundaries

- Network and device latency are always non-zero and displayed as measured values.
- Local Vault uses deterministic synthetic data in browser-owned IndexedDB and never connects to the private TableTop BRAMA Supabase project.
- WebMCP exposes only public page-owned content through read-only tools and accepts no arbitrary parameters.
- Browser TypeScript runs a checked-in demonstration fixture; type stripping is not type safety.
- The WebContainer proof mounts only its deterministic two-file fixture and remains disabled until licensing and isolation are explicit.
- Browser AI does not use an application proxy or hidden network fallback.
- Component Model output is a build/transpilation artifact; the browser lab discloses its worker/reference execution path.
- Lighthouse simulation and single-device timings never replace production monitoring or real-user field data.
