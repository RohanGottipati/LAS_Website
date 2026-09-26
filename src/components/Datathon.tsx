import React from 'react';
import { ArrowUpRight, CalendarDays, MapPin } from 'lucide-react';
import { AsciiField } from './AsciiField';
import { Reveal } from './Reveal';
import { SectionHeading } from './SectionHeading';
import { datathonStats } from '../data/site';

interface DatathonProps {
  cellWidth?: number;
  cellHeight?: number;
}

export function Datathon({ cellWidth = 10, cellHeight = 15 }: DatathonProps) {
  return (
    <section id="datathon" className="relative isolate overflow-hidden border-b border-paper/10">
      <div className="absolute inset-0 -z-10 opacity-[0.55]">
        <AsciiField
          className="h-full w-full"
          cellWidth={cellWidth}
          cellHeight={cellHeight}
          speed={0.5}
          intensity={0}
          chroma={0.7}
          interactive={false} />
        
      </div>
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(90deg,#070b0d_0%,rgba(7,11,13,0.88)_55%,rgba(7,11,13,0.62)_100%)]" />

      <div className="mx-auto max-w-[1400px] px-5 py-24 sm:px-8 sm:py-32">
        <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)] lg:gap-20">
          <div className="text-center">
            <SectionHeading align="center" index="02 / Flagship" title="LAS Datathon *'26*" />
            <Reveal delay={0.12}>
              <p className="mx-auto mt-8 max-w-2xl text-[15px] leading-relaxed text-paper/60">
                In February 2026, 350 students spent 36 hours on twelve partner datasets that had never been opened
                outside the organization. Teams pitched to a panel of analysts, quants and product leads on Sunday
                afternoon.
              </p>
            </Reveal>
            <Reveal delay={0.18}>
              <div className="mt-7 flex flex-wrap items-center justify-center gap-x-7 gap-y-3 font-mono text-[11.5px] uppercase tracking-[0.16em] text-paper/55">
                <span className="flex items-center gap-2">
                  <CalendarDays className="h-3.5 w-3.5 text-cyan/80" /> Feb 26 &ndash; 28, 2026
                </span>
                <span className="flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5 text-cyan/80" /> Lazaridis Hall, Waterloo
                </span>
              </div>
            </Reveal>
            <Reveal delay={0.24}>
              <a href="#newsletter" className="btn-signal mt-9" data-cursor="notify">
                Get notified when '27 applications drop
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </Reveal>

            <Reveal delay={0.3}>
              <dl className="mt-12 grid grid-cols-2 gap-px border border-paper/10 bg-paper/10 sm:grid-cols-4">
                {datathonStats.map((s) =>
                <div key={s.k} className="flex flex-col-reverse bg-panel/90 px-5 py-5 backdrop-blur-sm">
                    <dt className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-cyan/70">{s.k}</dt>
                    <dd className="font-display text-4xl leading-none text-paper">{s.v}</dd>
                  </div>
                )}
              </dl>
            </Reveal>
          </div>

          <Reveal delay={0.16} className="self-center">
            <figure className="overflow-hidden border border-paper/10 bg-panel shadow-[0_40px_120px_-60px_rgba(94,234,212,0.22)]">
              <img
                src="/data-minds-challenge.jpg"
                alt="Laurier Analytics Society members at The Data Minds Challenge"
                className="h-auto w-full object-cover" />
            </figure>
          </Reveal>
        </div>
      </div>
    </section>);

}