import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { SectionHeading } from './SectionHeading';
import { Reveal } from './Reveal';
import { aboutParagraphs } from '../data/site';

const CODE_LINES = [
{ indent: 0, text: 'las = Society(school="Wilfrid Laurier University")' },
{ indent: 0, text: 'las.members.load(source="all_faculties")' },
{ indent: 0, text: '' },
{ indent: 0, text: 'for student in las.members:' },
{ indent: 1, text: 'student.learn(["sql", "python", "storytelling"])' },
{ indent: 1, text: 'student.ship(project, reviewed_by="alumni")' },
{ indent: 0, text: '' },
{ indent: 0, text: 'print(las.outcomes())' },
{ indent: 0, text: '# {"placements": 71, "papers": 11, "reach": 2400}' }];


function useTypewriter(lines: typeof CODE_LINES, active: boolean) {
  const [count, setCount] = useState(0);
  const full = lines.map((l) => l.text).join('\n');

  useEffect(() => {
    if (!active) return;
    let raf = 0;
    const start = performance.now();
    const total = full.length;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / 2600);
      setCount(Math.floor(total * p));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, full]);

  // Slice the typed characters back into per-line strings.
  const out: string[] = [];
  let remaining = count;
  for (const line of lines) {
    if (remaining <= 0) {
      out.push('');
      continue;
    }
    out.push(line.text.slice(0, remaining));
    remaining -= line.text.length + 1;
  }
  return { typed: out, done: count >= full.length };
}

export function About() {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: '-120px' });
  const { typed, done } = useTypewriter(CODE_LINES, inView);

  return (
    <section id="about" className="relative border-b border-white/10 py-24 sm:py-32">
      <div className="mx-auto grid max-w-[1400px] gap-14 px-5 sm:px-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-20">
        <div>
          <SectionHeading
            index="01 / About"
            title="A society built around evidence." />
          
          <div className="mt-7 space-y-5">
            {aboutParagraphs.map((p, i) =>
            <Reveal key={i} delay={0.1 + i * 0.08}>
                <p className="max-w-xl text-[15px] leading-relaxed text-zinc-400">{p}</p>
              </Reveal>
            )}
          </div>

          <Reveal delay={0.3}>
            <dl className="mt-10 grid grid-cols-2 gap-px border border-white/10 bg-white/10 sm:grid-cols-3">
              {[
              ['Founded', '2019'],
              ['Portfolios', '06'],
              ['Campus', 'Waterloo']].
              map(([k, v]) =>
              <div key={k} className="group bg-[#0b0b0d] px-5 py-5 transition-colors duration-500 hover:bg-[#121214]">
                  <dt className="font-mono text-[10px] uppercase tracking-[0.24em] text-zinc-500">{k}</dt>
                  <dd className="mt-2 font-heading text-xl text-zinc-100">{v}</dd>
                </div>
              )}
            </dl>
          </Reveal>
        </div>

        <Reveal delay={0.12}>
          <div
            ref={ref}
            className="relative overflow-hidden border border-white/10 bg-[#0b0b0d] shadow-[0_40px_120px_-60px_rgba(255,255,255,0.15)]">
            
            <div className="flex items-center gap-2 border-b border-white/10 bg-white/[0.02] px-4 py-3">
              <span className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
              <span className="h-2.5 w-2.5 rounded-full bg-zinc-800" />
              <span className="h-2.5 w-2.5 rounded-full bg-zinc-800" />
              <span className="ml-2 font-mono text-[11px] text-zinc-500">las_society.py</span>
              <span className="ml-auto font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-600">
                {done ? 'exit 0' : 'running'}
              </span>
            </div>
            <pre className="overflow-x-auto px-5 py-6 font-mono text-[12.5px] leading-[1.85] text-zinc-300 sm:text-[13px]">
              {typed.map((line, i) =>
              <div key={i} className="flex gap-4">
                  <span className="w-5 shrink-0 select-none text-right text-zinc-700">{i + 1}</span>
                  <span
                  className={
                  CODE_LINES[i].text.startsWith('#') ?
                  'text-zinc-500' :
                  'text-zinc-200'
                  }
                  style={{ paddingLeft: CODE_LINES[i].indent * 20 }}>
                  
                    {line}
                  </span>
                </div>
              )}
            </pre>
            <motion.span
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),transparent)]"
              animate={{ y: ['0%', '1200%'] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'linear' }} />
            
          </div>
        </Reveal>
      </div>
    </section>);

}