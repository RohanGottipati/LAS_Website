import './monogram.css'

type Props = { className?: string; ribbon?: boolean }

/** LAS mark: a four-point star on a teal bookmark ribbon. */
export function Monogram({ className, ribbon = true }: Props) {
  return (
    <span className={['monogram', className].filter(Boolean).join(' ')} aria-hidden="true">
      {ribbon && <span className="monogram__ribbon" />}
      <svg className="monogram__star" viewBox="0 0 48 48" focusable="false">
        <path
          d="M24 4 C27 17 31 21 44 24 C31 27 27 31 24 44 C21 31 17 27 4 24 C17 21 21 17 24 4 Z"
          fill="currentColor"
        />
      </svg>
    </span>
  )
}
