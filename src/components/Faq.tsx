import React from 'react';
import { SectionHeading } from './SectionHeading';
import { Reveal } from './Reveal';
import { faqs } from '../data/site';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger } from
'./ui/Accordion';

export function Faq() {
  return (
    <section id="faq" className="border-b border-white/10 py-24 sm:py-32">
      <div className="mx-auto grid max-w-[1400px] gap-14 px-5 sm:px-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)] lg:gap-20">
        <SectionHeading
          index="06 / FAQ"
          title="Questions we get every September."
          description="Still unsure? Ask us in the Discord — someone from the exec team usually answers within a day." />
        

        <Reveal delay={0.1}>
          <Accordion type="single" className="w-full border-t border-white/10">
            {faqs.map((item, i) =>
            <AccordionItem
              key={item.q}
              value={`faq-${i}`}
              className="border-b border-white/10">
              
                <AccordionTrigger className="py-5 text-left font-heading text-[15px] text-zinc-100 hover:no-underline">
                  <span className="flex items-baseline gap-4">
                    <span className="font-mono text-[11px] text-zinc-600">0{i + 1}</span>
                    {item.q}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="pb-6 pl-[2.1rem] pr-6 text-[14px] leading-relaxed text-zinc-400">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            )}
          </Accordion>
        </Reveal>
      </div>
    </section>);

}