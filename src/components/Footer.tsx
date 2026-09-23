import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowUp } from 'lucide-react';
import { navLinks, socials } from '../data/site';

export function Footer() {
  return (
    <footer className="relative overflow-hidden">
      <div className="mx-auto max-w-[1400px] px-5 py-16 sm:px-8 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_minmax(0,1fr)]">
          <div>
            <div className="flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center border border-white/15 font-mono text-[11px] text-zinc-200">
                LAS
              </span>
              <span className="font-heading text-sm text-zinc-200">
                Laurier Analytics Society
              </span>
            </div>
            <p className="mt-5 max-w-sm text-[14px] leading-relaxed text-zinc-500">
              A student-run society at Wilfrid Laurier University. Not affiliated with any employer
              listed; all figures self-reported from our event logs.
            </p>
          </div>

          <nav aria-label="Footer">
            <p className="font-mono text-[10.5px] uppercase tracking-[0.24em] text-zinc-600">
              Sections
            </p>
            <ul className="mt-5 space-y-3">
              {navLinks.map((link) =>
              <li key={link.href}>
                  <a
                  href={link.href}
                  className="group inline-flex items-center gap-2 text-[14px] text-zinc-400 transition-colors duration-300 hover:text-zinc-100">
                  
                    <span className="h-px w-0 bg-zinc-300 transition-all duration-300 group-hover:w-4" />
                    {link.label}
                  </a>
                </li>
              )}
            </ul>
          </nav>

          <div>
            <p className="font-mono text-[10.5px] uppercase tracking-[0.24em] text-zinc-600">
              Elsewhere
            </p>
            <ul className="mt-5 space-y-3">
              {socials.map((s) =>
              <li key={s.label}>
                  <a
                  href={s.url ?? '#newsletter'}
                  target={s.url ? '_blank' : undefined}
                  rel={s.url ? 'noopener noreferrer' : undefined}
                  className="group flex items-center justify-between gap-4 border-b border-white/[0.06] pb-3 text-[14px] text-zinc-400 transition-colors duration-300 hover:text-zinc-100">
                  
                    <span>{s.label}</span>
                    <span className="flex items-center gap-1.5 font-mono text-[11px] text-zinc-600 transition-colors duration-300 group-hover:text-zinc-300">
                      {s.handle}
                      <ArrowUpRight className="h-3 w-3 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </span>
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-[11px] text-zinc-600">
            &copy; {new Date().getFullYear()} Laurier Analytics Society
          </p>
          <a
            href="#top"
            className="group inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-500 transition-colors duration-300 hover:text-zinc-200">
            
            Back to top
            <ArrowUp className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-1" />
          </a>
        </div>
      </div>

      <motion.div
        aria-hidden="true"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="select-none overflow-hidden px-5 pb-6 sm:px-8">
        
        <p className="whitespace-nowrap font-heading text-[18vw] font-semibold leading-[0.8] tracking-[-0.05em] text-white/[0.045]">
          ANALYTICS
        </p>
      </motion.div>
    </footer>);

}