import { useEffect, useRef, useState } from 'react';
import type { Locale } from '../data/content';
import { benchmarkVault, clearVault, type VaultBenchmark, VAULT_QUERY_BAND } from '../lib/local-vault';

const text = {
  en: {
    kicker: 'DATABASE / INDEXEDDB / LOCAL TRANSACTIONS',
    title: 'Local data vault',
    intro: 'Write 2,000 deterministic synthetic records to a real browser database, then time an indexed query. The dataset stays on this device until you clear it.',
    run: 'Benchmark IndexedDB',
    running: 'TRANSACTING…',
    clear: 'Clear local vault',
    clearing: 'CLEARING…',
    disclaimer: 'SYNTHETIC DATA ONLY · ZERO NETWORK REQUESTS · USER-CONTROLLED CLEANUP',
    telemetry: 'LOCAL DATABASE / LIVE',
    empty: 'No local transaction yet. Run the benchmark to create and query the synthetic vault.',
    cleared: 'The local IndexedDB database was deleted from this browser.',
    failed: 'IndexedDB is unavailable or the transaction was blocked. No fallback result has been fabricated.',
    records: 'Records written',
    write: 'Write transaction',
    query: 'Indexed query',
    matches: `${VAULT_QUERY_BAND} matches`,
    storage: 'Storage mode',
    used: 'Origin usage',
    persistent: 'persistent',
    bestEffort: 'best effort',
    unknown: 'unknown',
  },
  uk: {
    kicker: 'БАЗА ДАНИХ / INDEXEDDB / ЛОКАЛЬНІ ТРАНЗАКЦІЇ',
    title: 'Локальне сховище даних',
    intro: 'Запиши 2 000 детермінованих синтетичних записів у справжню браузерну базу, а потім виміряй індексований запит. Дані залишаються на цьому пристрої, доки ти їх не очистиш.',
    run: 'Виміряти IndexedDB',
    running: 'ТРАНЗАКЦІЯ…',
    clear: 'Очистити локальну базу',
    clearing: 'ОЧИЩЕННЯ…',
    disclaimer: 'ЛИШЕ СИНТЕТИЧНІ ДАНІ · БЕЗ МЕРЕЖЕВИХ ЗАПИТІВ · КОНТРОЛЬОВАНЕ ОЧИЩЕННЯ',
    telemetry: 'ЛОКАЛЬНА БАЗА / LIVE',
    empty: 'Локальних транзакцій ще не було. Запусти benchmark, щоб створити й опитати синтетичну базу.',
    cleared: 'Локальну IndexedDB-базу видалено з цього браузера.',
    failed: 'IndexedDB недоступна або транзакцію заблоковано. Фальшивий fallback-результат не створюється.',
    records: 'Записів створено',
    write: 'Транзакція запису',
    query: 'Індексований запит',
    matches: `Збіги ${VAULT_QUERY_BAND}`,
    storage: 'Режим зберігання',
    used: 'Використання origin',
    persistent: 'постійне',
    bestEffort: 'best effort',
    unknown: 'невідомо',
  },
} as const;

function formatBytes(value: number | undefined, locale: Locale) {
  if (value === undefined) return '—';
  return new Intl.NumberFormat(locale, { style: 'unit', unit: 'kilobyte', maximumFractionDigits: 1 })
    .format(value / 1024);
}

export default function LocalVault({ locale }: { locale: Locale }) {
  const c = text[locale];
  const mounted = useRef(true);
  const [state, setState] = useState<'idle' | 'running' | 'ready' | 'clearing' | 'cleared' | 'error'>('idle');
  const [result, setResult] = useState<VaultBenchmark | null>(null);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const run = async () => {
    setState('running');
    try {
      const nextResult = await benchmarkVault();
      if (!mounted.current) return;
      setResult(nextResult);
      setState('ready');
    } catch {
      if (!mounted.current) return;
      setResult(null);
      setState('error');
    }
  };

  const clear = async () => {
    setState('clearing');
    try {
      await clearVault();
      if (!mounted.current) return;
      setResult(null);
      setState('cleared');
    } catch {
      if (!mounted.current) return;
      setState('error');
    }
  };

  const storageMode = result?.persisted === true
    ? c.persistent
    : result?.persisted === false
      ? c.bestEffort
      : c.unknown;

  return (
    <div className="module-grid">
      <div className="module-copy">
        <p className="module-kicker">{c.kicker}</p>
        <h3>{c.title}</h3>
        <p>{c.intro}</p>
        <div className="vault-actions">
          <button className="module-action" type="button" onClick={run} disabled={state === 'running' || state === 'clearing'}>
            {state === 'running' ? c.running : c.run}<span aria-hidden="true">↗</span>
          </button>
          <button className="module-secondary" type="button" onClick={clear} disabled={state === 'running' || state === 'clearing'}>
            {state === 'clearing' ? c.clearing : c.clear}
          </button>
        </div>
        <p className="module-disclaimer">{c.disclaimer}</p>
      </div>
      <div className="vault-card" aria-live="polite">
        <div className="telemetry-head"><span>{c.telemetry}</span><i className={state === 'ready' ? 'is-ready' : ''} /></div>
        {state === 'idle' && <p className="module-empty">{c.empty}</p>}
        {(state === 'running' || state === 'clearing') && <div className="scan-loader" aria-label={state === 'running' ? c.running : c.clearing}><i /><i /><i /><i /></div>}
        {state === 'cleared' && <p className="module-empty">{c.cleared}</p>}
        {state === 'error' && <p className="module-error">{c.failed}</p>}
        {state === 'ready' && result && (
          <>
            <dl className="metric-grid vault-metrics">
              <div><dt>{c.records}</dt><dd>{result.records.toLocaleString(locale)}</dd></div>
              <div><dt>{c.write}</dt><dd>{result.writeMs.toFixed(2)} <small>ms</small></dd></div>
              <div><dt>{c.query}</dt><dd>{result.queryMs.toFixed(2)} <small>ms</small></dd></div>
              <div><dt>{c.matches}</dt><dd>{result.indexedMatches.toLocaleString(locale)}</dd></div>
              <div><dt>{c.storage}</dt><dd>{storageMode}</dd></div>
              <div><dt>{c.used}</dt><dd>{formatBytes(result.usageBytes, locale)}</dd></div>
            </dl>
            <p className="telemetry-foot">INDEX: band · KEY PATH: id · DATABASE VERSION: 1 · QUOTA: {formatBytes(result.quotaBytes, locale)}</p>
          </>
        )}
      </div>
    </div>
  );
}
