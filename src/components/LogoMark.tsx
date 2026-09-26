import React from 'react';
import { motion } from 'framer-motion';

interface LogoMarkProps {
  className?: string;
  /** Bars grow in one by one (used by the intro). */
  draw?: boolean;
  /** Hover / pressed emphasis (used by the cursor and nav). */
  active?: boolean;
}

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * LAS mark: a pointer cursor built from a histogram. Five descending bars trace
 * the arrow's edge (the last one shrinks into a single data point), and the
 * tail is one more bar. The tip at (7,4) is the cursor hotspot.
 */
export const LOGO_BARS = [
{ x: 7, top: 4, bottom: 32, o: 1 },
{ x: 11.8, top: 8.2, bottom: 30.1, o: 0.88 },
{ x: 16.6, top: 12.4, bottom: 28.2, o: 0.76 },
{ x: 21.4, top: 16.6, bottom: 26.3, o: 0.64 },
{ x: 26.2, top: 20.8, bottom: 24.4, o: 1 }];

export const LOGO_HOTSPOT = { x: 7, y: 4 };
const BAR_W = 3.6;

export function LogoMark({ className = 'h-full w-full', draw = false, active = false }: LogoMarkProps) {
  return (
    <svg viewBox="0 0 40 40" className={className} fill="none" aria-hidden="true">
      {LOGO_BARS.map((b, i) => {
        const last = i === LOGO_BARS.length - 1;
        return (
          <motion.rect
            key={i}
            x={b.x}
            y={b.top}
            width={BAR_W}
            height={b.bottom - b.top}
            fill="#5EEAD4"
            style={{ transformBox: 'fill-box', transformOrigin: last ? 'center' : 'bottom' }}
            initial={draw ? { scaleY: 0, scale: last ? 0 : 1, opacity: 0 } : false}
            animate={{
              scaleY: active && !last ? [1, 1.06, 1] : 1,
              scale: active && last ? 1.35 : 1,
              opacity: active ? 1 : b.o
            }}
            transition={{
              duration: draw ? 0.7 : 0.35,
              delay: draw ? 0.15 + i * 0.09 : active ? i * 0.03 : 0,
              ease: EASE
            }} />);


      })}
      <motion.rect
        x={16.8}
        y={26.6}
        width={BAR_W}
        height={9.6}
        fill="#e6eef0"
        transform="rotate(-26 18.6 26.6)"
        initial={draw ? { opacity: 0 } : false}
        animate={{ opacity: 0.92 }}
        transition={{ duration: 0.5, delay: draw ? 0.7 : 0 }} />
      
    </svg>);

}