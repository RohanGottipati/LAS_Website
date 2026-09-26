import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { AsciiField } from './AsciiField';

const EASE = [0.16, 1, 0.3, 1] as const;

const marquee = 'SELECT insight FROM campus WHERE curiosity = TRUE  //  ';

interface HeroProps {
  cellWidth?: number;
  cellHeight?: number;
}

export function Hero({ cellWidth = 9, cellHeight = 14 }: HeroProps) {
  const { scrollY } = useScroll();
  const fieldY = useTransform(scrollY, [0, 700], [0, 140]);
  const fade = useTransform(scrollY, [0, 520], [1, 0]);

  return (
    <section id="top" className="relative isolate min-h-[100svh] overflow-hidden border-b border-paper/10">
      <motion.div style={{ y: fieldY, opacity: fade }} className="absolute inset-0 -z-10">
        <AsciiField
          maskText="LAS"
          className="h-full w-full"
          intensity={0.95}
          speed={0.85}
          cellWidth={cellWidth}
          cellHeight={cellHeight}
        />
      </motion.div>
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_30%,transparent_0%,rgba(9,8,14,0.12)_40%,rgba(9,8,14,0.72)_80%,#09080e_100%)]" />

      <div className="mx-auto flex min-h-[100svh] max-w-[1400px] flex-col justify-end px-5 pb-14 pt-32 sm:px-8">
        <div className="relative max-w-3xl">
          <div className="pointer-events-none absolute -inset-x-8 -inset-y-10 -z-10 bg-[radial-gradient(ellipse_at_left,rgba(9,8,14,0.82)_0%,rgba(9,8,14,0.45)_55%,transparent_78%)]" />
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: EASE }}
            className="font-mono text-[11px] uppercase tracking-[0.34em] text-gold/80"
          >
            Wilfrid Laurier University / Waterloo, ON
          </motion.p>

          <h1 className="mt-5 font-heading text-[13vw] font-semibold leading-[0.92] tracking-[-0.04em] text-paper sm:text-[8vw] lg:text-[86px]">
            {['Laurier', 'Analytics Society'].map((line, li) => (
              <span key={line} className="block overflow-hidden">
                <motion.span
                  className="block"
                  initial={{ y: '110%', opacity: 0 }}
                  animate={{ y: '0%', opacity: 1 }}
                  transition={{ duration: 1, delay: 0.25 + li * 0.1, ease: EASE }}
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.55, ease: EASE }}
            className="mt-7 max-w-xl text-[15px] leading-relaxed text-paper/60"
          >
            We are Laurier&apos;s student data community — teaching students to find the signal,
            defend the method, and turn raw records into decisions that actually ship.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.68, ease: EASE }}
            className="mt-9 flex flex-wrap items-center gap-3"
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

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.9 }}
          className="las-marquee-wrap mt-16 overflow-hidden border-y border-paper/10 py-3"
        >
          <div
            className="las-marquee flex w-max whitespace-nowrap font-mono text-[11px] uppercase tracking-[0.22em] text-gold/45"
            style={{ ['--marquee-duration' as string]: '26s' }}
          >
            <span>{marquee.repeat(6)}</span>
            <span>{marquee.repeat(6)}</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
