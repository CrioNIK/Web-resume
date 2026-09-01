import { describe, expect, it } from 'vitest';
import {
  COMPONENT_MESH_MAX_SAMPLES,
  fnv1aWords,
  normalizeComponentMeshRequest,
  normalizeMeshSignal,
} from './component-mesh';

describe('component mesh reference contract', () => {
  it('normalizes, clamps, and produces a stable checksum', () => {
    const result = normalizeMeshSignal({
      samples: [-500, 0, 250, 750, 1_500],
      floor: 0,
      ceiling: 1_000,
    });

    expect(result).toEqual({
      values: [0, 0, 250_000, 750_000, 1_000_000],
      checksum: 0xff6d5f83,
      clamped: 2,
    });
  });

  it('treats reversed bounds identically', () => {
    const forward = normalizeMeshSignal({ samples: [-1, 5, 11], floor: 0, ceiling: 10 });
    const reverse = normalizeMeshSignal({ samples: [-1, 5, 11], floor: 10, ceiling: 0 });
    expect(reverse).toEqual(forward);
  });

  it('normalizes an empty span without division', () => {
    expect(normalizeMeshSignal({ samples: [4, 5, 6], floor: 5, ceiling: 5 })).toEqual({
      values: [0, 0, 0],
      checksum: fnv1aWords([0, 0, 0]),
      clamped: 2,
    });
  });

  it('bounds WIT inputs to signed 32-bit values and the sample budget', () => {
    const request = normalizeComponentMeshRequest({
      samples: Array.from({ length: COMPONENT_MESH_MAX_SAMPLES + 2 }, (_, index) => index),
      floor: Number.NEGATIVE_INFINITY,
      ceiling: Number.MAX_SAFE_INTEGER,
    });

    expect(request.samples).toHaveLength(COMPONENT_MESH_MAX_SAMPLES);
    expect(request.floor).toBe(0);
    expect(request.ceiling).toBe(2_147_483_647);
  });
});
