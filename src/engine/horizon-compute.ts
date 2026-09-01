export const HORIZON_MAX_PARTICLES = 65_536;
export const HORIZON_MAX_STEPS = 600;

export interface HorizonComputeRequest {
  seed: number;
  particles: number;
  steps: number;
}

export interface HorizonComputeResult {
  runtime: 'Rust/WASM' | 'JavaScript fallback';
  version: string;
  particles: number;
  steps: number;
  duration: number;
  checksum: number;
  meanSpeed?: number;
  fallbackReason?: string;
}

export type HorizonComputeWorkerResponse =
  | { type: 'result'; result: HorizonComputeResult }
  | { type: 'error'; message: string };

function boundedInteger(value: number, minimum: number, maximum: number): number {
  if (!Number.isFinite(value)) return minimum;
  return Math.min(maximum, Math.max(minimum, Math.trunc(value)));
}

export function normalizeHorizonComputeRequest(request: HorizonComputeRequest): HorizonComputeRequest {
  return {
    seed: Number.isFinite(request.seed) ? Math.trunc(request.seed) >>> 0 : 0x6d2b79f5,
    particles: boundedInteger(request.particles, 1, HORIZON_MAX_PARTICLES),
    steps: boundedInteger(request.steps, 1, HORIZON_MAX_STEPS),
  };
}

function nextXorShift32(value: number): number {
  let next = value >>> 0;
  next ^= next << 13;
  next ^= next >>> 17;
  next ^= next << 5;
  return next >>> 0;
}

/**
 * A bounded, integer-only particle-like kernel for browsers that cannot start
 * the Rust/WASM runtime. It intentionally has its own checksum namespace.
 */
export function javascriptFieldChecksum(seed: number, particles: number, steps: number): number {
  const request = normalizeHorizonComputeRequest({ seed, particles, steps });
  let state = request.seed || 0x6d2b79f5;
  let checksum = 0x811c9dc5;

  for (let particle = 0; particle < request.particles; particle += 1) {
    state = nextXorShift32(state);
    let x = state;
    state = nextXorShift32(state);
    let y = state;
    state = nextXorShift32(state);
    let velocityX = (state & 0xffff) - 0x8000;
    state = nextXorShift32(state);
    let velocityY = (state & 0xffff) - 0x8000;

    for (let step = 0; step < request.steps; step += 1) {
      const centeredX = (x >>> 16) - 0x8000;
      const centeredY = (y >>> 16) - 0x8000;

      state = nextXorShift32(state);
      const noiseX = (state >>> 24) - 0x80;
      state = nextXorShift32(state);
      const noiseY = (state >>> 24) - 0x80;

      velocityX = (velocityX + (centeredY >> 7) - (velocityX >> 5) + noiseX) | 0;
      velocityY = (velocityY - (centeredX >> 7) - (velocityY >> 5) + noiseY) | 0;
      x = (x + velocityX) >>> 0;
      y = (y + velocityY) >>> 0;
    }

    let mixed = x ^ ((y << 16) | (y >>> 16)) ^ state ^ particle;
    mixed = Math.imul(mixed ^ (mixed >>> 16), 0x7feb352d);
    checksum = Math.imul(checksum ^ mixed, 0x01000193) >>> 0;
  }

  return checksum;
}
