import { describe, expect, it } from 'vitest';
import { buildOfflinePlan } from './planner';

describe('buildOfflinePlan', () => {
  it('detects multiple English signals deterministically', () => {
    const plan = buildOfflinePlan('A fast multilingual AI product with analytics', 'en');
    expect(plan.signals).toEqual(['product', 'data', 'ai', 'language', 'speed']);
    expect(plan.steps).toHaveLength(4);
  });

  it('detects Ukrainian signals', () => {
    const plan = buildOfflinePlan('Швидка ігрова платформа з даними', 'uk');
    expect(plan.signals).toContain('game');
    expect(plan.signals).toContain('speed');
  });

  it('uses a product baseline for an unknown prompt', () => {
    expect(buildOfflinePlan('something entirely abstract', 'en').signals).toEqual(['product']);
  });
});
