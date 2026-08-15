import { useEffect, useRef } from 'react'
import { gsap, lockScroll, motion, prefersReducedMotion } from '../lib/motion'
import { Monogram } from './ui/Monogram'
import { site } from '../data/site'
import './site-preloader.css'

type Props = {
  /** Fired as soon as the hero artwork is ready — the hero builds underneath. */
  onReveal: () => void
  /** Fired when the mask has finished opening and the page is interactive. */
  onComplete: () => void
}

const DECODE_TIMEOUT_MS = 2500

/** Waits for the hero artwork, never longer than the timeout. */
function heroArtReady(): Promise<void> {
  const image = document.querySelector<HTMLImageElement>('[data-hero-art]')
  const settled = image
    ? image.complete
      ? Promise.resolve()
      : image.decode().catch(() => undefined)
    : Promise.resolve()

  return Promise.race([
    settled,
    new Promise<void>((resolve) => {
      window.setTimeout(resolve, DECODE_TIMEOUT_MS)
    }),
  ]).then(() => undefined)
}

/**
 * The loader is not a separate page: the hero is already mounted beneath it and
 * this panel simply masks itself open once the artwork has decoded.
 */
export function SitePreloader({ onReveal, onComplete }: Props) {
  const panelRef = useRef<HTMLDivElement>(null)
  const barRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    lockScroll(true)
    let cancelled = false

    const finish = () => {
      lockScroll(false)
      onComplete()
    }

    if (prefersReducedMotion()) {
      onReveal()
      const id = window.setTimeout(finish, 200)
      return () => {
        window.clearTimeout(id)
        lockScroll(false)
      }
    }

    const timeline = gsap.timeline({ paused: true })
    timeline
      .to(barRef.current, { scaleX: 1, duration: 1.1, ease: 'power2.inOut' }, 0)
      .to(panelRef.current, { opacity: 1, duration: 0.01 }, 0)
      .to(
        panelRef.current,
        {
          clipPath: 'inset(0% 0% 100% 0%)',
          duration: 0.6,
          ease: motion.cinematicEase,
          onComplete: finish,
        },
        0.95,
      )

    void heroArtReady().then(() => {
      if (cancelled) return
      onReveal()
      timeline.play()
    })

    return () => {
      cancelled = true
      timeline.kill()
      lockScroll(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="preloader" ref={panelRef} aria-hidden="true">
      <div className="preloader__inner">
        <Monogram className="monogram--plain preloader__mark" ribbon={false} />
        <span className="preloader__word">{site.name}</span>
        <span className="preloader__track">
          <span className="preloader__bar" ref={barRef} />
        </span>
      </div>
    </div>
  )
}
