import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { SectionHeading } from './SectionHeading';
import { Reveal } from './Reveal';
import { impactBars, impactSeries } from '../data/site';

const BLOCK = '\u2588';

function AsciiBar({
  label,
  value,
  meta,
  index





}: {label: string;value: number;meta: string;index: number;}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const cells = 34;
  const filled = Math.round(value / 100 * cells);

  return (
    <div ref={ref} className="group border-t border-white/10 py-5 first:border-t-0">
      <div className="flex items-baseline justify-between gap-4">
        <span className="font-heading text-sm text-zinc-200 transition-colors duration-300 group-hover:text-white">
          {label}
        </span>
        <span className="font-mono text-[11px] text-zinc-500">{meta}</span>
      </div>
      <div className="mt-3 flex items-center gap-4">
        <div className="flex select-none overflow-hidden font-mono text-[13px] leading-none tracking-[0.06em]">
          {Array.from({ length: cells }).map((_, i) =>
          <motion.span
            key={i}
            initial={{ opacity: 0, y: 6 }}
            animate={inView ? { opacity: i < filled ? 1 : 0.16, y: 0 } : {}}
            transition={{
              duration: 0.35,
              delay: index * 0.09 + i * 0.014,
              ease: 'easeOut'
            }}
            className="text-zinc-200">
            
              {BLOCK}
            </motion.span>
          )}
        </div>
        <span className="ml-auto font-mono text-[12px] tabular-nums text-zinc-400">{value}%</span>
      </div>
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
    <div ref={ref} className="border border-white/10 bg-[#0b0b0d] p-6">
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
              {impactBars.map((b, i) =>
              <AsciiBar key={b.label} {...b} index={i} />
              )}
            </div>
          </Reveal>
          <Reveal delay={0.12}>
            <GrowthChart />
          </Reveal>
        </div>
      </div>
    </section>);

}