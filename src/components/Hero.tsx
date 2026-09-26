import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { AsciiField } from './AsciiField';

const EASE = [0.16, 1, 0.3, 1] as const;

interface HeroProps {
  cellWidth?: number;
  cellHeight?: number;
}

export function Hero({ cellWidth = 9, cellHeight = 14 }: HeroProps) {
  const { scrollY } = useScroll();
  const fieldY = useTransform(scrollY, [0, 700], [0, 80]);
  const fade = useTransform(scrollY, [0, 520], [1, 0]);

  return (
    <section id="top" className="relative isolate min-h-[100svh] overflow-hidden border-b border-paper/10">
      <h1 className="sr-only">Laurier Analytics Society</h1>
      <motion.div style={{ y: fieldY, opacity: fade }} className="pointer-events-none absolute inset-0 -z-10">
        <AsciiField
          maskText="LAS"
          className="h-full w-full"
          intensity={0.98}
          speed={0.85}
          cellWidth={cellWidth}
          cellHeight={cellHeight}
          maskY={0.46}
          maskScale={0.72}
        />
      </motion.div>
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(7,11,13,0.28)_0%,transparent_22%,transparent_58%,rgba(7,11,13,0.35)_78%,rgba(7,11,13,0.88)_100%)]" />

      <div className="relative mx-auto flex min-h-[100svh] max-w-[1400px] flex-col justify-end px-5 pb-14 pt-28 sm:px-8">
        <div className="relative z-10 mx-auto w-full max-w-2xl text-center">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35, ease: EASE }}
            className="mx-auto max-w-xl text-[15px] leading-relaxed text-paper/60"
          >
            We are Laurier&apos;s student data community — teaching students to find the signal,
            defend the method, and turn raw records into decisions that actually ship.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.48, ease: EASE }}
            className="mt-8 flex flex-wrap items-center justify-center gap-3"
          >
            <a href="#newsletter" className="btn-signal">
              Join the society
              <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
            <a href="#about" className="group btn-ghost">
              What we do
              <ArrowDown className="h-4 w-4 transition-transform duration-200 group-hover:translate-y-0.5" />
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
