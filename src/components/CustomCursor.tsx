import React from 'react';
import { AnimatePresence, motion, useSpring } from 'framer-motion';
import { useCursorState } from '../hooks/useCursorState';

const EASE = [0.16, 1, 0.3, 1] as const;
const HOTSPOT = { x: 7, y: 4 };
const SIZE = 30;
const OFFSET_X = -(HOTSPOT.x / 40) * SIZE;
const OFFSET_Y = -(HOTSPOT.y / 40) * SIZE;
const BAR_W = 3.6;
const BARS = [
  { x: 7, top: 4, bottom: 32, o: 1 },
  { x: 11.8, top: 8.2, bottom: 30.1, o: 0.88 },
  { x: 16.6, top: 12.4, bottom: 28.2, o: 0.76 },
  { x: 21.4, top: 16.6, bottom: 26.3, o: 0.64 },
  { x: 26.2, top: 20.8, bottom: 24.4, o: 1 }
];

function CursorMark({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 40 40" className="h-full w-full" fill="none" aria-hidden="true">
      {BARS.map((b, i) => {
        const last = i === BARS.length - 1;
        return (
          <motion.rect
            key={i}
            x={b.x}
            y={b.top}
            width={BAR_W}
            height={b.bottom - b.top}
            fill="#5EEAD4"
            style={{ transformBox: 'fill-box', transformOrigin: last ? 'center' : 'bottom' }}
            animate={{
              scaleY: active && !last ? [1, 1.06, 1] : 1,
              scale: active && last ? 1.35 : 1,
              opacity: active ? 1 : b.o
            }}
            transition={{
              duration: 0.35,
              delay: active ? i * 0.03 : 0,
              ease: EASE
            }}
          />
        );
      })}
      <rect
        x={16.8}
        y={26.6}
        width={BAR_W}
        height={9.6}
        fill="#e6eef0"
        opacity={0.92}
        transform="rotate(-26 18.6 26.6)"
      />
    </svg>
  );
}

export function CustomCursor({ enabled = true }: { enabled?: boolean }) {
  const { supported, x, y, mode, label, pressed, coordsRef } = useCursorState(enabled);
  const chipX = useSpring(x, { stiffness: 420, damping: 34, mass: 0.5 });
  const chipY = useSpring(y, { stiffness: 420, damping: 34, mass: 0.5 });

  if (!supported) return null;

  const isLink = mode === 'link';
  const isText = mode === 'text';

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[200]">
      <motion.div style={{ x, y }} className="absolute left-0 top-0">
        <motion.div
          className="absolute drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)]"
          style={{ left: OFFSET_X, top: OFFSET_Y, width: SIZE, height: SIZE, transformOrigin: `${-OFFSET_X}px ${-OFFSET_Y}px` }}
          initial={false}
          animate={{ opacity: mode === 'hidden' || isText ? 0 : 1, scale: pressed ? 0.82 : isLink ? 1.08 : 1 }}
          transition={{ type: 'spring', stiffness: 500, damping: 28 }}
        >
          <CursorMark active={isLink} />
        </motion.div>

        <motion.span
          className="absolute left-0 top-0 block h-6 w-[2px] -translate-x-1/2 -translate-y-1/2 bg-cyan"
          initial={false}
          animate={{ opacity: isText ? 1 : 0, scaleY: isText ? 1 : 0.3 }}
          transition={{ duration: 0.15 }}
        />

        <span
          ref={coordsRef}
          className={`absolute left-[26px] top-[30px] whitespace-nowrap font-mono text-[9px] tracking-[0.08em] text-cyan/50 transition-opacity duration-200 ${
            mode === 'default' ? 'opacity-100' : 'opacity-0'
          }`}
        />
      </motion.div>

      <motion.div style={{ x: chipX, y: chipY }} className="absolute left-0 top-0">
        <AnimatePresence>
          {isLink && label ? (
            <motion.span
              key={label}
              className="absolute left-[24px] top-[26px] flex items-center gap-1.5 whitespace-nowrap bg-cyan px-2 py-1 font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-ink"
              initial={{ opacity: 0, scale: 0.6, x: -6 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.6, x: -6 }}
              style={{ transformOrigin: 'top left' }}
              transition={{ type: 'spring', stiffness: 520, damping: 30 }}
            >
              <span className="h-1 w-1 bg-ink" />
              {label}
            </motion.span>
          ) : null}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
