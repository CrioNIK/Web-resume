import { describe, expect, it } from 'vitest';
import { createVaultRecords, VAULT_QUERY_BAND } from './local-vault';

describe('local vault fixtures', () => {
  it('creates a deterministic bounded synthetic dataset', () => {
    expect(createVaultRecords(4, 42)).toEqual(createVaultRecords(4, 42));
    expect(createVaultRecords(20_000)).toHaveLength(10_000);
    expect(createVaultRecords(0)).toHaveLength(1);
    expect(createVaultRecords(Number.NaN)).toHaveLength(1);
  });

  it('produces unique keys and indexable compute records', () => {
    const records = createVaultRecords(2_000);
    expect(new Set(records.map((record) => record.id)).size).toBe(records.length);
    expect(records.filter((record) => record.band === VAULT_QUERY_BAND).length).toBeGreaterThan(0);
    expect(records.every((record) => /^SIG-[0-9A-F]{8}$/.test(record.signal))).toBe(true);
  });
});
