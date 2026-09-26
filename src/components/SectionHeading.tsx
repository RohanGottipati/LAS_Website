import React from 'react';
import { Reveal } from './Reveal';
import { WordReveal } from './WordReveal';

interface SectionHeadingProps {
  index: string;
  /** Wrap words in *asterisks* for the italic cyan accent. */
  title: string;
  description?: string;
  align?: 'left' | 'center';
}

export function SectionHeading({ index, title, description, align = 'left' }: SectionHeadingProps) {
  return (
    <div className={align === 'center' ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'}>
      <Reveal>
        <div
          className={`flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.3em] text-cyan/80 ${
          align === 'center' ? 'justify-center' : ''}`
          }>
          
          <span>{index}</span>
          <span className="h-px w-10 bg-cyan/40" />
        </div>
      </Reveal>
      <h2 className="mt-12 font-display text-[2.6rem] leading-[1.12] tracking-[-0.01em] text-paper sm:text-[3.5rem]">
        <WordReveal text={title} delay={0.05} />
      </h2>
      {description ?
      <Reveal delay={0.2}>
          <p className="mt-5 text-[15px] leading-relaxed text-paper/60">{description}</p>
        </Reveal> :
      null}
    </div>);

}