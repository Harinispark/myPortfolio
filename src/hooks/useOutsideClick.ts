import { useEffect, type RefObject } from 'react'

/** Calls `handler` when a pointer-down lands outside of `ref`. */
export function useOutsideClick(
  ref: RefObject<HTMLElement | null>,
  handler: () => void,
  active = true,
) {
  useEffect(() => {
    if (!active) return
    const onPointerDown = (event: PointerEvent) => {
      const node = ref.current
      if (!node || node.contains(event.target as Node)) return
      handler()
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [ref, handler, active])
}