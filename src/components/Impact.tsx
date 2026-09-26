import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { SectionHeading } from './SectionHeading';
import { Reveal } from './Reveal';
import { impactEvents, impactSeries } from '../data/site';

const EASE = [0.16, 1, 0.3, 1] as const;

type LightboxPhoto = {src: string;alt: string;label: string;};

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  return reduced;
}

function EventItem({
  label,
  meta,
  index,
  active,
  pinned,
  onActivate,
  onToggle
}: {
  label: string;
  meta: string;
  index: number;
  active: boolean;
  pinned: boolean;
  onActivate: () => void;
  onToggle: () => void;
}) {
  const highlighted = active || pinned;

  return (
    <button
      type="button"
      aria-pressed={pinned}
      onMouseEnter={onActivate}
      onFocus={onActivate}
      onClick={onToggle}
      className="group flex w-full items-center gap-4 border-t border-white/10 py-5 text-left outline-none first:border-t-0 focus-visible:ring-1 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#08080a]">

      <span
        className={`h-4 w-px transition-colors duration-300 ${
        highlighted ? 'bg-zinc-200' : 'bg-transparent'}`
        } />

      <span className="font-mono text-[11px] tabular-nums text-zinc-600">
        {String(index + 1).padStart(2, '0')}
      </span>
      <span className="min-w-0">
        <span
          className={`block font-heading text-sm transition-colors duration-300 ${
          highlighted ? 'text-white' : 'text-zinc-200 group-hover:text-white'}`
          }>

          {label}
        </span>
        <span className="mt-1 block font-mono text-[10px] tracking-[0.08em] text-zinc-500">
          {meta}
        </span>
      </span>
      <span
        className={`ml-auto hidden shrink-0 font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-500 transition-opacity duration-300 sm:inline ${
        pinned ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100'}`
        }>

        {pinned ? 'Pinned' : 'Pin to keep open'}
      </span>
    </button>);

}

function EventGallery({
  label,
  images,
  reduceMotion,
  onOpenPhoto
}: {
  label: string;
  images: string[];
  reduceMotion: boolean;
  onOpenPhoto: (photo: LightboxPhoto) => void;
}) {
  const [step, setStep] = useState(0);
  const [hovered, setHovered] = useState<number | null>(null);
  const [compact, setCompact] = useState(false);
  const len = images.length;
  const paused = hovered !== null || reduceMotion;

  useEffect(() => {
    setStep(0);
    setHovered(null);
  }, [label]);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1023px)');
    const update = () => setCompact(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (len <= 1 || paused) return;
    const id = window.setInterval(() => setStep((s) => s + 1), 3000);
    return () => window.clearInterval(id);
  }, [len, paused]);

  if (len === 0) {
    return (
      <div className="flex h-full min-h-[320px] items-center justify-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-zinc-500">
          Photos coming soon
        </p>
      </div>);

  }

  const spreadX = compact ? 14 : 30;
  const spreadY = compact ? 8 : 12;
  const tilt = reduceMotion || compact ? 0 : 3.5;

  return (
    <div className="relative h-full min-h-[320px] w-full overflow-hidden lg:min-h-[352px]">
      <p className="absolute left-0 top-0 z-10 font-mono text-[10.5px] uppercase tracking-[0.22em] text-zinc-500">
        {label}
      </p>
      <div className="absolute inset-0 mt-10">
        {images.map((src, i) => {
          const slot = (i + step) % len;
          const offset = slot - (len - 1) / 2;
          const isHovered = hovered === i;
          const alt = `${label} photo ${i + 1}`;
          return (
            <motion.button
              key={`${label}-${i}`}
              type="button"
              aria-label={`Open ${alt}`}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              onFocus={() => setHovered(i)}
              onBlur={() => setHovered(null)}
              onClick={() => onOpenPhoto({ src, alt, label })}
              className={`absolute left-1/2 top-1/2 h-[min(250px,46vw)] w-[min(356px,78%)] cursor-pointer overflow-hidden border bg-[#0b0b0d] shadow-2xl shadow-black/60 outline-none focus-visible:ring-2 focus-visible:ring-white ${
              isHovered ? 'border-white ring-2 ring-white/80' : 'border-white/10'}`
              }
              style={{ zIndex: isHovered ? len + 1 : slot }}
              initial={reduceMotion ? { opacity: 1, x: '-50%', y: '-50%' } : { opacity: 0, y: 28, rotate: 0, x: '-50%' }}
              animate={{
                opacity: 1,
                y: `calc(-50% + ${offset * spreadY}px)`,
                x: `calc(-50% + ${offset * spreadX}px)`,
                rotate: isHovered || reduceMotion ? 0 : offset * tilt,
                scale: isHovered && !reduceMotion ? 1.06 : 1
              }}
              transition={{
                duration: reduceMotion ? 0 : 0.6,
                ease: EASE,
                delay: reduceMotion || step !== 0 || isHovered ? 0 : 0.05 + i * 0.12
              }}>

              <img
                src={src}
                alt={alt}
                width={600}
                height={400}
                loading="lazy"
                className="pointer-events-none h-full w-full object-cover" />

            </motion.button>);

        })}
      </div>
    </div>);

}

