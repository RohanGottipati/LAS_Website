import { useGsapContext } from '../lib/useGsapContext'
import { revealOnEnter } from '../lib/reveal'
import { Monogram } from './ui/Monogram'
import { nav, site } from '../data/site'
import './site-footer.css'

export function SiteFooter() {
  const rootRef = useGsapContext<HTMLElement>(({ root, select }) => {
    revealOnEnter(root, select('[data-footer-reveal]'), { y: 18, start: 'top 92%' })
  }, [])

  return (
    <footer className="footer" ref={rootRef}>
      <div className="shell footer__grid">
        <div className="footer__brand" data-footer-reveal>
          <Monogram className="monogram--plain" ribbon={false} />
          <p className="footer__word">{site.name}</p>
          <p className="footer__tagline">{site.tagline}</p>
        </div>

        <nav className="footer__nav" aria-label="Footer" data-footer-reveal>
          <ul>
            {nav.map((item) => (
              <li key={item.href}>
                <a href={item.href}>{item.label}</a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="footer__contact" data-footer-reveal>
          <p className="eyebrow">Get in touch</p>
          <a className="footer__email" href={`mailto:${site.email}`}>
            {site.email}
          </a>
        </div>
      </div>

      <div className="shell footer__meta" data-footer-reveal>
        <p>
          © {new Date().getFullYear()} {site.name}. Run by students.
        </p>
        <p>
          Artwork: public-domain (CC0) works from{' '}
          <a href="https://www.metmuseum.org/about-the-met/policies-and-documents/open-access">
            The Metropolitan Museum of Art Open Access
          </a>
          . Full credits in <code>/art/credits.json</code>.
        </p>
      </div>
    </footer>
  )
}
