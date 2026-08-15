import { gsap, motion, prefersReducedMotion } from './motion'

type RevealOptions = {
  y?: number
  stagger?: number
  start?: string
  duration?: number
}

/**
 * Standard one-shot entrance used by the editorial sections: clipped lines
 * slide up, everything else rises and fades. Reduced motion simply pins the
 * end state.
 */
export function revealOnEnter(
  trigger: Element,
  targets: Element[],
  { y = 26, stagger = motion.stagger, start = 'top 82%', duration = motion.revealDuration }: RevealOptions = {},
): void {
  if (targets.length === 0) return
  if (prefersReducedMotion()) {
    gsap.set(targets, { opacity: 1, y: 0, yPercent: 0 })
    return
  }
  gsap.fromTo(
    targets,
    { y, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration,
      stagger,
      ease: motion.revealEase,
      scrollTrigger: { trigger, start },
    },
  )
}

/** Clipped headline lines (`.line-mask > span`) rising into place. */
export function revealLines(trigger: Element, lines: Element[], start = 'top 80%'): void {
  if (lines.length === 0) return
  if (prefersReducedMotion()) {
    gsap.set(lines, { yPercent: 0 })
    return
  }
  gsap.fromTo(
    lines,
    { yPercent: 108 },
    {
      yPercent: 0,
      duration: motion.revealDuration,
      stagger: motion.stagger,
      ease: motion.revealEase,
      scrollTrigger: { trigger, start },
    },
  )
}
