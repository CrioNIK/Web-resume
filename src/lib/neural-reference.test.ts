import { describe, expect, it } from 'vitest';
import {
  createNeuralInputs,
  inferNeuralReference,
  NEURAL_BATCH_MAX,
  NEURAL_BATCH_MIN,
  normalizeNeuralBatchSize,
} from './neural-reference';

describe('neural reference', () => {
  it('generates fixed-seed inputs deterministically', () => {
    const first = createNeuralInputs(NEURAL_BATCH_MIN, 42);
    const second = createNeuralInputs(NEURAL_BATCH_MIN, 42);

    expect(first).toEqual(second);
    expect(Array.from(first.slice(0, 4))).toEqual([
      -0.994712233543396,
      0.3206239640712738,
      -0.7780858278274536,
      0.698753833770752,
    ]);
  });

  it('produces finite, bounded output with a stable known vector', () => {
    const output = inferNeuralReference(new Float32Array([0.25, -0.5, 0.75, -1]));

    expect(Array.from(output)).toEqual([
      0.8696956038475037,
      -0.8368620276451111,
      -0.7332669496536255,
      0.14257079362869263,
    ]);
    expect(output.every((value) => Number.isFinite(value) && Math.abs(value) <= 1)).toBe(true);
  });

  it('rejects malformed vectors and clamps practical batch limits', () => {
    expect(() => inferNeuralReference(new Float32Array(3))).toThrow(RangeError);
    expect(normalizeNeuralBatchSize(1)).toBe(NEURAL_BATCH_MIN);
    expect(normalizeNeuralBatchSize(Number.NaN)).toBe(NEURAL_BATCH_MIN);
    expect(normalizeNeuralBatchSize(1_000_000)).toBe(NEURAL_BATCH_MAX);
  });
});
