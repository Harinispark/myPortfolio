import { useEffect, useRef, useState } from 'react'
import { useInView } from 'motion/react'

import { accentClassName } from '@/lib/accents'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

import type { Stat } from '@/types'

interface StatTileProps {
  stat: Stat
  className?: string
}

/** Big-number stat tile for the resume side panel. */
export function StatTile({ stat, className }: StatTileProps) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.6 })
  const reduced = usePrefersReducedMotion()
  const [counted, setCounted] = useState(0)

  // Reduced motion (or before it enters view) shows the final number directly.
  const value = reduced ? stat.value : counted

  useEffect(() => {
    if (reduced || !inView) return

    let frame = 0
    const duration = 900
    const start = performance.now()
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCounted(Math.round(stat.value * eased))
      if (progress < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [inView, reduced, stat.value])

  return (
    <div
      ref={ref}
      className={cn(
        'panel flex items-center gap-4 px-4 py-3',
        accentClassName[stat.accent],
        className,
      )}
    >
      <span className="font-display text-4xl leading-none accent-text">
        {value}
      </span>
      <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
        {stat.label}
      </span>
    </div>
  )
}
