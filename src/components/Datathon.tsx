import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, CalendarDays, MapPin } from 'lucide-react';
import { AsciiField } from './AsciiField';
import { Reveal } from './Reveal';
import { datathonStats, datathonTracks } from '../data/site';

interface DatathonProps {
  cellWidth?: number;
  cellHeight?: number;
}

export function Datathon({ cellWidth = 10, cellHeight = 15 }: DatathonProps) {
  return (
    <section id="datathon" className="relative isolate overflow-hidden border-b border-white/10">
      <div className="absolute inset-0 -z-10 opacity-[0.55]">
        <AsciiField
          className="h-full w-full"
          cellWidth={cellWidth}
          cellHeight={cellHeight}
          speed={0.5}
          intensity={0} />
        
      </div>
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(90deg,#08080a_0%,rgba(8,8,10,0.86)_55%,rgba(8,8,10,0.6)_100%)]" />

      <div className="mx-auto max-w-[1400px] px-5 py-24 sm:px-8 sm:py-32">
        <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)] lg:gap-20">
          <div>
            <Reveal>
              <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.3em] text-zinc-500">
                <span>05 / Flagship</span>
                <span className="h-px w-10 bg-zinc-700" />
              </div>
            </Reveal>
            <Reveal delay={0.06}>
              <h2 className="mt-5 font-heading text-4xl font-semibold tracking-tight text-zinc-50 sm:text-5xl">
                LaurierDatathon
                <span className="text-zinc-600">&apos;26</span>
              </h2>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-zinc-400">
                36 hours, 350 students, and twelve partner datasets that have never been opened by
                anyone outside the organization. Teams pitch to a panel of analysts, quants and
                product leads on Sunday afternoon.
              </p>
            </Reveal>
            <Reveal delay={0.18}>
              <div className="mt-7 flex flex-wrap gap-x-7 gap-y-3 font-mono text-[11.5px] uppercase tracking-[0.16em] text-zinc-400">
                <span className="flex items-center gap-2">
                  <CalendarDays className="h-3.5 w-3.5 text-zinc-600" /> Feb 27 &ndash; Mar 1, 2026
                </span>
                <span className="flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5 text-zinc-600" /> Lazaridis Hall, Waterloo
                </span>
              </div>
            </Reveal>
            <Reveal delay={0.24}>
              <a
                href="#newsletter"
                className="group relative mt-9 inline-block overflow-hidden bg-white px-6 py-3.5 font-heading text-sm font-medium text-black">
                
                <span className="relative z-10 flex items-center gap-2 transition-transform duration-300 group-hover:-translate-y-[140%]">
                  Get notified when applications open
                </span>
                <span className="absolute inset-0 z-10 flex translate-y-[140%] items-center justify-center gap-2 transition-transform duration-300 group-hover:translate-y-0">
                  Notify me <ArrowUpRight className="h-4 w-4" />
                </span>
              </a>
            </Reveal>

            <Reveal delay={0.3}>
              <dl className="mt-12 grid grid-cols-2 gap-px border border-white/10 bg-white/10 sm:grid-cols-4">
                {datathonStats.map((s) =>
                <div key={s.k} className="bg-[#0b0b0d]/90 px-5 py-5 backdrop-blur-sm">
                    <dd className="font-heading text-2xl text-zinc-50">{s.v}</dd>
                    <dt className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">
                      {s.k}
                    </dt>
                  </div>
                )}
              </dl>
            </Reveal>
          </div>

          <div className="space-y-px bg-white/10">
            {datathonTracks.map((track, i) =>
            <motion.div
              key={track.title}
              initial={{ opacity: 0, x: 26 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-70px' }}
              transition={{ duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="group relative overflow-hidden bg-[#0b0b0d]/90 p-7 backdrop-blur-sm">
              
                <span className="pointer-events-none absolute inset-y-0 left-0 w-0 bg-white/[0.05] transition-all duration-500 ease-out group-hover:w-full" />
                <div className="relative flex items-start justify-between gap-6">
                  <div>
                    <p className="font-mono text-[10.5px] uppercase tracking-[0.24em] text-zinc-500">
                      Track 0{i + 1}
                    </p>
                    <h3 className="mt-3 font-heading text-lg text-zinc-100">{track.title}</h3>
                    <p className="mt-2 max-w-sm text-[14px] leading-relaxed text-zinc-400">
                      {track.blurb}
                    </p>
                  </div>
                  <span className="font-mono text-[11px] text-zinc-700 transition-colors duration-300 group-hover:text-zinc-400">
                    {'>'}
                  </span>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>);

}