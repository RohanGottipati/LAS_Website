import { useLayoutEffect, useRef, type RefObject } from 'react'
import { gsap } from './motion'

type ContextSetup = (context: {
  root: HTMLElement
  select: <T extends Element = HTMLElement>(selector: string) => T[]
}) => void

/**
 * One `gsap.context` per section: every tween and ScrollTrigger created inside
 * the callback is reverted together when the section unmounts or deps change.
 */
export function useGsapContext<T extends HTMLElement>(
  setup: ContextSetup,
  deps: unknown[] = [],
): RefObject<T | null> {
  const rootRef = useRef<T | null>(null)

  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root) return
    const ctx = gsap.context(() => {
      setup({
        root,
        select: <E extends Element = HTMLElement>(selector: string) =>
          Array.from(root.querySelectorAll<E>(selector)),
      })
    }, root)
    return () => ctx.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return rootRef
}
