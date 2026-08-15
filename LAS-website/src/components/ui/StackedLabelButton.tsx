import type { ReactNode } from 'react'
import './stacked-label-button.css'

type Props = {
  href: string
  children: ReactNode
  variant?: 'solid' | 'outline' | 'light'
  className?: string
}

/**
 * Editorial pill CTA. The label is duplicated so hover can slide the first copy
 * out and the second copy in without touching layout properties.
 */
export function StackedLabelButton({ href, children, variant = 'solid', className }: Props) {
  return (
    <a
      href={href}
      className={['btn', `btn--${variant}`, className].filter(Boolean).join(' ')}
      data-stacked-label
    >
      <span className="btn__labels" aria-hidden="true">
        <span className="btn__label">{children}</span>
        <span className="btn__label btn__label--under">{children}</span>
      </span>
      <span className="visually-hidden">{children}</span>
    </a>
  )
}
