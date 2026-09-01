import { useState } from 'react';
import type { Locale } from '../data/content';

type ImportShim = (
  specifier: string,
  options?: { lang?: 'ts' },
) => Promise<Record<string, unknown>>;

type RuntimeGlobal = typeof globalThis & {
  importShim?: ImportShim;
  esmsInitOptions?: Record<string, unknown>;
};

interface ExperimentResult {
  checksum: number;
  strongest: string;
  samples: number;
}

interface RunReport extends ExperimentResult {
  runtimeMs: number;
  stripAndExecuteMs: number;
}

let runtimePromise: Promise<number> | null = null;

function loadRuntime(): Promise<number> {
  if (runtimePromise) return runtimePromise;
  runtimePromise = new Promise((resolve, reject) => {
    const runtime = globalThis as RuntimeGlobal;
    if (runtime.importShim) {
      resolve(0);
      return;
    }

    const started = performance.now();
    runtime.esmsInitOptions = {
      shimMode: true,
      noLoadEventRetriggers: true,
      onerror: (error: unknown) => { throw error; },
    };
    const script = document.createElement('script');
    script.async = true;
    script.src = '/vendor/es-module-shims/es-module-shims.js';
    script.dataset.horizonRuntime = 'typescript';
    script.addEventListener('load', () => {
      if (!runtime.importShim) {
        reject(new Error('ES Module Shims loaded without exposing importShim().'));
        return;
      }
      resolve(performance.now() - started);
    }, { once: true });
    script.addEventListener('error', () => {
      runtimePromise = null;
      reject(new Error('The self-hosted TypeScript runtime could not be loaded.'));
    }, { once: true });
    document.head.append(script);
  });
  return runtimePromise;
}

function isExperimentResult(value: unknown): value is ExperimentResult {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as Partial<ExperimentResult>;
  return typeof candidate.checksum === 'number'
    && typeof candidate.strongest === 'string'
    && typeof candidate.samples === 'number';
}

const strings = {
  en: {
    eyebrow: 'BROWSER TYPESCRIPT / INTENT-GATED',
    title: 'Strip and execute TypeScript in this tab.',
    body: 'ES Module Shims 2.8.4 fetches its self-hosted Amaro transformer only after this action. The source stays TypeScript until the browser requests it.',
    action: 'Run browser TypeScript',
    running: 'LOADING 4.8 MB TRANSFORMER…',
    empty: 'No runtime downloaded. Initial-route cost: 0 bytes.',
    boundary: 'Strip-only, not type-checking. ESMS currently embeds Amaro 0.5.3 / TypeScript 5.8 grammar; project CI separately uses TypeScript 7 and Amaro 1.1.11.',
    runtime: 'Runtime load',
    execute: 'Strip + execute',
    result: 'Typed result',
  },
  uk: {
    eyebrow: 'TYPESCRIPT У БРАУЗЕРІ / ЛИШЕ ЗА ЗАПИТОМ',
    title: 'Видалити типи й виконати TypeScript у цій вкладці.',
    body: 'ES Module Shims 2.8.4 завантажує локальний Amaro transformer лише після цієї дії. Код залишається TypeScript до запиту браузера.',
    action: 'Запустити TypeScript у браузері',
    running: 'ЗАВАНТАЖЕННЯ TRANSFORMER 4.8 MB…',
    empty: 'Runtime не завантажено. Вартість стартового маршруту: 0 байтів.',
    boundary: 'Лише strip-only, без перевірки типів. ESMS зараз містить Amaro 0.5.3 / граматику TypeScript 5.8; CI проєкту окремо використовує TypeScript 7 та Amaro 1.1.11.',
    runtime: 'Завантаження runtime',
    execute: 'Strip + виконання',
    result: 'Типізований результат',
  },
} as const;

export default function BrowserTypeScript({ locale }: { locale: Locale }) {
  const c = strings[locale];
  const [state, setState] = useState<'idle' | 'running' | 'ready' | 'error'>('idle');
  const [report, setReport] = useState<RunReport | null>(null);
  const [error, setError] = useState('');

  const run = async () => {
    setState('running');
    setError('');
    try {
      const runtimeMs = await loadRuntime();
      const runtime = globalThis as RuntimeGlobal;
      if (!runtime.importShim) throw new Error('importShim() is unavailable.');
      const started = performance.now();
      const module = await runtime.importShim(
        `/experiments/horizon-runtime.ts?run=${Date.now()}`,
        { lang: 'ts' },
      );
      const entry = module.runHorizonExperiment;
      if (typeof entry !== 'function') throw new Error('Typed experiment export is missing.');
      const value: unknown = entry();
      if (!isExperimentResult(value)) throw new Error('Typed experiment returned an invalid result.');
      setReport({ ...value, runtimeMs, stripAndExecuteMs: performance.now() - started });
      setState('ready');
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : String(reason));
      setState('error');
    }
  };

  return (
    <div className="module-grid browser-ts-module">
      <div className="module-copy">
        <p className="module-kicker">{c.eyebrow}</p>
        <h3>{c.title}</h3>
        <p>{c.body}</p>
        <button className="module-action" type="button" onClick={run} disabled={state === 'running'}>
          {state === 'running' ? c.running : c.action}
        </button>
        <p className="module-warning">{c.boundary}</p>
      </div>
      <div className="telemetry-card browser-ts-output" aria-live="polite">
        <div className="telemetry-head">
          <span>ESMS / AMARO</span>
          <span><i className={state === 'ready' ? 'is-ready' : ''} /> {state.toUpperCase()}</span>
        </div>
        {state === 'idle' && <p className="module-empty">{c.empty}</p>}
        {state === 'running' && <div className="scan-loader" aria-label={c.running}><i /><i /><i /><i /></div>}
        {state === 'error' && <p className="module-error">{error}</p>}
        {report && state === 'ready' && (
          <dl className="metric-grid">
            <div><dt>{c.runtime}</dt><dd>{report.runtimeMs.toFixed(1)} <small>ms</small></dd></div>
            <div><dt>{c.execute}</dt><dd>{report.stripAndExecuteMs.toFixed(1)} <small>ms</small></dd></div>
            <div><dt>{c.result}</dt><dd>{report.checksum}</dd></div>
            <div><dt>STRONGEST / SAMPLES</dt><dd>{report.strongest} / {report.samples}</dd></div>
          </dl>
        )}
      </div>
    </div>
  );
}
