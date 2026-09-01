export const COMPONENT_MESH_SCALE = 1_000_000;
export const COMPONENT_MESH_MAX_SAMPLES = 4_096;

const I32_MIN = -2_147_483_648;
const I32_MAX = 2_147_483_647;

export type ComponentArtifactStatus = 'ci-build-only';

export interface ComponentMeshRequest {
  samples: number[];
  floor: number;
  ceiling: number;
}

export interface NormalizedMeshSignal {
  values: number[];
  checksum: number;
  clamped: number;
}

export interface ComponentMeshResult extends NormalizedMeshSignal {
  artifactStatus: ComponentArtifactStatus;
  runtime: 'Rust/WASM core fallback' | 'JavaScript reference fallback';
  engineVersion?: string;
  mean: number;
  rms: number;
  zeroCrossings: number;
  duration: number;
  fallbackReason?: string;
}

export type ComponentMeshWorkerResponse =
  | { type: 'result'; result: ComponentMeshResult }
  | { type: 'error'; message: string };

function toI32(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(I32_MIN, Math.min(I32_MAX, Math.trunc(value)));
}

export function normalizeComponentMeshRequest(request: ComponentMeshRequest): ComponentMeshRequest {
  return {
    floor: toI32(request.floor),
    ceiling: toI32(request.ceiling),
    samples: request.samples.slice(0, COMPONENT_MESH_MAX_SAMPLES).map(toI32),
  };
}

export function fnv1aWords(words: readonly number[]): number {
  let hash = 0x811c9dc5;

  for (const rawWord of words) {
    const word = rawWord >>> 0;
    for (let shift = 0; shift < 32; shift += 8) {
      hash = Math.imul(hash ^ ((word >>> shift) & 0xff), 0x01000193) >>> 0;
    }
  }

  return hash;
}

export function normalizeMeshSignal(rawRequest: ComponentMeshRequest): NormalizedMeshSignal {
  const request = normalizeComponentMeshRequest(rawRequest);
  const lower = Math.min(request.floor, request.ceiling);
  const upper = Math.max(request.floor, request.ceiling);
  const span = upper - lower;
  let clamped = 0;

  const values = request.samples.map((sample) => {
    const bounded = Math.max(lower, Math.min(upper, sample));
    if (bounded !== sample) clamped += 1;
    if (span === 0) return 0;
    return Math.floor(((bounded - lower) * COMPONENT_MESH_SCALE) / span);
  });

  return {
    values,
    checksum: fnv1aWords(values),
    clamped,
  };
}
