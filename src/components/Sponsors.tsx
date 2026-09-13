import React from 'react';
import { motion } from 'framer-motion';
import { sponsors } from '../data/site';
import { Reveal } from './Reveal';

function Row({ items, reverse = false }: {items: string[];reverse?: boolean;}) {
  const doubled = [...items, ...items];
  return (
    <div className="relative overflow-hidden py-5">
      <motion.div
        className="flex w-max gap-14 whitespace-nowrap"
        animate={{ x: reverse ? ['-50%', '0%'] : ['0%', '-50%'] }}
        transition={{ duration: 34, repeat: Infinity, ease: 'linear' }}>
        
        {doubled.map((name, i) =>
        <span
          key={`${name}-${i}`}
          className="font-heading text-lg font-medium tracking-[0.12em] text-zinc-600 transition-colors duration-300 hover:text-zinc-200 sm:text-xl">
          
            {name}
          </span>
        )}
      </motion.div>
    </div>);

}

export function Sponsors() {
  return (
    <section aria-label="Partners and sponsors" className="border-b border-white/10 py-16 sm:py-20">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
        <Reveal>
          <p className="text-center font-mono text-[10.5px] uppercase tracking-[0.3em] text-zinc-500">
            Partners who hire, judge and sponsor
          </p>
        </Reveal>
      </div>
      <div className="mt-8 border-y border-white/10">
        <Row items={sponsors} />
        <div className="h-px w-full bg-white/10" />
        <Row items={[...sponsors].reverse()} reverse />
      </div>
    </section>);

}