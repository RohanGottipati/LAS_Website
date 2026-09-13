import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { navLinks } from '../data/site';

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <motion.div
        animate={{
          backgroundColor: scrolled ? 'rgba(8,8,10,0.82)' : 'rgba(8,8,10,0)',
          borderColor: scrolled ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0)',
          backdropFilter: scrolled ? 'blur(14px)' : 'blur(0px)'
        }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="border-b">
        
        <nav
          aria-label="Primary"
          className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-5 sm:px-8">
          
          <a href="#top" className="group flex items-center gap-3">
            <span className="grid h-8 w-8 place-items-center border border-white/15 bg-white/[0.03] font-mono text-[11px] tracking-tight text-zinc-200 transition-colors duration-300 group-hover:bg-white group-hover:text-black">
              LAS
            </span>
            <span className="hidden font-mono text-[11px] uppercase leading-[1.3] tracking-[0.18em] text-zinc-400 sm:block">
              Laurier
              <br />
              Analytics Society
            </span>
          </a>

          <ul className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) =>
            <li key={link.href}>
                <a
                href={link.href}
                className="group relative block px-3 py-2 font-mono text-[12px] uppercase tracking-[0.14em] text-zinc-400 transition-colors duration-300 hover:text-zinc-100">
                
                  {link.label}
                  <span className="absolute inset-x-3 bottom-1 h-px origin-left scale-x-0 bg-zinc-300 transition-transform duration-300 ease-out group-hover:scale-x-100" />
                </a>
              </li>
            )}
          </ul>

          <div className="flex items-center gap-2">
            <a
              href="#newsletter"
              className="group relative hidden overflow-hidden bg-white px-5 py-2.5 font-heading text-[13px] font-medium text-black sm:block">
              
              <span className="relative z-10 flex items-center gap-1.5 transition-transform duration-300 group-hover:-translate-y-[130%]">
                Join the team
              </span>
              <span className="absolute inset-0 z-10 flex translate-y-[130%] items-center justify-center gap-1.5 transition-transform duration-300 group-hover:translate-y-0">
                Join the team <ArrowUpRight className="h-3.5 w-3.5" />
              </span>
            </a>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              className="grid h-10 w-10 place-items-center border border-white/10 text-zinc-300 transition-colors duration-300 hover:bg-white/5 md:hidden">
              
              {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </nav>
        <motion.div
          style={{ scaleX: progress }}
          className="h-px origin-left bg-zinc-200/60" />
        
      </motion.div>

      <AnimatePresence>
        {open ?
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="overflow-hidden border-b border-white/10 bg-[#08080a]/95 backdrop-blur-xl md:hidden">
          
            <ul className="px-5 py-3">
              {navLinks.map((link, i) =>
            <motion.li
              key={link.href}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 + i * 0.05, duration: 0.3 }}>
              
                  <a
                href={link.href}
                onClick={() => setOpen(false)}
                className="flex items-center justify-between border-b border-white/5 py-3 font-mono text-[13px] uppercase tracking-[0.14em] text-zinc-300">
                
                    {link.label}
                    <ArrowUpRight className="h-3.5 w-3.5 text-zinc-600" />
                  </a>
                </motion.li>
            )}
            </ul>
          </motion.div> :
        null}
      </AnimatePresence>
    </header>);

}