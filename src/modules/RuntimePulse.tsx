import { useState } from 'react';
import { copy, type Locale } from '../data/content';

interface PulseResponse {
  ok: boolean;
  observedAt: string;
  timing: { handlerPreparationNanoseconds: number };
  runtime: { language: string; version: string; operatingSystem: string; architecture: string };
  capabilities: { persistence: boolean; visitorTracking: boolean };
  signal: { values: number[]; kind: string };
}

interface PulseResult {
  data: PulseResponse;
  roundTripMs: number;
  serverTiming: string;
}

export default function RuntimePulse({ locale }: { locale: Locale }) {
  const labels = copy[locale].runtimeLabels;
  const [state, setState] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle');
  const [result, setResult] = useState<PulseResult | null>(null);

  const ping = async () => {
    setState('loading');
    const started = performance.now();
    try {
      const response = await fetch('/api/pulse', {
        cache: 'no-store',
        headers: { Accept: 'application/json' },
        signal: AbortSignal.timeout(8_000),
      });
      if (!response.ok) throw new Error(`Pulse responded with ${response.status}`);
      const data = await response.json() as PulseResponse;
      setResult({
        data,
        roundTripMs: performance.now() - started,
        serverTiming: response.headers.get('server-timing') ?? 'not exposed',
      });
      setState('ready');
    } catch {
      setResult(null);
      setState('error');
    }
  };

  const points = result?.data.signal.values
    .map((value, index, values) => `${(index / Math.max(values.length - 1, 1)) * 100},${38 - (value / 1000) * 32}`)
    .join(' ');

  return (
    <div className="module-grid">
      <div className="module-copy">
        <p className="module-kicker">GO / VERCEL FUNCTION / BETA</p>
        <h3>{labels.title}</h3>
        <p>{labels.intro}</p>
        <button className="module-action" type="button" onClick={ping} disabled={state === 'loading'}>
          {state === 'loading' ? labels.loading : labels.action}<span aria-hidden="true">↗</span>
        </button>
        <p className="module-disclaimer">{labels.disclaimer}</p>
      </div>
      <div className="telemetry-card" aria-live="polite">
        <div className="telemetry-head"><span>{labels.telemetry}</span><i className={state === 'ready' ? 'is-ready' : ''} /></div>
        {state === 'idle' && <p className="module-empty">{labels.pending}</p>}
        {state === 'loading' && <div className="scan-loader" aria-label={labels.loadingLabel}><i /><i /><i /><i /></div>}
        {state === 'error' && <p className="module-error">{labels.failed}</p>}
        {state === 'ready' && result && (
          <>
            <dl className="metric-grid">
              <div><dt>{labels.rtt}</dt><dd>{result.roundTripMs.toFixed(2)} <small>ms</small></dd></div>
              <div><dt>{labels.server}</dt><dd>{(result.data.timing.handlerPreparationNanoseconds / 1_000_000).toFixed(3)} <small>ms</small></dd></div>
              <div><dt>{labels.runtime}</dt><dd>{result.data.runtime.language.toUpperCase()} <small>{result.data.runtime.version}</small></dd></div>
              <div><dt>{labels.cache}</dt><dd>NO-STORE</dd></div>
            </dl>
            <svg className="signal-plot" viewBox="0 0 100 40" role="img" aria-label={labels.signalLabel}>
              <path d="M0 39H100M0 20H100M0 1H100" />
              <polyline points={points} />
            </svg>
            <p className="telemetry-foot">{result.serverTiming} · {new Date(result.data.observedAt).toLocaleTimeString(locale)}</p>
          </>
        )}
      </div>
    </div>
  );
}
