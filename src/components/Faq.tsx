import React from 'react';
import { SectionHeading } from './SectionHeading';
import { Reveal } from './Reveal';
import { faqs } from '../data/site';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/Accordion';

export function Faq() {
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
          <Accordion type="single" defaultValue="faq-0" className="w-full border-t border-paper/10">
            {faqs.map((item, i) =>
            <AccordionItem key={item.q} value={`faq-${i}`} className="border-b border-paper/10">
                <AccordionTrigger className="py-5 text-left font-heading text-[15px] text-paper hover:text-paper hover:no-underline data-[state=open]:text-paper">
                  <span className="flex items-baseline gap-4">
                    <span className="font-mono text-[11px] text-cyan/70">0{i + 1}</span>
                    {item.q}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="pb-6 pl-[2.1rem] pr-6 text-[14px] leading-relaxed text-paper/60">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            )}
          </Accordion>
        </Reveal>
      </div>
    </section>);

}