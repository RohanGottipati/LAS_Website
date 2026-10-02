import React, { useEffect, useRef } from 'react';
import { heatmap } from '../utils/heatmap';

const RAMP = ' .:-=+*!?<>|iIlZXUYQ$#%@';
// Quantization of the colour lookup table. Fine enough to be visually
// indistinguishable from the continuous heatmap, cheap enough to bake once.
const V_LEVELS = 64;
const S_LEVELS = 64;

// Sine lookup table. The noise runs sin/cos for every cell every frame; a table
// lookup is ~15x faster than Math.sin here, which keeps the field animating
// without starving the main thread during scroll. The <1-step phase error is
// imperceptible for an ambient background.
const SIN_SIZE = 4096;
const SIN_MASK = SIN_SIZE - 1;
const SIN_SCALE = SIN_SIZE / (Math.PI * 2);
const SIN_QUARTER = SIN_SIZE / 4;
const SIN_TABLE = new Float32Array(SIN_SIZE);
for (let i = 0; i < SIN_SIZE; i++) SIN_TABLE[i] = Math.sin((i / SIN_SIZE) * Math.PI * 2);
const fastSin = (x: number) => SIN_TABLE[((x * SIN_SCALE) | 0) & SIN_MASK];
const fastCos = (x: number) => SIN_TABLE[(((x * SIN_SCALE) | 0) + SIN_QUARTER) & SIN_MASK];

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
  /** Vertical placement of the mask, 0 = top, 1 = bottom. */
  maskY?: number;
  /** Mask glyph height as a fraction of the field. */
  maskScale?: number;
}

