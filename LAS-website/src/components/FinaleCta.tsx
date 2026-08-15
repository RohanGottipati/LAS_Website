import { depthScale, gsap, motion, prefersReducedMotion } from '../lib/motion'
import { useBreakpoint } from '../lib/useBreakpoint'
import { useGsapContext } from '../lib/useGsapContext'
import { revealLines } from '../lib/reveal'
import { DitheredDevice } from './ui/DitheredDevice'
import { StackedLabelButton } from './ui/StackedLabelButton'
import { finale } from '../data/site'
import './finale-cta.css'

/** Closing scene: two opposing dithered devices converge on a centred statement. */
export function FinaleCta() {
  const breakpoint = useBreakpoint()

  const rootRef = useGsapContext<HTMLElement>(
    ({ root, select }) => {
      revealLines(root, select('.finale__title .line-mask > span'), 'top 68%')

      if (prefersReducedMotion()) {
        gsap.set(select('[data-finale-cta]'), { opacity: 1, y: 0 })
        return
      }

      const scale = depthScale(breakpoint)
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: 'top 85%',
          end: 'center 45%',
          scrub: motion.scrub,
        },
      })

      timeline
        .fromTo('[data-finale-bg]', { scale: 1.04 }, { scale: 1, ease: 'none' }, 0)
        .fromTo(
          '.finale__device--left',
          { xPercent: -14 * scale, rotate: -2 },
          { xPercent: 0, rotate: 0, ease: 'none' },
          0,
        )
        .fromTo(
          '.finale__device--right',
          { xPercent: 14 * scale, rotate: 2 },
          { xPercent: 0, rotate: 0, ease: 'none' },
          0,
        )

      gsap.fromTo(
        select('[data-finale-cta]'),
        { y: 18, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: motion.revealDuration,
          delay: 0.15,
          ease: motion.revealEase,
          scrollTrigger: { trigger: root, start: 'top 62%' },
        },
      )
    },
    [breakpoint],
  )

  return (
    <section className="finale" ref={rootRef}>
      <img
        className="finale__bg"
        data-finale-bg
        src="/art/finale-bg.webp"
        alt=""
        loading="lazy"
        decoding="async"
      />
      <div className="finale__scrim" />

      <DitheredDevice
        className="finale__device finale__device--left"
        patternId="finale-dither-left"
        variant="laptop"
      />
      <DitheredDevice
        className="finale__device finale__device--right"
        patternId="finale-dither-right"
        variant="laptop-mirrored"
      />

      <div className="shell finale__content">
        <h2 className="display finale__title">
          {finale.title.split(' you ').map((part, index) => (
            <span className="line-mask" key={part}>
              <span>{index === 0 ? `${part} you` : part}</span>
            </span>
          ))}
        </h2>
        <div data-finale-cta>
          <StackedLabelButton href={finale.cta.href} variant="light">
            {finale.cta.label}
          </StackedLabelButton>
        </div>
      </div>
    </section>
  )
}
