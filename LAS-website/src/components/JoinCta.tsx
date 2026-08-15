import { depthScale, gsap, motion, prefersReducedMotion } from '../lib/motion'
import { useBreakpoint } from '../lib/useBreakpoint'
import { useGsapContext } from '../lib/useGsapContext'
import { revealLines, revealOnEnter } from '../lib/reveal'
import { StackedLabelButton } from './ui/StackedLabelButton'
import { joinCta } from '../data/site'
import './join-cta.css'

/** Full-bleed cinematic band: artwork settles while the copy steps in. */
export function JoinCta() {
  const breakpoint = useBreakpoint()

  const rootRef = useGsapContext<HTMLElement>(
    ({ root, select }) => {
      revealLines(root, select('.join__title .line-mask > span'))
      revealOnEnter(root, select('[data-join-reveal]'), { y: 22, start: 'top 74%' })

      if (prefersReducedMotion()) return
      const scale = depthScale(breakpoint)

      gsap.fromTo(
        select('[data-join-art]'),
        { scale: 1.08 },
        {
          scale: 1,
          duration: 1.6,
          ease: motion.cinematicEase,
          scrollTrigger: { trigger: root, start: 'top 85%' },
        },
      )

      gsap.fromTo(
        select('[data-join-art]'),
        { yPercent: -3 * scale },
        {
          yPercent: 3 * scale,
          ease: 'none',
          scrollTrigger: { trigger: root, start: 'top bottom', end: 'bottom top', scrub: motion.scrub },
        },
      )
    },
    [breakpoint],
  )

  return (
    <section className="join" id="future-events" ref={rootRef}>
      <div className="join__media">
        <img
          className="join__art"
          data-join-art
          src="/art/cta-cinematic.webp"
          alt=""
          loading="lazy"
          decoding="async"
        />
      </div>

      <div className="shell join__content">
        <p className="eyebrow join__eyebrow" data-join-reveal>
          {joinCta.eyebrow}
        </p>
        <h2 className="display join__title">
          {joinCta.title.split(' is ').map((part, index) => (
            <span className="line-mask" key={part}>
              <span>{index === 0 ? `${part} is` : part}</span>
            </span>
          ))}
        </h2>
        <p className="join__body" data-join-reveal>
          {joinCta.body}
        </p>
        <div data-join-reveal>
          <StackedLabelButton href={joinCta.cta.href} variant="light">
            {joinCta.cta.label}
          </StackedLabelButton>
        </div>
      </div>
    </section>
  )
}
