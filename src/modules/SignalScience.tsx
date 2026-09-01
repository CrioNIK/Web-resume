import { useEffect, useRef, useState } from 'react';
import type { Locale } from '../data/content';
import type { AnalysisResult } from '../lib/analytics';

const text = {
  en: {
    kicker: 'DATA SCIENCE / MODULE WORKER / OLS',
    title: 'Signal science bench',
    intro: 'Create a deterministic noisy dataset, fit ordinary least squares, and calculate residual percentiles in a dedicated worker so the interface stays responsive.',
    size: 'Dataset size', noise: 'Noise', run: 'Generate + regress', running: 'ANALYZING…', empty: 'No dataset yet. Configure the signal and launch a worker job.',
    failed: 'The analytics worker could not complete this run. Try again or keep exploring the rest of the lab.',
    dataset: 'DATASET / FIXED SEED', plotLabel: 'Synthetic dataset and fitted regression line',
    slope: 'Slope', fit: 'R² fit', median: 'Median residual', p95: 'P95 residual', compute: 'Worker compute',
  },
  uk: {
    kicker: 'DATA SCIENCE / MODULE WORKER / OLS',
    title: 'Signal science bench',
    intro: 'Створи детермінований noisy dataset, побудуй ordinary least squares і порахуй residual percentiles в окремому worker, щоб інтерфейс не зависав.',
    size: 'Розмір датасету', noise: 'Шум', run: 'Згенерувати + регресія', running: 'АНАЛІЗ…', empty: 'Датасету ще немає. Налаштуй сигнал і запусти worker job.',
    failed: 'Аналітичний worker не завершив цей запуск. Спробуй ще раз або продовжуй досліджувати лабораторію.',
    dataset: 'ДАТАСЕТ / ФІКСОВАНИЙ SEED', plotLabel: 'Синтетичний датасет і лінія регресії',
    slope: 'Нахил', fit: 'Якість R²', median: 'Медіана похибки', p95: 'P95 похибки', compute: 'Worker-обчислення',
  },
};

export default function SignalScience({ locale }: { locale: Locale }) {
  const c = text[locale];
  const workerRef = useRef<Worker | null>(null);
  const jobRef = useRef(0);
  const [size, setSize] = useState(50_000);
  const [noise, setNoise] = useState(18);
  const [running, setRunning] = useState(false);
  const [failed, setFailed] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  useEffect(() => {
    const worker = new Worker(new URL('../workers/analytics.worker.ts', import.meta.url), { type: 'module' });
    workerRef.current = worker;
    worker.onmessage = (event: MessageEvent<{ jobId: number; result: AnalysisResult }>) => {
      if (event.data.jobId !== jobRef.current) return;
      setResult(event.data.result);
      setFailed(false);
      setRunning(false);
    };
    worker.onerror = () => {
      setFailed(true);
      setRunning(false);
    };
    return () => worker.terminate();
  }, []);

  const run = () => {
    const jobId = jobRef.current + 1;
    jobRef.current = jobId;
    setFailed(false);
    setRunning(true);
    if (!workerRef.current) {
      setFailed(true);
      setRunning(false);
      return;
    }
    workerRef.current.postMessage({ jobId, size, noise, seed: 0xc01dba5e });
  };

  const plot = result ? (() => {
    const yValues = result.points.map((point) => point.y);
    const minY = Math.min(...yValues);
    const maxY = Math.max(...yValues);
    const mapY = (value: number) => 94 - ((value - minY) / Math.max(maxY - minY, 1)) * 84;
    const dots = result.points.map((point) => ({ x: 6 + point.x * 0.88, y: mapY(point.y) }));
    const lineStart = mapY(result.intercept);
    const lineEnd = mapY(result.intercept + result.slope * 100);
    return { dots, lineStart, lineEnd };
  })() : null;

  return (
    <div className="module-grid">
      <div className="module-copy">
        <p className="module-kicker">{c.kicker}</p>
        <h3>{c.title}</h3>
        <p>{c.intro}</p>
        <label className="range-control">
          <span>{c.size}<strong>{size.toLocaleString(locale)}</strong></span>
          <input type="range" min="5000" max="200000" step="5000" value={size} onChange={(event) => setSize(Number(event.target.value))} />
        </label>
        <label className="range-control">
          <span>{c.noise}<strong>{noise}</strong></span>
          <input type="range" min="0" max="45" step="1" value={noise} onChange={(event) => setNoise(Number(event.target.value))} />
        </label>
        <button className="module-action" type="button" onClick={run} disabled={running}>
          {running ? c.running : c.run}<span aria-hidden="true">↗</span>
        </button>
      </div>
      <div className="science-card" aria-live="polite">
        <div className="telemetry-head"><span>{c.dataset}</span><i className={result ? 'is-ready' : ''} /></div>
        {failed && <p className="module-error">{c.failed}</p>}
        {!result && !failed && <p className="module-empty">{c.empty}</p>}
        {result && plot && (
          <>
            <svg className="science-plot" viewBox="0 0 100 100" role="img" aria-label={c.plotLabel}>
              <path d="M6 5V94H97" />
              {plot.dots.map((point, index) => <circle key={index} cx={point.x} cy={point.y} r="0.65" />)}
              <line x1="6" y1={plot.lineStart} x2="94" y2={plot.lineEnd} />
            </svg>
            <dl className="science-metrics">
              <div><dt>{c.slope}</dt><dd>{result.slope.toFixed(3)}</dd></div>
              <div><dt>{c.fit}</dt><dd>{result.rSquared.toFixed(4)}</dd></div>
              <div><dt>{c.median}</dt><dd>{result.medianResidual.toFixed(2)}</dd></div>
              <div><dt>{c.p95}</dt><dd>{result.p95Residual.toFixed(2)}</dd></div>
              <div><dt>{c.compute}</dt><dd>{result.computeMs.toFixed(2)} ms</dd></div>
            </dl>
          </>
        )}
      </div>
    </div>
  );
}
