import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { SectionHeading } from './SectionHeading';
import { Reveal } from './Reveal';
import { impactEvents, impactSeries } from '../data/site';

function EventItem({
  label,
  index,
  active,
  pinned,
  onActivate,
  onDeactivate,
  onToggle
}: {label: string;index: number;active: boolean;pinned: boolean;onActivate: () => void;onDeactivate: () => void;onToggle: () => void;}) {
  const highlighted = active || pinned;
  return (
    <div
      role="button"
      tabIndex={0}
      aria-pressed={pinned}
      onMouseEnter={onActivate}
      onMouseLeave={onDeactivate}
      onFocus={onActivate}
      onBlur={onDeactivate}
      onClick={onToggle}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onToggle();
        }
      }}
      className="group flex items-center gap-4 border-t border-white/10 py-5 outline-none first:border-t-0 cursor-pointer">

      <span
        className={`h-4 w-px transition-colors duration-300 ${
        highlighted ? 'bg-zinc-200' : 'bg-transparent'}`
        } />

      <span className="font-mono text-[11px] tabular-nums text-zinc-600">
        {String(index + 1).padStart(2, '0')}
      </span>
      <span
        className={`font-heading text-sm transition-colors duration-300 ${
        highlighted ? 'text-white' : 'text-zinc-200 group-hover:text-white'}`
        }>

        {label}
      </span>
      {pinned &&
      <span className="ml-auto font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-500">
          Pinned
        </span>
      }
    </div>);

}

function EventGallery({ label, images }: {label: string;images: string[];}) {
  const [step, setStep] = useState(0);
  const [hovered, setHovered] = useState<number | null>(null);
  const [lightbox, setLightbox] = useState<string | null>(null);
  const len = images.length;
  const paused = hovered !== null || lightbox !== null;

  useEffect(() => {
    if (len <= 1 || paused) return;
    const id = setInterval(() => setStep((s) => s + 1), 3000);
    return () => clearInterval(id);
  }, [len, paused]);

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {if (e.key === 'Escape') setLightbox(null);};
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightbox]);

  return (
    <div className="relative h-[400px] w-full">
      <p className="absolute left-0 top-0 z-10 font-mono text-[10.5px] uppercase tracking-[0.22em] text-zinc-500">
        {label}
      </p>
      <div className="absolute inset-0 mt-10">
        {images.map((src, i) => {
          const slot = (i + step) % len;
          const offset = slot - (len - 1) / 2;
          const isHovered = hovered === i;
          return (
            <motion.div
              key={src}
              role="button"
              tabIndex={0}
              aria-label={`Open ${label} photo ${i + 1}`}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              onFocus={() => setHovered(i)}
              onBlur={() => setHovered(null)}
              onClick={() => setLightbox(src)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setLightbox(src);
                }
              }}
              className={`absolute left-1/2 top-1/2 h-[250px] w-[356px] cursor-pointer overflow-hidden border bg-[#0b0b0d] shadow-2xl shadow-black/60 outline-none ${
              isHovered ? 'border-white ring-2 ring-white/80' : 'border-white/10'}`
              }
              style={{ zIndex: isHovered ? len + 1 : slot }}
              initial={{ opacity: 0, y: 28, rotate: 0, x: '-50%' }}
              animate={{
                opacity: 1,
                y: `calc(-50% + ${offset * 12}px)`,
                x: `calc(-50% + ${offset * 30}px)`,
                rotate: isHovered ? 0 : offset * 3.5,
                scale: isHovered ? 1.06 : 1
              }}
              transition={{
                duration: 0.6,
                ease: [0.16, 1, 0.3, 1],
                delay: step === 0 && !isHovered ? 0.05 + i * 0.12 : 0
              }}>

              <img
                src={src}
                alt={`${label} photo ${i + 1}`}
                loading="lazy"
                className="h-full w-full object-cover" />

            </motion.div>);

        })}
      </div>

      <AnimatePresence>
        {lightbox &&
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={() => setLightbox(null)}
          role="dialog"
          aria-modal="true">

            <button
            onClick={() => setLightbox(null)}
            aria-label="Close"
            className="absolute right-6 top-6 z-10 font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-300 transition-colors hover:text-white">

              Close ✕
            </button>
            <motion.img
            src={lightbox}
            alt={label}
            className="max-h-[85vh] max-w-[90vw] border border-white/10 object-contain shadow-2xl shadow-black/60"
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.92, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()} />

          </motion.div>
        }
      </AnimatePresence>
    </div>);

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
          transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }} />

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
  const [activeEvent, setActiveEvent] = useState<number | null>(null);
  const [pinnedEvent, setPinnedEvent] = useState<number | null>(null);
  const displayed = activeEvent ?? pinnedEvent;

  return (
    <section id="impact" className="border-b border-white/10 py-24 sm:py-32">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
        <SectionHeading
          index="02 / Impact"
          title="What a year of LAS looks like."
          description="Every number below comes from our own event logs and post-event surveys. We publish the methodology in the newsletter each term." />


        <div className="mt-14 grid gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-16">
          <Reveal>
            <div>
              {impactEvents.map((e, i) =>
              <EventItem
                key={e.label}
                label={e.label}
                index={i}
                active={activeEvent === i}
                pinned={pinnedEvent === i}
                onActivate={() => setActiveEvent(i)}
                onDeactivate={() => setActiveEvent(null)}
                onToggle={() => setPinnedEvent((prev) => prev === i ? null : i)} />

              )}
            </div>
          </Reveal>
          <Reveal delay={0.12}>
            <div className="border border-white/10 bg-[#0b0b0d] p-6">
              <AnimatePresence mode="wait">
                {displayed === null ?
                <motion.div
                  key="chart"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}>

                    <GrowthChart />
                  </motion.div> :

                <motion.div
                  key={`event-${displayed}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}>

                    <EventGallery
                    label={impactEvents[displayed].label}
                    images={impactEvents[displayed].images} />

                  </motion.div>
                }
              </AnimatePresence>
            </div>
          </Reveal>
        </div>
      </div>
    </section>);

}
