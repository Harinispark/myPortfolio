import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

/** In-app override for the OS `prefers-reduced-motion` setting. */
export type MotionMode = 'system' | 'full' | 'reduced'

interface MotionContextValue {
  /** The visitor's chosen mode. `system` defers to the OS setting. */
  mode: MotionMode
  setMode: (mode: MotionMode) => void
  /** Whether decorative motion should be suppressed right now. */
  reduced: boolean
  /** What the OS reports, regardless of any manual override. */
  systemReduced: boolean
}

const QUERY = '(prefers-reduced-motion: reduce)'

/* oxlint-disable-next-line react/only-export-components */
export const MotionContext = createContext<MotionContextValue | null>(null)

/**
 * Owns the site's motion preference. The OS setting is the default, but the
 * visitor can force "Full" (play everything) or "Reduced" (freeze everything)
 * from the navbar menu — which is the only way to *see* the effects on a
 * machine whose OS asks for reduced motion.
 *
 * The resolved state is mirrored onto <html> as `.motion-full` /
 * `.motion-reduced` so pure-CSS effects (marquee, aurora blobs, sheen) honour
 * the override too, not just the JS-driven ones.
 *
 * The choice is intentionally in-memory: the DB is the source of truth for
 * content, and this is a per-visit viewing preference.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<MotionMode>('system')
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

  const reduced =
    mode === 'reduced' ? true : mode === 'full' ? false : systemReduced

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('motion-reduced', reduced)
    root.classList.toggle('motion-full', !reduced)
    return () => {
      root.classList.remove('motion-reduced', 'motion-full')
    }
  }, [reduced])

  const setMode = useCallback((next: MotionMode) => setModeState(next), [])

  const value = useMemo<MotionContextValue>(
    () => ({ mode, setMode, reduced, systemReduced }),
    [mode, setMode, reduced, systemReduced],
  )

  return <MotionContext.Provider value={value}>{children}</MotionContext.Provider>
}

/* oxlint-disable-next-line react/only-export-components */
export function useMotion(): MotionContextValue {
  const context = useContext(MotionContext)
  if (!context) {
    throw new Error('useMotion must be used within a MotionProvider')
  }
  return context
}
