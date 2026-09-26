import React from 'react';
import { motion } from 'framer-motion';
import { SectionHeading } from './SectionHeading';
import { initiatives } from '../data/site';

export function Initiatives() {
  return (
    <section id="initiatives" className="border-b border-paper/10 py-24 sm:py-32">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
        <SectionHeading
          index="03 / Initiatives"
          title="Six programs, one pipeline."
          description="From your first SELECT statement to a defended case in front of alumni judges — each initiative is a step further down the pipeline."
        />

        <div className="mt-14 grid gap-px bg-paper/10 md:grid-cols-2 lg:grid-cols-3">
          {initiatives.map((item, i) => {
            const href = item.code === 'INIT_06' ? '#newsletter' : undefined;
            const Inner = (
              <>
                <span className="pointer-events-none absolute inset-0 origin-bottom scale-y-0 bg-gold/[0.05] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-y-100" />
                <span className="pointer-events-none absolute left-0 top-0 h-px w-0 bg-gold transition-all duration-500 group-hover:w-full" />

                <div className="relative flex items-center justify-between">
                  <span className="font-mono text-[10.5px] uppercase tracking-[0.24em] text-violet">
                    {item.code}
                  </span>
                </div>

                <h3 className="relative mt-8 font-heading text-xl font-medium text-paper">{item.title}</h3>
                <p className="relative mt-3 text-[14px] leading-relaxed text-paper/60">{item.blurb}</p>

                <div className="relative mt-auto pt-7">
                  <div className="flex flex-wrap gap-1.5">
                    {item.tags.map((t) => (
                      <span
                        key={t}
                        className="border border-violet/25 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-paper/60 transition-colors duration-300 group-hover:border-gold/35 group-hover:text-paper"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  <p className="mt-4 font-mono text-[11px] text-gold/70">{item.metric}</p>
                </div>
              </>
            );

            return (
              <motion.article
                key={item.code}
                initial={{ opacity: 0, y: 26 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-70px' }}
                transition={{ duration: 0.7, delay: (i % 3) * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="group relative flex min-h-[300px] flex-col overflow-hidden bg-panel p-7"
              >
                {href ? (
                  <a href={href} className="relative flex min-h-0 flex-1 flex-col outline-none">
                    {Inner}
                  </a>
                ) : (
                  Inner
                )}
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
