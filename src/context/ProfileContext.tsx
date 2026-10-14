import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

import { useToast } from '@/context/ToastContext'
import { useSiteContent } from '@/context/SiteContentContext'
import { api } from '@/lib/api/client'
import { normalizeSectionOrder } from '@/lib/sectionOrder'

import type { SectionKey, WatchProfile, WatchProfileId } from '@/types'

type Stage = 'intro' | 'picker' | 'home'

interface ProfileContextValue {
  /** 'intro' → splash; 'picker' → profile picker; 'home' → the site shell. */
  stage: Stage
  profiles: WatchProfile[]
  activeProfile: WatchProfile | null
  /** The active profile's reordered home-page sections, always complete. */
  sectionOrder: SectionKey[]
  /** Bumped on every replay so the splash can re-run its animation. */
  introKey: number
  selectProfile: (id: WatchProfileId) => void
  showPicker: () => void
  /** Intro finished playing → home if a profile is saved, else picker. */
  advanceFromIntro: () => void
  replayIntro: () => void
  /** Clears the saved profile and re-asks "Who's watching?". */
  watchAgain: () => void
}

const ProfileContext = createContext<ProfileContextValue | null>(null)

/* oxlint-disable-next-line react/only-export-components */
export const defaultSectionOrder: SectionKey[] = normalizeSectionOrder(null)

/**
 * Persists the active viewer server-side (an HttpOnly session cookie + a
 * `viewing_sessions` row) instead of localStorage. Profile metadata comes from
 * the site content bundle, which falls back to bundled static data.
 */
export function ProfileProvider({ children }: { children: ReactNode }) {
  const { content } = useSiteContent()
  const profiles = content.profiles

  const [stage, setStage] = useState<Stage>('intro')
  const [activeId, setActiveId] = useState<WatchProfileId | null>(null)
  const [introKey, setIntroKey] = useState(0)

  const { publish } = useToast()

  // Ask the backend who is watching (cookie-backed). Fall back to no profile
  // if the API is unreachable — the picker simply shows.
  useEffect(() => {
    let cancelled = false
    api<{ viewerProfileId: string | null }>('/api/session')
      .then((data) => {
        if (cancelled) return
        const id = data.viewerProfileId
        if (id && profiles.some((profile) => profile.id === id)) {
          setActiveId(id as WatchProfileId)
        }
      })
      .catch(() => {
        // No backend yet — treat as "nobody chosen".
      })
    return () => {
      cancelled = true
    }
    // Intentionally run once; profiles come from the validated bundle.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const activeProfile = useMemo(
    () => profiles.find((profile) => profile.id === activeId) ?? null,
    [profiles, activeId],
  )

  const sectionOrder = useMemo(
    () =>
      activeProfile
        ? normalizeSectionOrder(activeProfile.sectionOrder)
        : defaultSectionOrder,
    [activeProfile],
  )

  const selectProfile = useCallback(
    (id: WatchProfileId) => {
      const profile = profiles.find((entry) => entry.id === id)
      if (!profile) return
      setActiveId(id)
      void api('/api/session', {
        method: 'PUT',
        body: JSON.stringify({ viewerProfileId: id }),
      }).catch(() => {
        // Persistence is best-effort; the in-memory choice still applies.
      })
      publish({
        title: `Now watching as ${profile.label}`,
        description: profile.description,
        accent: profile.accent,
      })
      setStage('home')
    },
    [profiles, publish],
  )

  const showPicker = useCallback(() => setStage('picker'), [])

  const advanceFromIntro = useCallback(() => {
    setStage((current) =>
      current === 'intro' ? (activeId ? 'home' : 'picker') : current,
    )
  }, [activeId])

  const replayIntro = useCallback(() => {
    setIntroKey((key) => key + 1)
    setStage('intro')
  }, [])

  const watchAgain = useCallback(() => {
    setActiveId(null)
    void api('/api/session', { method: 'DELETE' }).catch(() => {
      // Ignore network failures; the in-memory state still resets.
    })
    setStage('picker')
  }, [])

  const value = useMemo<ProfileContextValue>(
    () => ({
      stage,
      profiles,
      activeProfile,
      sectionOrder,
      introKey,
      selectProfile,
      showPicker,
      advanceFromIntro,
      replayIntro,
      watchAgain,
    }),
    [
      stage,
      profiles,
      activeProfile,
      sectionOrder,
      introKey,
      selectProfile,
      showPicker,
      advanceFromIntro,
      replayIntro,
      watchAgain,
    ],
  )

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
}

/* oxlint-disable-next-line react/only-export-components */
export function useProfile(): ProfileContextValue {
  const context = useContext(ProfileContext)
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider')
  }
  return context
}
