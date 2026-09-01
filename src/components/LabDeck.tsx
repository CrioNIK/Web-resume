import { lazy, startTransition, Suspense, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import { copy, type Locale } from '../data/content';

const RuntimePulse = lazy(() => import('../modules/RuntimePulse'));
const WasmForge = lazy(() => import('../modules/WasmForge'));
const SignalScience = lazy(() => import('../modules/SignalScience'));
const LocalAI = lazy(() => import('../modules/LocalAI'));
const SignalRun = lazy(() => import('../modules/SignalRun'));
const LocalVault = lazy(() => import('../modules/LocalVault'));
const BrowserTypeScript = lazy(() => import('../modules/BrowserTypeScript'));
const AgentTools = lazy(() => import('../modules/AgentTools'));
const SpatialInterface = lazy(() => import('../modules/SpatialInterface'));
const NeuralField = lazy(() => import('../modules/NeuralField'));
const WebContainerLab = lazy(() => import('../modules/WebContainerLab'));
const ComponentMesh = lazy(() => import('../modules/ComponentMesh'));

type LabKey = 'pulse' | 'compute' | 'analytics' | 'ai' | 'game' | 'database'
  | 'browser' | 'agent' | 'spatial' | 'neural' | 'container' | 'component';

const modules: Record<LabKey, typeof RuntimePulse> = {
  pulse: RuntimePulse,
  compute: WasmForge,
  analytics: SignalScience,
  ai: LocalAI,
  game: SignalRun,
  database: LocalVault,
  browser: BrowserTypeScript,
  agent: AgentTools,
  spatial: SpatialInterface,
  neural: NeuralField,
  container: WebContainerLab,
  component: ComponentMesh,
};

export default function LabDeck({ locale }: { locale: Locale }) {
  const [active, setActive] = useState<LabKey | null>(null);
  const c = copy[locale];
  const ActiveModule = active ? modules[active] : null;
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
      <div className="lab-tabs" role="group" aria-label={c.labTitle}>
        {keys.map((key) => {
          const [index, title, teaser] = c.labTabs[key];
          const selected = active === key;
          return (
            <button
              key={key}
              type="button"
              aria-pressed={selected}
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
        id="lab-panel"
        role="region"
        aria-label={active ? c.labTabs[active][1] : c.labTitle}
        tabIndex={0}
      >
        {ActiveModule ? (
          <Suspense fallback={<div className="module-loading">{c.moduleLoading}</div>}>
            <ActiveModule locale={locale} />
          </Suspense>
        ) : (
          <div className="lab-empty">
            <span>00 / 12</span>
            <p>{c.labEmpty}</p>
          </div>
        )}
      </div>
    </div>
  );
}
