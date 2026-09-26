import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ImageOff } from 'lucide-react';
import type { LightboxPhoto } from './PhotoLightbox';

const EASE = [0.16, 1, 0.3, 1] as const;

interface EventGalleryProps {
  label: string;
  images: string[];
  reduceMotion: boolean;
  onOpenPhoto: (photo: LightboxPhoto) => void;
}

export function EventGallery({ label, images, reduceMotion, onOpenPhoto }: EventGalleryProps) {
  const [step, setStep] = useState(0);
  const [hovered, setHovered] = useState<number | null>(null);
  const [compact, setCompact] = useState(false);
  const [failed, setFailed] = useState<Record<number, boolean>>({});
  const len = images.length;
  const paused = hovered !== null || reduceMotion;

  useEffect(() => {
    setStep(0);
    setHovered(null);
    setFailed({});
  }, [label]);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1023px)');
    const update = () => setCompact(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (len <= 1 || paused) return;
    const id = window.setInterval(() => setStep((s) => s + 1), 3000);
    return () => window.clearInterval(id);
  }, [len, paused]);

  if (len === 0) {
    return (
      <div className="flex h-full min-h-[320px] flex-col items-center justify-center gap-3">
        <ImageOff className="h-5 w-5 text-paper/30" />
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-paper/45">No photos from this event yet</p>
      </div>);

  }

  const spreadX = compact ? 14 : 30;
  const spreadY = compact ? 8 : 12;
  const tilt = reduceMotion || compact ? 0 : 3.5;

  return (
    <div className="relative h-full min-h-[320px] w-full overflow-hidden lg:min-h-[352px]">
      <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between">
        <p className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-cyan/70">{label}</p>
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-paper/40">
          {len} photos · click to enlarge
        </p>
      </div>
      <div className="absolute inset-0 mt-10">
        {images.map((src, i) => {
          const slot = (i + step) % len;
          const offset = slot - (len - 1) / 2;
          const isHovered = hovered === i;
          const alt = `${label} photo ${i + 1}`;
          return (
            <motion.button
              key={`${label}-${i}`}
              type="button"
              aria-label={`Open ${alt}`}
              data-cursor="zoom"
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              onFocus={() => setHovered(i)}
              onBlur={() => setHovered(null)}
              onClick={() => onOpenPhoto({ src, alt, label })}
              className={`absolute left-1/2 top-1/2 h-[min(250px,46vw)] w-[min(356px,78%)] cursor-zoom-in overflow-hidden border bg-lift shadow-2xl shadow-black/60 outline-none focus-visible:ring-2 focus-visible:ring-cyan ${
              isHovered ? 'border-cyan ring-2 ring-cyan/70' : 'border-paper/10'}`
              }
              style={{ zIndex: isHovered ? len + 1 : slot }}
              initial={false}
              animate={{
                opacity: 1,
                y: `calc(-50% + ${offset * spreadY}px)`,
                x: `calc(-50% + ${offset * spreadX}px)`,
                rotate: isHovered || reduceMotion ? 0 : offset * tilt,
                scale: isHovered && !reduceMotion ? 1.06 : 1
              }}
              transition={{
                duration: reduceMotion ? 0 : 0.6,
                ease: EASE,
                delay: reduceMotion || step !== 0 || isHovered ? 0 : 0.05 + i * 0.12
              }}>
              
              {failed[i] ?
              <span className="flex h-full w-full items-center justify-center">
                  <ImageOff className="h-5 w-5 text-paper/30" />
                </span> :

              <img
                src={src}
                alt={alt}
                width={600}
                height={400}
                loading="lazy"
                onError={() => setFailed((f) => ({ ...f, [i]: true }))}
                className="pointer-events-none h-full w-full object-cover" />

              }
            </motion.button>);

        })}
      </div>
    </div>);

}