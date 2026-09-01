import { readFile } from 'node:fs/promises';
import { transformSync } from 'amaro';
import { describe, expect, it } from 'vitest';

describe('browser TypeScript fixture', () => {
  it('remains executable after Amaro strip-only transformation', async () => {
    const source = await readFile(
      new URL('../public/experiments/horizon-runtime.ts', import.meta.url),
      'utf8',
    );
    const { code } = transformSync(source, { mode: 'strip-only' });

    expect(code).not.toContain('interface HorizonVector');
    expect(code).toContain('runHorizonExperiment');

    const runnable = code.replace('export function', 'function');
    const result = Function(`${runnable}; return runHorizonExperiment();`)() as {
      checksum: number;
      strongest: string;
      samples: number;
    };

    expect(result).toEqual({ checksum: 5450, strongest: 'agent', samples: 3 });
  });
});
