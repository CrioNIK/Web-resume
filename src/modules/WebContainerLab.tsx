import { useMemo, useState } from 'react';
import type { WebContainer, WebContainerProcess } from '@webcontainer/api';
import type { Locale } from '../data/content';
import { evaluateWebContainerGate } from '../lib/webcontainer-gate';

let containerPromise: Promise<WebContainer> | null = null;

async function getContainer(): Promise<WebContainer> {
  if (!containerPromise) {
    containerPromise = import('@webcontainer/api').then(({ WebContainer }) => (
      WebContainer.boot({ coep: 'require-corp' })
    ));
  }
  return containerPromise;
}

async function runNodeServer(): Promise<{ output: string; elapsedMs: number }> {
  const started = performance.now();
  const container = await getContainer();
  await container.mount({
    'package.json': {
      file: { contents: '{"name":"horizon-tab-runtime","type":"module","private":true}' },
    },
    'index.mjs': {
      file: {
        contents: [
          "import { createServer } from 'node:http';",
          "const payload = JSON.stringify({ runtime: process.release.name, version: process.version, isolation: 'tab' });",
          "createServer((_, response) => { response.writeHead(200, { 'content-type': 'application/json' }); response.end(payload); }).listen(3111);",
        ].join('\n'),
      },
    },
  });

  let process: WebContainerProcess | null = null;
  const server = new Promise<string>((resolve) => {
    const unsubscribe = container.on('server-ready', (port, url) => {
      if (port !== 3111) return;
      unsubscribe();
      resolve(url);
    });
  });

  process = await container.spawn('node', ['index.mjs']);
  try {
    const url = await Promise.race([
      server,
      new Promise<never>((_, reject) => setTimeout(() => reject(new Error('Node server boot timed out.')), 12_000)),
    ]);
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Node server returned HTTP ${response.status}.`);
    return { output: await response.text(), elapsedMs: performance.now() - started };
  } finally {
    process.kill();
  }
}

const strings = {
  en: {
    eyebrow: 'WEBCONTAINERS / NODE IN A TAB',
    title: 'A real Node server, behind a real license gate.',
    body: 'The adapter mounts a deterministic two-file project, starts node:http inside the browser, requests its preview URL, then terminates the process. It never mounts this repository, credentials, or user code.',
    run: 'Boot isolated Node server',
    running: 'BOOTING WEB CONTAINER…',
    license: 'Production boot is disabled until a StackBlitz commercial-use license is explicitly configured. The implementation and local POC remain testable with VITE_ENABLE_WEBCONTAINER_POC=true.',
    https: 'WebContainers require a secure HTTPS context.',
    isolation: 'This response is not cross-origin isolated. Local POC needs COOP same-origin and COEP require-corp.',
    memory: 'SharedArrayBuffer is unavailable in this browser context.',
    ready: 'All runtime prerequisites are present.',
    empty: 'No WebContainer booted. Initial-route and idle network cost: 0 bytes.',
  },
  uk: {
    eyebrow: 'WEBCONTAINERS / NODE У ВКЛАДЦІ',
    title: 'Справжній Node-сервер за справжнім license gate.',
    body: 'Адаптер монтує детермінований проєкт із двох файлів, запускає node:http у браузері, запитує preview URL і завершує процес. Репозиторій, секрети та код користувача не монтуються.',
    run: 'Запустити ізольований Node-сервер',
    running: 'ЗАПУСК WEB CONTAINER…',
    license: 'Production-запуск вимкнено, доки явно не налаштовано ліцензію StackBlitz для комерційного використання. Реалізацію й локальний POC можна перевірити з VITE_ENABLE_WEBCONTAINER_POC=true.',
    https: 'WebContainers потребують захищеного HTTPS-контексту.',
    isolation: 'Відповідь не має cross-origin isolation. Локальний POC потребує COOP same-origin та COEP require-corp.',
    memory: 'SharedArrayBuffer недоступний у цьому контексті браузера.',
    ready: 'Усі передумови runtime виконані.',
    empty: 'WebContainer не запускався. Вартість стартового маршруту й idle network: 0 байтів.',
  },
} as const;

export default function WebContainerLab({ locale }: { locale: Locale }) {
  const c = strings[locale];
  const [status, setStatus] = useState<'idle' | 'running' | 'ready' | 'error'>('idle');
  const [output, setOutput] = useState('');
  const [elapsed, setElapsed] = useState(0);
  const gate = useMemo(() => evaluateWebContainerGate({
    enabled: import.meta.env.VITE_ENABLE_WEBCONTAINER_POC === 'true',
    secureContext: window.isSecureContext,
    crossOriginIsolated: globalThis.crossOriginIsolated,
    sharedArrayBuffer: typeof SharedArrayBuffer !== 'undefined',
  }), []);
  const gateMessage = gate.ready ? c.ready : {
    license: c.license,
    https: c.https,
    isolation: c.isolation,
    'shared-memory': c.memory,
  }[gate.reason];

  const run = async () => {
    if (!gate.ready) return;
    setStatus('running');
    setOutput('');
    try {
      const result = await runNodeServer();
      setOutput(result.output);
      setElapsed(result.elapsedMs);
      setStatus('ready');
    } catch (reason) {
      setOutput(reason instanceof Error ? reason.message : String(reason));
      setStatus('error');
    }
  };

  return (
    <div className="module-grid webcontainer-module">
      <div className="module-copy">
        <p className="module-kicker">{c.eyebrow}</p>
        <h3>{c.title}</h3>
        <p>{c.body}</p>
        <button className="module-action" type="button" onClick={run} disabled={!gate.ready || status === 'running'}>
          {status === 'running' ? c.running : c.run}
        </button>
        <p className="module-warning">{gateMessage}</p>
      </div>
      <div className="telemetry-card webcontainer-output" aria-live="polite">
        <div className="telemetry-head">
          <span>NODE / TAB</span>
          <span><i className={status === 'ready' ? 'is-ready' : ''} /> {status.toUpperCase()}</span>
        </div>
        {status === 'idle' && <p className="module-empty">{c.empty}</p>}
        {status === 'running' && <div className="scan-loader" aria-label={c.running}><i /><i /><i /><i /></div>}
        {(status === 'ready' || status === 'error') && (
          <pre>{output}{status === 'ready' ? `\n\nboot + request: ${elapsed.toFixed(1)} ms` : ''}</pre>
        )}
      </div>
    </div>
  );
}
