import { gsap, motion, prefersReducedMotion } from '../lib/motion'
import { useGsapContext } from '../lib/useGsapContext'
import { revealLines } from '../lib/reveal'
import { impact } from '../data/site'
import './impact-stats.css'

const CARD_START = [
  { y: 70, rotate: -1.5 },
  { y: 110, rotate: 1.2 },
  { y: 60, rotate: -0.8 },
  { y: 120, rotate: 1.5 },
  { y: 90, rotate: -1.2 },
]

export function ImpactStats() {
  const rootRef = useGsapContext<HTMLElement>(({ root, select }) => {
    revealLines(root, select('.impact__title .line-mask > span'))

    const collage = root.querySelector('[data-collage]')
    const cards = select<HTMLElement>('[data-stat]')
    const reduced = prefersReducedMotion()

    if (collage && !reduced) {
      gsap.fromTo(
        collage,
        { clipPath: 'inset(100% 0% 0% 0%)', scale: 1.04 },
        {
          clipPath: 'inset(0% 0% 0% 0%)',
          scale: 1,
          duration: 1.1,
          ease: motion.cinematicEase,
          scrollTrigger: { trigger: root, start: 'top 70%' },
        },
      )
    }

    cards.forEach((card, index) => {
      const from = CARD_START[index % CARD_START.length]
      if (reduced) {
        gsap.set(card, { opacity: 1, y: 0, rotate: 0 })
      } else {
        gsap.fromTo(
          card,
          { y: from.y, rotate: from.rotate, opacity: 0 },
          {
            y: 0,
            rotate: 0,
            opacity: 1,
            duration: 0.85,
            delay: index * 0.09,
            ease: motion.revealEase,
            scrollTrigger: { trigger: root, start: 'top 62%' },
          },
        )
      }

      // Counters run once, when the section is meaningfully in view.
      const valueEl = card.querySelector<HTMLElement>('[data-value]')
      const target = Number(valueEl?.dataset.value ?? 0)
      if (!valueEl || !target) return
      if (reduced) {
        valueEl.textContent = String(target)
        return
      }
      const counter = { current: 0 }
      gsap.to(counter, {
        current: target,
        duration: 1.2,
        ease: 'power2.out',
        scrollTrigger: { trigger: root, start: 'top 65%' },
        onUpdate: () => {
          valueEl.textContent = String(Math.round(counter.current))
        },
      })
    })
  }, [])

  return (
    <section className="impact" ref={rootRef}>
      <div className="shell impact__grid">
        <div className="impact__copy">
          <p className="eyebrow">{impact.eyebrow}</p>
          <h2 className="display impact__title">
            {impact.title.split(', ').map((line, index, all) => (
              <span className="line-mask" key={line}>
                <span>{index < all.length - 1 ? `${line},` : line}</span>
              </span>
            ))}
          </h2>
          <p className="impact__note">{impact.note}</p>
        </div>

        <div className="impact__collage" data-collage>
          <img
            src="/art/stats-collage.webp"
            alt="Painting of Adélaïde Labille-Guiard at her easel with two students"
            loading="lazy"
            decoding="async"
          />
        </div>

        <ul className="impact__stats">
          {impact.stats.map((stat) => (
            <li className={`stat stat--${stat.tone}`} key={stat.label} data-stat>
              <p className="stat__value">
                <span data-value={stat.value}>0</span>
                {stat.suffix}
              </p>
              <p className="stat__label">{stat.label}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
