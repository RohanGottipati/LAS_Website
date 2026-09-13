import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { SectionHeading } from './SectionHeading';
import { team } from '../data/site';

const CHARS = '.:-=+*#%@$&iIlZXU';

function hash(str: string) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

const COLS = 16;
const ROWS = 9;

function AsciiPortrait({ seed, hovered }: {seed: string;hovered: boolean;}) {
  const grid = useMemo(() => {
    let h = hash(seed);
    const cells: {ch: string;w: number;}[] = [];
    for (let y = 0; y < ROWS; y++) {
      for (let x = 0; x < COLS; x++) {
        h = Math.imul(h, 1103515245) + 12345 >>> 0;
        const r = h % 1000 / 1000;
        // Radial falloff keeps a portrait-like blob in the middle.
        const dx = (x - COLS / 2 + 0.5) / (COLS / 2);
        const dy = (y - ROWS / 2 + 0.5) / (ROWS / 2);
        const d = Math.sqrt(dx * dx + dy * dy);
        const w = Math.max(0, 1 - d * 0.95) * (0.45 + r * 0.55);
        cells.push({ ch: CHARS[Math.floor(r * CHARS.length)], w });
      }
    }
    return cells;
  }, [seed]);

  return (
    <div
      aria-hidden="true"
      className="grid select-none font-mono text-[11px] leading-[1.15]"
      style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))` }}>
      
      {grid.map((cell, i) =>
      <motion.span
        key={i}
        className="text-center text-zinc-300"
        initial={false}
        animate={{
          opacity: hovered ? Math.min(1, cell.w * 1.6 + 0.1) : cell.w * 0.55,
          y: hovered ? -1 : 0
        }}
        transition={{ duration: 0.45, delay: i % COLS * 0.012, ease: 'easeOut' }}>
        
          {cell.ch}
        </motion.span>
      )}
    </div>);

}

export function Team() {
  const [active, setActive] = useState<string | null>(null);

  return (
    <section id="team" className="border-b border-white/10 py-24 sm:py-32">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
        <SectionHeading
          index="04 / Our Team"
          title="38 executives. One shared spreadsheet."
          description="The people who run the workshops, wrangle the sponsors, and stay up late cleaning the datathon datasets." />
        

        <div className="mt-14 grid gap-px bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
          {team.map((member, i) =>
          <motion.article
            key={member.name}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-70px' }}
            transition={{ duration: 0.65, delay: i % 4 * 0.07, ease: [0.16, 1, 0.3, 1] }}
            onMouseEnter={() => setActive(member.name)}
            onMouseLeave={() => setActive(null)}
            className="group relative overflow-hidden bg-[#0b0b0d] p-6">
            
              <span className="pointer-events-none absolute inset-0 bg-white/[0.04] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <div className="relative overflow-hidden border border-white/10 bg-black/40 p-4">
                <AsciiPortrait seed={member.name} hovered={active === member.name} />
              </div>
              <h3 className="relative mt-5 font-heading text-base text-zinc-100">{member.name}</h3>
              <p className="relative mt-1 font-mono text-[11px] uppercase tracking-[0.18em] text-zinc-400">
                {member.role}
              </p>
              <p className="relative mt-2 text-[13px] text-zinc-500">{member.focus}</p>
            </motion.article>
          )}
        </div>
      </div>
    </section>);

}