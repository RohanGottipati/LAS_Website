import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Loader2, ArrowRight, AlertCircle } from 'lucide-react';
import { AsciiField } from './AsciiField';
import { Reveal } from './Reveal';
import { WordReveal } from './WordReveal';
import { submitSponsorInquiry } from '../utils/supabase';

type Status = 'idle' | 'loading' | 'success' | 'error';

interface SponsorsProps {
  cellWidth?: number;
  cellHeight?: number;
}

const PARTNER_POINTS = [
  'Put your brand in front of 2,400+ analytics-minded Laurier students.',
  'Sponsor the flagship datathon, host a speaker night, or open an internship pipeline.',
  'Meet candidates already comfortable with data, from BBA to Data Science.'
];

export function Sponsors({ cellWidth = 9, cellHeight = 14 }: SponsorsProps) {
  const [company, setCompany] = useState('');
  const [contactName, setContactName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('Please fill in the required fields to continue.');

  const clearError = () => {
    if (status === 'error') setStatus('idle');
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === 'loading') return;

    const trimmedCompany = company.trim();
    const trimmedContact = contactName.trim();
    const trimmedEmail = email.trim();
    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail);

    if (!trimmedCompany || !trimmedContact || !validEmail) {
      setErrorMsg(
        !validEmail && trimmedCompany && trimmedContact
          ? 'Enter a valid email address to continue.'
          : 'Please fill in company, contact and a valid email.'
      );
      setStatus('error');
      return;
    }

    setStatus('loading');
    try {
      const result = await submitSponsorInquiry({
        company: trimmedCompany,
        contactName: trimmedContact,
        email: trimmedEmail,
        message: message.trim() || undefined,
        source: 'sponsors_section',
      });
      if (result.ok) {
        setStatus('success');
      } else {
        setErrorMsg(result.error ?? 'Something went wrong. Please try again.');
        setStatus('error');
      }
    } catch {
      setErrorMsg('Network error. Please check your connection and try again.');
      setStatus('error');
    }
  };

  const reset = () => {
    setCompany('');
    setContactName('');
    setEmail('');
    setMessage('');
    setStatus('idle');
  };

  const inputClass = (invalid: boolean) =>
    `h-12 w-full border bg-paper/[0.03] px-4 font-mono text-[13px] text-paper outline-none transition-all duration-300 placeholder:text-paper/30 focus:bg-paper/[0.06] ${
      invalid ? 'border-heat/70 focus:border-heat' : 'border-paper/15 focus:border-cyan/55'
    }`;

  const invalid = status === 'error';

  return (
    <section id="partners" className="relative isolate overflow-hidden border-b border-paper/10">
      <div className="absolute inset-0 -z-10 opacity-40">
        <AsciiField
          className="h-full w-full"
          cellWidth={cellWidth}
          cellHeight={cellHeight}
          speed={0.5}
          intensity={0}
          chroma={0.55}
          interactive={false} />
      </div>
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_40%,rgba(7,11,13,0.5)_0%,#070b0d_74%)]" />

      <div className="mx-auto max-w-[1400px] px-5 py-24 sm:px-8 sm:py-32">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
          <div>
            <Reveal>
              <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-cyan/80">06 / Partners</p>
            </Reveal>
            <h2 className="mt-5 font-display text-5xl leading-[1] tracking-tight text-paper sm:text-6xl">
              <WordReveal text="Partner *with us.*" delay={0.05} />
            </h2>
            <Reveal delay={0.12}>
              <p className="mt-5 max-w-md text-[15px] leading-relaxed text-paper/60">
                Companies power what we do, from the datathon to speaker nights. Tell us what you have in mind
                and the partnerships team will follow up within a few days.
              </p>
            </Reveal>
            <Reveal delay={0.18}>
              <ul className="mt-8 space-y-3">
                {PARTNER_POINTS.map((point) => (
                  <li key={point} className="flex items-start gap-3 text-[14px] leading-relaxed text-paper/70">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 bg-cyan" />
                    {point}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          <Reveal delay={0.12}>
            <AnimatePresence mode="wait" initial={false}>
              {status === 'success' ? (
                <motion.div
                  key="success"
                  role="status"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="flex items-center gap-4 border border-cyan/25 bg-cyan/[0.06] px-6 py-6">
                  <span className="grid h-9 w-9 shrink-0 place-items-center bg-cyan text-ink">
                    <Check className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-heading text-sm text-paper">Thanks. Your inquiry is in.</p>
                    <p className="mt-1 truncate font-mono text-[11px] text-paper/50">
                      We&apos;ll reply to {email} shortly.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={reset}
                    className="shrink-0 font-mono text-[10.5px] uppercase tracking-[0.18em] text-paper/45 transition-colors hover:text-cyan">
                    Send another
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={onSubmit}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col gap-3"
                  noValidate>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label htmlFor="sponsor-company" className="sr-only">
                        Company or organization
                      </label>
                      <input
                        id="sponsor-company"
                        type="text"
                        autoComplete="organization"
                        value={company}
                        onChange={(e) => {
                          setCompany(e.target.value);
                          clearError();
                        }}
                        placeholder="Company / organization"
                        aria-invalid={invalid && !company.trim()}
                        className={inputClass(invalid && !company.trim())} />
                    </div>
                    <div>
                      <label htmlFor="sponsor-contact" className="sr-only">
                        Contact name
                      </label>
                      <input
                        id="sponsor-contact"
                        type="text"
                        autoComplete="name"
                        value={contactName}
                        onChange={(e) => {
                          setContactName(e.target.value);
                          clearError();
                        }}
                        placeholder="Your name"
                        aria-invalid={invalid && !contactName.trim()}
                        className={inputClass(invalid && !contactName.trim())} />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="sponsor-email" className="sr-only">
                      Work email
                    </label>
                    <input
                      id="sponsor-email"
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        clearError();
                      }}
                      placeholder="you@company.com"
                      aria-invalid={invalid}
                      aria-describedby={invalid ? 'sponsor-error' : undefined}
                      className={inputClass(invalid)} />
                  </div>

                  <div>
                    <label htmlFor="sponsor-message" className="sr-only">
                      What do you have in mind?
                    </label>
                    <textarea
                      id="sponsor-message"
                      value={message}
                      onChange={(e) => {
                        setMessage(e.target.value);
                        clearError();
                      }}
                      rows={4}
                      placeholder="What are you hoping to do together? (optional)"
                      className="w-full resize-y border border-paper/15 bg-paper/[0.03] px-4 py-3 font-mono text-[13px] leading-relaxed text-paper outline-none transition-all duration-300 placeholder:text-paper/30 focus:border-cyan/55 focus:bg-paper/[0.06]" />
                  </div>

                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    data-cursor="send"
                    className="btn-signal justify-center disabled:opacity-70">
                    {status === 'loading' ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" /> Sending
                      </>
                    ) : (
                      <>
                        Become a sponsor
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>

                  <AnimatePresence>
                    {invalid ? (
                      <motion.p
                        id="sponsor-error"
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        className="flex items-center gap-2 font-mono text-[11px] text-heat"
                        role="alert">
                        <AlertCircle className="h-3.5 w-3.5" />
                        {errorMsg}
                      </motion.p>
                    ) : null}
                  </AnimatePresence>
                </motion.form>
              )}
            </AnimatePresence>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
