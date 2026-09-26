import React, { useEffect, useRef } from 'react';
import { heatmap } from '../lib/heatmap';

const RAMP = ' .:-=+*!?<>|iIlZXUYQ$#%@';

interface AsciiFieldProps {
  /** Big text burned into the character field as a denser mask. */
  maskText?: string;
  className?: string;
  cellWidth?: number;
  cellHeight?: number;
  speed?: number;
  /** 0 = flat noise, 1 = strong mask contrast */
  intensity?: number;
  interactive?: boolean;
  /** Full chroma heatmap vs a quieter wash for background sections. */
  chroma?: number;
}

function noise(x: number, y: number, t: number) {
  const a = Math.sin(x * 0.14 + t * 0.9) * Math.cos(y * 0.19 - t * 0.6);
  const b = Math.sin((x + y) * 0.07 - t * 1.1);
  const c = Math.sin(Math.sqrt(x * x * 0.6 + y * y * 2.2) * 0.09 - t * 1.4);
  return (a + b * 0.8 + c * 0.7) / 2.5;
}

export function AsciiField({
  maskText,
  className,
  cellWidth = 9,
  cellHeight = 14,
  speed = 1,
  intensity = 0.9,
  interactive = true,
  chroma = 1
}: AsciiFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pointer = useRef({ x: -999, y: -999, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let cols = 0;
    let rows = 0;
    let mask: Float32Array = new Float32Array(0);
    let raf = 0;
    let last = 0;
    let visible = true;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const buildMask = () => {
      mask = new Float32Array(cols * rows);
      if (!maskText) return;
      const off = document.createElement('canvas');
      off.width = cols;
      off.height = rows;
      const octx = off.getContext('2d');
      if (!octx) return;
      octx.save();
      octx.scale(1, cellWidth / cellHeight);
      const virtualH = rows * (cellHeight / cellWidth);
      let size = Math.floor(virtualH * 0.62);
      octx.textAlign = 'center';
      octx.textBaseline = 'middle';
      octx.fillStyle = '#fff';
      const fit = () => {
        octx.font = `700 ${size}px Geist, sans-serif`;
        return octx.measureText(maskText).width;
      };
      while (fit() > cols * 0.88 && size > 6) size -= 1;
      octx.fillText(maskText, cols / 2, virtualH / 2);
      octx.restore();
      const data = octx.getImageData(0, 0, cols, rows).data;
      for (let i = 0; i < cols * rows; i++) mask[i] = data[i * 4 + 3] / 255;
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.max(1, Math.ceil(rect.width / cellWidth));
      rows = Math.max(1, Math.ceil(rect.height / cellHeight));
      buildMask();
    };

    const paint = (now: number) => {
      const t = reduced ? 0 : now / 1000 * speed;
      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);
      ctx.font = `${cellHeight - 3}px "Geist Mono", ui-monospace, monospace`;
      ctx.textBaseline = 'top';

      const p = pointer.current;
      const px = p.x / cellWidth;
      const py = p.y / cellHeight;
      const chromaClamp = Math.min(1, Math.max(0.25, chroma));

      for (let y = 0; y < rows; y++) {
        const ny = rows <= 1 ? 0.5 : y / (rows - 1);
        for (let x = 0; x < cols; x++) {
          let v = noise(x, y, t) * 0.5 + 0.5;
          const m = mask[y * cols + x] || 0;
          v = v * (1 - intensity * m) + m * intensity * (0.72 + 0.28 * Math.sin(t * 2 + x * 0.08));
          if (p.active) {
            const dx = x - px;
            const dy = (y - py) * 1.4;
            const d = Math.sqrt(dx * dx + dy * dy);
            if (d < 16) v += (1 - d / 16) * 0.55;
          }
          if (v <= 0.08) continue;
          const idx = Math.min(RAMP.length - 1, Math.max(0, Math.floor(v * RAMP.length)));
          const ch = RAMP[idx];
          if (ch === ' ') continue;
          const nx = cols <= 1 ? 0.5 : x / (cols - 1);
          const [r, g, b] = heatmap(Math.min(1, v), nx, ny);
          const gray = 0.22 * r + 0.72 * g + 0.06 * b;
          const cr = Math.round(gray + (r - gray) * chromaClamp);
          const cg = Math.round(gray + (g - gray) * chromaClamp);
          const cb = Math.round(gray + (b - gray) * chromaClamp);
          const alpha = 0.28 + Math.min(0.72, v * 0.7);
          ctx.fillStyle = `rgba(${cr},${cg},${cb},${alpha.toFixed(3)})`;
          ctx.fillText(ch, x * cellWidth, y * cellHeight);
        }
      }
    };

    const render = (now: number) => {
      if (!visible || document.hidden) {
        raf = 0;
        return;
      }
      raf = requestAnimationFrame(render);
      if (now - last < 33) return;
      last = now;
      paint(now);
    };

    const kick = () => {
      if (!raf && visible && !document.hidden) {
        raf = requestAnimationFrame(render);
      }
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) kick();
      },
      { threshold: 0.02 }
    );
    io.observe(canvas);

    const onVis = () => {
      if (document.hidden) {
        if (raf) cancelAnimationFrame(raf);
        raf = 0;
      } else {
        kick();
      }
    };

    const onMove = (e: PointerEvent) => {
      if (!interactive || !visible) return;
      const rect = canvas.getBoundingClientRect();
      pointer.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        active: true
      };
    };
    const onLeave = () => {
      pointer.current = { x: -999, y: -999, active: false };
    };

    resize();
    paint(performance.now());
    kick();
    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerleave', onLeave);
    document.addEventListener('visibilitychange', onVis);
    return () => {
      io.disconnect();
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerleave', onLeave);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [maskText, cellWidth, cellHeight, speed, intensity, interactive, chroma]);

  return <canvas ref={canvasRef} aria-hidden="true" className={className} />;
}
