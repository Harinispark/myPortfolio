import { accentClassName } from '@/lib/accents'
import { cn } from '@/lib/cn'

import type { Accent } from '@/types'

interface ProgressBarProps {
  value: number
  accent?: Accent
  ariaLabel?: string
  className?: string
}

/** A "watch progress" bar. Value 0–100; accent drives the fill colour. */
export function ProgressBar({
  value,
  accent = 'red',
  ariaLabel,
  className,
}: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, value))

  return (
    <div
      role="progressbar"
      aria-valuenow={Math.round(clamped)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={ariaLabel}
      className={cn(
        'h-1.5 w-full overflow-hidden rounded-full bg-white/10',
        accentClassName[accent],
        className,
      )}
    >
      <div
        className="h-full rounded-full bg-linear-to-r from-[var(--accent)] to-[var(--accent-bright)] transition-[width] duration-500 ease-out"
        style={{ width: `${clamped}%` }}
      />
    </div>
  )
}