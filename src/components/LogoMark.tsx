import React from 'react';
import { motion } from 'framer-motion';

interface LogoMarkProps {
  className?: string;
  /** Strokes draw themselves in (used by the intro). */
  draw?: boolean;
}

const EASE = [0.16, 1, 0.3, 1] as const;
const PAPER = '#e6eef0';
const CYAN = '#5EEAD4';

/**
 * LAS monogram built from chart primitives:
 *  L: a pair of chart axes
 *  A: a line chart peaking at a highlighted data point, with a dashed mean line
 *  S: a fitted curve running through scattered observations
 */
export function LogoMark({ className = 'h-full w-full', draw = false }: LogoMarkProps) {
  const stroke = (delay: number, duration = 0.8) => ({
    initial: draw ? { pathLength: 0, opacity: 0 } : false,
    animate: { pathLength: 1, opacity: 1 },
    transition: { pathLength: { duration, delay, ease: EASE }, opacity: { duration: 0.01, delay } }
  });
  const pop = (delay: number) => ({
    initial: draw ? { scale: 0 } : false,
    animate: { scale: 1 },
    transition: { duration: 0.45, delay, ease: EASE }
  });

  return (
    <svg viewBox="0 0 72 32" className={className} fill="none" aria-hidden="true">
      {/* L: axes */}
      <motion.path
        d="M4 3.5 V28 H18"
        stroke={PAPER}
        strokeWidth={3.2}
        strokeLinecap="square"
        strokeLinejoin="miter"
        {...stroke(0)} />
      
      <motion.path d="M4 16 H6.5 M11 28 V25.5" stroke={PAPER} strokeOpacity={0.45} strokeWidth={1.4} {...stroke(0.5, 0.3)} />

      {/* A: peak line chart */}
      <motion.path
        d="M22.5 28 L31 5.5 L39.5 28"
        stroke={CYAN}
        strokeWidth={3.2}
        strokeLinecap="square"
        strokeLinejoin="miter"
        {...stroke(0.25)} />
      
      <motion.path d="M25.8 20 H36.2" stroke={CYAN} strokeOpacity={0.7} strokeWidth={1.4} strokeDasharray="1.6 1.8" {...pop(0.75)} style={{ transformOrigin: '31px 20px' }} />
      <motion.circle cx={31} cy={5.5} r={3.4} fill="#070b0d" stroke={CYAN} strokeWidth={2} style={{ transformOrigin: '31px 5.5px' }} {...pop(0.9)} />

      {/* S: fitted curve through observations */}
      <motion.path
        d="M64 8 C62.4 5.3 59.6 4 56 4 C51.2 4 47.6 6.4 47.6 10.2 C47.6 17 64.4 14.6 64.4 21.6 C64.4 25.6 60.8 28 55.8 28 C51.8 28 48.6 26.6 46.6 23.8"
        stroke={PAPER}
        strokeWidth={3.2}
        strokeLinecap="square"
        {...stroke(0.45)} />
      
      {[
      { cx: 51, cy: 14.6, r: 1.5 },
      { cx: 60.8, cy: 17.4, r: 1.5 },
      { cx: 68, cy: 27, r: 2 }].
      map((d, i) =>
      <motion.circle
        key={i}
        cx={d.cx}
        cy={d.cy}
        r={d.r}
        fill={CYAN}
        fillOpacity={i === 2 ? 1 : 0.75}
        style={{ transformOrigin: `${d.cx}px ${d.cy}px` }}
        {...pop(1 + i * 0.1)} />

      )}
    </svg>);

}
