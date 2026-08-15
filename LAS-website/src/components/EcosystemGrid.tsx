import {
  currentBreakpoint,
  depthScale,
  gsap,
  motion,
  prefersReducedMotion,
} from '../lib/motion'
import { useGsapContext } from '../lib/useGsapContext'
import { revealLines } from '../lib/reveal'
import { ecosystem } from '../data/site'
import './ecosystem-grid.css'

const CARD_OFFSETS = [80, 120, 90, 130]

export function EcosystemGrid() {
  const rootRef = useGsapContext<HTMLElement>(({ root, select }) => {
    revealLines(root, select('.ecosystem__title .line-mask > span'))

    const cards = select<HTMLElement>('[data-card]')
    if (cards.length === 0) return

    if (prefersReducedMotion()) {
      gsap.set(cards, { y: 0, opacity: 1, scale: 1 })
      return
    }

    cards.forEach((card, index) => {
      gsap.fromTo(
        card,
        { y: CARD_OFFSETS[index % CARD_OFFSETS.length], opacity: 0, scale: 0.98 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.9,
          delay: index * 0.1,
          ease: motion.revealEase,
          scrollTrigger: { trigger: root, start: 'top 72%' },
        },
      )
    })

    // Artwork drifts inside its clipped frame, independent of the card itself.
    const scale = depthScale(currentBreakpoint())
    gsap.fromTo(
      select('[data-card-art]'),
      { yPercent: -4 * scale },
      {
        yPercent: 4 * scale,
        ease: 'none',
        scrollTrigger: { trigger: root, start: 'top bottom', end: 'bottom top', scrub: motion.scrub },
      },
    )
  }, [])

  return (
    <section className="ecosystem" id="about" ref={rootRef}>
      <div className="shell">
        <header className="ecosystem__head">
          <p className="eyebrow ecosystem__eyebrow">{ecosystem.eyebrow}</p>
          <h2 className="display ecosystem__title">
            {ecosystem.title.split(' with ').map((part, index) => (
              <span className="line-mask" key={part}>
                <span>{index === 0 ? `${part} with` : part}</span>
              </span>
            ))}
          </h2>
        </header>

        <ul className="ecosystem__cards">
          {ecosystem.cards.map((card) => (
            <li className="card" key={card.title} data-card>
              <div className="card__frame">
                <img
                  className="card__art"
                  data-card-art
                  src={card.art}
                  alt={card.alt}
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="card__body">
                <h3 className="card__title">{card.title}</h3>
                <p className="card__text">{card.body}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
