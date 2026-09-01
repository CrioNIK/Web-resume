import { useCallback, useEffect, useRef, useState } from 'react';
import type { Locale } from '../data/content';

interface Point { x: number; y: number }

const columns = 12;
const rows = 7;

const text = {
  en: {
    kicker: 'CANVAS / INPUT LOOP / ZERO DEPENDENCIES', title: 'Signal run',
    intro: 'Collect eight unstable nodes. Use arrow keys, WASD, or the touch pad. The tiny loop renders directly to canvas and keeps its state local to this tab.',
    start: 'Start / reset run', score: 'Nodes', time: 'Time', status: 'Status', idle: 'Start the run', active: 'Signal is live', won: 'Horizon breached', ended: 'Run expired',
    controls: 'Game controls', up: 'Move up', left: 'Move left', down: 'Move down', right: 'Move right',
  },
  uk: {
    kicker: 'CANVAS / INPUT LOOP / ZERO DEPENDENCIES', title: 'Signal run',
    intro: 'Збери вісім нестабільних вузлів. Використовуй стрілки, WASD або сенсорну панель. Малий цикл рендериться прямо в canvas і зберігає стан лише в цій вкладці.',
    start: 'Старт / нова гра', score: 'Вузли', time: 'Час', status: 'Статус', idle: 'Запусти гру', active: 'Сигнал активний', won: 'Горизонт зламано', ended: 'Час вичерпано',
    controls: 'Керування грою', up: 'Рух угору', left: 'Рух ліворуч', down: 'Рух униз', right: 'Рух праворуч',
  },
};

function targetFor(score: number): Point {
  let state = (0xc01dba5e ^ (score * 0x9e3779b9)) >>> 0;
  state ^= state << 13; state ^= state >>> 17; state ^= state << 5;
  const x = (state >>> 0) % columns;
  state = (state * 1664525 + 1013904223) >>> 0;
  return { x, y: state % rows };
}

export default function SignalRun({ locale }: { locale: Locale }) {
  const c = text[locale];
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [player, setPlayer] = useState<Point>({ x: 2, y: 3 });
  const [target, setTarget] = useState<Point>(targetFor(0));
  const [score, setScore] = useState(0);
  const [seconds, setSeconds] = useState(30);
  const [status, setStatus] = useState<'idle' | 'active' | 'won' | 'ended'>('idle');

  const start = () => {
    setPlayer({ x: 2, y: 3 });
    setTarget(targetFor(0));
    setScore(0);
    setSeconds(30);
    setStatus('active');
  };

  const move = useCallback((dx: number, dy: number) => {
    if (status !== 'active') return;
    setPlayer((current) => {
      const next = {
        x: Math.max(0, Math.min(columns - 1, current.x + dx)),
        y: Math.max(0, Math.min(rows - 1, current.y + dy)),
      };
      if (next.x === target.x && next.y === target.y) {
        setScore((currentScore) => {
          const nextScore = currentScore + 1;
          if (nextScore >= 8) setStatus('won');
          else setTarget(targetFor(nextScore));
          return nextScore;
        });
      }
      return next;
    });
  }, [status, target]);

  useEffect(() => {
    if (status !== 'active') return;
    const interval = window.setInterval(() => {
      setSeconds((current) => {
        if (current <= 1) {
          setStatus('ended');
          return 0;
        }
        return current - 1;
      });
    }, 1000);
    return () => window.clearInterval(interval);
  }, [status]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const moves: Record<string, [number, number]> = {
        ArrowUp: [0, -1], w: [0, -1], W: [0, -1],
        ArrowDown: [0, 1], s: [0, 1], S: [0, 1],
        ArrowLeft: [-1, 0], a: [-1, 0], A: [-1, 0],
        ArrowRight: [1, 0], d: [1, 0], D: [1, 0],
      };
      const direction = moves[event.key];
      if (!direction || status !== 'active') return;
      event.preventDefault();
      move(...direction);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [move, status]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) return;
    const width = canvas.width;
    const height = canvas.height;
    const cellWidth = width / columns;
    const cellHeight = height / rows;
    context.fillStyle = '#090b10';
    context.fillRect(0, 0, width, height);
    context.strokeStyle = 'rgba(142,125,255,.16)';
    context.lineWidth = 1;
    for (let x = 0; x <= columns; x += 1) { context.beginPath(); context.moveTo(x * cellWidth, 0); context.lineTo(x * cellWidth, height); context.stroke(); }
    for (let y = 0; y <= rows; y += 1) { context.beginPath(); context.moveTo(0, y * cellHeight); context.lineTo(width, y * cellHeight); context.stroke(); }

    const targetX = (target.x + 0.5) * cellWidth;
    const targetY = (target.y + 0.5) * cellHeight;
    context.shadowBlur = 24;
    context.shadowColor = '#52e6b8';
    context.fillStyle = '#52e6b8';
    context.beginPath(); context.arc(targetX, targetY, 8, 0, Math.PI * 2); context.fill();
    context.shadowColor = '#ff5c44';
    context.fillStyle = '#ff5c44';
    context.fillRect((player.x + 0.5) * cellWidth - 8, (player.y + 0.5) * cellHeight - 8, 16, 16);
    context.shadowBlur = 0;
  }, [player, target]);

  const statusLabel = status === 'active' ? c.active : status === 'won' ? c.won : status === 'ended' ? c.ended : c.idle;

  return (
    <div className="module-grid">
      <div className="module-copy">
        <p className="module-kicker">{c.kicker}</p>
        <h3>{c.title}</h3>
        <p>{c.intro}</p>
        <button className="module-action" type="button" onClick={start}>{c.start}<span aria-hidden="true">↗</span></button>
        <div className="game-metrics" aria-live="polite">
          <span>{c.score}<strong>{score} / 8</strong></span>
          <span>{c.time}<strong>{seconds}s</strong></span>
          <span>{c.status}<strong>{statusLabel}</strong></span>
        </div>
      </div>
      <div className="game-card">
        <canvas ref={canvasRef} width="720" height="420" aria-label={`${c.title}. ${statusLabel}. ${c.score}: ${score}.`} />
        <div className="touch-pad" aria-label={c.controls}>
          <button type="button" aria-label={c.up} onClick={() => move(0, -1)}>↑</button>
          <button type="button" aria-label={c.left} onClick={() => move(-1, 0)}>←</button>
          <button type="button" aria-label={c.down} onClick={() => move(0, 1)}>↓</button>
          <button type="button" aria-label={c.right} onClick={() => move(1, 0)}>→</button>
        </div>
      </div>
    </div>
  );
}
