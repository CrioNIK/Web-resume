# Horizon Engine

`horizon-engine` is a small Rust/WASM compute layer for deterministic visual and
analytics work in the browser. It has no clock, network, DOM, or browser-randomness
dependency, so the same seed and ordered inputs produce the same simulation and
layout results.

The crate intentionally owns computation only. Rendering, sample collection,
storage, and product claims remain the responsibility of the JavaScript caller.

## Capabilities

- deterministic particle-field simulation with a seeded PRNG;
- measured latency summaries with percentiles, standard deviation, and mean
  absolute successive-delta jitter;
- signal summaries with RMS, spread, standard deviation, mean-centered zero
  crossings, and a least-squares trend;
- deterministic, best-effort timeline lane layout for dense event sequences.

## Build and test

From the repository root:

```sh
cargo test --manifest-path crates/horizon-engine/Cargo.toml
cargo build --manifest-path crates/horizon-engine/Cargo.toml --release
```

The release package is built with Rust 1.98 and wasm-pack 0.15:

```sh
wasm-pack build crates/horizon-engine --target web --release --out-dir ../../public/wasm
```

Or use the lower-level toolchain:

```sh
rustup target add wasm32-unknown-unknown
cargo build --manifest-path crates/horizon-engine/Cargo.toml --target wasm32-unknown-unknown --release
wasm-bindgen --target web --out-dir public/wasm \
  crates/horizon-engine/target/wasm32-unknown-unknown/release/horizon_engine.wasm
```

`public/wasm/` is generated and committed so Vercel can deploy the browser
module without installing a Rust toolchain during the frontend build. CI rebuilds
the package and fails if the checked-in artifacts drift from the crate.

## Browser API

```js
import init, {
  ParticleField,
  analyzeLatency,
  analyzeSignal,
  layoutTimeline,
} from "/wasm/horizon_engine.js";

await init();

const field = new ParticleField(0x51a7e, 1280, 720, 1600);
const appliedSeconds = field.step(1 / 60, 640, 360, 900);
const particleData = field.snapshot();
// particle stride: [x, y, velocityX, velocityY, normalizedSpeed]

const latency = analyzeLatency(realMeasuredSamplesMs);
if (latency.measured()) {
  console.log(latency.p50Ms(), latency.p95Ms(), latency.p99Ms());
}

const signal = analyzeSignal(frameDurationsMs, 16.6667);
const timeline = layoutTimeline(
  timestampsMs,
  importanceWeights,
  1200,
  4,
  28,
);
const nodes = timeline.nodes();
// timeline stride: [originalIndex, xPx, laneIndex, scale]
```

Objects returned by `wasm-bindgen` own WASM memory. Call `.free()` when a report,
layout, or particle field will no longer be used.

## Semantics and limits

### Particle field

- Particle count is capped at 65,536.
- Width and height are normalized to at least `1`.
- A simulation step is clamped to `0.05` seconds for numerical stability, and
  `step` returns the duration actually applied.
- The snapshot is a copied flat `Float32Array`-compatible buffer with stride 5.

### Latency analytics

Latency results describe only the samples supplied by the caller. The engine does
not generate synthetic measurements and never substitutes `0 ms` for missing data.
When no valid sample exists, `measured()` is `false` and numeric metrics are `NaN`.
Negative and non-finite samples are rejected and counted. `jitterMs()` is the mean
absolute difference between successive valid samples; it is `NaN` until at least
two valid samples exist.

Percentiles use linear interpolation over sorted values. This makes small sample
sets deterministic but does not turn them into statistically representative data.

### Signal analytics

Non-finite samples are rejected. Trend and duration are `NaN` when the sample
interval is not positive and finite. The trend is returned in signal units per
second.

### Timeline layout

Invalid timestamps are omitted and counted. Events are sorted by timestamp, then
original index. The algorithm chooses lanes deterministically and minimizes local
overlap, but cannot guarantee separation when event density exceeds the available
lanes. Output records use chronological order and preserve the original input index.

## Integration contract

1. Collect real timing and signal samples in application code.
2. Initialize the WASM module once, then retain long-lived `ParticleField` objects.
3. Reuse typed-array views only for the current call; exported vectors are copies.
4. Treat `measured()`, `valid()`, and `rejectedCount()` as required UI-state inputs.
5. Label latency metrics with their sample window and count; never market an empty
   or synthetic sample set as zero-latency behavior.
