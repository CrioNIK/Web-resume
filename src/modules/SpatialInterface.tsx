import { useEffect, useMemo, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import type { Locale } from '../data/content';
import { startHorizonField, type RenderMode } from '../engine/horizon-field';

const nodes = [
  { id: 'brama', label: 'TableTop BRAMA', x: 18, y: 27, signal: 'PRODUCT / LIVE' },
  { id: 'localization', label: 'UA + PL upstream', x: 70, y: 19, signal: '23 / 23 MERGED' },
  { id: 'horizon', label: 'Horizon Lab', x: 58, y: 67, signal: 'SYSTEMS / OPEN' },
  { id: 'overlay', label: 'UA Overlay', x: 25, y: 72, signal: 'PROTOTYPE / PRIVATE' },
] as const;

type SpatialNode = (typeof nodes)[number];

function htmlInCanvasStatus(): boolean {
  if (typeof CanvasRenderingContext2D === 'undefined') return false;
  const prototype = CanvasRenderingContext2D.prototype as CanvasRenderingContext2D & {
    drawElementImage?: unknown;
  };
  return typeof prototype.drawElementImage === 'function';
}

const strings = {
  en: {
    eyebrow: 'HTML-IN-CANVAS / ACCESSIBLE CO-RENDER',
    title: 'Semantic controls inside a GPU spatial scene.',
    body: 'The canvas is decorative and hidden from assistive technology. Every spatial node is a real DOM button with focus, selection, text, and hit-testing, projected over the same scene coordinates.',
    proposal: 'HTML-in-Canvas dev-trial API',
    detected: 'detected — adapter available for manual Canary testing',
    unavailable: 'not exposed — production uses standards-based DOM/GPU layering',
    selected: 'Selected system',
    hint: 'Tab or arrow through the real DOM controls. The visual field never owns accessibility.',
  },
  uk: {
    eyebrow: 'HTML-IN-CANVAS / ДОСТУПНИЙ CO-RENDER',
    title: 'Семантичні контролери у просторовій GPU-сцені.',
    body: 'Canvas декоративний і прихований від assistive technology. Кожен просторовий вузол — справжня DOM-кнопка з фокусом, вибором, текстом і hit-testing, спроєктована на ті самі координати сцени.',
    proposal: 'HTML-in-Canvas dev-trial API',
    detected: 'виявлено — adapter доступний для ручного тесту в Canary',
    unavailable: 'не надано — production використовує стандартне DOM/GPU layering',
    selected: 'Обрана система',
    hint: 'Переміщуйтеся Tab між справжніми DOM-контролерами. Візуальне поле ніколи не керує доступністю.',
  },
} as const;

export default function SpatialInterface({ locale }: { locale: Locale }) {
  const c = strings[locale];
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selected, setSelected] = useState<SpatialNode>(nodes[0]);
  const [mode, setMode] = useState<RenderMode | 'boot'>('boot');
  const proposalAvailable = useMemo(htmlInCanvasStatus, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let disposed = false;
    let stop: (() => void) | undefined;
    void startHorizonField(canvas, (next) => {
      if (!disposed) setMode(next);
    }).then((cleanup) => {
      if (disposed) cleanup();
      else stop = cleanup;
    });
    return () => {
      disposed = true;
      stop?.();
    };
  }, []);

  return (
    <div className="spatial-module">
      <div className="module-copy spatial-copy">
        <p className="module-kicker">{c.eyebrow}</p>
        <h3>{c.title}</h3>
        <p>{c.body}</p>
        <p className="module-warning">
          {c.proposal}: {proposalAvailable ? c.detected : c.unavailable}.
        </p>
      </div>
      <div className="spatial-stage">
        <canvas ref={canvasRef} aria-hidden="true" />
        <span className="spatial-render-label" aria-hidden="true">RENDER / {mode.toUpperCase()}</span>
        <ol className="spatial-nodes" aria-label={c.title}>
          {nodes.map((node, index) => {
            const style = { '--node-x': `${node.x}%`, '--node-y': `${node.y}%` } as CSSProperties;
            return (
              <li key={node.id} style={style}>
                <button
                  type="button"
                  aria-pressed={selected.id === node.id}
                  onClick={() => setSelected(node)}
                  onFocus={() => setSelected(node)}
                >
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <strong>{node.label}</strong>
                  <small>{node.signal}</small>
                </button>
              </li>
            );
          })}
        </ol>
        <p className="spatial-selection" aria-live="polite">
          <span>{c.selected}</span>
          <strong>{selected.label}</strong>
          <small>{selected.signal}</small>
        </p>
      </div>
      <p className="spatial-hint">{c.hint}</p>
    </div>
  );
}
