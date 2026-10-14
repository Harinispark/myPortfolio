import { useEffect, type RefObject } from 'react'

/**
 * Traps Tab focus inside `ref` while `active` is true. Moves focus to the
 * first focusable (or `[data-autofocus]`) element when it activates.
 */
export function useFocusTrap(
  ref: RefObject<HTMLElement | null>,
  active: boolean,
) {
  useEffect(() => {
    if (!active) return
    const node = ref.current
    if (!node) return

    const getFocusable = () =>
      Array.from(
        node.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      ).filter(
        (el) => el.offsetParent !== null || el === document.activeElement,
      )

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return
      const items = getFocusable()
      if (items.length === 0) {
        event.preventDefault()
        return
      }
      const first = items[0]
      const last = items[items.length - 1]
      const current = document.activeElement

      if (event.shiftKey && (current === first || current === node)) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && current === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)

    const initial =
      node.querySelector<HTMLElement>('[data-autofocus]') ??
      getFocusable()[0] ??
      null
    initial?.focus()

    return () => document.removeEventListener('keydown', onKeyDown)
  }, [ref, active])
}