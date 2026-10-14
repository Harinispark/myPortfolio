import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { cn } from '@/lib/cn'

interface LetterboxProps {
  /** When true the bars are in place (framing the intro); false retracts them. */
  closed: boolean
}

/**
 * Cinematic letterbox bars. They sit over the intro splash (above it in the
 * stacking order) and retract off-screen once the story starts, uncovering the
 * page like a film opening to full frame.
 *
 * Skipped entirely under reduced motion.
 */
export function Letterbox({ closed }: LetterboxProps) {
  const reduced = usePrefersReducedMotion()
  if (reduced) return null

  const bar =
    'pointer-events-none fixed inset-x-0 z-[60] h-14 bg-ink transition-transform duration-700 ease-[cubic-bezier(0.2,0.7,0.2,1)]'

  return (
    <>
      <div
        aria-hidden="true"
        className={cn(bar, 'top-0', closed ? 'translate-y-0' : '-translate-y-full')}
      />
      <div
        aria-hidden="true"
        className={cn(bar, 'bottom-0', closed ? 'translate-y-0' : 'translate-y-full')}
      />
    </>
  )
}
