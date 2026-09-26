import React from 'react';
import { AnimatePresence, motion, useSpring } from 'framer-motion';
import { LogoMark, LOGO_HOTSPOT } from './LogoMark';
import { useCursorState } from '../hooks/useCursorState';

const SIZE = 30;
const OFFSET_X = -(LOGO_HOTSPOT.x / 40) * SIZE;
const OFFSET_Y = -(LOGO_HOTSPOT.y / 40) * SIZE;

export function CustomCursor({ enabled = true }: {enabled?: boolean;}) {
  const { supported, x, y, mode, label, pressed, coordsRef } = useCursorState(enabled);
  const chipX = useSpring(x, { stiffness: 420, damping: 34, mass: 0.5 });
  const chipY = useSpring(y, { stiffness: 420, damping: 34, mass: 0.5 });

  if (!supported) return null;

  const isLink = mode === 'link';
  const isText = mode === 'text';

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[200]">
      {/* Pointer: the LAS histogram-arrow, hotspot pinned to the tip */}
      <motion.div style={{ x, y }} className="absolute left-0 top-0">
        <motion.div
          className="absolute drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)]"
          style={{ left: OFFSET_X, top: OFFSET_Y, width: SIZE, height: SIZE, transformOrigin: `${-OFFSET_X}px ${-OFFSET_Y}px` }}
          initial={false}
          animate={{ opacity: mode === 'hidden' || isText ? 0 : 1, scale: pressed ? 0.82 : isLink ? 1.08 : 1 }}
          transition={{ type: 'spring', stiffness: 500, damping: 28 }}>
          
          <LogoMark active={isLink} />
        </motion.div>

        <motion.span
          className="absolute left-0 top-0 block h-6 w-[2px] -translate-x-1/2 -translate-y-1/2 bg-cyan"
          initial={false}
          animate={{ opacity: isText ? 1 : 0, scaleY: isText ? 1 : 0.3 }}
          transition={{ duration: 0.15 }} />
        

        <span
          ref={coordsRef}
          className={`absolute left-[26px] top-[30px] whitespace-nowrap font-mono text-[9px] tracking-[0.08em] text-cyan/50 transition-opacity duration-200 ${
          mode === 'default' ? 'opacity-100' : 'opacity-0'}`
          } />
        
      </motion.div>

      {/* Trailing label chip for interactive targets */}
      <motion.div style={{ x: chipX, y: chipY }} className="absolute left-0 top-0">
        <AnimatePresence>
          {isLink && label ?
          <motion.span
            key={label}
            className="absolute left-[24px] top-[26px] flex items-center gap-1.5 whitespace-nowrap bg-cyan px-2 py-1 font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-ink"
            initial={{ opacity: 0, scale: 0.6, x: -6 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.6, x: -6 }}
            style={{ transformOrigin: 'top left' }}
            transition={{ type: 'spring', stiffness: 520, damping: 30 }}>
            
              <span className="h-1 w-1 bg-ink" />
              {label}
            </motion.span> :
          null}
        </AnimatePresence>
      </motion.div>
    </div>);

}