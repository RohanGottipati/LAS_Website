import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Loader2, ArrowRight, AlertCircle } from 'lucide-react';
import { AsciiField } from './AsciiField';
import { Reveal } from './Reveal';

type Status = 'idle' | 'loading' | 'success' | 'error';

interface NewsletterProps {
  cellWidth?: number;
  cellHeight?: number;
}

export function Newsletter({ cellWidth = 9, cellHeight = 14 }: NewsletterProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<Status>('idle');

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (status === 'loading') return;
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    if (!valid) {
      setStatus('error');
      return;
    }
    setStatus('loading');
    window.setTimeout(() => setStatus('success'), 1200);
  };

  return (
    <section id="newsletter" className="relative isolate overflow-hidden border-b border-paper/10">
      <div className="absolute inset-0 -z-10 opacity-40">
        <AsciiField
          className="h-full w-full"
          cellWidth={cellWidth}
          cellHeight={cellHeight}
          speed={0.6}
          intensity={0}
          chroma={0.65}
          interactive={false}
        />
      </div>
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_50%,rgba(7,11,13,0.55)_0%,#070b0d_72%)]" />

      <div className="mx-auto max-w-[1400px] px-5 py-24 sm:px-8 sm:py-32">
        <div className="mx-auto max-w-2xl text-center">
          <Reveal>
            <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-cyan/80">07 / Newsletter</p>
          </Reveal>
          <Reveal delay={0.06}>
            <h2 className="mt-5 font-heading text-3xl font-semibold tracking-tight text-paper sm:text-4xl">
              Get the signal, skip the noise.
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mt-4 text-[15px] leading-relaxed text-paper/60">
              Biweekly: upcoming events, application deadlines, internship postings, and one chart worth
              your attention. Unsubscribe in one click.
            </p>
          </Reveal>

          <Reveal delay={0.18}>
            <div className="relative mx-auto mt-10 max-w-lg">
              <AnimatePresence mode="wait" initial={false}>
                {status === 'success' ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="flex items-center gap-4 border border-cyan/25 bg-cyan/[0.06] px-6 py-5 text-left"
                  >
                    <span className="grid h-9 w-9 shrink-0 place-items-center bg-cyan text-ink">
                      <Check className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="font-heading text-sm text-paper">You&apos;re on the list.</p>
                      <p className="mt-1 font-mono text-[11px] text-paper/50">Confirmation sent to {email}</p>
                    </div>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    onSubmit={onSubmit}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col gap-2 sm:flex-row"
                    noValidate
                  >
                    <label htmlFor="newsletter-email" className="sr-only">
                      Email address
                    </label>
                    <input
                      id="newsletter-email"
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (status === 'error') setStatus('idle');
                      }}
                      placeholder="you@mylaurier.ca"
                      aria-invalid={status === 'error'}
                      className={`h-12 flex-1 border bg-paper/[0.03] px-4 font-mono text-[13px] text-paper outline-none transition-all duration-300 placeholder:text-paper/30 focus:bg-paper/[0.06] ${
                        status === 'error'
                          ? 'border-heat/70 focus:border-heat'
                          : 'border-paper/15 focus:border-cyan/55'
                      }`}
                    />
                    <button type="submit" disabled={status === 'loading'} className="btn-signal disabled:opacity-70">
                      {status === 'loading' ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" /> Subscribing
                        </>
                      ) : (
                        <>
                          Subscribe
                          <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                        </>
                      )}
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {status === 'error' ? (
                  <motion.p
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="mt-3 flex items-center justify-center gap-2 font-mono text-[11px] text-heat"
                    role="alert"
                  >
                    <AlertCircle className="h-3.5 w-3.5" />
                    Enter a valid email address to continue.
                  </motion.p>
                ) : null}
              </AnimatePresence>

              <p className="mt-4 font-mono text-[10.5px] uppercase tracking-[0.2em] text-paper/35">
                2,400 students subscribed
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
