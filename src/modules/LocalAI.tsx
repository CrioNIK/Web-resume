import { useMemo, useState } from 'react';
import type { Locale } from '../data/content';
import { buildOfflinePlan } from '../lib/planner';

interface LanguageModelSession {
  prompt(input: string): Promise<string>;
  destroy?(): void;
}

interface LanguageModelApi {
  availability?(): Promise<string>;
  create(options?: Record<string, unknown>): Promise<LanguageModelSession>;
}

const text = {
  en: {
    kicker: 'ON-DEVICE AI / EXPERIMENTAL API / SAFE FALLBACK',
    title: 'Local horizon mapper',
    intro: 'Describe a product problem. If this browser exposes its experimental on-device LanguageModel API, the session stays browser-owned. Otherwise a deterministic offline planner answers and says exactly what it is.',
    label: 'Problem signal', placeholder: 'Example: A multilingual analytics product that must feel instant on mobile…', run: 'Map the horizon',
    running: 'MAPPING…', mode: 'MODE', nativeMode: 'BROWSER LANGUAGE MODEL', fallbackMode: 'LOCAL RULESET',
    system: 'You are an on-device product systems mapper. Return four concise, evidence-oriented steps. Never claim zero latency. Mention one fallback and one measurement.',
    ready: 'Browser-native model detected', fallback: 'Deterministic offline planner', empty: 'No prompt has been processed. Nothing is sent to this site or stored by it.',
    error: 'The browser model could not start, so the explicit offline planner was used.',
  },
  uk: {
    kicker: 'ON-DEVICE AI / EXPERIMENTAL API / SAFE FALLBACK',
    title: 'Локальний horizon mapper',
    intro: 'Опиши продуктову проблему. Якщо браузер надає експериментальний on-device LanguageModel API, сесія лишається під контролем браузера. Інакше відповідає детермінований offline planner і прямо називає себе.',
    label: 'Сигнал проблеми', placeholder: 'Наприклад: мультимовний аналітичний продукт, який має бути миттєвим на mobile…', run: 'Побудувати горизонт',
    running: 'ПОБУДОВА…', mode: 'РЕЖИМ', nativeMode: 'БРАУЗЕРНА МОВНА МОДЕЛЬ', fallbackMode: 'ЛОКАЛЬНІ ПРАВИЛА',
    system: 'Ти — локальний мапер продуктових систем. Дай чотири стислих кроки, орієнтованих на докази. Не обіцяй нульову затримку. Згадай один fallback і одне вимірювання.',
    ready: 'Виявлено browser-native модель', fallback: 'Детермінований offline planner', empty: 'Prompt ще не оброблявся. Сайт нічого не надсилає й не зберігає.',
    error: 'Browser-модель не запустилася, тому використано явний offline planner.',
  },
};

function getLanguageModel(): LanguageModelApi | null {
  const candidate = (globalThis as unknown as { LanguageModel?: LanguageModelApi }).LanguageModel;
  return candidate?.create ? candidate : null;
}

export default function LocalAI({ locale }: { locale: Locale }) {
  const c = text[locale];
  const modelApi = useMemo(getLanguageModel, []);
  const [prompt, setPrompt] = useState('');
  const [running, setRunning] = useState(false);
  const [mode, setMode] = useState<'native' | 'fallback' | null>(null);
  const [answer, setAnswer] = useState('');
  const [fellBack, setFellBack] = useState(false);

  const run = async () => {
    const trimmed = prompt.trim();
    if (!trimmed) return;
    setRunning(true);
    setFellBack(false);

    if (modelApi) {
      let session: LanguageModelSession | undefined;
      try {
        const availability = await modelApi.availability?.();
        if (availability && ['unavailable', 'no'].includes(availability)) throw new Error('Unavailable');
        session = await modelApi.create({
          initialPrompts: [{
            role: 'system',
            content: c.system,
          }],
        });
        const response = await session.prompt(trimmed.slice(0, 800));
        setAnswer(response);
        setMode('native');
        setRunning(false);
        return;
      } catch {
        setFellBack(true);
      } finally {
        session?.destroy?.();
      }
    }

    const plan = buildOfflinePlan(trimmed, locale);
    setAnswer(`${plan.title}\n\n${plan.steps.map((step, index) => `${index + 1}. ${step}`).join('\n\n')}\n\n${plan.caveat}`);
    setMode('fallback');
    setRunning(false);
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
        <button className="module-action" type="button" onClick={run} disabled={running || !prompt.trim()}>
          {running ? c.running : c.run}<span aria-hidden="true">↗</span>
        </button>
      </div>
      <div className="ai-output" aria-live="polite">
        <div className="telemetry-head">
          <span>{modelApi ? c.ready : c.fallback}</span>
          <i className={modelApi ? 'is-ready' : ''} />
        </div>
        {!answer && <p className="module-empty">{c.empty}</p>}
        {fellBack && <p className="module-warning">{c.error}</p>}
        {answer && <pre>{answer}</pre>}
        {mode && <p className="telemetry-foot">{c.mode} / {mode === 'native' ? c.nativeMode : c.fallbackMode}</p>}
      </div>
    </div>
  );
}
