import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/** Shared timing vocabulary — every section pulls its durations from here. */
export const motion = {
  revealDuration: 0.7,
  fastDuration: 0.3,
  stagger: 0.08,
  revealEase: 'power3.out',
  cinematicEase: 'power4.inOut',
  scrub: 0.7,
} as const

export type Breakpoint = 'mobile' | 'tablet' | 'desktop'

export const BREAKPOINTS = { tablet: 768, desktop: 1200 } as const

export function currentBreakpoint(): Breakpoint {
  if (typeof window === 'undefined') return 'desktop'
  if (window.matchMedia(`(min-width: ${BREAKPOINTS.desktop}px)`).matches) return 'desktop'
  if (window.matchMedia(`(min-width: ${BREAKPOINTS.tablet}px)`).matches) return 'tablet'
  return 'mobile'
}

/** Tablet keeps the choreography but at ~65% travel; mobile drops heavy motion. */
export function depthScale(breakpoint: Breakpoint): number {
  if (breakpoint === 'desktop') return 1
  if (breakpoint === 'tablet') return 0.65
  return 0.35
}

export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function lockScroll(locked: boolean): void {
  document.body.dataset.scrollLocked = String(locked)
}

/** ScrollTrigger needs a nudge once fonts and lazy artwork have settled. */
export function refreshScrollTriggersWhenSettled(): void {
  const refresh = () => ScrollTrigger.refresh()
  if (document.fonts?.status === 'loaded') refresh()
  else void document.fonts?.ready.then(refresh)
  window.addEventListener('load', refresh, { once: true })
}

export { gsap, ScrollTrigger }
