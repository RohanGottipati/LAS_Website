import React, { createContext, useContext, useEffect, useRef, type ReactNode } from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

type SmoothScrollContextValue = {
  scrollTo: (target: string | HTMLElement | number, offset?: number, immediate?: boolean) => void;
  setPaused: (paused: boolean) => void;
};

const SmoothScrollContext = createContext<SmoothScrollContextValue | null>(null);
const scrollSubscribers = new Set<() => void>();

export function subscribeToSmoothScroll(callback: () => void) {
  scrollSubscribers.add(callback);
  return () => scrollSubscribers.delete(callback);
}

export function useSmoothScroll() {
  return useContext(SmoothScrollContext);
}

export function shouldUseLenis(matches: (query: string) => boolean) {
  return !matches('(prefers-reduced-motion: reduce), (pointer: coarse)');
}

export function SmoothScroll({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (!shouldUseLenis((query) => window.matchMedia(query).matches)) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => 1 - Math.pow(1 - t, 4),
      smoothWheel: true
    });
    lenisRef.current = lenis;
    if (document.body.style.overflow === 'hidden') lenis.stop();
    lenis.on('scroll', () => scrollSubscribers.forEach((callback) => callback()));

    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const onAnchorClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }
      const link = (event.target as HTMLElement).closest<HTMLAnchorElement>('a[href]');
      if (!link) return;
      const url = new URL(link.href, window.location.href);
      if (url.origin !== window.location.origin || url.pathname !== window.location.pathname || !url.hash) {
        return;
      }
      const target = document.getElementById(decodeURIComponent(url.hash.slice(1)));
      if (!target) return;
      event.preventDefault();
      lenis.scrollTo(target, { offset: -getHeaderOffset() });
      window.history.pushState(null, '', url.hash);
    };

    document.addEventListener('click', onAnchorClick);
    return () => {
      document.removeEventListener('click', onAnchorClick);
      cancelAnimationFrame(raf);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  const value = {
    scrollTo: (target: string | HTMLElement | number, offset = -getHeaderOffset(), immediate = false) => {
      if (lenisRef.current) lenisRef.current.scrollTo(target, { offset, immediate });
      else if (typeof target === 'number') window.scrollTo({ top: target, behavior: 'auto' });
      else
        (typeof target === 'string' ? document.querySelector<HTMLElement>(target) : target)?.scrollIntoView({
          block: 'start'
        });
    },
    setPaused: (paused: boolean) => {
      if (paused) lenisRef.current?.stop();
      else lenisRef.current?.start();
    }
  };

  return <SmoothScrollContext.Provider value={value}>{children}</SmoothScrollContext.Provider>;
}

function getHeaderOffset() {
  return document.querySelector<HTMLElement>('[data-site-nav]')?.getBoundingClientRect().height ?? 0;
}
