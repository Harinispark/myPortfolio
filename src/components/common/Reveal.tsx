import type { ReactNode } from 'react'
import { motion } from 'motion/react'

import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

interface RevealProps {
  children: ReactNode
  className?: string
  delay?: number
  y?: number
}

/** Scroll-in reveal. Fades (and gently rises) content as it enters the view. */
export function Reveal({ children, className, delay = 0, y = 24 }: RevealProps) {
  const reduced = usePrefersReducedMotion()

  return (
    <motion.div
      className={className}
      initial={reduced ? { opacity: 1 } : { opacity: 0, y }}
      whileInView={reduced ? { opacity: 1 } : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: reduced ? 0.001 : 0.55, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}