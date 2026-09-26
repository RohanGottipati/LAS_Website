import React from 'react';
import { motion } from 'framer-motion';
import { stats } from '../data/site';
import { useCountUp } from '../hooks/useCountUp';

interface StatCardProps {
  value: number;
  suffix: string;
  label: string;
  detail: string;
  index: number;
}

function StatCard({ value, suffix, label, detail, index }: StatCardProps) {
  const { ref, value: current } = useCountUp(value, 1600 + index * 180);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      className="group relative overflow-hidden bg-panel px-6 py-9 sm:px-8">
      
      <span className="pointer-events-none absolute inset-0 -translate-y-full bg-cyan/[0.05] transition-transform duration-500 ease-out group-hover:translate-y-0" />
      <div className="relative">
        <div className="flex items-baseline font-display text-6xl leading-none tracking-tight text-paper sm:text-7xl">
          <span ref={ref} className="tabular-nums" aria-label={`${value.toLocaleString()}${suffix}`}>
            {current.toLocaleString()}
          </span>
          <span className="italic text-cyan" aria-hidden="true">
            {suffix}
          </span>
        </div>
        <p className="mt-3 font-heading text-sm text-paper/80">{label}</p>
        <p className="mt-1 font-mono text-[10.5px] uppercase tracking-[0.18em] text-paper/40">{detail}</p>
        <div className="mt-5 h-px w-full bg-paper/10">
          <motion.div
            className="h-px bg-cyan"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.1, delay: 0.2 + index * 0.08, ease: [0.16, 1, 0.3, 1] }}
            style={{ originX: 0 }} />
          
        </div>
      </div>
    </motion.div>);

}

export function Stats() {
  return (
    <section aria-label="Society by the numbers" className="border-b border-paper/10">
      <div className="mx-auto max-w-[1400px] px-5 py-16 sm:px-8 sm:py-20">
        <div className="grid gap-px bg-paper/10 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s, i) =>
          <StatCard key={s.label} {...s} index={i} />
          )}
        </div>
      </div>
    </section>);

}