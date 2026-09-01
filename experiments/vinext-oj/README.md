# Vinext on oj compatibility probe

This directory is an isolated build-system experiment. It is deliberately not imported by the production portfolio.

The control path is a minimal Vinext App Router application with a real async React Server Component. The exact stack is locked to Vinext `1.0.0-beta.8`, Vite `8.2.2`, React and React DOM `19.2.8`, `react-server-dom-webpack` `19.2.8`, `@vitejs/plugin-react` `6.1.0`, and `@vitejs/plugin-rsc` `0.5.34`. The experimental path runs the same `vite.config.ts` through oj `0.1.11`.

## Run the control

Node.js 22.12 or newer is required.

```sh
npm ci
npm run build
```

`npm run build` is the canonical result. CI fails when this Vinext build fails.

## Run the oj probe

Install the pinned Rust crate, then run the fixture's probe script:

```sh
cargo install oj --version 0.1.11 --locked
npm run build:oj
```

The oj result is informational. A failure means only that this exact Vinext/Vite/RSC combination was not compatible with oj `0.1.11` in that run. A success is a useful integration signal, not evidence of complete Next.js API parity or production readiness. The workflow preserves the build log and any generated output as artifacts and writes the exact outcome to the GitHub Actions step summary.

This fixture is not a Node-free build. Vinext `1.0.0-beta.8` requires Node.js, and oj invokes JavaScript Vite plugins through its plugin host. Even a successful oj result would demonstrate plugin compatibility for this fixture, not removal of Node from the Vinext toolchain.

## Why the portfolio stays on direct Vite

The portfolio is a browser-first SPA and does not need App Router routing, server rendering, React Server Components, or Server Actions. Adding Vinext would increase the runtime and compatibility surface without unlocking a current product requirement. Vinext also describes itself as under active development with known compatibility gaps, while oj `0.1.11` is an early Rust-native tool whose Vite-plugin compatibility must be measured rather than assumed.

Migration becomes a valid option only when all of these conditions hold:

1. The portfolio has a concrete server-rendered or RSC requirement that cannot be met cleanly by its direct Vite architecture.
2. Canonical Vinext and oj builds both pass repeatedly for production-parity routes, workers, WASM assets, localization, and deployment configuration.
3. Browser end-to-end, accessibility, bundle-budget, security-header, and performance gates show no regression.
4. The selected Vinext, oj, and deployment-adapter versions have a support posture suitable for production.

Primary references: [Vinext repository and status](https://github.com/cloudflare/vinext), [oj 0.1.11 crate](https://crates.io/crates/oj/0.1.11), and [Vite 8 documentation](https://vite.dev/guide/).