function PhotoLightbox({
  photo,
  onClose
}: {
  photo: LightboxPhoto;
  onClose: () => void;
}) {
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    previouslyFocused.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    closeRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onCloseRef.current();
        return;
      }
      if (e.key === 'Tab') {
        e.preventDefault();
        closeRef.current?.focus();
      }
    };

    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKey);
      previouslyFocused.current?.focus();
    };
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${photo.label} photo`}>

      <button
        ref={closeRef}
        type="button"
        onClick={onClose}
        aria-label="Close photo"
        className="absolute right-6 top-6 z-10 font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-300 outline-none transition-colors hover:text-white focus-visible:text-white focus-visible:ring-1 focus-visible:ring-white/60">

        Close ✕
      </button>
      <motion.img
        src={photo.src}
        alt={photo.alt}
        className="max-h-[85vh] max-w-[90vw] border border-white/10 object-contain shadow-2xl shadow-black/60"
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }}
        transition={{ duration: 0.25, ease: EASE }}
        onClick={(e) => e.stopPropagation()} />

    </motion.div>);

}

function GrowthChart() {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const max = Math.max(...impactSeries.map((d) => d.value));
  const w = 520;
  const h = 220;
  const pad = 8;
  const points = impactSeries.map((d, i) => {
    const x = pad + i * (w - pad * 2) / (impactSeries.length - 1);
    const y = h - pad - d.value / max * (h - pad * 2);
    return [x, y] as const;
  });
  const line = points.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
  const area = `${line} L${points[points.length - 1][0]},${h - pad} L${points[0][0]},${h - pad} Z`;

  return (
    <div ref={ref}>
      <div className="flex items-baseline justify-between">
        <p className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-zinc-500">
          Students reached / year
        </p>
        <p className="font-mono text-[11px] text-zinc-400">+1,233% since 2021</p>
      </div>
      <svg viewBox={`0 0 ${w} ${h}`} className="mt-5 w-full" role="img" aria-label="Growth of students reached per year">
        {[0.25, 0.5, 0.75].map((g) =>
        <line
          key={g}
          x1={pad}
          x2={w - pad}
          y1={pad + g * (h - pad * 2)}
          y2={pad + g * (h - pad * 2)}
          stroke="rgba(255,255,255,0.06)"
          strokeDasharray="3 6" />

        )}
        <motion.path
          d={area}
          fill="rgba(255,255,255,0.06)"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 0.7 }} />

        <motion.path
          d={line}
          fill="none"
          stroke="rgba(228,228,231,0.9)"
          strokeWidth={1.5}
          initial={{ pathLength: 0 }}
          animate={inView ? { pathLength: 1 } : {}}
          transition={{ duration: 1.6, ease: EASE }} />

        {points.map(([x, y], i) =>
        <motion.circle
          key={i}
          cx={x}
          cy={y}
          r={2.6}
          fill="#0b0b0d"
          stroke="#e4e4e7"
          strokeWidth={1.2}
          initial={{ opacity: 0, scale: 0 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.4, delay: 0.5 + i * 0.12 }} />

        )}
      </svg>
      <div className="mt-3 flex justify-between font-mono text-[10px] tracking-[0.14em] text-zinc-600">
        {impactSeries.map((d) =>
        <span key={d.year}>{d.year}</span>
        )}
      </div>
    </div>);

}

export function Impact() {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const [activeEvent, setActiveEvent] = useState<number | null>(null);
  const [pinnedEvent, setPinnedEvent] = useState<number | null>(null);
  const [lightbox, setLightbox] = useState<LightboxPhoto | null>(null);
  const reduceMotion = usePrefersReducedMotion();
  const displayed = activeEvent ?? pinnedEvent;
  const preview = displayed !== null ? impactEvents[displayed] : null;

  const clearActiveIfOutside = () => {
    const root = panelRef.current;
    if (!root) {
      setActiveEvent(null);
      return;
    }
    if (root.matches(':hover') || root.contains(document.activeElement)) return;
    setActiveEvent(null);
  };

  return (
    <section id="impact" className="border-b border-white/10 py-24 sm:py-32">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
        <SectionHeading
          index="02 / Impact"
          title="What a year of LAS looks like."
          description="Attendance, placements and partner counts come from our event logs and post-event surveys. Hover an event to open its photo deck; click to pin it. We publish the methodology in the newsletter each term." />


        <div
          ref={panelRef}
          className="mt-14 grid gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-16"
          onMouseLeave={() => {
            if (!lightbox) setActiveEvent(null);
          }}
          onBlur={(e) => {
            if (lightbox) return;
            if (!e.currentTarget.contains(e.relatedTarget as Node)) {
              setActiveEvent(null);
            }
          }}>

          <Reveal>
            <div>
              {impactEvents.map((e, i) =>
              <EventItem
                key={e.label}
                label={e.label}
                meta={e.meta}
                index={i}
                active={activeEvent === i}
                pinned={pinnedEvent === i}
                onActivate={() => setActiveEvent(i)}
                onToggle={() => setPinnedEvent((prev) => prev === i ? null : i)} />

              )}
            </div>
          </Reveal>
          <Reveal delay={0.12}>
            <div className="relative min-h-[400px] overflow-hidden border border-white/10 bg-[#0b0b0d] p-6">
              <div
                className={preview ? 'pointer-events-none invisible' : undefined}
                aria-hidden={preview ? true : undefined}>

                <GrowthChart />
              </div>
              <AnimatePresence>
                {preview ?
                <motion.div
                  key={preview.label}
                  className="absolute inset-0 p-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: reduceMotion ? 0 : 0.25 }}>

                    <EventGallery
                    label={preview.label}
                    images={preview.images}
                    reduceMotion={reduceMotion}
                    onOpenPhoto={setLightbox} />

                  </motion.div> :
                null}
              </AnimatePresence>
            </div>
          </Reveal>
        </div>
      </div>

      {createPortal(
        <AnimatePresence>
          {lightbox ?
          <PhotoLightbox
            key={lightbox.src}
            photo={lightbox}
            onClose={() => {
              setLightbox(null);
              window.requestAnimationFrame(clearActiveIfOutside);
            }} /> :

          null}
        </AnimatePresence>,
        document.body
      )}
    </section>);

}
