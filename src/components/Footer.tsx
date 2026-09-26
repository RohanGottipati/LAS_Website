import React from 'react';
import { ArrowUpRight, ArrowUp } from 'lucide-react';
import { Logo } from './Logo';
import { navLinks, socials } from '../data/site';

export function Footer() {
  return (
    <footer className="relative overflow-hidden">
      <div className="mx-auto max-w-[1400px] px-5 py-16 sm:px-8 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_minmax(0,1fr)]">
          <div>
            <a href="#top" className="group inline-flex items-center gap-4">
              <Logo className="h-12 w-[108px]" interactive />
              <span>
                <span className="block font-display text-2xl leading-none text-paper">Laurier Analytics Society</span>
                <span className="mt-1 block font-mono text-[10.5px] uppercase tracking-[0.2em] text-cyan/70">
                  Find the signal
                </span>
              </span>
            </a>
          </div>

          <nav aria-label="Footer">
            <p className="font-mono text-[10.5px] uppercase tracking-[0.24em] text-cyan/70">Sections</p>
            <ul className="mt-5 space-y-3">
              {navLinks.map((link) =>
              <li key={link.href}>
                  <a
                  href={link.href}
                  className="group inline-flex items-center gap-2 text-[14px] text-paper/55 transition-colors duration-300 hover:text-paper">
                  
                    <span className="h-px w-0 bg-cyan transition-all duration-300 group-hover:w-4" />
                    {link.label}
                  </a>
                </li>
              )}
            </ul>
          </nav>

          <div>
            <p className="font-mono text-[10.5px] uppercase tracking-[0.24em] text-cyan/70">Elsewhere</p>
            <ul className="mt-5 space-y-3">
              {socials.map((s) => {
                const external = s.url.startsWith('http');
                return (
                  <li key={s.label}>
                    <a
                      href={s.url}
                      target={external ? '_blank' : undefined}
                      rel={external ? 'noopener noreferrer' : undefined}
                      className="group flex items-center justify-between gap-4 border-b border-paper/[0.06] pb-3 text-[14px] text-paper/55 transition-colors duration-300 hover:text-paper">
                      
                      <span>{s.label}</span>
                      <span className="flex min-w-0 items-center gap-1.5 font-mono text-[11px] text-paper/35 transition-colors duration-300 group-hover:text-cyan">
                        <span className="truncate">{s.handle}</span>
                        <ArrowUpRight className="h-3 w-3 shrink-0 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                      </span>
                    </a>
                  </li>);

              })}
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-paper/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-[11px] text-paper/35">&copy; {new Date().getFullYear()} Laurier Analytics Society</p>
          <a
            href="#top"
            className="group inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-paper/45 transition-colors duration-300 hover:text-cyan">
            
            Back to top
            <ArrowUp className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-1" />
          </a>
        </div>
      </div>
    </footer>);

}