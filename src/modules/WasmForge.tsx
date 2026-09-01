import { useEffect, useRef, useState } from 'react';
import type { Locale } from '../data/content';
import type {
  HorizonComputeRequest,
  HorizonComputeResult,
  HorizonComputeWorkerResponse,
} from '../engine/horizon-compute';

const WORKER_TIMEOUT_MS = 30_000;

function runComputeWorker(request: HorizonComputeRequest, signal: AbortSignal): Promise<HorizonComputeResult> {
  return new Promise((resolve, reject) => {
    const worker = new Worker(new URL('../workers/horizon-compute.worker.ts', import.meta.url), {
      type: 'module',
      name: 'horizon-compute',
    });
    let settled = false;
    const timeout = window.setTimeout(() => finish(reject, new Error('Compute worker timed out.')), WORKER_TIMEOUT_MS);

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

    const abort = () => finish(reject, new DOMException('Compute cancelled.', 'AbortError'));

    worker.onmessage = (event: MessageEvent<HorizonComputeWorkerResponse>) => {
      if (event.data.type === 'result') {
        finish(resolve, event.data.result);
      } else {
        finish(reject, new Error(event.data.message));
      }
    };
    worker.onerror = (event) => {
      event.preventDefault();
      finish(reject, new Error(event.message || 'Compute worker failed.'));
    };
    worker.onmessageerror = () => finish(reject, new Error('Compute worker returned an unreadable response.'));
    signal.addEventListener('abort', abort, { once: true });
    worker.postMessage(request);
  });
}

const text = {
  en: {
    kicker: 'RUST / WEBASSEMBLY / DETERMINISTIC',
    title: 'Field compute forge',
    intro: 'Generate a seeded particle field and advance it through 90 simulation steps in a dedicated worker. Identical inputs stay repeatable within each runtime.',
    action: 'Run compute kernel',
    retry: 'Retry compute kernel',
    running: 'COMPUTING…',
    note: 'Every run gets a fresh module worker, terminated after it replies. It loads Rust/WASM at runtime; if that fails, the same worker runs an explicitly labelled fixed-point JavaScript fallback.',
    empty: 'Kernel cold. Start a run to capture real timing on this device.',
    failure: 'The worker could not start either runtime. Retry creates a new worker.',
    runtime: 'Runtime', particles: 'Particles', steps: 'Steps', duration: 'Device time', checksum: 'Checksum', speed: 'Mean speed',
  },
  uk: {
    kicker: 'RUST / WEBASSEMBLY / ДЕТЕРМІНОВАНО',
    title: 'Forge обчислювального поля',
    intro: 'Створи seeded particle field і проведи його через 90 кроків симуляції в окремому worker. Однакові inputs повторюються в межах кожного runtime.',
    action: 'Запустити compute kernel',
    retry: 'Повторити compute kernel',
    running: 'ОБЧИСЛЕННЯ…',
    note: 'Кожен запуск отримує новий module worker, який завершується після відповіді. Він завантажує Rust/WASM у runtime; якщо це не вдається, той самий worker запускає явно позначений fixed-point JavaScript fallback.',
    empty: 'Kernel холодний. Запусти його, щоб виміряти реальний час на цьому пристрої.',
    failure: 'Worker не зміг запустити жоден runtime. Повторна спроба створить новий worker.',
    runtime: 'Runtime', particles: 'Частинки', steps: 'Кроки', duration: 'Час пристрою', checksum: 'Checksum', speed: 'Середня швидкість',
  },
};

export default function WasmForge({ locale }: { locale: Locale }) {
  const c = text[locale];
  const activeRun = useRef<AbortController | null>(null);
  const [particles, setParticles] = useState(12_000);
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<HorizonComputeResult | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => () => {
    activeRun.current?.abort();
  }, []);

  const run = async () => {
    activeRun.current?.abort();
    const controller = new AbortController();
    activeRun.current = controller;
    setRunning(true);
    setFailed(false);
    setResult(null);

    try {
      const next = await runComputeWorker({ seed: 0xc01dba5e, particles, steps: 90 }, controller.signal);
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
        <label className="range-control">
          <span>{c.particles}<strong>{particles.toLocaleString(locale)}</strong></span>
          <input type="range" min="2000" max="30000" step="2000" value={particles} onChange={(event) => setParticles(Number(event.target.value))} />
        </label>
        <button className="module-action" type="button" onClick={run} disabled={running}>
          {running ? c.running : failed ? c.retry : c.action}<span aria-hidden="true">↗</span>
        </button>
        <p className="module-disclaimer">{c.note}</p>
      </div>
      <div className="compute-card" aria-live="polite">
        <div className="telemetry-head"><span>FIELD / 0xC01DBA5E</span><i className={result ? 'is-ready' : ''} /></div>
        {!result && <p className="module-empty">{failed ? c.failure : c.empty}</p>}
        {result && (
          <dl className="compute-output">
            <div><dt>{c.runtime}</dt><dd>{result.runtime}</dd></div>
            <div><dt>{c.particles}</dt><dd>{result.particles.toLocaleString(locale)}</dd></div>
            <div><dt>{c.steps}</dt><dd>{result.steps}</dd></div>
            <div className="output-hero"><dt>{c.duration}</dt><dd>{result.duration.toFixed(2)} <small>ms</small></dd></div>
            <div><dt>{c.checksum}</dt><dd>0x{result.checksum.toString(16).toUpperCase().padStart(8, '0')}</dd></div>
            {result.meanSpeed !== undefined && <div><dt>{c.speed}</dt><dd>{result.meanSpeed.toFixed(3)}</dd></div>}
          </dl>
        )}
        {result && <p className="telemetry-foot">ENGINE / {result.version}{result.fallbackReason ? ` / ${result.fallbackReason}` : ''}</p>}
      </div>
    </div>
  );
}
