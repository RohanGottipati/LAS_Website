import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { impactSeries } from '../../data/site';

const EASE = [0.16, 1, 0.3, 1] as const;

export function GrowthChart() {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const max = Math.max(...impactSeries.map((d) => d.value));
  const first = impactSeries[0].value;
  const lastValue = impactSeries[impactSeries.length - 1].value;
  const growth = Math.round((lastValue - first) / first * 100);
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
        <p className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-cyan/70">Students reached / year</p>
        <p className="font-mono text-[11px] text-paper/50">
          +{growth.toLocaleString()}% since {impactSeries[0].year}
        </p>
      </div>
      <svg
        viewBox={`0 0 ${w} ${h}`}
        className="mt-5 w-full"
        role="img"
        aria-label={`Students reached per year, growing from ${first} in ${impactSeries[0].year} to ${lastValue.toLocaleString()} in ${impactSeries[impactSeries.length - 1].year}`}>
        
        {[0.25, 0.5, 0.75].map((g) =>
        <line
          key={g}
          x1={pad}
          x2={w - pad}
          y1={pad + g * (h - pad * 2)}
          y2={pad + g * (h - pad * 2)}
          stroke="rgba(94,234,212,0.12)"
          strokeDasharray="3 6" />

        )}
        <motion.path
          d={area}
          fill="rgba(94,234,212,0.12)"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 0.7 }} />
        
        <motion.path
          d={line}
          fill="none"
          stroke="rgba(94,234,212,0.95)"
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
          fill="#070b0d"
          stroke="#5EEAD4"
          strokeWidth={1.2}
          initial={{ opacity: 0, scale: 0 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.4, delay: 0.5 + i * 0.12 }} />

        )}
      </svg>
      <div className="mt-3 flex justify-between font-mono text-[10px] tracking-[0.14em] text-paper/40">
        {impactSeries.map((d) =>
        <span key={d.year}>{d.year}</span>
        )}
      </div>
    </div>);

}