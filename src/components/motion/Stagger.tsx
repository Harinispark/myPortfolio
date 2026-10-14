import type { ReactNode } from 'react'
import { motion, type Variants } from 'motion/react'

import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

interface StaggerProps {
  children: ReactNode
  className?: string
  /** Gap between each child's entrance, in seconds. */
  stagger?: number
  /** Delay before the first child starts, in seconds. */
  delay?: number
}

/**
 * Container that cascades its `StaggerItem` children into view as the group
 * scrolls onto screen. Under reduced motion the children just fade in place
 * (no travel), so nothing jumps.
 *
 * Because it drives children with motion variants, direct children should be
 * `StaggerItem`s (which render the actual cards).
 */
export function Stagger({ children, className, stagger = 0.07, delay = 0 }: StaggerProps) {
  const reduced = usePrefersReducedMotion()

  const container: Variants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: reduced ? 0 : stagger,
        delayChildren: reduced ? 0 : delay,
      },
    },
  }

  return (
    <motion.div
      className={cn(className)}
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.15 }}
    >
      {children}
    </motion.div>
  )
}

interface StaggerItemProps {
  children: ReactNode
  className?: string
}

/** A single child of `Stagger` — rises and fades in as the cascade reaches it. */
export function StaggerItem({ children, className }: StaggerItemProps) {
  const reduced = usePrefersReducedMotion()

  const item: Variants = {
    hidden: reduced ? { opacity: 0 } : { opacity: 0, y: 22 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: reduced ? 0.001 : 0.5, ease: 'easeOut' },
    },
  }

  return (
    <motion.div className={cn(className)} variants={item}>
      {children}
    </motion.div>
  )
}
