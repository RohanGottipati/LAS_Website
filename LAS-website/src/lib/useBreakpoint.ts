import { useEffect, useState } from 'react'
import { BREAKPOINTS, currentBreakpoint, type Breakpoint } from './motion'

/**
 * Tracks the active layout tier so sections can rebuild their timelines when
 * the viewport crosses a breakpoint (mobile drops pinning entirely).
 */
export function useBreakpoint(): Breakpoint {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>(() => currentBreakpoint())

  useEffect(() => {
    const queries = [
      window.matchMedia(`(min-width: ${BREAKPOINTS.tablet}px)`),
      window.matchMedia(`(min-width: ${BREAKPOINTS.desktop}px)`),
    ]
    const update = () => setBreakpoint(currentBreakpoint())
    queries.forEach((query) => query.addEventListener('change', update))
    update()
    return () => queries.forEach((query) => query.removeEventListener('change', update))
  }, [])

  return breakpoint
}
