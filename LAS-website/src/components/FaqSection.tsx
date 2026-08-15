import { useGsapContext } from '../lib/useGsapContext'
import { revealLines, revealOnEnter } from '../lib/reveal'
import { faq } from '../data/site'
import './faq-section.css'

export function FaqSection() {
  const rootRef = useGsapContext<HTMLElement>(({ root, select }) => {
    revealLines(root, select('.faq__title .line-mask > span'))
    revealOnEnter(root, select('[data-faq-item]'), { y: 18, stagger: 0.07 })
  }, [])

  return (
    <section className="faq" id="faq" ref={rootRef}>
      <div className="shell faq__grid">
        <h2 className="display faq__title">
          <span className="line-mask">
            <span>Questions,</span>
          </span>
          <span className="line-mask">
            <span>answered.</span>
          </span>
        </h2>

        <dl className="faq__list">
          {faq.map((item) => (
            <div className="faq__item" key={item.q} data-faq-item>
              <dt>{item.q}</dt>
              <dd>{item.a}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
