import { useEffect } from 'react'
import Lenis from 'lenis'

import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

/**
 * Inertial smooth scrolling for the whole app. Lenis drives the *native*
 * scroll position (so motion's `useScroll`, `IntersectionObserver`, anchor
 * links and `position: sticky` all keep working), it just eases the travel.
 *
 * Disabled entirely under `prefers-reduced-motion` — those visitors get
 * instant, native scrolling.
 */
export function SmoothScroll() {
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    if (reduced) return

    const lenis = new Lenis({
      lerp: 0.1,
      wheelMultiplier: 1,
      smoothWheel: true,
      // Let `#anchor` links animate through Lenis; native scroll-padding on
      // `html` already offsets them below the sticky navbar.
      anchors: true,
      autoRaf: true,
    })

    return () => {
      lenis.destroy()
    }
  }, [reduced])

  return null
}
