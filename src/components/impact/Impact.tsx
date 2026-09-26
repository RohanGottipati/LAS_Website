import React, { useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { SectionHeading } from '../SectionHeading';
import { Reveal } from '../Reveal';
import { EventItem } from './EventItem';
import { EventGallery } from './EventGallery';
import { GrowthChart } from './GrowthChart';
import { PhotoLightbox, type LightboxPhoto } from './PhotoLightbox';
import { impactEvents } from '../../data/site';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

export function Impact() {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const [activeEvent, setActiveEvent] = useState<number | null>(null);
  const [pinnedEvent, setPinnedEvent] = useState<number | null>(null);
  const [lightbox, setLightbox] = useState<LightboxPhoto | null>(null);
  const reduceMotion = usePrefersReducedMotion();
  const displayed = activeEvent ?? pinnedEvent;
  const preview = displayed !== null ? impactEvents[displayed] : null;

  const clearActiveIfOutside = () => {
    const root = panelRef.current;
    if (!root) {
      setActiveEvent(null);
      return;
    }
    if (root.matches(':hover') || root.contains(document.activeElement)) return;
    setActiveEvent(null);
  };

  return (
    <section id="impact" className="border-b border-paper/10 py-24 sm:py-32">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
        <SectionHeading
          index="02 / Impact"
          title="What a year of LAS *looks like.*"
          description="Attendance, placements and partner counts come from our event logs and post-event surveys. Hover an event to open its photo deck; click to pin it. We publish the methodology in the newsletter each term." />
        

        <div
          ref={panelRef}
          className="mt-14 grid gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-16"
          onMouseLeave={() => {
            if (!lightbox) setActiveEvent(null);
          }}
          onBlur={(e) => {
            if (lightbox) return;
            if (!e.currentTarget.contains(e.relatedTarget as Node)) setActiveEvent(null);
          }}>
          
          <Reveal>
            <div>
              {impactEvents.map((e, i) =>
              <EventItem
                key={e.label}
                label={e.label}
                meta={e.meta}
                index={i}
                active={activeEvent === i}
                pinned={pinnedEvent === i}
                onActivate={() => setActiveEvent(i)}
                onToggle={() => setPinnedEvent((prev) => prev === i ? null : i)} />

              )}
            </div>
          </Reveal>
          <Reveal delay={0.12}>
            <div className="relative min-h-[400px] overflow-hidden border border-paper/10 bg-panel p-6">
              <div
                className={preview ? 'pointer-events-none invisible' : undefined}
                aria-hidden={preview ? true : undefined}>
                
                <GrowthChart />
              </div>
              <AnimatePresence>
                {preview ?
                <motion.div
                  key={preview.label}
                  className="absolute inset-0 p-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: reduceMotion ? 0 : 0.25 }}>
                  
                    <EventGallery
                    label={preview.label}
                    images={preview.images}
                    reduceMotion={reduceMotion}
                    onOpenPhoto={setLightbox} />
                  
                  </motion.div> :
                null}
              </AnimatePresence>
            </div>
          </Reveal>
        </div>
      </div>

      {createPortal(
        <AnimatePresence>
          {lightbox ?
          <PhotoLightbox
            key={lightbox.src}
            photo={lightbox}
            onClose={() => {
              setLightbox(null);
              window.requestAnimationFrame(clearActiveIfOutside);
            }} /> :

          null}
        </AnimatePresence>,
        document.body
      )}
    </section>);

}