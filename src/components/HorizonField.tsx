import { useEffect, useRef, useState } from 'react';
import type { Locale } from '../data/content';
import { startHorizonField, type RenderMode } from '../engine/horizon-field';

const labels: Record<Locale, Record<RenderMode | 'boot' | 'paused', string>> = {
  en: {
    boot: 'RENDER / NEGOTIATING',
    webgpu: 'RENDER / WEBGPU LIVE',
    canvas: 'RENDER / CANVAS FALLBACK',
    static: 'RENDER / REDUCED MOTION',
    paused: 'RENDER / PAUSED',
  },
  uk: {
    boot: 'RENDER / УЗГОДЖЕННЯ',
    webgpu: 'RENDER / WEBGPU LIVE',
    canvas: 'RENDER / CANVAS FALLBACK',
    static: 'RENDER / МЕНШЕ РУХУ',
    paused: 'RENDER / ПРИЗУПИНЕНО',
  },
};

const motionLabels: Record<Locale, { pause: string; resume: string }> = {
  en: { pause: 'Pause background motion', resume: 'Resume background motion' },
  uk: { pause: 'Призупинити рух фону', resume: 'Відновити рух фону' },
};

export default function HorizonField({ locale }: { locale: Locale }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mode, setMode] = useState<RenderMode | 'boot'>('boot');
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || paused) return;

    let disposed = false;
    let stop: (() => void) | undefined;

    void startHorizonField(canvas, (nextMode) => {
      if (!disposed) setMode(nextMode);
    }).then((cleanup) => {
      if (disposed) cleanup();
      else stop = cleanup;
    });

    return () => {
      disposed = true;
      stop?.();
    };
  }, [paused]);

  return (
    <>
      <div className="horizon-field" aria-hidden="true">
        <canvas ref={canvasRef} />
        <span className="render-label">{labels[locale][paused ? 'paused' : mode]}</span>
      </div>
      {mode !== 'static' && (
        <button
          className="motion-toggle"
          type="button"
          aria-pressed={paused}
          onClick={() => setPaused((current) => !current)}
        >
          <span aria-hidden="true">{paused ? '▶' : 'Ⅱ'}</span>
          {paused ? motionLabels[locale].resume : motionLabels[locale].pause}
        </button>
      )}
    </>
  );
}
