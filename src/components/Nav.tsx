import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { navLinks } from '../data/site';
import { useActiveSection } from '../hooks/useActiveSection';

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });
  const sectionIds = useMemo(() => navLinks.map((l) => l.href.slice(1)), []);
  const active = useActiveSection(sectionIds);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div
        className={`border-b transition-[background-color,border-color,backdrop-filter] duration-300 ${
          scrolled ? 'border-gold/20 bg-ink' : 'border-transparent bg-ink/85 backdrop-blur-[10px]'
        }`}
      >
        <nav
          aria-label="Primary"
          className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-5 sm:px-8"
        >
          <a href="#top" className="group flex items-center gap-3">
            <span className="grid h-8 w-8 place-items-center border border-gold/35 bg-gold/[0.06] font-mono text-[11px] tracking-tight text-gold transition-colors duration-300 group-hover:bg-gold group-hover:text-ink">
              LAS
            </span>
            <span className="hidden font-mono text-[11px] uppercase leading-[1.3] tracking-[0.18em] text-paper/55 sm:block">
              Laurier
              <br />
              Analytics Society
            </span>
          </a>

          <ul className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => {
              const isActive = active === link.href.slice(1);
              return (
                <li key={link.href}>
                  <a
                    href={link.href}
                    aria-current={isActive ? 'location' : undefined}
                    className={`group relative block px-3 py-2 font-mono text-[12px] uppercase tracking-[0.14em] transition-colors duration-300 ${
                      isActive ? 'text-gold' : 'text-paper/55 hover:text-paper'
                    }`}
                  >
                    {link.label}
                    <span
                      className={`absolute inset-x-3 bottom-1 h-px origin-left bg-gold transition-transform duration-300 ease-out ${
                        isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                      }`}
                    />
                  </a>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-2">
            <a href="#newsletter" className="btn-signal hidden h-10 px-5 text-[13px] sm:inline-flex">
              Join the team
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              className="grid h-10 w-10 place-items-center border border-paper/10 text-paper/80 transition-colors duration-300 hover:border-gold/40 hover:text-gold md:hidden"
            >
              {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </nav>
        <motion.div
          style={{ scaleX: progress }}
          className="h-px origin-left bg-gold/80"
        />
      </div>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-b border-gold/20 bg-ink md:hidden"
          >
            <ul className="px-5 py-3">
              {navLinks.map((link, i) => (
                <motion.li
                  key={link.href}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 + i * 0.05, duration: 0.3 }}
                >
                  <a
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between border-b border-paper/5 py-3 font-mono text-[13px] uppercase tracking-[0.14em] text-paper/80"
                  >
                    {link.label}
                    <ArrowUpRight className="h-3.5 w-3.5 text-gold/70" />
                  </a>
                </motion.li>
              ))}
              <li>
                <a
                  href="#newsletter"
                  onClick={() => setOpen(false)}
                  className="mt-3 flex items-center justify-between py-3 font-heading text-sm text-gold"
                >
                  Join the team
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              </li>
            </ul>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
