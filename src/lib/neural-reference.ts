export const NEURAL_INPUT_WIDTH = 4;
export const NEURAL_HIDDEN_WIDTH = 8;
export const NEURAL_OUTPUT_WIDTH = 4;
export const NEURAL_BATCH_MIN = 1_024;
export const NEURAL_BATCH_MAX = 65_536;

// Row-major weights. Keeping these values in TypeScript lets the WebGPU engine
// generate its WGSL constants from the exact same source used by the reference.
export const NEURAL_HIDDEN_WEIGHTS: readonly number[] = Object.freeze([
  0.82, -0.41, 0.23, 0.67,
  -0.33, 0.91, -0.58, 0.19,
  0.47, 0.16, 0.88, -0.72,
  -0.76, 0.54, 0.31, 0.43,
  0.29, -0.84, 0.62, 0.51,
  0.68, 0.37, -0.49, -0.21,
  -0.52, -0.27, 0.74, 0.86,
  0.14, 0.73, 0.45, -0.93,
]);

export const NEURAL_HIDDEN_BIASES: readonly number[] = Object.freeze([
  0.08, -0.14, 0.05, 0.19, -0.09, 0.12, -0.03, 0.16,
]);

export const NEURAL_OUTPUT_WEIGHTS: readonly number[] = Object.freeze([
  0.61, -0.22, 0.47, -0.53, 0.31, 0.18, -0.44, 0.27,
  -0.36, 0.72, 0.11, 0.39, -0.57, 0.46, 0.25, -0.19,
  0.28, 0.35, -0.64, 0.16, 0.52, -0.41, 0.73, -0.08,
  -0.49, 0.13, 0.32, 0.69, -0.24, 0.58, -0.17, 0.43,
]);

export const NEURAL_OUTPUT_BIASES: readonly number[] = Object.freeze([
  0.04, -0.07, 0.11, -0.02,
]);

export function normalizeNeuralBatchSize(value: number): number {
  if (!Number.isFinite(value)) return NEURAL_BATCH_MIN;
  return Math.max(NEURAL_BATCH_MIN, Math.min(NEURAL_BATCH_MAX, Math.floor(value)));
}
function nextRandom(state: number): number {
  let next = state >>> 0;
  next ^= next << 13;
  next ^= next >>> 17;
  next ^= next << 5;
  return next >>> 0;
}

export function createNeuralInputs(count: number, seed = 0xc01dba5e): Float32Array {
  const safeCount = normalizeNeuralBatchSize(count);
  const values = new Float32Array(safeCount * NEURAL_INPUT_WIDTH);
  let state = seed >>> 0 || 0x9e3779b9;

  for (let index = 0; index < values.length; index += 1) {
    state = nextRandom(state);
    values[index] = Math.fround((state / 0xffffffff) * 2 - 1);
  }

  return values;
}

export function inferNeuralReference(inputs: Float32Array): Float32Array {
  if (inputs.length % NEURAL_INPUT_WIDTH !== 0) {
    throw new RangeError(`Neural input length must be divisible by ${NEURAL_INPUT_WIDTH}.`);
  }

  const count = inputs.length / NEURAL_INPUT_WIDTH;
  const output = new Float32Array(count * NEURAL_OUTPUT_WIDTH);
  const hidden = new Float32Array(NEURAL_HIDDEN_WIDTH);

  for (let batchIndex = 0; batchIndex < count; batchIndex += 1) {
    const inputOffset = batchIndex * NEURAL_INPUT_WIDTH;

    for (let hiddenIndex = 0; hiddenIndex < NEURAL_HIDDEN_WIDTH; hiddenIndex += 1) {
      let value = Math.fround(NEURAL_HIDDEN_BIASES[hiddenIndex]);
      const weightOffset = hiddenIndex * NEURAL_INPUT_WIDTH;
      for (let inputIndex = 0; inputIndex < NEURAL_INPUT_WIDTH; inputIndex += 1) {
        const product = Math.fround(
          inputs[inputOffset + inputIndex] * NEURAL_HIDDEN_WEIGHTS[weightOffset + inputIndex],
        );
        value = Math.fround(value + product);
      }
      hidden[hiddenIndex] = Math.fround(Math.tanh(value));
    }

    const outputOffset = batchIndex * NEURAL_OUTPUT_WIDTH;
    for (let outputIndex = 0; outputIndex < NEURAL_OUTPUT_WIDTH; outputIndex += 1) {
      let value = Math.fround(NEURAL_OUTPUT_BIASES[outputIndex]);
      const weightOffset = outputIndex * NEURAL_HIDDEN_WIDTH;
      for (let hiddenIndex = 0; hiddenIndex < NEURAL_HIDDEN_WIDTH; hiddenIndex += 1) {
        const product = Math.fround(
          hidden[hiddenIndex] * NEURAL_OUTPUT_WEIGHTS[weightOffset + hiddenIndex],
        );
        value = Math.fround(value + product);
      }
      output[outputOffset + outputIndex] = Math.fround(Math.tanh(value));
    }
  }

  return output;
}
