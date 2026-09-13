import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { SectionHeading } from './SectionHeading';
import { initiatives } from '../data/site';

export function Initiatives() {
  return (
    <section id="initiatives" className="border-b border-white/10 py-24 sm:py-32">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
        <SectionHeading
          index="03 / Initiatives"
          title="Six programs, one pipeline."
          description="From your first SELECT statement to a defended case in front of alumni judges — each initiative is a step further down the pipeline." />
        

        <div className="mt-14 grid gap-px bg-white/10 md:grid-cols-2 lg:grid-cols-3">
          {initiatives.map((item, i) =>
          <motion.article
            key={item.code}
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-70px' }}
            transition={{ duration: 0.7, delay: i % 3 * 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="group relative flex min-h-[300px] flex-col overflow-hidden bg-[#0b0b0d] p-7">
            
              <span className="pointer-events-none absolute inset-0 origin-bottom scale-y-0 bg-white/[0.045] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-y-100" />
              <span className="pointer-events-none absolute left-0 top-0 h-px w-0 bg-zinc-200 transition-all duration-500 group-hover:w-full" />

              <div className="relative flex items-center justify-between">
                <span className="font-mono text-[10.5px] uppercase tracking-[0.24em] text-zinc-500">
                  {item.code}
                </span>
                <ArrowUpRight className="h-4 w-4 text-zinc-600 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-zinc-200" />
              </div>

              <h3 className="relative mt-8 font-heading text-xl font-medium text-zinc-100">
                {item.title}
              </h3>
              <p className="relative mt-3 text-[14px] leading-relaxed text-zinc-400">{item.blurb}</p>

              <div className="relative mt-auto pt-7">
                <div className="flex flex-wrap gap-1.5">
                  {item.tags.map((t) =>
                <span
                  key={t}
                  className="border border-white/10 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-zinc-400 transition-colors duration-300 group-hover:border-white/25 group-hover:text-zinc-200">
                  
                      {t}
                    </span>
                )}
                </div>
                <p className="mt-4 font-mono text-[11px] text-zinc-600">{item.metric}</p>
              </div>
            </motion.article>
          )}
        </div>
      </div>
    </section>);

}