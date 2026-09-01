# Horizon Component Mesh

This subtree is a real, versioned WebAssembly Component Model proof. It keeps the experimental toolchain independent from the portfolio's production Vite build and publishes generated binaries only as CI artifacts.

## Contract and languages

`wit/horizon.wit` defines `criomant:horizon@0.1.0`:

- Rust 1.98 (`wasm32-wasip2`, `wit-bindgen` 0.61.1) exports `normalize.signal`.
- Go 1.26.7 (`componentize-go` 0.4.1) exports `checksum.hash`.
- The Rust component imports that checksum interface. `wac plug` 0.10.1 connects it to the Go component and removes `criomant:horizon/checksum` from the final import surface.
- `jco` 1.32.1 transpiles the composed component to browser-compatible ESM plus core Wasm. The smoke test invokes the generated binding, not a duplicated JavaScript implementation.

The deterministic pipeline clamps signed 32-bit samples, maps them to the integer range `0..1_000_000`, then hashes each normalized word in little-endian byte order with FNV-1a. Reversed bounds and zero-width ranges are defined by the WIT implementation and covered by tests.

## I/O and capability boundary

The application functions are pure: they do not read files, clocks, random values, environment variables, sockets, or standard streams. The current upstream Go and Rust WASIp2 runtimes still expose ambient WASI Preview 2 imports in their generated component binaries. Those imports are host-satisfied by Jco's pinned preview2 shim, even though this call path never invokes them.

That distinction matters: this proof demonstrates typed cross-language composition and deterministic behavior, not a claim that the generated binary has an empty WASI import list. The dedicated workflow inspects that import/export surface on every relevant change.

## Browser boundary

Component Model binaries are not executed natively by today's browsers. `jco` lowers the composed binary to JavaScript bindings and core Wasm in CI. The generated files are uploaded as the `horizon-component-mesh` workflow artifact and are intentionally absent from the site's base bundle.

The lazy `ComponentMesh` UI therefore labels its interactive path as `Rust/WASM core fallback`: a one-shot worker runs the already shipped Rust core-Wasm signal engine and checks the same deterministic contract with the focused TypeScript reference. It never labels that fallback as the composed component.

## Reproducible build

Run the **Component Model** GitHub workflow, or reproduce its commands on Linux with the exact versions in `.github/workflows/component-model.yml`. The workflow:

1. regenerates and checks Go canonical ABI bindings;
2. builds both source components;
3. validates and inspects each component with `wasm-tools`;
4. composes Rust and Go with `wac plug`;
5. verifies that the private checksum import is gone from the final component;
6. transpiles with Jco and executes the generated ESM binding in Node;
7. uploads the component binary, browser ESM/core-Wasm files, inferred WIT, and toolchain manifest.

Primary tool references: [Component Model guide](https://component-model.bytecodealliance.org/), [wit-bindgen](https://github.com/bytecodealliance/wit-bindgen), [componentize-go](https://github.com/bytecodealliance/componentize-go), [WAC](https://github.com/bytecodealliance/wac), and [Jco transpilation](https://github.com/bytecodealliance/jco/blob/main/docs/src/transpiling.md).
