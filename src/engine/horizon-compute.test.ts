import { describe, expect, it } from 'vitest';
import { javascriptFieldChecksum, normalizeHorizonComputeRequest } from './horizon-compute';

describe('javascriptFieldChecksum', () => {
  it('returns the same checksum for the same seeded field', () => {
    const first = javascriptFieldChecksum(0xc01dba5e, 256, 24);
    const second = javascriptFieldChecksum(0xc01dba5e, 256, 24);

    expect(first).toBe(0xc96d5323);
    expect(second).toBe(first);
  });

  it('changes when the seeded workload changes', () => {
    const baseline = javascriptFieldChecksum(0xc01dba5e, 256, 24);

    expect(javascriptFieldChecksum(0xc01dba5f, 256, 24)).not.toBe(baseline);
    expect(javascriptFieldChecksum(0xc01dba5e, 256, 25)).not.toBe(baseline);
  });

  it('bounds work before running the fallback kernel', () => {
    expect(normalizeHorizonComputeRequest({ seed: Number.NaN, particles: -4, steps: 9999 })).toEqual({
      seed: 0x6d2b79f5,
      particles: 1,
      steps: 600,
    });
  });
});
