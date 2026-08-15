import { depthScale, gsap, motion, prefersReducedMotion } from '../lib/motion'
import { useBreakpoint } from '../lib/useBreakpoint'
import { useGsapContext } from '../lib/useGsapContext'
import { revealLines, revealOnEnter } from '../lib/reveal'
import { DitheredDevice } from './ui/DitheredDevice'
import { framework } from '../data/site'
import './framework-scene.css'

/**
 * The pinned editorial scene: background, device and cards are all driven by a
 * single scrubbed timeline so the composition assembles as you scroll and takes
 * itself apart cleanly on the way back up.
 */
/** Resting horizontal offset per card, in % of card width. */
const CARD_REST = [0, -6, 4]

export function FrameworkScene() {
  const breakpoint = useBreakpoint()

  const rootRef = useGsapContext<HTMLElement>(
    ({ root, select }) => {
      const cards = select('[data-scene-card]')

      if (breakpoint === 'mobile' || prefersReducedMotion()) {
        if (breakpoint !== 'mobile') {
          gsap.set(cards, { xPercent: (index: number) => CARD_REST[index % CARD_REST.length] })
        }
        revealLines(root, select('.scene__title .line-mask > span'))
        revealOnEnter(root, cards, { y: 24 })
        return
      }

      const scale = depthScale(breakpoint)
      const timeline = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: root,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.8,
        },
      })

      timeline
        .fromTo('[data-scene-bg]', { scale: 1.05, yPercent: -2 }, { scale: 1, yPercent: 0 }, 0)
        .fromTo(
          '.scene__device',
          { xPercent: -18 * scale, yPercent: 6 * scale, scale: 0.94, rotate: -1.5 },
          { xPercent: 0, yPercent: 0, scale: 1, rotate: 0 },
          0.05,
        )
        .fromTo(
          '[data-scene-title] .line-mask > span',
          { yPercent: 108 },
          { yPercent: 0, ease: motion.revealEase, stagger: 0.06, duration: 0.25 },
          0.12,
        )

      cards.forEach((card, index) => {
        // Cards rest on a staggered offset, so entrance values compose with it.
        const rest = CARD_REST[index % CARD_REST.length]
        timeline.fromTo(
          card,
          {
            xPercent: rest + (index % 2 === 0 ? -18 : 18) * scale,
            y: 40 * scale,
            opacity: 0,
          },
          { xPercent: rest, y: 0, opacity: 1, duration: 0.28, ease: motion.revealEase },
          0.35 + index * 0.16,
        )
      })

      timeline.to('[data-scene-inner]', { yPercent: -4 * scale, duration: 0.2 }, 0.82)
    },
    [breakpoint],
  )

  return (
    <section className="scene" ref={rootRef}>
      <div className="scene__stage" data-scene-stage>
        <div className="scene__inner" data-scene-inner>
          <img
            className="scene__bg"
            data-scene-bg
            src="/art/framework-bg.webp"
            alt=""
            loading="lazy"
            decoding="async"
          />
          <div className="scene__scrim" />

          <div className="shell scene__layout">
            <div className="scene__copy" data-scene-title>
              <p className="eyebrow scene__eyebrow">{framework.eyebrow}</p>
              <h2 className="display scene__title">
                {framework.title.split(', ').map((line, index, all) => (
                  <span className="line-mask" key={line}>
                    <span>{index < all.length - 1 ? `${line},` : line}</span>
                  </span>
                ))}
              </h2>
            </div>

            <DitheredDevice className="scene__device" patternId="scene-dither-dots" />

            <ul className="scene__cards">
              {framework.steps.map((step) => (
                <li className="scene__card" key={step.title} data-scene-card>
                  <h3>{step.title}</h3>
                  <p>{step.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
