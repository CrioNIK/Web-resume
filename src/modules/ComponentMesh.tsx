import { useEffect, useRef, useState } from 'react';
import type { Locale } from '../data/content';
import type {
  ComponentMeshRequest,
  ComponentMeshResult,
  ComponentMeshWorkerResponse,
} from '../lib/component-mesh';

const WORKER_TIMEOUT_MS = 20_000;
const DEMO_REQUEST: ComponentMeshRequest = {
  samples: [-500, 0, 250, 750, 1_500],
  floor: 0,
  ceiling: 1_000,
};

const text = {
  en: {
    kicker: 'WASM COMPONENT MODEL / RUST + GO / WIT 0.1.0',
    title: 'Component mesh',
    intro: 'A versioned WIT contract composes a Rust fixed-point normalizer with a Go FNV-1a checksum capability. The composed browser artifact is generated and tested in dedicated CI, outside the initial bundle.',
    run: 'Run browser fallback',
    retry: 'Retry browser fallback',
    running: 'SPAWNING WORKER…',
    note: 'This button does not pretend that browsers natively execute Component Model binaries. It starts a one-shot worker, runs the existing core Rust/WASM signal engine, and checks the same component contract with a TypeScript reference.',
    empty: 'No runtime result yet. The portable component artifact remains a CI output until it is deliberately promoted into the site.',
    failure: 'The one-shot worker failed. Retry starts a clean worker.',
    runtime: 'Browser runtime',
    artifact: 'Composed artifact',
    checksum: 'Go contract checksum',
    values: 'Normalized values',
    clamped: 'Clamped samples',
    duration: 'Device time',
    mean: 'Rust signal mean',
    artifactValue: 'CI-GENERATED / NOT IN BASE BUNDLE',
  },
  uk: {
    kicker: 'WASM COMPONENT MODEL / RUST + GO / WIT 0.1.0',
    title: 'Мережа компонентів',
    intro: 'Версійний WIT-контракт компонує Rust fixed-point normalizer із Go-capability для checksum FNV-1a. Скомпонований browser artifact генерується й тестується в окремому CI поза initial bundle.',
    run: 'Запустити browser fallback',
    retry: 'Повторити browser fallback',
    running: 'СТВОРЕННЯ WORKER…',
    note: 'Ця кнопка не вдає, що браузери нативно виконують Component Model binaries. Вона запускає one-shot worker, наявний core Rust/WASM signal engine і перевіряє той самий component contract через TypeScript reference.',
    empty: 'Результату runtime ще немає. Portable component artifact лишається CI-виходом, доки його свідомо не додадуть до сайту.',
    failure: 'One-shot worker не спрацював. Повторна спроба створить чистий worker.',
    runtime: 'Browser runtime',
    artifact: 'Скомпонований artifact',
    checksum: 'Checksum Go-контракту',
    values: 'Нормалізовані значення',
    clamped: 'Clamped samples',
    duration: 'Час пристрою',
    mean: 'Rust signal mean',
    artifactValue: 'CI-GENERATED / НЕ В BASE BUNDLE',
  },
} satisfies Record<Locale, Record<string, string>>;

function runWorker(signal: AbortSignal): Promise<ComponentMeshResult> {
  return new Promise((resolve, reject) => {
    const worker = new Worker(new URL('../workers/component-mesh.worker.ts', import.meta.url), {
      type: 'module',
      name: 'component-mesh',
    });
    let settled = false;
    const timeout = window.setTimeout(
      () => finish(reject, new Error('Component Mesh worker timed out.')),
      WORKER_TIMEOUT_MS,
    );

    const cleanup = () => {
      window.clearTimeout(timeout);
      signal.removeEventListener('abort', abort);
      worker.onmessage = null;
      worker.onerror = null;
      worker.onmessageerror = null;
      worker.terminate();
    };
    const finish = <T,>(callback: (value: T) => void, value: T) => {
      if (settled) return;
      settled = true;
      cleanup();
      callback(value);
    };
    const abort = () => finish(reject, new DOMException('Component Mesh cancelled.', 'AbortError'));

    worker.onmessage = (event: MessageEvent<ComponentMeshWorkerResponse>) => {
      if (event.data.type === 'result') finish(resolve, event.data.result);
      else finish(reject, new Error(event.data.message));
    };
    worker.onerror = (event) => {
      event.preventDefault();
      finish(reject, new Error(event.message || 'Component Mesh worker failed.'));
    };
    worker.onmessageerror = () => finish(reject, new Error('Component Mesh returned unreadable data.'));
    signal.addEventListener('abort', abort, { once: true });
    worker.postMessage(DEMO_REQUEST);
  });
}

export default function ComponentMesh({ locale }: { locale: Locale }) {
  const c = text[locale];
  const activeRun = useRef<AbortController | null>(null);
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<ComponentMeshResult | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => () => activeRun.current?.abort(), []);

  const execute = async () => {
    activeRun.current?.abort();
    const controller = new AbortController();
    activeRun.current = controller;
    setRunning(true);
    setResult(null);
    setFailed(false);

    try {
      const next = await runWorker(controller.signal);
      if (!controller.signal.aborted) setResult(next);
    } catch (error) {
      if (!(error instanceof DOMException && error.name === 'AbortError')) setFailed(true);
    } finally {
      if (activeRun.current === controller) {
        activeRun.current = null;
        if (!controller.signal.aborted) setRunning(false);
      }
    }
  };

  return (
    <div className="module-grid">
      <div className="module-copy">
        <p className="module-kicker">{c.kicker}</p>
        <h3>{c.title}</h3>
        <p>{c.intro}</p>
        <button className="module-action" type="button" onClick={execute} disabled={running}>
          {running ? c.running : failed ? c.retry : c.run}<span aria-hidden="true">↗</span>
        </button>
        <p className="module-disclaimer">{c.note}</p>
      </div>

      <div className="compute-card" aria-live="polite">
        <div className="telemetry-head">
          <span>COMPONENT / CRIOMANT:HORIZON@0.1.0</span>
          <i className={result ? 'is-ready' : ''} />
        </div>
        {!result && <p className="module-empty">{failed ? c.failure : c.empty}</p>}
        {result && (
          <dl className="compute-output">
            <div><dt>{c.runtime}</dt><dd>{result.runtime}</dd></div>
            <div><dt>{c.artifact}</dt><dd>{c.artifactValue}</dd></div>
            <div className="output-hero"><dt>{c.checksum}</dt><dd>0x{result.checksum.toString(16).toUpperCase().padStart(8, '0')}</dd></div>
            <div><dt>{c.values}</dt><dd>{result.values.join(' / ')}</dd></div>
            <div><dt>{c.clamped}</dt><dd>{result.clamped}</dd></div>
            <div><dt>{c.mean}</dt><dd>{result.mean.toFixed(2)}</dd></div>
            <div><dt>{c.duration}</dt><dd>{result.duration.toFixed(2)} <small>ms</small></dd></div>
          </dl>
        )}
        {result && (
          <p className="telemetry-foot">
            CORE ENGINE / {result.engineVersion ?? 'JS'}{result.fallbackReason ? ` / ${result.fallbackReason}` : ''}
          </p>
        )}
      </div>
    </div>
  );
}
