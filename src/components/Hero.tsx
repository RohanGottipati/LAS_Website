import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { Magnetic } from './Magnetic';
import { WordReveal } from './WordReveal';

const EASE = [0.16, 1, 0.3, 1] as const;

interface HeroProps {
  /** Starts the entrance choreography (after the intro finishes). */
  ready?: boolean;
}

export function Hero({ ready = true }: HeroProps) {
  const { scrollY } = useScroll();
  const contentY = useTransform(scrollY, [0, 600], [0, -60]);
  const fade = useTransform(scrollY, [0, 500], [1, 0]);
  const enter = (delay: number) => ({
    initial: { opacity: 0, y: 16 },
    animate: ready ? { opacity: 1, y: 0 } : undefined,
    transition: { duration: 0.8, delay, ease: EASE }
  });

  return (
    <section id="top" className="relative isolate min-h-[100svh] overflow-hidden border-b border-paper/10">
      <div className="relative mx-auto flex min-h-[100svh] max-w-[1400px] flex-col px-5 pb-10 pt-28 sm:px-8">
        <motion.div
          style={{ y: contentY, opacity: fade }}
          className="flex flex-1 flex-col items-center justify-center text-center">
          
          <motion.p {...enter(0.1)} className="font-mono text-[11px] uppercase tracking-[0.3em] text-cyan/80">
            Laurier Analytics Society · Est. 2019
          </motion.p>
          <h1 className="mt-6 max-w-5xl font-display text-[3.4rem] leading-[0.95] tracking-[-0.015em] text-paper sm:text-[5.5rem] lg:text-[7.5rem]">
            <WordReveal text="Find the *signal* in the noise." delay={0.2} immediate play={ready} />
          </h1>
          <motion.p {...enter(0.6)} className="mx-auto mt-8 max-w-xl text-[15px] leading-relaxed text-paper/60 sm:text-base">
            Wilfrid Laurier University&apos;s student data community — teaching students to find the signal, defend the
            method, and turn raw records into decisions that actually ship.
          </motion.p>

          <motion.div {...enter(0.75)} className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Magnetic>
              <a href="#newsletter" className="btn-signal" data-cursor="join">
                Join the society
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </Magnetic>
            <Magnetic>
              <a href="#about" className="group btn-ghost" data-cursor="scroll">
                What we do
                <ArrowDown className="h-4 w-4 transition-transform duration-200 group-hover:translate-y-0.5" />
              </a>
            </Magnetic>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={ready ? { opacity: 1 } : undefined}
          transition={{ duration: 1, delay: 1.1 }}
          className="pointer-events-none hidden items-center justify-between font-mono text-[10px] uppercase tracking-[0.26em] text-paper/35 sm:flex">
          
          <span>Waterloo, ON · 43.4724° N</span>
          <span className="flex items-center gap-3">
            Scroll
            <span className="relative block h-8 w-px overflow-hidden bg-paper/15">
              <motion.span
                className="absolute inset-x-0 top-0 h-3 bg-cyan"
                animate={{ y: ['-100%', '280%'] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }} />
              
            </span>
          </span>
          <span>2,400+ students reached</span>
        </motion.div>
      </div>
    </section>);

}