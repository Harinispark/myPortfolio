import type { ReactNode } from 'react'

import { Photo } from '@/components/common/Photo'
import {
  BriefcaseIcon,
  CodeIcon,
  SparklesIcon,
} from '@/components/common/icons'
import { portrait } from '@/data/site'
import { accentClassName } from '@/lib/accents'
import { cn } from '@/lib/cn'

import type { WatchProfile, WatchProfileId } from '@/types'

const glyphByProfile: Record<WatchProfileId, ReactNode> = {
  harini: null, // uses the real portrait instead
  recruiter: <BriefcaseIcon width="42%" height="42%" />,
  developer: <CodeIcon width="42%" height="42%" />,
  creative: <SparklesIcon width="42%" height="42%" />,
}

const sizeClasses = {
  sm: 'size-8',
  md: 'size-12',
  lg: 'size-20',
  xl: 'size-28',
} as const

interface ProfileAvatarProps {
  profile: WatchProfile
  size?: keyof typeof sizeClasses
  className?: string
  priority?: boolean
}

/**
 * The avatar for a watching profile. The "Harini" profile uses the real
 * portrait; the other profiles get generative gradient glyphs.
 */
export function ProfileAvatar({
  profile,
  size = 'md',
  className,
  priority = false,
}: ProfileAvatarProps) {
  const sizeClass = sizeClasses[size]

  if (profile.id === 'harini') {
    return (
      <Photo
        variant="avatar"
        src={portrait.src}
        alt={portrait.alt}
        width={portrait.width}
        height={portrait.height}
        priority={priority}
        focus="50% 18%"
        className={cn(sizeClass, className)}
      />
    )
  }

  return (
    <span
      aria-hidden="true"
      className={cn(
        sizeClass,
        'glyph-tile flex items-center justify-center',
        accentClassName[profile.accent],
        className,
      )}
    >
      {glyphByProfile[profile.id]}
    </span>
  )
}