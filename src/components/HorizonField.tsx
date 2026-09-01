import { useEffect, useRef, useState } from 'react';
import type { Locale } from '../data/content';
import { startHorizonField, type RenderMode } from '../engine/horizon-field';

const labels: Record<Locale, Record<RenderMode | 'boot', string>> = {
  en: {
    boot: 'RENDER / NEGOTIATING',
    webgpu: 'RENDER / WEBGPU LIVE',
    canvas: 'RENDER / CANVAS FALLBACK',
    static: 'RENDER / REDUCED MOTION',
  },
  uk: {
    boot: 'RENDER / УЗГОДЖЕННЯ',
    webgpu: 'RENDER / WEBGPU LIVE',
    canvas: 'RENDER / CANVAS FALLBACK',
    static: 'RENDER / МЕНШЕ РУХУ',
  },
};

export default function HorizonField({ locale }: { locale: Locale }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mode, setMode] = useState<RenderMode | 'boot'>('boot');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

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
  }, []);

  return (
    <div className="horizon-field" aria-hidden="true">
      <canvas ref={canvasRef} />
      <span className="render-label">{labels[locale][mode]}</span>
    </div>
  );
}
