import { describe, expect, it } from 'vitest';
import { analyzeSyntheticSignal } from './analytics';

describe('analyzeSyntheticSignal', () => {
  it('is deterministic apart from device timing', () => {
    const request = { size: 5000, noise: 12, seed: 42 };
    const first = analyzeSyntheticSignal(request);
    const second = analyzeSyntheticSignal(request);
    expect({ ...first, computeMs: 0 }).toEqual({ ...second, computeMs: 0 });
  });

  it('recovers the underlying positive relationship', () => {
    const result = analyzeSyntheticSignal({ size: 20_000, noise: 10, seed: 7 });
    expect(result.slope).toBeGreaterThan(1.68);
    expect(result.slope).toBeLessThan(1.76);
    expect(result.rSquared).toBeGreaterThan(0.9);
  });

  it('clamps unsafe dataset sizes', () => {
    expect(analyzeSyntheticSignal({ size: 1, noise: 0, seed: 1 }).size).toBe(100);
    expect(analyzeSyntheticSignal({ size: 1_000_000, noise: 0, seed: 1 }).size).toBe(250_000);
  });
});
