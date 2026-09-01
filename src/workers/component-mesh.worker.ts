/// <reference lib="webworker" />
import init, { analyzeSignal, engineVersion } from '../generated/horizon-engine/horizon_engine.js';
import horizonEngineWasmUrl from '../generated/horizon-engine/horizon_engine_bg.wasm?url';
import {
  normalizeComponentMeshRequest,
  normalizeMeshSignal,
  type ComponentMeshRequest,
  type ComponentMeshResult,
  type ComponentMeshWorkerResponse,
} from '../lib/component-mesh';

const workerScope = self as unknown as DedicatedWorkerGlobalScope;

function failureSummary(error: unknown): string {
  if (error instanceof WebAssembly.CompileError) return 'core WASM compilation unavailable';
  if (error instanceof WebAssembly.LinkError) return 'core WASM linking unavailable';
  if (error instanceof WebAssembly.RuntimeError) return 'core WASM execution unavailable';
  return 'core WASM module unavailable';
}

async function run(rawRequest: ComponentMeshRequest): Promise<ComponentMeshResult> {
  const request = normalizeComponentMeshRequest(rawRequest);
  const normalized = normalizeMeshSignal(request);
  const started = performance.now();

  try {
    await init({ module_or_path: horizonEngineWasmUrl });
    const report = analyzeSignal(new Float64Array(request.samples), 1);

    try {
      return {
        ...normalized,
        artifactStatus: 'ci-build-only',
        runtime: 'Rust/WASM core fallback',
        engineVersion: engineVersion(),
        mean: report.mean(),
        rms: report.rms(),
        zeroCrossings: report.zeroCrossings(),
        duration: performance.now() - started,
      };
    } finally {
      report.free();
    }
  } catch (error) {
    const values = request.samples;
    const mean = values.length === 0
      ? Number.NaN
      : values.reduce((sum, value) => sum + value, 0) / values.length;
    const rms = values.length === 0
      ? Number.NaN
      : Math.sqrt(values.reduce((sum, value) => sum + value * value, 0) / values.length);
    const zeroCrossings = values.slice(1).reduce((count, value, index) => {
      const previous = values[index];
      return count + Number((previous <= mean && value > mean) || (previous >= mean && value < mean));
    }, 0);

    return {
      ...normalized,
      artifactStatus: 'ci-build-only',
      runtime: 'JavaScript reference fallback',
      mean,
      rms,
      zeroCrossings,
      duration: performance.now() - started,
      fallbackReason: failureSummary(error),
    };
  }
}

function post(response: ComponentMeshWorkerResponse): void {
  workerScope.postMessage(response);
}

workerScope.onmessage = (event: MessageEvent<ComponentMeshRequest>) => {
  workerScope.onmessage = null;

  void run(event.data)
    .then((result) => post({ type: 'result', result }))
    .catch(() => post({ type: 'error', message: 'The Component Mesh fallback could not complete.' }))
    .finally(() => workerScope.close());
};

export {};
