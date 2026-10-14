import { useEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'

import { ProfileAvatar } from '@/components/profiles/ProfileAvatar'
import { site } from '@/data/site'
import { accentClassName } from '@/lib/accents'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { useProfile } from '@/context/ProfileContext'

import type { WatchProfile } from '@/types'

const COLUMNS = 2

function clampIndex(index: number, size: number): number {
  return Math.max(0, Math.min(size - 1, index))
}

function isArrowKey(key: string): boolean {
  return (
    key === 'ArrowLeft' ||
    key === 'ArrowRight' ||
    key === 'ArrowUp' ||
    key === 'ArrowDown'
  )
}

/**
 * "Who's watching?" — pick a viewer. The choice reorders the home page,
 * persists server-side (session cookie + database row), and pings the toast.
 * Fully keyboard navigable (roving tabindex + arrow keys).
 */
export function ProfilePicker() {
  const { selectProfile, activeProfile, profiles } = useProfile()
  const reduced = usePrefersReducedMotion()
  const [focusedIndex, setFocusedIndex] = useState(0)
  const gridRef = useRef<HTMLDivElement>(null)

  // Make the picker immediately keyboard-ready on mount.
  useEffect(() => {
    const first = gridRef.current?.querySelector<HTMLButtonElement>(
      '[data-profile-card]',
    )
    first?.focus()
  }, [])

  const moveFocus = (index: number) => {
    setFocusedIndex(index)
    const card = gridRef.current?.querySelector<HTMLButtonElement>(
      `[data-profile-card][data-index="${index}"]`,
    )
    card?.focus()
  }

  const onGridKeyDown = (event: React.KeyboardEvent) => {
    if (!isArrowKey(event.key)) return
    event.preventDefault()

    let next = focusedIndex
    switch (event.key) {
      case 'ArrowRight':
        next = clampIndex(focusedIndex + 1, profiles.length)
        break
      case 'ArrowLeft':
        next = clampIndex(focusedIndex - 1, profiles.length)
        break
      case 'ArrowDown':
        next = clampIndex(focusedIndex + COLUMNS, profiles.length)
        break
      case 'ArrowUp':
        next = clampIndex(focusedIndex - COLUMNS, profiles.length)
        break
    }

    if (next !== focusedIndex) moveFocus(next)
  }

  return (
    <section
      aria-labelledby="profile-picker-title"
      className="flex min-h-svh flex-col items-center justify-center px-6 py-20"
    >
      <p className="kicker mb-3 text-gold">
        {site.wordmark} — {site.seriesTag}
      </p>
      <h1
        id="profile-picker-title"
        className="display-lg mb-3 text-center text-fg"
      >
        Who's watching?
      </h1>
      <p className="mb-12 max-w-md text-center text-sm text-muted">
        {site.tagline}
      </p>

      <div
        ref={gridRef}
        role="list"
        aria-label="Choose a viewer profile"
        className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4"
        onKeyDown={onGridKeyDown}
      >
        {profiles.map((profile, index) => (
          <motion.div
            key={profile.id}
            role="listitem"
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: reduced ? 0.001 : 0.5,
              delay: reduced ? 0 : 0.1 + index * 0.08,
              ease: 'easeOut',
            }}
          >
            <ProfileCard
              profile={profile}
              index={index}
              focusedIndex={focusedIndex}
              isActive={activeProfile?.id === profile.id}
              onFocus={() => setFocusedIndex(index)}
              onSelect={() => selectProfile(profile.id)}
            />
          </motion.div>
        ))}
      </div>
    </section>
  )
}

interface ProfileCardProps {
  profile: WatchProfile
  index: number
  focusedIndex: number
  isActive: boolean
  onFocus: () => void
  onSelect: () => void
}

function ProfileCard({
  profile,
  index,
  focusedIndex,
  isActive,
  onFocus,
  onSelect,
}: ProfileCardProps) {
  return (
    <button
      type="button"
      data-profile-card
      data-index={index}
      tabIndex={focusedIndex === index ? 0 : -1}
      aria-pressed={isActive}
      aria-label={`${profile.label} — ${profile.kicker}. ${profile.tagline}.`}
      onFocus={onFocus}
      onClick={onSelect}
      className={cn(
        'hover-lift group flex w-full flex-col items-center gap-4 rounded-2xl border border-line bg-surface px-4 py-6 text-center sm:min-w-44 sm:px-6 sm:py-8',
        accentClassName[profile.accent],
        isActive && 'border-[var(--accent)]',
      )}
    >
      <ProfileAvatar profile={profile} size="xl" priority />

      <span className="leading-tight">
        <span className="block font-display text-3xl tracking-[0.04em] text-fg sm:text-4xl">
          {profile.label}
        </span>
        <span className="mt-1 block text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">
          {profile.kicker}
        </span>
      </span>

      <span className="block text-xs text-muted">{profile.tagline}</span>

      {isActive && (
        <span className="kicker border-t border-line pt-2 accent-text">
          Now watching
        </span>
      )}
    </button>
  )
}