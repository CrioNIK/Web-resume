import { lazy, startTransition, Suspense, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import { copy, type Locale } from '../data/content';

const RuntimePulse = lazy(() => import('../modules/RuntimePulse'));
const WasmForge = lazy(() => import('../modules/WasmForge'));
const SignalScience = lazy(() => import('../modules/SignalScience'));
const LocalAI = lazy(() => import('../modules/LocalAI'));
const SignalRun = lazy(() => import('../modules/SignalRun'));

type LabKey = 'pulse' | 'compute' | 'analytics' | 'ai' | 'game';

const modules: Record<LabKey, typeof RuntimePulse> = {
  pulse: RuntimePulse,
  compute: WasmForge,
  analytics: SignalScience,
  ai: LocalAI,
  game: SignalRun,
};

export default function LabDeck({ locale }: { locale: Locale }) {
  const [active, setActive] = useState<LabKey>('pulse');
  const c = copy[locale];
  const ActiveModule = modules[active];
  const keys = Object.keys(modules) as LabKey[];
  const tabRefs = useRef<Partial<Record<LabKey, HTMLButtonElement | null>>>({});

  const activateTab = (key: LabKey, moveFocus = false) => {
    startTransition(() => setActive(key));
    if (moveFocus) requestAnimationFrame(() => tabRefs.current[key]?.focus());
  };

  const handleTabKey = (event: KeyboardEvent<HTMLButtonElement>, key: LabKey) => {
    const currentIndex = keys.indexOf(key);
    let nextIndex: number | null = null;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') nextIndex = (currentIndex + 1) % keys.length;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') nextIndex = (currentIndex - 1 + keys.length) % keys.length;
    if (event.key === 'Home') nextIndex = 0;
    if (event.key === 'End') nextIndex = keys.length - 1;
    if (nextIndex === null) return;
    event.preventDefault();
    activateTab(keys[nextIndex], true);
  };

  return (
    <div className="lab-deck">
      <div className="lab-tabs" role="tablist" aria-label={c.labTitle} aria-orientation="horizontal">
        {keys.map((key) => {
          const [index, title, teaser] = c.labTabs[key];
          const selected = active === key;
          return (
            <button
              key={key}
              type="button"
              role="tab"
              id={`lab-tab-${key}`}
              aria-selected={selected}
              aria-controls={`lab-panel-${key}`}
              tabIndex={selected ? 0 : -1}
              ref={(node) => { tabRefs.current[key] = node; }}
              onClick={() => activateTab(key)}
              onKeyDown={(event) => handleTabKey(event, key)}
            >
              <span>{index}</span>
              <strong>{title}</strong>
              <small>{teaser}</small>
            </button>
          );
        })}
      </div>
      <div
        className="lab-panel"
        id={`lab-panel-${active}`}
        role="tabpanel"
        aria-labelledby={`lab-tab-${active}`}
        tabIndex={0}
      >
        <Suspense fallback={<div className="module-loading">MODULE / LOADING…</div>}>
          <ActiveModule locale={locale} />
        </Suspense>
      </div>
    </div>
  );
}
