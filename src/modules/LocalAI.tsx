import { useEffect, useMemo, useRef, useState } from 'react';
import type { Locale } from '../data/content';
import {
  expectedTextCapabilities,
  getBrowserLanguageModel,
  normalizeModelAvailability,
  type BrowserLanguageModelSession,
  type BrowserModelAvailability,
} from '../lib/browser-language-model';
import { buildOfflinePlan } from '../lib/planner';

const text = {
  en: {
    kicker: 'BROWSER AI / EXPERIMENTAL API / SAFE FALLBACK',
    title: 'Local horizon mapper',
    intro: 'Describe a product problem. The page negotiates a browser-provided LanguageModel with explicit language promises. Unsupported, failed, or cancelled sessions never become a hidden network fallback.',
    label: 'Problem signal', placeholder: 'Example: A multilingual analytics product that must feel instant on mobile…', run: 'Map the horizon', stop: 'Stop',
    running: 'MAPPING…', mode: 'MODE', nativeMode: 'BROWSER-PROVIDED MODEL', fallbackMode: 'LOCAL RULESET',
    system: 'You are a browser-provided product systems mapper. Return four concise, evidence-oriented steps. Never claim zero latency. Mention one fallback and one measurement.',
    availability: { unavailable: 'MODEL UNAVAILABLE', downloadable: 'MODEL DOWNLOADABLE', downloading: 'MODEL DOWNLOADING', available: 'MODEL AVAILABLE' },
    fallback: 'Deterministic offline planner', empty: 'No prompt has been processed. Nothing is sent to this site or stored by it.',
    error: 'The browser model could not complete, so the explicit offline planner was used.',
    cancelled: 'Browser model generation cancelled. No fallback was run.', download: 'Browser-owned model download',
  },
  uk: {
    kicker: 'BROWSER AI / ЕКСПЕРИМЕНТАЛЬНИЙ API / SAFE FALLBACK',
    title: 'Локальний horizon mapper',
    intro: 'Опиши продуктову проблему. Сторінка узгоджує browser-provided LanguageModel з явною мовною обіцянкою. Непідтримувана, невдала чи скасована сесія ніколи не стає прихованим network fallback.',
    label: 'Сигнал проблеми', placeholder: 'Наприклад: мультимовний аналітичний продукт, який має бути миттєвим на mobile…', run: 'Побудувати горизонт', stop: 'Зупинити',
    running: 'ПОБУДОВА…', mode: 'РЕЖИМ', nativeMode: 'BROWSER-PROVIDED MODEL', fallbackMode: 'ЛОКАЛЬНІ ПРАВИЛА',
    system: 'Ти — browser-provided мапер продуктових систем. Дай чотири стислих кроки, орієнтованих на докази. Не обіцяй нульову затримку. Згадай один fallback і одне вимірювання.',
    availability: { unavailable: 'МОДЕЛЬ НЕДОСТУПНА', downloadable: 'МОДЕЛЬ МОЖНА ЗАВАНТАЖИТИ', downloading: 'МОДЕЛЬ ЗАВАНТАЖУЄТЬСЯ', available: 'МОДЕЛЬ ДОСТУПНА' },
    fallback: 'Детермінований offline planner', empty: 'Prompt ще не оброблявся. Сайт нічого не надсилає й не зберігає.',
    error: 'Browser-модель не завершила роботу, тому використано явний offline planner.',
    cancelled: 'Генерацію browser-моделі скасовано. Fallback не запускався.', download: 'Завантаження моделі браузером',
  },
} as const;

function formatOfflinePlan(input: string, locale: Locale): string {
  const plan = buildOfflinePlan(input, locale);
  return `${plan.title}\n\n${plan.steps.map((step, index) => `${index + 1}. ${step}`).join('\n\n')}\n\n${plan.caveat}`;
}

