import { useContext, useEffect, useState } from 'react'

import { MotionContext } from '@/context/MotionContext'

const QUERY = '(prefers-reduced-motion: reduce)'

/**
 * True when decorative motion should be suppressed.
 *
 * Honours the in-app Motion toggle (System / Full / Reduced) when a
 * `MotionProvider` is present, and falls back to the raw OS media query
 * otherwise — so the hook keeps working anywhere it is used.
 */
export function usePrefersReducedMotion(): boolean {
  const context = useContext(MotionContext)
  const [systemReduced, setSystemReduced] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia(QUERY).matches
  })

  useEffect(() => {
    const query = window.matchMedia(QUERY)
    const onChange = () => setSystemReduced(query.matches)
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [])

  return context ? context.reduced : systemReduced
}
