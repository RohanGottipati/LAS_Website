import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { SectionHeading } from './SectionHeading';
import { Reveal } from './Reveal';
import { faqs } from '../data/site';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

export function Faq() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" className="border-b border-paper/10 py-24 sm:py-32">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
        <SectionHeading
          align="center"
          index="04 / FAQ"
          title="Questions we get *every September.*"
          description="Still unsure? Send us a DM on Instagram. Someone from the exec team usually answers within a day." />

        <Reveal delay={0.18} className="mt-8 flex justify-center">
          <a
            href="https://www.instagram.com/laurier_analytics"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost">
            Message @laurier_analytics
          </a>
        </Reveal>

        <Reveal delay={0.1} className="mx-auto mt-14 max-w-3xl">
          <div className="w-full border-t border-paper/10">
            {faqs.map((item, i) =>
              <FaqRow
                key={item.q}
                index={i}
                question={item.q}
                answer={item.a}
                isOpen={open === i}
                onToggle={() => setOpen((current) => current === i ? null : i)} />
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function FaqRow({
  index,
  question,
  answer,
  isOpen,
  onToggle
}: {
  index: number;
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const reduced = usePrefersReducedMotion();
  const panelId = `faq-panel-${index}`;
  const triggerId = `faq-trigger-${index}`;

  return (
    <div className="border-b border-paper/10">
      <button
        type="button"
        id={triggerId}
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-6 py-5 text-left font-heading text-[15px] text-paper">
        <span className="flex items-baseline gap-4">
          <span className="font-mono text-[11px] text-cyan/70">0{index + 1}</span>
          {question}
        </span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-paper/50 ${
            reduced ? '' : 'transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]'
          } ${isOpen ? 'rotate-180 text-cyan/80' : ''}`} />
      </button>

      <div
        id={panelId}
        role="region"
        aria-labelledby={triggerId}
        className={`grid ${
          reduced ? '' : 'transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]'
        } ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
        <div className="overflow-hidden">
          <p
            className={`pb-6 pl-[2.1rem] pr-6 text-[14px] leading-relaxed text-paper/60 ${
              reduced ? '' : 'transition-opacity duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]'
            } ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
            {answer}
          </p>
        </div>
      </div>
    </div>
  );
}
