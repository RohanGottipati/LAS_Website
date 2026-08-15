import { depthScale, gsap, prefersReducedMotion, ScrollTrigger } from '../lib/motion'
import { useBreakpoint } from '../lib/useBreakpoint'
import { useGsapContext } from '../lib/useGsapContext'
import { revealLines, revealOnEnter } from '../lib/reveal'
import { gallery } from '../data/site'
import './floating-gallery.css'

/** Per-tile depth: unequal vertical velocity is what makes the grid float. */
const DEPTH = [
  { speed: 0.35, x: -20, rotate: -2 },
  { speed: 0.55, x: 12, rotate: 1 },
  { speed: 0.8, x: -8, rotate: 0 },
  { speed: 1.15, x: 18, rotate: 2 },
]

export function FloatingGallery() {
  const breakpoint = useBreakpoint()

  const rootRef = useGsapContext<HTMLElement>(
    ({ root, select }) => {
      revealLines(root, select('.gallery__title .line-mask > span'))
      const tiles = select<HTMLElement>('[data-tile]')

      if (breakpoint === 'mobile' || prefersReducedMotion()) {
        revealOnEnter(root, tiles, { y: 24, stagger: 0.06 })
        return
      }

      const scale = depthScale(breakpoint)

      // A single ScrollTrigger drives every tile from one normalised progress.
      ScrollTrigger.create({
        trigger: root,
        start: 'top bottom',
        end: 'bottom top',
        onUpdate: (self) => {
          const progress = self.progress - 0.5
          tiles.forEach((tile, index) => {
            const depth = DEPTH[index % DEPTH.length]
            gsap.set(tile, {
              y: progress * -220 * depth.speed * scale,
              x: progress * depth.x * scale,
              rotate: depth.rotate * (0.4 + progress * 0.6),
              scale: 1 + (depth.speed - 0.7) * 0.02,
            })
          })
        },
      })
    },
    [breakpoint],
  )

  return (
    <section className="gallery" id="events" ref={rootRef}>
      <div className="shell">
        <header className="gallery__head">
          <p className="eyebrow">{gallery.eyebrow}</p>
          <h2 className="display gallery__title">
            {gallery.title.split(' worth ').map((part, index) => (
              <span className="line-mask" key={part}>
                <span>{index === 0 ? `${part} worth` : part}</span>
              </span>
            ))}
          </h2>
        </header>
      </div>

      <ul className="gallery__tiles">
        {gallery.tiles.map((tile, index) => (
          <li className={`gallery__tile gallery__tile--${index + 1}`} key={tile.caption} data-tile>
            <div className="gallery__frame">
              <img src={tile.art} alt={tile.alt} loading="lazy" decoding="async" />
            </div>
            <span className="gallery__caption">{tile.caption}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
