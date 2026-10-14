import { motion, useScroll, useSpring } from 'motion/react'

import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

/**
 * A thin, Netflix-style reading-progress line pinned to the very top of the
 * viewport. Tracks the real page scroll, so it keeps working alongside Lenis.
 */
export function ScrollProgress() {
  const reduced = usePrefersReducedMotion()
  const { scrollYProgress } = useScroll()
  const smooth = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.3,
  })

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-[45] h-0.5 origin-left bg-linear-to-r from-brand via-brand-bright to-gold"
      style={{ scaleX: reduced ? scrollYProgress : smooth }}
    />
  )
}
