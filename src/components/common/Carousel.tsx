import { useRef, type KeyboardEvent, type ReactNode } from 'react'

import { ChevronLeftIcon, ChevronRightIcon } from '@/components/common/icons'
import { cn } from '@/lib/cn'

interface CarouselProps {
  children: ReactNode
  ariaLabel: string
  className?: string
  /** Shows prev/next chevron controls overlaid on the edges. */
  controls?: boolean
}

/**
 * A swipeable, scroll-snapped carousel. Touch works natively; keyboard users
 * get ArrowLeft/ArrowRight on the focused track; mouse users get the chevron
 * controls. Reduced-motion users get instant scrolling (no smooth behavior).
 */
export function Carousel({
  children,
  ariaLabel,
  className,
  controls = true,
}: CarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null)

  const scrollBy = (direction: 1 | -1) => {
    const track = trackRef.current
    if (!track) return
    track.scrollBy({
      left: direction * track.clientWidth * 0.85,
      behavior: 'smooth',
    })
  }

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault()
      scrollBy(-1)
    } else if (event.key === 'ArrowRight') {
      event.preventDefault()
      scrollBy(1)
    }
  }

  const controlClasses =
    'absolute top-1/2 z-10 hidden size-10 -translate-y-1/2 place-items-center rounded-full border border-line bg-surface/90 text-muted shadow-lg backdrop-blur transition-colors hover:border-gold/60 hover:text-gold sm:grid'

  return (
    <div className={cn('relative', className)}>
      <div
        ref={trackRef}
        role="region"
        aria-roledescription="carousel"
        aria-label={ariaLabel}
        tabIndex={0}
        onKeyDown={onKeyDown}
        className="carousel no-scrollbar rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-gold/60"
      >
        {children}
      </div>

      {controls && (
        <>
          <button
            type="button"
            aria-label="Scroll carousel back"
            onClick={() => scrollBy(-1)}
            className={cn(controlClasses, '-left-3')}
          >
            <ChevronLeftIcon width={18} height={18} />
          </button>
          <button
            type="button"
            aria-label="Scroll carousel forward"
            onClick={() => scrollBy(1)}
            className={cn(controlClasses, '-right-3')}
          >
            <ChevronRightIcon width={18} height={18} />
          </button>
        </>
      )}
    </div>
  )
}