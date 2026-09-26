import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, CalendarDays, MapPin } from 'lucide-react';
import { AsciiField } from './AsciiField';
import { Reveal } from './Reveal';
import { Magnetic } from './Magnetic';
import { WordReveal } from './WordReveal';
import { datathonStats, datathonTracks } from '../data/site';

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
          <div>
            <Reveal>
              <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.3em] text-cyan/80">
                <span>05 / Flagship</span>
                <span className="h-px w-10 bg-cyan/40" />
              </div>
            </Reveal>
            <Reveal delay={0.06}>
              <h2 className="mt-5 font-display text-6xl leading-[0.95] tracking-tight text-paper sm:text-8xl">
                <WordReveal text="LaurierDatathon *'27*" />
              </h2>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-paper/60">
                36 hours, 350 students, and twelve partner datasets that have never been opened by anyone outside the
                organization. Teams pitch to a panel of analysts, quants and product leads on Sunday afternoon.
              </p>
            </Reveal>
            <Reveal delay={0.18}>
              <div className="mt-7 flex flex-wrap gap-x-7 gap-y-3 font-mono text-[11.5px] uppercase tracking-[0.16em] text-paper/55">
                <span className="flex items-center gap-2">
                  <CalendarDays className="h-3.5 w-3.5 text-cyan/80" /> Feb 26 &ndash; 28, 2027
                </span>
                <span className="flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5 text-cyan/80" /> Lazaridis Hall, Waterloo
                </span>
              </div>
            </Reveal>
            <Reveal delay={0.24}>
              <Magnetic className="mt-9 inline-flex">
                <a href="#newsletter" className="btn-signal" data-cursor="notify">
                  Get notified when applications open
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              </Magnetic>
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

          <div className="space-y-px self-center bg-paper/10">
            {datathonTracks.map((track, i) =>
            <motion.div
              key={track.title}
              initial={{ opacity: 0, x: 26 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-70px' }}
              transition={{ duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="group relative overflow-hidden bg-panel/90 p-7 backdrop-blur-sm">
              
                <span className="pointer-events-none absolute inset-y-0 left-0 w-0 bg-cyan/[0.06] transition-all duration-500 ease-out group-hover:w-full" />
                <span className="pointer-events-none absolute inset-y-0 left-0 w-px origin-top scale-y-0 bg-cyan transition-transform duration-500 group-hover:scale-y-100" />
                <div className="relative">
                  <p className="font-mono text-[10.5px] uppercase tracking-[0.24em] text-violet">Track 0{i + 1}</p>
                  <h3 className="mt-3 font-display text-3xl text-paper">{track.title}</h3>
                  <p className="mt-2 max-w-sm text-[14px] leading-relaxed text-paper/60">{track.blurb}</p>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>);

}