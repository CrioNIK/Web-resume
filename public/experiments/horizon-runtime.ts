interface HorizonVector {
  readonly channel: 'compute' | 'render' | 'agent';
  readonly weight: number;
}

type HorizonResult = {
  readonly checksum: number;
  readonly strongest: HorizonVector['channel'];
  readonly samples: number;
};

const vectors = [
  { channel: 'compute', weight: 0.91 },
  { channel: 'render', weight: 0.86 },
  { channel: 'agent', weight: 0.94 },
] as const satisfies readonly HorizonVector[];

export function runHorizonExperiment<const T extends readonly HorizonVector[]>(
  input: T = vectors as T,
): HorizonResult {
  const checksum = input.reduce((total, vector, index) => (
    total + Math.round(vector.weight * 1_000) * (index + 1)
  ), 0);
  const strongest = input.reduce((best, vector) => (
    vector.weight > best.weight ? vector : best
  )).channel;

  return { checksum, strongest, samples: input.length };
}
