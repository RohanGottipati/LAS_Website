import { depthScale, gsap, motion, prefersReducedMotion } from '../lib/motion'
import { useBreakpoint } from '../lib/useBreakpoint'
import { useGsapContext } from '../lib/useGsapContext'
import { revealLines, revealOnEnter } from '../lib/reveal'
import { team } from '../data/site'
import './team-editorial.css'

export function TeamEditorial() {
  const breakpoint = useBreakpoint()

  const rootRef = useGsapContext<HTMLElement>(
    ({ root, select }) => {
      revealLines(root, select('.team__title .line-mask > span'))
      revealOnEnter(root, select('[data-team-reveal]'), { y: 24 })

      if (prefersReducedMotion()) return
      const scale = depthScale(breakpoint)

      gsap.fromTo(
        select('[data-team-art]'),
        { yPercent: -5 * scale },
        {
          yPercent: 5 * scale,
          ease: 'none',
          scrollTrigger: { trigger: root, start: 'top bottom', end: 'bottom top', scrub: motion.scrub },
        },
      )

      gsap.fromTo(
        select('[data-team-quote]'),
        { clipPath: 'inset(0% 0% 100% 0%)', y: 20 },
        {
          clipPath: 'inset(0% 0% 0% 0%)',
          y: 0,
          duration: 0.9,
          stagger: 0.12,
          ease: motion.revealEase,
          scrollTrigger: { trigger: root, start: 'top 62%' },
        },
      )
    },
    [breakpoint],
  )

  return (
    <section className="team" id="team" ref={rootRef}>
      <div className="shell team__grid">
        <figure className="team__figure">
          <div className="team__frame">
            <img
              data-team-art
              src="/art/research-tall.webp"
              alt="Painting of the light-filled interior of the Oude Kerk in Delft"
              loading="lazy"
              decoding="async"
            />
          </div>
          <figcaption>Committee meetings, held wherever the light is best.</figcaption>
        </figure>

        <div className="team__copy">
          <p className="eyebrow" data-team-reveal>
            {team.eyebrow}
          </p>
          <h2 className="display team__title">
            {team.title.split(', ').map((line, index, all) => (
              <span className="line-mask" key={line}>
                <span>{index < all.length - 1 ? `${line},` : line}</span>
              </span>
            ))}
          </h2>
          <p className="lede" data-team-reveal>
            {team.body}
          </p>

          <div className="team__stack">
            {team.quotes.map((item) => (
              <blockquote className="team__quote" key={item.author} data-team-quote>
                <p>“{item.quote}”</p>
                <cite>{item.author}</cite>
              </blockquote>
            ))}
            <div className="team__paper" aria-hidden="true">
              <img src="/art/research-detail.webp" alt="" loading="lazy" decoding="async" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
