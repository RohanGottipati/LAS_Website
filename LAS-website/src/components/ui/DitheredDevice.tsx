import './dithered-device.css'

type Props = {
  variant?: 'laptop' | 'laptop-mirrored' | 'tablet'
  className?: string
  patternId?: string
}

/**
 * Halftone-dithered modern device drawn as vector art: a black silhouette
 * filled with a dot pattern so it reads as a 1-bit dither at any size.
 */
export function DitheredDevice({ variant = 'laptop', className, patternId = 'dither-dots' }: Props) {
  const mirrored = variant === 'laptop-mirrored'
  const isTablet = variant === 'tablet'

  return (
    <svg
      className={['device', `device--${variant}`, className].filter(Boolean).join(' ')}
      viewBox="0 0 420 320"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <pattern id={patternId} width="6" height="6" patternUnits="userSpaceOnUse">
          <rect width="6" height="6" fill="var(--ink)" />
          <circle cx="1.5" cy="1.5" r="1.15" fill="var(--paper)" />
          <circle cx="4.5" cy="4.5" r="0.7" fill="var(--paper)" opacity="0.85" />
        </pattern>
      </defs>
      <g transform={mirrored ? 'translate(420,0) scale(-1,1)' : undefined}>
        {isTablet ? (
          <rect x="60" y="24" width="300" height="270" rx="14" fill={`url(#${patternId})`} />
        ) : (
          <>
            <path d="M96 296 L18 296 L106 26 L392 26 L392 296 Z" fill={`url(#${patternId})`} />
            <path
              d="M96 296 L18 296 L106 26 L392 26 L392 296 Z"
              fill="none"
              stroke="var(--ink)"
              strokeWidth="2"
            />
          </>
        )}
        <g className="device__spark" transform="translate(200 165)">
          <path
            d="M0 -26 C4 -8 8 -4 26 0 C8 4 4 8 0 26 C-4 8 -8 4 -26 0 C-8 -4 -4 -8 0 -26 Z"
            fill="var(--paper)"
          />
        </g>
      </g>
    </svg>
  )
}
