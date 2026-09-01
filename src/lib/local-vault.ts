export const VAULT_DATABASE = 'criomant-horizon-vault';
export const VAULT_STORE = 'signals';
export const VAULT_VERSION = 1;
export const VAULT_QUERY_BAND = 'compute';

export type VaultBand = 'interface' | 'compute' | 'data' | 'delivery';

export interface VaultRecord {
  id: number;
  band: VaultBand;
  score: number;
  signal: string;
}

export interface VaultBenchmark {
  records: number;
  indexedMatches: number;
  writeMs: number;
  queryMs: number;
  usageBytes?: number;
  quotaBytes?: number;
  persisted?: boolean;
}

const bands: VaultBand[] = ['interface', 'compute', 'data', 'delivery'];

function nextRandom(state: { value: number }) {
  let value = state.value >>> 0;
  value ^= value << 13;
  value ^= value >>> 17;
  value ^= value << 5;
  state.value = value >>> 0;
  return state.value / 0x1_0000_0000;
}

export function createVaultRecords(count: number, seed = 0xc01dba5e): VaultRecord[] {
  const normalizedCount = Number.isFinite(count) ? Math.floor(count) : 1;
  const boundedCount = Math.min(Math.max(normalizedCount, 1), 10_000);
  const state = { value: seed || 1 };

  return Array.from({ length: boundedCount }, (_, id) => {
    const band = bands[Math.floor(nextRandom(state) * bands.length)];
    const score = Math.round(nextRandom(state) * 10_000) / 100;
    const signal = Math.floor(nextRandom(state) * 0x1_0000_0000)
      .toString(16)
      .padStart(8, '0')
      .toUpperCase();

    return { id, band, score, signal: `SIG-${signal}` };
  });
}

function requestResult<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error('IndexedDB request failed'));
  });
}

function transactionComplete(transaction: IDBTransaction): Promise<void> {
  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve();
    transaction.onabort = () => reject(transaction.error ?? new Error('IndexedDB transaction aborted'));
    transaction.onerror = () => reject(transaction.error ?? new Error('IndexedDB transaction failed'));
  });
}

function openVault(): Promise<IDBDatabase> {
  if (typeof indexedDB === 'undefined') {
    return Promise.reject(new Error('IndexedDB is unavailable'));
  }

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(VAULT_DATABASE, VAULT_VERSION);

    request.onupgradeneeded = () => {
      const database = request.result;
      const store = database.createObjectStore(VAULT_STORE, { keyPath: 'id' });
      store.createIndex('band', 'band', { unique: false });
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error('IndexedDB could not open'));
    request.onblocked = () => reject(new Error('IndexedDB upgrade was blocked'));
  });
}

export async function benchmarkVault(recordCount = 2_000): Promise<VaultBenchmark> {
  const database = await openVault();
  const records = createVaultRecords(recordCount);

  try {
    const writeStarted = performance.now();
    const writeTransaction = database.transaction(VAULT_STORE, 'readwrite');
    const writeComplete = transactionComplete(writeTransaction);
    const store = writeTransaction.objectStore(VAULT_STORE);
    store.clear();
    for (const record of records) store.put(record);
    await writeComplete;
    const writeMs = performance.now() - writeStarted;

    const queryStarted = performance.now();
    const queryTransaction = database.transaction(VAULT_STORE, 'readonly');
    const queryComplete = transactionComplete(queryTransaction);
    const countRequest = queryTransaction.objectStore(VAULT_STORE).index('band').count(VAULT_QUERY_BAND);
    const [indexedMatches] = await Promise.all([requestResult(countRequest), queryComplete]);
    const queryMs = performance.now() - queryStarted;

    const estimate = typeof navigator !== 'undefined' && navigator.storage?.estimate
      ? await navigator.storage.estimate()
      : undefined;
    const persisted = typeof navigator !== 'undefined' && navigator.storage?.persisted
      ? await navigator.storage.persisted()
      : undefined;

    return {
      records: records.length,
      indexedMatches,
      writeMs,
      queryMs,
      usageBytes: estimate?.usage,
      quotaBytes: estimate?.quota,
      persisted,
    };
  } finally {
    database.close();
  }
}

export function clearVault(): Promise<void> {
  if (typeof indexedDB === 'undefined') return Promise.reject(new Error('IndexedDB is unavailable'));

  return new Promise((resolve, reject) => {
    const request = indexedDB.deleteDatabase(VAULT_DATABASE);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error ?? new Error('IndexedDB could not be cleared'));
    request.onblocked = () => reject(new Error('IndexedDB deletion was blocked'));
  });
}
