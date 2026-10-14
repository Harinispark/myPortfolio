import type { ReactNode } from 'react'

import { cn } from '@/lib/cn'

interface ChipProps {
  children: ReactNode
  className?: string
  /** Renders the chip span as an inline anchor. */
  href?: string
}

/** Small pill used for tech stacks, tags, and counts. */
export function Chip({ children, className, href }: ChipProps) {
  const classes = cn(
    'inline-flex items-center gap-1.5 rounded-full border border-line bg-surface-2/70 px-3 py-1 text-xs font-medium text-muted',
    className,
  )
  if (href) {
    return (
      <a
        href={href}
        className={cn(classes, 'transition-colors hover:border-gold/60 hover:text-gold')}
      >
        {children}
      </a>
    )
  }
  return <span className={classes}>{children}</span>
}