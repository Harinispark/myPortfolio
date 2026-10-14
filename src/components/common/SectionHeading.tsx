import { motion, type Variants } from 'motion/react'

import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { cn } from '@/lib/cn'

import type { SectionMeta } from '@/types'

interface SectionHeadingProps {
  meta: SectionMeta
  headingId?: string
  align?: 'left' | 'center'
  className?: string
}

/** Consistent kicker + title + subtitle heading for every section. */
export function SectionHeading({
  meta,
  headingId,
  align = 'left',
  className,
}: SectionHeadingProps) {
  const reduced = usePrefersReducedMotion()

  const wipe: Variants = {
    hidden: reduced
      ? { opacity: 0 }
      : { opacity: 0, clipPath: 'inset(0 100% 0 0)' },
    show: {
      opacity: 1,
      clipPath: 'inset(0 0% 0 0)',
      transition: { duration: reduced ? 0.001 : 0.75, ease: [0.2, 0.7, 0.2, 1] },
    },
  }

  const rise: Variants = {
    hidden: reduced ? { opacity: 0 } : { opacity: 0, y: 14 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: reduced ? 0.001 : 0.5, ease: 'easeOut' },
    },
  }

  return (
    <div className={cn(align === 'center' && 'text-center', className)}>
      <p className="accent-red kicker">
        <span className="accent-text">{meta.eyebrow}</span>
      </p>
      <motion.h2
        id={headingId}
        variants={wipe}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.5 }}
        className="display-lg mt-1 text-fg"
      >
        {meta.title}
      </motion.h2>
      {meta.subtitle && (
        <motion.p
          variants={rise}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.5 }}
          className={cn(
            'mt-3 max-w-2xl text-muted',
            align === 'center' && 'mx-auto',
          )}
        >
          {meta.subtitle}
        </motion.p>
      )}
    </div>
  )
}
