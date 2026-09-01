/// <reference lib="webworker" />
import {
  javascriptFieldChecksum,
  normalizeHorizonComputeRequest,
  type HorizonComputeRequest,
  type HorizonComputeResult,
  type HorizonComputeWorkerResponse,
} from '../engine/horizon-compute';
import init, { engineVersion, ParticleField } from '../generated/horizon-engine/horizon_engine.js';

const workerScope = self as unknown as DedicatedWorkerGlobalScope;
function checksumPositions(positions: Float32Array): number {
  const pairCount = positions.length / 2;
  const pairStride = Math.max(1, Math.floor(pairCount / 2048));
  let checksum = 0x811c9dc5;

  for (let pair = 0; pair < pairCount; pair += pairStride) {
    const offset = pair * 2;
    checksum = Math.imul(checksum ^ Math.round(positions[offset] * 1000), 0x01000193) >>> 0;
    checksum = Math.imul(checksum ^ Math.round(positions[offset + 1] * 1000), 0x01000193) >>> 0;
  }

  return checksum;
}

function wasmFailureSummary(error: unknown): string {
  if (error instanceof WebAssembly.CompileError) return 'WASM compilation unavailable';
  if (error instanceof WebAssembly.LinkError) return 'WASM linking unavailable';
  if (error instanceof WebAssembly.RuntimeError) return 'WASM execution unavailable';
  if (error instanceof TypeError) return 'WASM module unavailable';
  return 'WASM initialization unavailable';
}

async function runWasm(request: HorizonComputeRequest): Promise<HorizonComputeResult> {
  await init();

  const started = performance.now();
  const field = new ParticleField(request.seed, 1280, 720, request.particles);

  try {
    for (let index = 0; index < request.steps; index += 1) {
      field.step(1 / 60, 640, 360, 1800);
    }

    const positions = field.positions();
    return {
      runtime: 'Rust/WASM',
      version: engineVersion(),
      particles: request.particles,
      steps: request.steps,
      duration: performance.now() - started,
      checksum: checksumPositions(positions),
      meanSpeed: field.meanSpeed(),
    };
  } finally {
    field.free();
  }
}

function runFallback(request: HorizonComputeRequest, wasmError: unknown): HorizonComputeResult {
  const started = performance.now();
  const checksum = javascriptFieldChecksum(request.seed, request.particles, request.steps);

  return {
    runtime: 'JavaScript fallback',
    version: 'js-fixedpoint-1',
    particles: request.particles,
    steps: request.steps,
    duration: performance.now() - started,
    checksum,
    fallbackReason: wasmFailureSummary(wasmError),
  };
}

async function compute(rawRequest: HorizonComputeRequest): Promise<HorizonComputeResult> {
  const request = normalizeHorizonComputeRequest(rawRequest);

  try {
    return await runWasm(request);
  } catch (error) {
    return runFallback(request, error);
  }
}

function post(response: HorizonComputeWorkerResponse): void {
  workerScope.postMessage(response);
}

workerScope.onmessage = (event: MessageEvent<HorizonComputeRequest>) => {
  workerScope.onmessage = null;

  void compute(event.data)
    .then((result) => post({ type: 'result', result }))
    .catch(() => post({ type: 'error', message: 'Neither compute runtime could complete the request.' }))
    .finally(() => workerScope.close());
};

export {};
