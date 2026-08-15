import { useMemo } from 'react'
import './dither-field.css'

type Props = {
  /** Grid columns; rows are derived from the aspect ratio. */
  columns?: number
  rows?: number
  cell?: number
  seed?: number
  className?: string
}

function mulberry32(seed: number) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/**
 * Programmatic dither/pixel field: a deterministic scatter of small squares
 * whose density falls off towards the top-right, mirroring the reference art
 * direction without shipping a raster texture.
 */
export function DitherField({ columns = 48, rows = 18, cell = 14, seed = 7, className }: Props) {
  const squares = useMemo(() => {
    const random = mulberry32(seed)
    const out: { x: number; y: number; s: number; o: number; teal: boolean }[] = []
    for (let row = 0; row < rows; row += 1) {
      for (let col = 0; col < columns; col += 1) {
        const fromBottom = (rows - row) / rows
        const fromLeft = (columns - col) / columns
        const density = Math.min(1, fromBottom * 0.85 + fromLeft * 0.5)
        if (random() > density * 0.9) continue
        const size = random() > 0.82 ? 5 : 3
        out.push({
          x: col * cell + (random() * 2 - 1),
          y: row * cell + (random() * 2 - 1),
          s: size,
          o: 0.25 + random() * 0.65,
          teal: random() > 0.45,
        })
      }
    }
    return out
  }, [columns, rows, cell, seed])

  return (
    <svg
      className={['dither-field', className].filter(Boolean).join(' ')}
      viewBox={`0 0 ${columns * cell} ${rows * cell}`}
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      {squares.map((square, index) => (
        <rect
          key={index}
          x={square.x}
          y={square.y}
          width={square.s}
          height={square.s}
          opacity={square.o}
          className={square.teal ? 'dither-field__teal' : 'dither-field__ink'}
        />
      ))}
    </svg>
  )
}
