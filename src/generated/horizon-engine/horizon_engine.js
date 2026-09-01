/* @ts-self-types="./horizon_engine.d.ts" */

/**
 * Summary of caller-provided latency measurements in milliseconds.
 */
export class LatencyReport {
    static __wrap(ptr) {
        const obj = Object.create(LatencyReport.prototype);
        obj.__wbg_ptr = ptr;
        LatencyReportFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        LatencyReportFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_latencyreport_free(ptr, 0);
    }
    /**
     * @returns {number}
     */
    jitterMs() {
        const ret = wasm.latencyreport_jitterMs(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    maxMs() {
        const ret = wasm.latencyreport_maxMs(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    meanMs() {
        const ret = wasm.latencyreport_meanMs(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {boolean}
     */
    measured() {
        const ret = wasm.latencyreport_measured(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @returns {number}
     */
    minMs() {
        const ret = wasm.latencyreport_minMs(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    p50Ms() {
        const ret = wasm.latencyreport_p50Ms(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    p95Ms() {
        const ret = wasm.latencyreport_p95Ms(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    p99Ms() {
        const ret = wasm.latencyreport_p99Ms(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    rejectedCount() {
        const ret = wasm.latencyreport_rejectedCount(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @returns {number}
     */
    sampleCount() {
        const ret = wasm.latencyreport_sampleCount(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @returns {number}
     */
    stdDevMs() {
        const ret = wasm.latencyreport_stdDevMs(this.__wbg_ptr);
        return ret;
    }
}
if (Symbol.dispose) LatencyReport.prototype[Symbol.dispose] = LatencyReport.prototype.free;

/**
 * Seeded particle simulation intended for browser-owned rendering.
 */
export class ParticleField {
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        ParticleFieldFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_particlefield_free(ptr, 0);
    }
    /**
     * @returns {number}
     */
    count() {
        const ret = wasm.particlefield_count(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @returns {number}
     */
    meanSpeed() {
        const ret = wasm.particlefield_meanSpeed(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {number} seed
     * @param {number} width
     * @param {number} height
     * @param {number} count
     */
    constructor(seed, width, height, count) {
        const ret = wasm.particlefield_new(seed, width, height, count);
        this.__wbg_ptr = ret;
        ParticleFieldFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * Compact x/y pairs for renderers that do not need velocity data.
     * @returns {Float32Array}
     */
    positions() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.particlefield_positions(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var v1 = getArrayF32FromWasm0(r0, r1).slice();
            wasm.__wbindgen_export2(r0, r1 * 4, 4);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * Reinitializes the current particle count with a new deterministic seed.
     * @param {number} seed
     */
    reset(seed) {
        wasm.particlefield_reset(this.__wbg_ptr, seed);
    }
    /**
     * Resizes the simulation while preserving normalized particle positions.
     * @param {number} width
     * @param {number} height
     */
    resize(width, height) {
        wasm.particlefield_resize(this.__wbg_ptr, width, height);
    }
    /**
     * Flat particle records: x, y, velocity x, velocity y, normalized speed.
     * @returns {Float32Array}
     */
    snapshot() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.particlefield_snapshot(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var v1 = getArrayF32FromWasm0(r0, r1).slice();
            wasm.__wbindgen_export2(r0, r1 * 4, 4);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * Advances the field and returns the clamped duration that was applied.
     * @param {number} delta_seconds
     * @param {number} attractor_x
     * @param {number} attractor_y
     * @param {number} attractor_strength
     * @returns {number}
     */
    step(delta_seconds, attractor_x, attractor_y, attractor_strength) {
        const ret = wasm.particlefield_step(this.__wbg_ptr, delta_seconds, attractor_x, attractor_y, attractor_strength);
        return ret;
    }
    /**
     * @returns {number}
     */
    stride() {
        const ret = wasm.particlefield_stride(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @returns {number}
     */
    tick() {
        const ret = wasm.particlefield_tick(this.__wbg_ptr);
        return ret >>> 0;
    }
}
if (Symbol.dispose) ParticleField.prototype[Symbol.dispose] = ParticleField.prototype.free;

/**
 * Summary of a scalar, evenly sampled signal.
 */
export class SignalReport {
    static __wrap(ptr) {
        const obj = Object.create(SignalReport.prototype);
        obj.__wbg_ptr = ptr;
        SignalReportFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        SignalReportFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_signalreport_free(ptr, 0);
    }
    /**
     * @returns {number}
     */
    durationMs() {
        const ret = wasm.signalreport_durationMs(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    max() {
        const ret = wasm.signalreport_max(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    mean() {
        const ret = wasm.signalreport_mean(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    min() {
        const ret = wasm.signalreport_min(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    peakToPeak() {
        const ret = wasm.signalreport_peakToPeak(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    rejectedCount() {
        const ret = wasm.signalreport_rejectedCount(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @returns {number}
     */
    rms() {
        const ret = wasm.signalreport_rms(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    sampleCount() {
        const ret = wasm.signalreport_sampleCount(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @returns {number}
     */
    stdDev() {
        const ret = wasm.signalreport_stdDev(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    trendPerSecond() {
        const ret = wasm.signalreport_trendPerSecond(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {boolean}
     */
    valid() {
        const ret = wasm.signalreport_valid(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @returns {number}
     */
    zeroCrossings() {
        const ret = wasm.signalreport_zeroCrossings(this.__wbg_ptr);
        return ret >>> 0;
    }
}
if (Symbol.dispose) SignalReport.prototype[Symbol.dispose] = SignalReport.prototype.free;

/**
 * Chronologically ordered flat timeline node records.
 */
export class TimelineLayout {
    static __wrap(ptr) {
        const obj = Object.create(TimelineLayout.prototype);
        obj.__wbg_ptr = ptr;
        TimelineLayoutFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        TimelineLayoutFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_timelinelayout_free(ptr, 0);
    }
    /**
     * @returns {number}
     */
    endMs() {
        const ret = wasm.timelinelayout_endMs(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    eventCount() {
        const ret = wasm.timelinelayout_eventCount(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @returns {number}
     */
    laneCount() {
        const ret = wasm.timelinelayout_laneCount(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @returns {Float64Array}
     */
    nodes() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.timelinelayout_nodes(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var v1 = getArrayF64FromWasm0(r0, r1).slice();
            wasm.__wbindgen_export2(r0, r1 * 8, 8);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @returns {number}
     */
    rejectedCount() {
        const ret = wasm.timelinelayout_rejectedCount(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @returns {number}
     */
    startMs() {
        const ret = wasm.timelinelayout_startMs(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    stride() {
        const ret = wasm.timelinelayout_stride(this.__wbg_ptr);
        return ret >>> 0;
    }
}
if (Symbol.dispose) TimelineLayout.prototype[Symbol.dispose] = TimelineLayout.prototype.free;

/**
 * @param {Float64Array} samples_ms
 * @returns {LatencyReport}
 */
export function analyzeLatency(samples_ms) {
    const ptr0 = passArrayF64ToWasm0(samples_ms, wasm.__wbindgen_export);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.analyzeLatency(ptr0, len0);
    return LatencyReport.__wrap(ret);
}

/**
 * @param {Float64Array} samples
 * @param {number} sample_interval_ms
 * @returns {SignalReport}
 */
export function analyzeSignal(samples, sample_interval_ms) {
    const ptr0 = passArrayF64ToWasm0(samples, wasm.__wbindgen_export);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.analyzeSignal(ptr0, len0, sample_interval_ms);
    return SignalReport.__wrap(ret);
}

/**
 * @returns {string}
 */
export function engineVersion() {
    let deferred1_0;
    let deferred1_1;
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.engineVersion(retptr);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        deferred1_0 = r0;
        deferred1_1 = r1;
        return getStringFromWasm0(r0, r1);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        wasm.__wbindgen_export2(deferred1_0, deferred1_1, 1);
    }
}

/**
 * Creates deterministic timeline records: original index, x pixels, lane, scale.
 * @param {Float64Array} timestamps_ms
 * @param {Float64Array} importance
 * @param {number} width_px
 * @param {number} lane_count
 * @param {number} min_gap_px
 * @returns {TimelineLayout}
 */
export function layoutTimeline(timestamps_ms, importance, width_px, lane_count, min_gap_px) {
    const ptr0 = passArrayF64ToWasm0(timestamps_ms, wasm.__wbindgen_export);
    const len0 = WASM_VECTOR_LEN;
    const ptr1 = passArrayF64ToWasm0(importance, wasm.__wbindgen_export);
    const len1 = WASM_VECTOR_LEN;
    const ret = wasm.layoutTimeline(ptr0, len0, ptr1, len1, width_px, lane_count, min_gap_px);
    return TimelineLayout.__wrap(ret);
}
function __wbg_get_imports() {
    const import0 = {
        __proto__: null,
        __wbg___wbindgen_throw_bb96b2010945f0bc: function(arg0, arg1) {
            throw new Error(getStringFromWasm0(arg0, arg1));
        },
    };
    return {
        __proto__: null,
        "./horizon_engine_bg.js": import0,
    };
}

const LatencyReportFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_latencyreport_free(ptr, 1));
const ParticleFieldFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_particlefield_free(ptr, 1));
const SignalReportFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_signalreport_free(ptr, 1));
const TimelineLayoutFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_timelinelayout_free(ptr, 1));

function getArrayF32FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getFloat32ArrayMemory0().subarray(ptr / 4, ptr / 4 + len);
}

function getArrayF64FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getFloat64ArrayMemory0().subarray(ptr / 8, ptr / 8 + len);
}

let cachedDataViewMemory0 = null;
function getDataViewMemory0() {
    if (cachedDataViewMemory0 === null || cachedDataViewMemory0.buffer.detached === true || (cachedDataViewMemory0.buffer.detached === undefined && cachedDataViewMemory0.buffer !== wasm.memory.buffer)) {
        cachedDataViewMemory0 = new DataView(wasm.memory.buffer);
    }
    return cachedDataViewMemory0;
}

let cachedFloat32ArrayMemory0 = null;
function getFloat32ArrayMemory0() {
    if (cachedFloat32ArrayMemory0 === null || cachedFloat32ArrayMemory0.byteLength === 0) {
        cachedFloat32ArrayMemory0 = new Float32Array(wasm.memory.buffer);
    }
    return cachedFloat32ArrayMemory0;
}

let cachedFloat64ArrayMemory0 = null;
function getFloat64ArrayMemory0() {
    if (cachedFloat64ArrayMemory0 === null || cachedFloat64ArrayMemory0.byteLength === 0) {
        cachedFloat64ArrayMemory0 = new Float64Array(wasm.memory.buffer);
    }
    return cachedFloat64ArrayMemory0;
}

function getStringFromWasm0(ptr, len) {
    return decodeText(ptr >>> 0, len);
}

let cachedUint8ArrayMemory0 = null;
function getUint8ArrayMemory0() {
    if (cachedUint8ArrayMemory0 === null || cachedUint8ArrayMemory0.byteLength === 0) {
        cachedUint8ArrayMemory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8ArrayMemory0;
}

function passArrayF64ToWasm0(arg, malloc) {
    const ptr = malloc(arg.length * 8, 8) >>> 0;
    getFloat64ArrayMemory0().set(arg, ptr / 8);
    WASM_VECTOR_LEN = arg.length;
    return ptr;
}

let cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });
cachedTextDecoder.decode();
const MAX_SAFARI_DECODE_BYTES = 2146435072;
let numBytesDecoded = 0;
function decodeText(ptr, len) {
    numBytesDecoded += len;
    if (numBytesDecoded >= MAX_SAFARI_DECODE_BYTES) {
        cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });
        cachedTextDecoder.decode();
        numBytesDecoded = len;
    }
    return cachedTextDecoder.decode(getUint8ArrayMemory0().subarray(ptr, ptr + len));
}

let WASM_VECTOR_LEN = 0;

let wasmModule, wasmInstance, wasm;
function __wbg_finalize_init(instance, module) {
    wasmInstance = instance;
    wasm = instance.exports;
    wasmModule = module;
    cachedDataViewMemory0 = null;
    cachedFloat32ArrayMemory0 = null;
    cachedFloat64ArrayMemory0 = null;
    cachedUint8ArrayMemory0 = null;
    return wasm;
}

async function __wbg_load(module, imports) {
    if (typeof Response === 'function' && module instanceof Response) {
        if (!module.ok) {
            throw new Error(`failed to fetch Wasm: ${module.status} ${module.statusText} fetching '${module.url}'`);
        }

        if (typeof WebAssembly.instantiateStreaming === 'function') {
            try {
                return await WebAssembly.instantiateStreaming(module, imports);
            } catch (e) {
                const validResponse = expectedResponseType(module.type);

                if (validResponse && module.headers.get('Content-Type') !== 'application/wasm') {
                    console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve Wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);

                } else { throw e; }
            }
        }

        const bytes = await module.arrayBuffer();
        return await WebAssembly.instantiate(bytes, imports);
    } else {
        const instance = await WebAssembly.instantiate(module, imports);

        if (instance instanceof WebAssembly.Instance) {
            return { instance, module };
        } else {
            return instance;
        }
    }

    function expectedResponseType(type) {
        switch (type) {
            case 'basic': case 'cors': case 'default': return true;
        }
        return false;
    }
}

function initSync(module) {
    if (wasm !== undefined) return wasm;


    if (module !== undefined) {
        if (Object.getPrototypeOf(module) === Object.prototype) {
            ({module} = module)
        } else {
            console.warn('using deprecated parameters for `initSync()`; pass a single object instead')
        }
    }

    const imports = __wbg_get_imports();
    if (!(module instanceof WebAssembly.Module)) {
        module = new WebAssembly.Module(module);
    }
    const instance = new WebAssembly.Instance(module, imports);
    return __wbg_finalize_init(instance, module);
}

async function __wbg_init(module_or_path) {
    if (wasm !== undefined) return wasm;


    if (module_or_path !== undefined) {
        if (Object.getPrototypeOf(module_or_path) === Object.prototype) {
            ({module_or_path} = module_or_path)
        } else {
            console.warn('using deprecated parameters for the initialization function; pass a single object instead')
        }
    }

    if (module_or_path === undefined) {
        module_or_path = new URL('horizon_engine_bg.wasm', import.meta.url);
    }
    const imports = __wbg_get_imports();

    if (typeof module_or_path === 'string' || (typeof Request === 'function' && module_or_path instanceof Request) || (typeof URL === 'function' && module_or_path instanceof URL)) {
        module_or_path = fetch(module_or_path);
    }

    const { instance, module } = await __wbg_load(await module_or_path, imports);

    return __wbg_finalize_init(instance, module);
}

export { initSync, __wbg_init as default };
