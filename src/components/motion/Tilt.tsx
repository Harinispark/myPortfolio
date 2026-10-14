import { useRef, type ReactNode } from 'react'
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
} from 'motion/react'

import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

interface TiltProps {
  children: ReactNode
  className?: string
  /** Maximum rotation, in degrees, at the card's corners. */
  max?: number
}

/**
 * A pointer-driven 3D tilt with a soft light glare that follows the cursor.
 * Wraps any card; the wrapped element keeps its own hover/focus styling.
 *
 * Returns a plain wrapper under `prefers-reduced-motion` — no tracking, no
 * transform, no glare.
 */
export function Tilt({ children, className, max = 7 }: TiltProps) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = usePrefersReducedMotion()
  const wrapperClassName = cn('group relative', className)

  const pointerX = useMotionValue(0.5)
  const pointerY = useMotionValue(0.5)
  const springX = useSpring(pointerX, { stiffness: 200, damping: 22, mass: 0.4 })
  const springY = useSpring(pointerY, { stiffness: 200, damping: 22, mass: 0.4 })

  const rotateX = useTransform(springY, [0, 1], [max, -max])
  const rotateY = useTransform(springX, [0, 1], [-max, max])

  const glareX = useTransform(springX, [0, 1], ['14%', '86%'])
  const glareY = useTransform(springY, [0, 1], ['10%', '90%'])
  const glare = useMotionTemplate`radial-gradient(420px circle at ${glareX} ${glareY}, rgba(255,255,255,0.26), transparent 58%)`

  if (reduced) {
    return <div className={wrapperClassName}>{children}</div>
  }

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'touch') return
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    pointerX.set((event.clientX - rect.left) / rect.width)
    pointerY.set((event.clientY - rect.top) / rect.height)
  }

  const handlePointerLeave = () => {
    pointerX.set(0.5)
    pointerY.set(0.5)
  }

  return (
    <motion.div
      ref={ref}
      className={wrapperClassName}
      style={{
        rotateX,
        rotateY,
        transformPerspective: 1100,
        transformStyle: 'preserve-3d',
      }}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      {children}
      <motion.span
        aria-hidden="true"
        className="tilt-glare"
        style={{ backgroundImage: glare }}
      />
    </motion.div>
  )
}
