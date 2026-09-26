import React from 'react';
import { Reveal } from './Reveal';

interface SectionHeadingProps {
  index: string;
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
            align === 'center' ? 'justify-center' : ''
          }`}
        >
          <span>{index}</span>
          <span className="h-px w-10 bg-cyan/40" />
        </div>
      </Reveal>
      <Reveal delay={0.06}>
        <h2 className="mt-4 font-heading text-3xl font-semibold tracking-tight text-paper sm:text-4xl">
          {title}
        </h2>
      </Reveal>
      {description ? (
        <Reveal delay={0.12}>
          <p className="mt-4 text-[15px] leading-relaxed text-paper/60">{description}</p>
        </Reveal>
      ) : null}
    </div>
  );
}