export default function LocalAI({ locale }: { locale: Locale }) {
  const c = text[locale];
  const modelApi = useMemo(getBrowserLanguageModel, []);
  const [availability, setAvailability] = useState<BrowserModelAvailability>('unavailable');
  const [prompt, setPrompt] = useState('');
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [mode, setMode] = useState<'native' | 'fallback' | 'cancelled' | null>(null);
  const [answer, setAnswer] = useState('');
  const [fellBack, setFellBack] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const sessionRef = useRef<BrowserLanguageModelSession | null>(null);
  const capabilities = useMemo(() => expectedTextCapabilities(locale), [locale]);

  useEffect(() => {
    let active = true;
    if (!modelApi) return;
    void modelApi.availability(capabilities).then((value) => {
      if (active) setAvailability(normalizeModelAvailability(value));
    }).catch(() => {
      if (active) setAvailability('unavailable');
    });
    return () => { active = false; };
  }, [capabilities, modelApi]);

  useEffect(() => () => {
    abortRef.current?.abort();
    sessionRef.current?.destroy();
  }, []);

  const useFallback = (input: string) => {
    setAnswer(formatOfflinePlan(input, locale));
    setMode('fallback');
    setFellBack(true);
  };

  const run = async () => {
    const trimmed = prompt.trim();
    if (!trimmed) return;
    setRunning(true);
    setFellBack(false);
    setAnswer('');
    setMode(null);
    setProgress(0);

    if (modelApi && availability !== 'unavailable') {
      const controller = new AbortController();
      abortRef.current = controller;
      try {
        const session = await modelApi.create({
          ...capabilities,
          initialPrompts: [{ role: 'system', content: c.system }],
          signal: controller.signal,
          monitor(monitor) {
            monitor.addEventListener('downloadprogress', (event) => {
              const loaded = Math.max(0, Math.min(1, event.loaded ?? 0));
              setProgress(loaded);
              setAvailability(loaded < 1 ? 'downloading' : 'available');
            });
          },
        });
        sessionRef.current = session;
        let response = '';
        for await (const chunk of session.promptStreaming(trimmed.slice(0, 800), { signal: controller.signal })) {
          response += chunk;
          setAnswer(response);
        }
        setMode('native');
        setAvailability('available');
        return;
      } catch (reason) {
        if (controller.signal.aborted || (reason instanceof DOMException && reason.name === 'AbortError')) {
          setMode('cancelled');
          setAnswer(c.cancelled);
          return;
        }
        useFallback(trimmed);
        return;
      } finally {
        sessionRef.current?.destroy();
        sessionRef.current = null;
        abortRef.current = null;
        setRunning(false);
      }
    }

    useFallback(trimmed);
    setRunning(false);
  };

  const stop = () => {
    abortRef.current?.abort(new DOMException('Cancelled by user.', 'AbortError'));
    sessionRef.current?.destroy();
  };

  return (
    <div className="module-grid">
      <div className="module-copy">
        <p className="module-kicker">{c.kicker}</p>
        <h3>{c.title}</h3>
        <p>{c.intro}</p>
        <label className="prompt-control">
          <span>{c.label}</span>
          <textarea value={prompt} maxLength={800} placeholder={c.placeholder} onChange={(event) => setPrompt(event.target.value)} />
          <small>{prompt.length} / 800</small>
        </label>
        <div className="ai-actions">
          <button className="module-action" type="button" onClick={run} disabled={running || !prompt.trim()}>
            {running ? c.running : c.run}<span aria-hidden="true">↗</span>
          </button>
          {running && <button className="module-secondary" type="button" onClick={stop}>{c.stop}</button>}
        </div>
      </div>
      <div className="ai-output">
        <div className="telemetry-head">
          <span>{modelApi ? c.availability[availability] : c.fallback}</span>
          <i className={availability === 'available' ? 'is-ready' : ''} />
        </div>
        {availability === 'downloading' && <p className="telemetry-foot">{c.download} / {Math.round(progress * 100)}%</p>}
        {!answer && <p className="module-empty">{c.empty}</p>}
        {fellBack && <p className="module-warning">{c.error}</p>}
        {answer && <pre>{answer}</pre>}
        <p className="sr-only" aria-live="polite">{mode === 'cancelled' ? c.cancelled : mode ? `${c.mode}: ${mode}` : ''}</p>
        {mode && <p className="telemetry-foot">{c.mode} / {mode === 'native' ? c.nativeMode : mode === 'fallback' ? c.fallbackMode : 'CANCELLED'}</p>}
      </div>
    </div>
  );
}
