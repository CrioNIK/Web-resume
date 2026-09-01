/* tslint:disable */
/* eslint-disable */

/**
 * Summary of caller-provided latency measurements in milliseconds.
 */
export class LatencyReport {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    jitterMs(): number;
    maxMs(): number;
    meanMs(): number;
    measured(): boolean;
    minMs(): number;
    p50Ms(): number;
    p95Ms(): number;
    p99Ms(): number;
    rejectedCount(): number;
    sampleCount(): number;
    stdDevMs(): number;
}

/**
 * Seeded particle simulation intended for browser-owned rendering.
 */
export class ParticleField {
    free(): void;
    [Symbol.dispose](): void;
    count(): number;
    meanSpeed(): number;
    constructor(seed: number, width: number, height: number, count: number);
    /**
     * Compact x/y pairs for renderers that do not need velocity data.
     */
    positions(): Float32Array;
    /**
     * Reinitializes the current particle count with a new deterministic seed.
     */
    reset(seed: number): void;
    /**
     * Resizes the simulation while preserving normalized particle positions.
     */
    resize(width: number, height: number): void;
    /**
     * Flat particle records: x, y, velocity x, velocity y, normalized speed.
     */
    snapshot(): Float32Array;
    /**
     * Advances the field and returns the clamped duration that was applied.
     */
    step(delta_seconds: number, attractor_x: number, attractor_y: number, attractor_strength: number): number;
    stride(): number;
    tick(): number;
}

/**
 * Summary of a scalar, evenly sampled signal.
 */
export class SignalReport {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    durationMs(): number;
    max(): number;
    mean(): number;
    min(): number;
    peakToPeak(): number;
    rejectedCount(): number;
    rms(): number;
    sampleCount(): number;
    stdDev(): number;
    trendPerSecond(): number;
    valid(): boolean;
    zeroCrossings(): number;
}

/**
 * Chronologically ordered flat timeline node records.
 */
export class TimelineLayout {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    endMs(): number;
    eventCount(): number;
    laneCount(): number;
    nodes(): Float64Array;
    rejectedCount(): number;
    startMs(): number;
    stride(): number;
}

export function analyzeLatency(samples_ms: Float64Array): LatencyReport;

export function analyzeSignal(samples: Float64Array, sample_interval_ms: number): SignalReport;

export function engineVersion(): string;

/**
 * Creates deterministic timeline records: original index, x pixels, lane, scale.
 */
export function layoutTimeline(timestamps_ms: Float64Array, importance: Float64Array, width_px: number, lane_count: number, min_gap_px: number): TimelineLayout;

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
    readonly memory: WebAssembly.Memory;
    readonly __wbg_latencyreport_free: (a: number, b: number) => void;
    readonly __wbg_particlefield_free: (a: number, b: number) => void;
    readonly __wbg_signalreport_free: (a: number, b: number) => void;
    readonly __wbg_timelinelayout_free: (a: number, b: number) => void;
    readonly analyzeLatency: (a: number, b: number) => number;
    readonly analyzeSignal: (a: number, b: number, c: number) => number;
    readonly engineVersion: (a: number) => void;
    readonly latencyreport_measured: (a: number) => number;
    readonly layoutTimeline: (a: number, b: number, c: number, d: number, e: number, f: number, g: number) => number;
    readonly particlefield_count: (a: number) => number;
    readonly particlefield_meanSpeed: (a: number) => number;
    readonly particlefield_new: (a: number, b: number, c: number, d: number) => number;
    readonly particlefield_positions: (a: number, b: number) => void;
    readonly particlefield_reset: (a: number, b: number) => void;
    readonly particlefield_resize: (a: number, b: number, c: number) => void;
    readonly particlefield_snapshot: (a: number, b: number) => void;
    readonly particlefield_step: (a: number, b: number, c: number, d: number, e: number) => number;
    readonly signalreport_valid: (a: number) => number;
    readonly timelinelayout_eventCount: (a: number) => number;
    readonly timelinelayout_nodes: (a: number, b: number) => void;
    readonly latencyreport_minMs: (a: number) => number;
    readonly signalreport_min: (a: number) => number;
    readonly timelinelayout_startMs: (a: number) => number;
    readonly particlefield_stride: (a: number) => number;
    readonly timelinelayout_stride: (a: number) => number;
    readonly latencyreport_jitterMs: (a: number) => number;
    readonly latencyreport_maxMs: (a: number) => number;
    readonly latencyreport_meanMs: (a: number) => number;
    readonly latencyreport_p50Ms: (a: number) => number;
    readonly latencyreport_p95Ms: (a: number) => number;
    readonly latencyreport_p99Ms: (a: number) => number;
    readonly latencyreport_rejectedCount: (a: number) => number;
    readonly latencyreport_sampleCount: (a: number) => number;
    readonly latencyreport_stdDevMs: (a: number) => number;
    readonly particlefield_tick: (a: number) => number;
    readonly signalreport_durationMs: (a: number) => number;
    readonly signalreport_max: (a: number) => number;
    readonly signalreport_mean: (a: number) => number;
    readonly signalreport_peakToPeak: (a: number) => number;
    readonly signalreport_rejectedCount: (a: number) => number;
    readonly signalreport_rms: (a: number) => number;
    readonly signalreport_sampleCount: (a: number) => number;
    readonly signalreport_stdDev: (a: number) => number;
    readonly signalreport_trendPerSecond: (a: number) => number;
    readonly signalreport_zeroCrossings: (a: number) => number;
    readonly timelinelayout_endMs: (a: number) => number;
    readonly timelinelayout_laneCount: (a: number) => number;
    readonly timelinelayout_rejectedCount: (a: number) => number;
    readonly __wbindgen_export: (a: number, b: number) => number;
    readonly __wbindgen_add_to_stack_pointer: (a: number) => number;
    readonly __wbindgen_export2: (a: number, b: number, c: number) => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;

/**
 * Instantiates the given `module`, which can either be bytes or
 * a precompiled `WebAssembly.Module`.
 *
 * @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
 *
 * @returns {InitOutput}
 */
export function initSync(module: { module: SyncInitInput } | SyncInitInput): InitOutput;

/**
 * If `module_or_path` is {RequestInfo} or {URL}, makes a request and
 * for everything else, calls `WebAssembly.instantiate` directly.
 *
 * @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
 *
 * @returns {Promise<InitOutput>}
 */
export default function __wbg_init (module_or_path?: { module_or_path: InitInput | Promise<InitInput> } | InitInput | Promise<InitInput>): Promise<InitOutput>;
