import React from 'react';
import { sponsors } from '../data/site';
import { Reveal } from './Reveal';

function Row({ items, reverse = false }: { items: string[]; reverse?: boolean }) {
  const doubled = [...items, ...items];
  return (
    <div className="las-marquee-wrap relative overflow-hidden py-5">
      <div
        className={`las-marquee flex w-max gap-14 whitespace-nowrap ${reverse ? 'las-marquee-rev' : ''}`}
        style={{ ['--marquee-duration' as string]: '34s' }}
      >
        {doubled.map((name, i) => (
          <span
            key={`${name}-${i}`}
            className="font-heading text-lg font-medium tracking-[0.12em] text-paper/35 transition-colors duration-300 hover:text-gold sm:text-xl"
          >
            {name}
          </span>
        ))}
      </div>
    </div>
  );
}

export function Sponsors() {
  return (
    <section aria-label="Partners and sponsors" className="border-b border-paper/10 py-16 sm:py-20">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
        <Reveal>
          <p className="text-center font-mono text-[10.5px] uppercase tracking-[0.3em] text-gold/80">
            Partners who hire, judge and sponsor
          </p>
        </Reveal>
      </div>
      <div className="mt-8 border-y border-paper/10">
        <Row items={sponsors} />
        <div className="h-px w-full bg-paper/10" />
        <Row items={[...sponsors].reverse()} reverse />
      </div>
    </section>
  );
}
