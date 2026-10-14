import { useState, type CSSProperties } from 'react'

import { Monogram } from '@/components/brand/Monogram'
import { cn } from '@/lib/cn'

export type PhotoVariant = 'hero' | 'avatar' | 'nav'

interface PhotoProps {
  src?: string
  alt: string
  width?: number
  height?: number
  variant?: PhotoVariant
  /** `object-position` for nudging the crop without touching code later. */
  focus?: string
  priority?: boolean
  className?: string
}

const variantClasses: Record<PhotoVariant, string> = {
  hero: 'photo-img photo-hero',
  avatar: 'photo-img rounded-full',
  nav: 'photo-img rounded-full',
}

/**
 * Renders the portrait with the CSS mask + gradient fade treatment. If the
 * asset is missing (or fails to load), a styled monogram placeholder is shown
 * instead — the layout never collapses.
 */
export function Photo({
  src,
  alt,
  width,
  height,
  variant = 'avatar',
  focus,
  priority = false,
  className,
}: PhotoProps) {
  const [missing, setMissing] = useState(false)

  // If `src` changes, forget a previous load failure.
  const [lastSrc, setLastSrc] = useState(src)
  if (src !== lastSrc) {
    setLastSrc(src)
    setMissing(false)
  }

  if (!src || missing) {
    return <PhotoFallback variant={variant} className={className} />
  }

  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      onError={() => setMissing(true)}
      className={cn(variantClasses[variant], className)}
      style={
        focus ? ({ '--photo-focus': focus } as CSSProperties) : undefined
      }
    />
  )
}

function PhotoFallback({
  variant,
  className,
}: {
  variant: PhotoVariant
  className?: string
}) {
  if (variant === 'hero') {
    return (
      <div
        className={cn(
          'photo-hero flex items-center justify-center border border-line bg-surface',
          className,
        )}
        aria-hidden="true"
      >
        <Monogram width={104} height={104} />
      </div>
    )
  }
  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-full bg-linear-to-br from-surface-3 to-surface-2',
        className,
      )}
      aria-hidden="true"
    >
      <Monogram width="52%" height="52%" />
    </div>
  )
}