export function AsciiField({
  maskText,
  className,
  cellWidth = 9,
  cellHeight = 14,
  speed = 1,
  intensity = 0.9,
  interactive = true,
  chroma = 1,
  maskY = 0.5,
  maskScale = 0.62
}: AsciiFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pointer = useRef({ x: -999, y: -999, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const chromaClamp = Math.min(1, Math.max(0.25, chroma));
    const hasMask = !!maskText;

    // Colour + alpha lookup, keyed by (value level, spatial level). Baked once
    // so the per-cell paint never calls heatmap()/hsv2rgb or allocates a colour
    // string. Those were the main per-frame cost that starved scrolling.
    const lut: string[] = new Array(V_LEVELS * S_LEVELS);
    for (let vl = 0; vl < V_LEVELS; vl++) {
      const vc = vl / (V_LEVELS - 1);
      const alpha = (0.28 + Math.min(0.72, vc * 0.7)).toFixed(3);
      for (let sl = 0; sl < S_LEVELS; sl++) {
        const spatial = sl / (S_LEVELS - 1);
        // heatmap() derives its spatial term from nx*0.35 + ny*0.55, so feeding
        // both as spatial/0.9 reproduces the exact colour for this spatial band.
        const [r, g, b] = heatmap(vc, spatial / 0.9, spatial / 0.9);
        const gray = 0.22 * r + 0.72 * g + 0.06 * b;
        const cr = Math.round(gray + (r - gray) * chromaClamp);
        const cg = Math.round(gray + (g - gray) * chromaClamp);
        const cb = Math.round(gray + (b - gray) * chromaClamp);
        lut[vl * S_LEVELS + sl] = `rgba(${cr},${cg},${cb},${alpha})`;
      }
    }

    let cols = 0;
    let rows = 0;
    let cssW = 0;
    let cssH = 0;
    let mask = new Float32Array(0);
    // Per-cell static fields, rebuilt on resize.
    let phaseR = new Float32Array(0); // sqrt-radius phase for the noise
    let sLevelField = new Int16Array(0); // precomputed spatial LUT index
    // Per-axis static fields.
    let colPhaseX = new Float32Array(0); // x * 0.14
    let colPhaseXY = new Float32Array(0); // x * 0.07
    let colMaskPhase = new Float32Array(0); // x * 0.08
    let colPx = new Float32Array(0); // x * cellWidth
    let rowPhaseY = new Float32Array(0); // y * 0.19
    let rowPhaseXY = new Float32Array(0); // y * 0.07
    let rowPy = new Float32Array(0); // y * cellHeight
    let raf = 0;
    let last = 0;
    let visible = true;

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
      let size = Math.floor(virtualH * maskScale);
      octx.textAlign = 'center';
      octx.textBaseline = 'middle';
      octx.fillStyle = '#fff';
      const fit = () => {
        octx.font = `700 ${size}px Geist, sans-serif`;
        return octx.measureText(maskText).width;
      };
      while (fit() > cols * 0.88 && size > 6) size -= 1;
      octx.fillText(maskText, cols / 2, virtualH * maskY);
      octx.restore();
      const data = octx.getImageData(0, 0, cols, rows).data;
      for (let i = 0; i < cols * rows; i++) mask[i] = data[i * 4 + 3] / 255;
    };

    // Precompute everything about the noise that doesn't depend on time, so the
    // per-frame loop is just a handful of sin/cos per cell plus the draw call.
    const buildFields = () => {
      phaseR = new Float32Array(cols * rows);
      sLevelField = new Int16Array(cols * rows);
      colPhaseX = new Float32Array(cols);
      colPhaseXY = new Float32Array(cols);
      colMaskPhase = new Float32Array(cols);
      colPx = new Float32Array(cols);
      rowPhaseY = new Float32Array(rows);
      rowPhaseXY = new Float32Array(rows);
      rowPy = new Float32Array(rows);
      for (let x = 0; x < cols; x++) {
        colPhaseX[x] = x * 0.14;
        colPhaseXY[x] = x * 0.07;
        colMaskPhase[x] = x * 0.08;
        colPx[x] = x * cellWidth;
      }
      for (let y = 0; y < rows; y++) {
        rowPhaseY[y] = y * 0.19;
        rowPhaseXY[y] = y * 0.07;
        rowPy[y] = y * cellHeight;
      }
      for (let y = 0; y < rows; y++) {
        const ny = rows <= 1 ? 0.5 : y / (rows - 1);
        for (let x = 0; x < cols; x++) {
          const i = y * cols + x;
          phaseR[i] = Math.sqrt(x * x * 0.6 + y * y * 2.2) * 0.09;
          const nx = cols <= 1 ? 0.5 : x / (cols - 1);
          let spatial = nx * 0.35 + ny * 0.55;
          if (spatial < 0) spatial = 0;
          else if (spatial > 1) spatial = 1;
          sLevelField[i] = Math.round(spatial * (S_LEVELS - 1));
        }
      }
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      cssW = rect.width;
      cssH = rect.height;
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.max(1, Math.ceil(rect.width / cellWidth));
      rows = Math.max(1, Math.ceil(rect.height / cellHeight));
      buildFields();
      buildMask();
    };

    const paint = (now: number) => {
      const t = reduced ? 0 : now / 1000 * speed;
      ctx.clearRect(0, 0, cssW, cssH);
      ctx.font = `${cellHeight - 3}px "Geist Mono", ui-monospace, monospace`;
      ctx.textBaseline = 'top';

      const p = pointer.current;
      const px = p.x / cellWidth;
      const py = p.y / cellHeight;
      const active = p.active;
      const t9 = t * 0.9;
      const t6 = t * 0.6;
      const t11 = t * 1.1;
      const t14 = t * 1.4;
      const t2 = t * 2;
      const rampMax = RAMP.length - 1;
      let lastFill = '';

      for (let y = 0; y < rows; y++) {
        // The cosine term of the noise depends only on the row, so hoist it.
        const cosRow = fastCos(rowPhaseY[y] - t6);
        const rowXY = rowPhaseXY[y];
        const yPix = rowPy[y];
        const rowBase = y * cols;
        for (let x = 0; x < cols; x++) {
          const i = rowBase + x;
          const a = fastSin(colPhaseX[x] + t9) * cosRow;
          const b = fastSin(colPhaseXY[x] + rowXY - t11);
          const c = fastSin(phaseR[i] - t14);
          let v = (a + b * 0.8 + c * 0.7) / 2.5 * 0.5 + 0.5;
          if (hasMask) {
            const m = mask[i];
            if (m) v = v * (1 - intensity * m) + m * intensity * (0.72 + 0.28 * fastSin(t2 + colMaskPhase[x]));
          }
          if (active) {
            const dx = x - px;
            const dy = (y - py) * 1.4;
            const d = Math.sqrt(dx * dx + dy * dy);
            if (d < 16) v += (1 - d / 16) * 0.55;
          }
          if (v <= 0.08) continue;
          const idx = v >= 1 ? rampMax : (v * RAMP.length) | 0;
          const ch = RAMP[idx];
          if (ch === ' ') continue;
          const vc = v > 1 ? 1 : v;
          const vl = vc >= 1 ? V_LEVELS - 1 : (vc * V_LEVELS) | 0;
          const color = lut[vl * S_LEVELS + sLevelField[i]];
          if (color !== lastFill) {
            ctx.fillStyle = color;
            lastFill = color;
          }
          ctx.fillText(ch, colPx[x], yPix);
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
      if (!raf && visible && !document.hidden) raf = requestAnimationFrame(render);
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
      pointer.current = { x: e.clientX - rect.left, y: e.clientY - rect.top, active: true };
    };
    const onLeave = () => {
      pointer.current = { x: -999, y: -999, active: false };
    };

    resize();
    paint(performance.now());
    kick();
    // Re-render the mask once web fonts are ready so the glyphs use Geist.
    document.fonts?.ready.then(() => {
      resize();
      paint(performance.now());
    });
    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', onMove);
    document.documentElement.addEventListener('pointerleave', onLeave);
    document.addEventListener('visibilitychange', onVis);
    return () => {
      io.disconnect();
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('pointerleave', onLeave);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [maskText, cellWidth, cellHeight, speed, intensity, interactive, chroma, maskY, maskScale]);

  return <canvas ref={canvasRef} aria-hidden="true" className={className} />;
}
