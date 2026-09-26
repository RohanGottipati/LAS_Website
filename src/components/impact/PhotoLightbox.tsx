import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

const EASE = [0.16, 1, 0.3, 1] as const;

export type LightboxPhoto = {src: string;alt: string;label: string;};

interface PhotoLightboxProps {
  photo: LightboxPhoto;
  onClose: () => void;
}

export function PhotoLightbox({ photo, onClose }: PhotoLightboxProps) {
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    previouslyFocused.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    closeRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onCloseRef.current();
        return;
      }
      if (e.key === 'Tab') {
        e.preventDefault();
        closeRef.current?.focus();
      }
    };

    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKey);
      previouslyFocused.current?.focus();
    };
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${photo.label} photo`}>
      
      <button
        ref={closeRef}
        type="button"
        onClick={onClose}
        aria-label="Close photo"
        className="absolute right-6 top-6 z-10 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-paper/70 outline-none transition-colors hover:text-cyan focus-visible:text-cyan focus-visible:ring-1 focus-visible:ring-cyan/60">
        
        Close
        <X className="h-3.5 w-3.5" />
      </button>
      <motion.figure
        className="flex flex-col items-center"
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }}
        transition={{ duration: 0.25, ease: EASE }}
        onClick={(e) => e.stopPropagation()}>
        
        <img
          src={photo.src}
          alt={photo.alt}
          className="max-h-[80vh] max-w-[90vw] border border-cyan/20 object-contain shadow-2xl shadow-black/60" />
        
        <figcaption className="mt-4 font-mono text-[11px] uppercase tracking-[0.2em] text-paper/55">
          {photo.alt}
        </figcaption>
      </motion.figure>
    </motion.div>);

}