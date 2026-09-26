import React, { useEffect, useRef, useState } from 'react';
import { SectionHeading } from './SectionHeading';
import { Reveal } from './Reveal';
import { aboutFacts, aboutParagraphs } from '../data/site';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { useTypewriter, type CodeLine } from '../hooks/useTypewriter';

const CODE_LINES: CodeLine[] = [
{ indent: 0, text: 'las = Society(school="Wilfrid Laurier University")' },
{ indent: 0, text: 'las.members.load(source="all_faculties")' },
{ indent: 0, text: '' },
{ indent: 0, text: 'for student in las.members:' },
{ indent: 1, text: 'student.learn(["sql", "python", "storytelling"])' },
{ indent: 1, text: 'student.ship(project, reviewed_by="alumni")' },
{ indent: 0, text: '' },
{ indent: 0, text: 'print(las.outcomes())' },
{ indent: 0, text: '# {"placements": 71, "papers": 11, "reach": 2400}' }];


export function About() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);
  const reduced = usePrefersReducedMotion();
  const { typed, done } = useTypewriter(CODE_LINES, inView, reduced);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { threshold: 0.25 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section id="about" className="relative border-b border-paper/10 py-24 sm:py-32">
      <div className="mx-auto grid max-w-[1400px] gap-14 px-5 sm:px-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-20">
        <div>
          <SectionHeading index="01 / About" title="A society built around *evidence.*" />

          <div className="mt-7 space-y-5">
            {aboutParagraphs.map((p, i) =>
            <Reveal key={i} delay={0.1 + i * 0.08}>
                <p className="max-w-xl text-[15px] leading-relaxed text-paper/60">{p}</p>
              </Reveal>
            )}
          </div>

          <Reveal delay={0.3}>
            <dl className="mt-10 grid grid-cols-2 gap-px border border-paper/10 bg-paper/10 sm:grid-cols-3">
              {aboutFacts.map((f) =>
              <div key={f.k} className="bg-panel px-5 py-5 transition-colors duration-500 hover:bg-lift">
                  <dt className="font-mono text-[10px] uppercase tracking-[0.24em] text-cyan/70">{f.k}</dt>
                  <dd className="mt-2 font-display text-3xl text-paper">{f.v}</dd>
                </div>
              )}
            </dl>
          </Reveal>
        </div>

        <Reveal delay={0.12}>
          <div
            ref={ref}
            className="relative overflow-hidden border border-paper/10 bg-panel shadow-[0_40px_120px_-60px_rgba(94,234,212,0.22)]">
            
            <div className="flex items-center gap-2 border-b border-paper/10 bg-cyan/[0.03] px-4 py-3">
              <span className="h-2.5 w-2.5 rounded-full bg-heat/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-cyan/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-trace/80" />
              <span className="ml-2 font-mono text-[11px] text-paper/45">las_society.py</span>
              <span
                className={`ml-auto font-mono text-[10px] uppercase tracking-[0.2em] ${done ? 'text-trace' : 'text-cyan'}`}>
                
                {done ? 'exit 0' : inView ? 'running' : 'ready'}
              </span>
            </div>
            <pre
              aria-label="Python snippet describing the society"
              className="overflow-x-auto px-5 py-6 font-mono text-[12.5px] leading-[1.85] sm:text-[13px]">
              
              {typed.map((line, i) =>
              <div key={i} className="flex gap-4">
                  <span className="w-5 shrink-0 select-none text-right text-paper/25">{i + 1}</span>
                  <span style={{ paddingLeft: CODE_LINES[i].indent * 20 }}>{tokenize(line)}</span>
                </div>
              )}
            </pre>
          </div>
        </Reveal>
      </div>
    </section>);

}

function tokenize(line: string) {
  if (!line) return null;
  if (line.trimStart().startsWith('#')) {
    return <span className="text-trace/70">{line}</span>;
  }

  const re = /("[^"]*"?)|(\b(?:for|in|print)\b)|(\b\d+\b)|([A-Za-z_][A-Za-z0-9_]*)|([()[\]{}.,:=])|(\s+)|./g;
  const nodes: React.ReactNode[] = [];
  let m: RegExpExecArray | null;
  let i = 0;
  while (m = re.exec(line)) {
    const [tok, str, kw, num, ident, punct] = m;
    let cls = 'text-paper/85';
    if (str) cls = 'text-cyan';else
    if (kw) cls = 'text-violet';else
    if (num) cls = 'text-heat';else
    if (ident) {
      const next = line[m.index + tok.length];
      cls = ident[0] === ident[0].toUpperCase() || next === '(' ? 'text-trace' : 'text-paper/85';
    } else if (punct) cls = 'text-paper/35';
    nodes.push(
      <span key={i++} className={cls}>
        {tok}
      </span>
    );
  }
  return nodes;
}