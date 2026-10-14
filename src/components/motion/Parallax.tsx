import { useRef, type ReactNode } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'

import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

interface ParallaxProps {
  children: ReactNode
  className?: string
  /**
   * How far the content drifts as it crosses the viewport, as a fraction of
   * its own height. `0.1` moves it ≈10% up then 10% down. Keep it small.
   */
  speed?: number
  /** Direction of travel. `up` (default) moves against the scroll. */
  direction?: 'up' | 'down'
}

/**
 * Scroll-linked parallax. The wrapped content drifts gently as it passes
 * through the viewport, driven by motion's `useScroll` (which reads the real
 * scroll position, so it stays in sync with Lenis).
 *
 * Returns a plain wrapper under reduced motion — no listeners, no transform.
 */
export function Parallax({
  children,
  className,
  speed = 0.1,
  direction = 'up',
}: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = usePrefersReducedMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  const sign = direction === 'up' ? -1 : 1
  const distance = speed * sign * 100
  const y = useTransform(scrollYProgress, [0, 1], [`${-distance}%`, `${distance}%`])

  if (reduced) {
    return (
      <div ref={ref} className={cn(className)}>
        {children}
      </div>
    )
  }

  return (
    <motion.div ref={ref} className={cn(className)} style={{ y }}>
      {children}
    </motion.div>
  )
}
