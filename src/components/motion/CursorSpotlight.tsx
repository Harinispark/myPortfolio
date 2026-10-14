import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'motion/react'

import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

/**
 * A soft red spotlight that trails the cursor across the page. Purely
 * decorative: `pointer-events-none`, `aria-hidden`, sits below the chrome.
 *
 * Not rendered at all under `prefers-reduced-motion` or on touch-only devices.
 */
export function CursorSpotlight() {
  const reduced = usePrefersReducedMotion()
  const [visible, setVisible] = useState(false)

  const x = useMotionValue(-9999)
  const y = useMotionValue(-9999)
  const springX = useSpring(x, { stiffness: 140, damping: 26, mass: 0.6 })
  const springY = useSpring(y, { stiffness: 140, damping: 26, mass: 0.6 })

  useEffect(() => {
    if (reduced) return
    if (typeof window === 'undefined') return
    if (window.matchMedia('(pointer: coarse)').matches) return

    const onMove = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return
      x.set(event.clientX)
      y.set(event.clientY)
      setVisible(true)
    }
    const onLeave = () => setVisible(false)

    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerleave', onLeave)

    return () => {
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerleave', onLeave)
    }
  }, [reduced, x, y])

  if (reduced) return null

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed z-[25] size-[36rem] rounded-full transition-opacity duration-500"
      style={{
        left: springX,
        top: springY,
        x: '-50%',
        y: '-50%',
        opacity: visible ? 1 : 0,
        background:
          'radial-gradient(circle, rgba(194,20,28,0.16), transparent 62%)',
      }}
    />
  )
}
