import { gsap, prefersReducedMotion } from '../lib/motion'
import { useGsapContext } from '../lib/useGsapContext'
import { revealLines, revealOnEnter } from '../lib/reveal'
import { DitherField } from './ui/DitherField'
import { StackedLabelButton } from './ui/StackedLabelButton'
import { bridge, practices } from '../data/site'
import './tools-bridge.css'

const MARQUEE_SECONDS = 32

export function ToolsBridge() {
  const rootRef = useGsapContext<HTMLElement>(({ root, select }) => {
    revealLines(root, select('.bridge__statement .line-mask > span'))
    revealOnEnter(root, select('[data-bridge-reveal]'), { y: 20 })

    if (prefersReducedMotion()) return

    // Duplicated list translated by exactly one copy height for a seamless loop.
    const track = root.querySelector<HTMLElement>('[data-marquee-track]')
    if (!track) return
    gsap.to(track, {
      yPercent: -50,
      duration: MARQUEE_SECONDS,
      ease: 'none',
      repeat: -1,
    })
  }, [])

  return (
    <section className="bridge" id="programmes" ref={rootRef}>
      <div className="bridge__dither" aria-hidden="true">
        <DitherField columns={60} rows={10} cell={16} seed={23} className="dither-field--wave" />
      </div>

      <div className="shell bridge__grid">
        <div className="bridge__marquee" aria-hidden="true">
          <ul className="bridge__track" data-marquee-track>
            {[...practices, ...practices].map((item, index) => (
              <li key={`${item.name}-${index}`}>
                <span className="bridge__name">{item.name}</span>
                <span className="bridge__note">{item.note}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bridge__copy">
          <p className="eyebrow" data-bridge-reveal>
            {bridge.eyebrow}
          </p>
          <h2 className="display bridge__statement">
            {bridge.statement.split(', ').map((line, index, all) => (
              <span className="line-mask" key={line}>
                <span>{index < all.length - 1 ? `${line},` : line}</span>
              </span>
            ))}
          </h2>
          <ul className="bridge__list">
            {practices.map((item) => (
              <li key={item.name} data-bridge-reveal>
                <span className="bridge__name">{item.name}</span>
                <span className="bridge__note">{item.note}</span>
              </li>
            ))}
          </ul>
          <div data-bridge-reveal>
            <StackedLabelButton href={bridge.cta.href} variant="outline">
              {bridge.cta.label}
            </StackedLabelButton>
          </div>
        </div>
      </div>
    </section>
  )
}
