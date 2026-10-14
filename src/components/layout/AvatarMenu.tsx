import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'

import { CheckIcon } from '@/components/common/icons'
import { ProfileAvatar } from '@/components/profiles/ProfileAvatar'
import { useOutsideClick } from '@/hooks/useOutsideClick'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { useMotion, type MotionMode } from '@/context/MotionContext'
import { useProfile } from '@/context/ProfileContext'

const motionOptions: { value: MotionMode; label: string; hint: string }[] = [
  { value: 'system', label: 'System', hint: 'Follow my device setting' },
  { value: 'full', label: 'Full', hint: 'Play every effect' },
  { value: 'reduced', label: 'Reduced', hint: 'Freeze decorative motion' },
]

/**
 * The avatar in the navbar. "Harini" shows the real portrait; every profile
 * can be switched to directly from here, and the opening can be replayed.
 */
export function AvatarMenu() {
  const { profiles, activeProfile, selectProfile, replayIntro, watchAgain } =
    useProfile()
  const { mode, setMode } = useMotion()
  const reduced = usePrefersReducedMotion()
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  useOutsideClick(rootRef, () => setOpen(false), open)

  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
        triggerRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open])

  const close = (action: () => void) => () => {
    action()
    setOpen(false)
    triggerRef.current?.focus()
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={open ? 'Close profile menu' : 'Switch profile or replay the opening'}
        onClick={() => setOpen((value) => !value)}
        className="group relative rounded-full ring-gold/70 transition-shadow hover:ring-2 focus-visible:ring-2"
      >
        <ProfileAvatar
          profile={activeProfile ?? profiles[0]}
          size="sm"
          priority
          className="transition-transform duration-300 group-hover:scale-105"
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            role="menu"
            aria-label="Profile and playback menu"
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: reduced ? 0.001 : 0.2, ease: 'easeOut' }}
            className="absolute right-0 mt-3 w-72 overflow-hidden rounded-2xl border border-line bg-surface p-2 shadow-2xl shadow-black/60"
          >
            <li role="none">
              <p className="kicker px-3 pb-1 pt-2">Who's watching</p>
            </li>

            {profiles.map((profile) => {
              const isActive = activeProfile?.id === profile.id
              return (
                <li role="none" key={profile.id}>
                  <button
                    type="button"
                    role="menuitem"
                    onClick={close(() => selectProfile(profile.id))}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition-colors hover:bg-surface-2"
                  >
                    <ProfileAvatar profile={profile} size="sm" />
                    <span className="flex-1 leading-tight">
                      <span className="block text-sm font-semibold text-fg">
                        {profile.label}
                      </span>
                      <span className="block text-xs text-muted">
                        {profile.kicker} · {profile.tagline}
                      </span>
                    </span>
                    {isActive && (
                      <CheckIcon width={16} height={16} className="shrink-0 text-gold" />
                    )}
                  </button>
                </li>
              )
            })}

            <li role="none" className="my-1 hairline" aria-hidden="true" />

            <li role="none">
              <button
                type="button"
                role="menuitem"
                onClick={close(replayIntro)}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm text-muted transition-colors hover:bg-surface-2 hover:text-fg"
              >
                Replay opening
              </button>
            </li>
            <li role="none">
              <button
                type="button"
                role="menuitem"
                onClick={close(watchAgain)}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm text-muted transition-colors hover:bg-surface-2 hover:text-fg"
              >
                Watch again
              </button>
            </li>

            <li role="none" className="my-1 hairline" aria-hidden="true" />

            <li role="none">
              <p className="kicker px-3 pb-1 pt-2">Motion</p>
            </li>

            {motionOptions.map((option) => {
              const isChosen = mode === option.value
              return (
                <li role="none" key={option.value}>
                  <button
                    type="button"
                    role="menuitemradio"
                    aria-checked={isChosen}
                    onClick={() => setMode(option.value)}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition-colors hover:bg-surface-2"
                  >
                    <span className="flex-1 leading-tight">
                      <span className="block text-sm font-semibold text-fg">
                        {option.label}
                      </span>
                      <span className="block text-xs text-muted">
                        {option.hint}
                      </span>
                    </span>
                    {isChosen && (
                      <CheckIcon width={16} height={16} className="shrink-0 text-gold" />
                    )}
                  </button>
                </li>
              )
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  )
}