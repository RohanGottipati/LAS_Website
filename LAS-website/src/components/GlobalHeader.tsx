import { useEffect, useRef, useState } from 'react'
import { gsap, motion, prefersReducedMotion } from '../lib/motion'
import { Monogram } from './ui/Monogram'
import { nav, site } from '../data/site'
import './global-header.css'

type Props = { revealed: boolean }

export function GlobalHeader({ revealed }: Props) {
  const headerRef = useRef<HTMLElement>(null)
  const [solid, setSolid] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    if (!revealed || prefersReducedMotion()) return
    const items = headerRef.current?.querySelectorAll('[data-header-item]')
    if (!items?.length) return
    const tween = gsap.fromTo(
      items,
      { y: -14, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: motion.revealDuration,
        ease: motion.revealEase,
        stagger: 0.05,
        delay: 0.9,
      },
    )
    return () => {
      tween.kill()
    }
  }, [revealed])

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > window.innerHeight * 0.72)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className="header"
      ref={headerRef}
      data-solid={solid}
      data-revealed={revealed}
      data-open={menuOpen}
    >
      <div className="header__inner">
        <a className="header__brand" href="#top" data-header-item>
          <Monogram />
          <span className="header__word">
            <strong>LAS</strong> CLUB
          </span>
          <span className="visually-hidden">{site.name} home</span>
        </a>

        <nav className="header__nav" aria-label="Primary">
          <ul>
            {nav.map((item) => (
              <li key={item.href} data-header-item>
                <a href={item.href} onClick={() => setMenuOpen(false)}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <button
          type="button"
          className="header__toggle"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
          data-header-item
        >
          {menuOpen ? 'Close' : 'Menu'}
        </button>
      </div>
    </header>
  )
}
