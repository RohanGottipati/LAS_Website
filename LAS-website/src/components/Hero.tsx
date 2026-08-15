import { useEffect } from 'react'
import {
  currentBreakpoint,
  depthScale,
  gsap,
  motion,
  prefersReducedMotion,
} from '../lib/motion'
import { useGsapContext } from '../lib/useGsapContext'
import { DitherField } from './ui/DitherField'
import { DitheredDevice } from './ui/DitheredDevice'
import { StackedLabelButton } from './ui/StackedLabelButton'
import { hero } from '../data/site'
import './hero.css'

type Props = { start: boolean }

export function Hero({ start }: Props) {
  // Scroll-linked depth: artwork drifts down, text and dither drift up.
  const rootRef = useGsapContext<HTMLElement>(({ root }) => {
    if (prefersReducedMotion()) return
    const scale = depthScale(currentBreakpoint())

    gsap
      .timeline({
        scrollTrigger: {
          trigger: root,
          start: 'top top',
          end: 'bottom top',
          scrub: motion.scrub,
        },
      })
      .to('[data-hero-art-frame]', { y: 60 * scale, ease: 'none' }, 0)
      .to('[data-hero-copy]', { y: -20 * scale, ease: 'none' }, 0)
      .to('[data-hero-dither]', { y: -35 * scale, ease: 'none' }, 0)
  }, [])

  useEffect(() => {
    const root = rootRef.current
    if (!start || !root) return

    const pick = (selector: string) => Array.from(root.querySelectorAll(selector))

    if (prefersReducedMotion()) {
      gsap.set(pick('[data-hero-reveal]'), { opacity: 1, y: 0 })
      gsap.set(pick('.hero__line > span'), { yPercent: 0 })
      return
    }

    const timeline = gsap.timeline({ defaults: { ease: motion.revealEase } })
    timeline
      .fromTo(
        pick('[data-hero-art]'),
        { scale: 1.08, yPercent: 2 },
        { scale: 1, yPercent: 0, duration: 1.4, ease: 'power2.out' },
        0.1,
      )
      .fromTo(
        pick('[data-hero-dither] rect'),
        { opacity: 0, scale: 0.4, transformOrigin: 'center' },
        {
          opacity: (_index: number, target: Element) =>
            Number(target.getAttribute('opacity') ?? 1),
          scale: 1,
          duration: 0.5,
          stagger: { each: 0.0018, from: 'random' },
        },
        0.25,
      )
      .fromTo(
        pick('.hero__line > span'),
        { yPercent: 108 },
        { yPercent: 0, duration: motion.revealDuration, stagger: motion.stagger },
        0.55,
      )
      .fromTo(
        pick('[data-hero-cta]'),
        { y: 18, opacity: 0 },
        { y: 0, opacity: 1, duration: motion.revealDuration },
        0.75,
      )

    return () => {
      timeline.kill()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [start])

  return (
    <section className="hero" id="top" ref={rootRef} data-started={start}>
      <div className="hero__art" data-hero-art-frame>
        <img
          src="/art/hero-figure.webp"
          alt="Detail of Johannes Vermeer’s painting of a young woman at a window with a water pitcher"
          data-hero-art
          width={1500}
          height={1900}
          fetchPriority="high"
          decoding="async"
        />
      </div>

      <div className="hero__dither" data-hero-dither>
        <DitherField columns={44} rows={16} cell={15} seed={11} />
      </div>

      <DitheredDevice className="hero__device" patternId="hero-dither-dots" />

      <div className="shell hero__grid">
        <div className="hero__copy" data-hero-copy>
          <h1 className="display hero__headline">
            {hero.headlineLines.map((line) => (
              <span className="line-mask hero__line" key={line}>
                <span>{line}</span>
              </span>
            ))}
          </h1>
          <div className="hero__actions" data-hero-reveal data-hero-cta>
            <StackedLabelButton href={hero.cta.href}>{hero.cta.label}</StackedLabelButton>
            <a className="hero__link" href={hero.secondary.href}>
              {hero.secondary.label}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
