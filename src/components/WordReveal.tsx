import React from 'react';
import { motion } from 'framer-motion';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

interface WordRevealProps {
  /** Wrap words in *asterisks* to render them as the italic cyan accent. */
  text: string;
  delay?: number;
  /** Animate on mount instead of when scrolled into view. */
  immediate?: boolean;
  play?: boolean;
}

const EASE = [0.16, 1, 0.3, 1] as const;

export function WordReveal({ text, delay = 0, immediate = false, play = true }: WordRevealProps) {
  const reduced = usePrefersReducedMotion();
  const words = parse(text);

  return (
    <>
      {words.map((w, i) => {
        const cls = w.accent ? 'italic text-cyan' : undefined;
        if (reduced) {
          return (
            <span key={i} className={cls}>
              {w.word}{' '}
            </span>);

        }
        return (
          <React.Fragment key={i}>
            <motion.span
              className="inline-block overflow-hidden pb-[0.12em] align-bottom -mb-[0.12em]"
              initial="hidden"
              {...immediate ?
                { animate: play ? 'show' : 'hidden' } :
                { whileInView: 'show', viewport: { once: true, margin: '-80px' } }}>
              
              <motion.span
                className={`inline-block will-change-transform ${cls ?? ''}`}
                variants={{
                  hidden: { y: '110%', rotate: 4 },
                  show: { y: '0%', rotate: 0 }
                }}
                transition={{ duration: 0.9, delay: delay + i * 0.055, ease: EASE }}>
                
                {w.word}
              </motion.span>
            </motion.span>{' '}
          </React.Fragment>);

      })}
    </>);

}

function parse(text: string) {
  const out: {word: string;accent: boolean;}[] = [];
  text.split(/(\*[^*]+\*)/).forEach((chunk) => {
    if (!chunk) return;
    const accent = chunk.startsWith('*') && chunk.endsWith('*');
    const clean = accent ? chunk.slice(1, -1) : chunk;
    clean.
    split(/\s+/).
    filter(Boolean).
    forEach((word) => out.push({ word, accent }));
  });
  return out;
}