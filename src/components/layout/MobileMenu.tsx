import { useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'motion/react'

import { Logo } from '@/components/brand/Logo'
import { Button } from '@/components/common/Button'
import { CloseIcon } from '@/components/common/icons'
import { ViewTransitionLink } from '@/components/motion/ViewTransitionLink'
import { ProfileAvatar } from '@/components/profiles/ProfileAvatar'
import { cta, footerConfig, navItems } from '@/data/navigation'
import { useFocusTrap } from '@/hooks/useFocusTrap'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { useScrollLock } from '@/hooks/useScrollLock'
import { useProfile } from '@/context/ProfileContext'

interface MobileMenuProps {
  open: boolean
  onClose: () => void
}

/** Full-screen drawer with all navigation, the CTA, and the profile switch. */
export function MobileMenu({ open, onClose }: MobileMenuProps) {
  const { profiles, activeProfile, selectProfile } = useProfile()
  const reduced = usePrefersReducedMotion()
  const panelRef = useRef<HTMLDivElement>(null)

  useScrollLock(open)
  useFocusTrap(panelRef, open)

  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 lg:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduced ? 0.001 : 0.2 }}
        >
          {/* Backdrop */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-ink/70 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Site navigation"
            initial={reduced ? { opacity: 0 } : { x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduced ? { opacity: 0 } : { x: '100%' }}
            transition={{
              duration: reduced ? 0.001 : 0.28,
              ease: [0.2, 0.7, 0.2, 1],
            }}
            className="absolute right-0 top-0 flex h-full w-[86%] max-w-sm flex-col overflow-y-auto border-l border-line bg-surface px-6 py-6"
          >
            <div className="flex items-center justify-between">
              <Logo href="#home" onClick={onClose} />
              <button
                type="button"
                aria-label="Close menu"
                data-autofocus
                onClick={onClose}
                className="rounded-full border border-line p-2 text-muted transition-colors hover:border-gold/60 hover:text-gold"
              >
                <CloseIcon width={18} height={18} />
              </button>
            </div>

            <nav aria-label="Mobile" className="mt-8">
              <ul className="flex flex-col gap-1">
                {navItems.map((item) => (
                  <li key={item.id}>
                    {item.section === 'resumePage' ? (
                      <ViewTransitionLink
                        to={item.href}
                        onClick={onClose}
                        className="block rounded-xl px-3 py-3 font-display text-3xl tracking-[0.04em] text-fg transition-colors hover:bg-surface-2 hover:text-brand-bright"
                      >
                        {item.label}
                      </ViewTransitionLink>
                    ) : (
                      <a
                        href={item.href}
                        onClick={onClose}
                        className="block rounded-xl px-3 py-3 font-display text-3xl tracking-[0.04em] text-fg transition-colors hover:bg-surface-2 hover:text-brand-bright"
                      >
                        {item.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </nav>

            <div className="mt-6">
              <Button
                href={cta.href}
                size="lg"
                aria-label={cta.ariaLabel}
                className="w-full"
                onClick={onClose}
              >
                {cta.label}
              </Button>
            </div>

            <p className="kicker mt-8 mb-3">Who's watching</p>
            <ul className="flex flex-col gap-1">
              {profiles.map((profile) => (
                <li key={profile.id}>
                  <button
                    type="button"
                    onClick={() => {
                      selectProfile(profile.id)
                      onClose()
                    }}
                    aria-pressed={activeProfile?.id === profile.id}
                    className="flex w-full items-center gap-3 rounded-xl border border-transparent px-3 py-2 text-left transition-colors hover:bg-surface-2 aria-pressed:border-gold/50"
                  >
                    <ProfileAvatar profile={profile} size="sm" />
                    <span className="leading-tight">
                      <span className="block text-sm font-semibold text-fg">
                        {profile.label}
                      </span>
                      <span className="block text-xs text-muted">{profile.tagline}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>

            <p className="mt-auto pt-8 text-center text-xs text-faint">
              {footerConfig.note}
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}