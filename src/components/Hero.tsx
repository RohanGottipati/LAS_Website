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
    <section id="top" className="relative isolate min-h-[100svh] overflow-hidden border-b border-white/10">
      <motion.div style={{ y: fieldY, opacity: fade }} className="absolute inset-0 -z-10">
        <AsciiField
          maskText="LAS"
          className="h-full w-full"
          intensity={0.95}
          speed={0.85}
          cellWidth={cellWidth}
          cellHeight={cellHeight} />
        
      </motion.div>
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_35%,transparent_0%,#08080a_78%)]" />

      <div className="mx-auto flex min-h-[100svh] max-w-[1400px] flex-col justify-end px-5 pb-14 pt-32 sm:px-8">
        <div className="max-w-3xl">
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: EASE }}
            className="font-mono text-[11px] uppercase tracking-[0.34em] text-zinc-500">
            
            Wilfrid Laurier University / Waterloo, ON
          </motion.p>

          <h1 className="mt-5 font-heading text-[13vw] font-semibold leading-[0.92] tracking-[-0.04em] text-zinc-50 sm:text-[8vw] lg:text-[86px]">
            {['Laurier', 'Analytics Society'].map((line, li) =>
            <span key={line} className="block overflow-hidden">
                <motion.span
                className="block"
                initial={{ y: '110%', opacity: 0 }}
                animate={{ y: '0%', opacity: 1 }}
                transition={{ duration: 1, delay: 0.25 + li * 0.1, ease: EASE }}>
                
                  {line}
                </motion.span>
              </span>
            )}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.55, ease: EASE }}
            className="mt-7 max-w-xl text-[15px] leading-relaxed text-zinc-400">
            
            We are Laurier&apos;s student data community — teaching students to find the signal,
            defend the method, and turn raw records into decisions that actually ship.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.68, ease: EASE }}
            className="mt-9 flex flex-wrap items-center gap-3">
            
            <a
              href="#newsletter"
              className="group relative overflow-hidden bg-white px-6 py-3.5 font-heading text-sm font-medium text-black">
              
              <span className="relative z-10 flex items-center gap-2 transition-transform duration-300 group-hover:-translate-y-[140%]">
                Join the society
              </span>
              <span className="absolute inset-0 z-10 flex translate-y-[140%] items-center justify-center gap-2 transition-transform duration-300 group-hover:translate-y-0">
                Join the society <ArrowUpRight className="h-4 w-4" />
              </span>
            </a>
            <a
              href="#about"
              className="group flex items-center gap-2 border border-white/15 px-6 py-3.5 font-heading text-sm font-medium text-zinc-200 transition-colors duration-300 hover:border-white/40 hover:bg-white/[0.04]">
              
              What we do
              <ArrowDown className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-1" />
            </a>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.9 }}
          className="mt-16 overflow-hidden border-y border-white/10 py-3">
          
          <motion.div
            className="flex whitespace-nowrap font-mono text-[11px] uppercase tracking-[0.22em] text-zinc-600"
            animate={{ x: ['0%', '-50%'] }}
            transition={{ duration: 26, repeat: Infinity, ease: 'linear' }}>
            
            <span>{marquee.repeat(6)}</span>
            <span>{marquee.repeat(6)}</span>
          </motion.div>
        </motion.div>
      </div>
    </section>);

}