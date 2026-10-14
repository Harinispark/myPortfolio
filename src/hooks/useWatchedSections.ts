import { useEffect, useState } from 'react'

import { getAnchor } from '@/data/sections'
import { sectionKeys } from '@/data/sections'
import { api } from '@/lib/api/client'

import type { SectionKey } from '@/types'

/**
 * Tracks which home-page sections the viewer has "watched" (scrolled into
 * view) and which one is on screen right now. Powers the Continue Exploring
 * progress bars. Watched sections are persisted per session in the backend
 * (best-effort — the UI works even without a database).
 */
export function useWatchedSections(): {
  watched: ReadonlySet<SectionKey>
  current: SectionKey | null
} {
  const [watched, setWatched] = useState<ReadonlySet<SectionKey>>(
    () => new Set<SectionKey>(),
  )
  const [current, setCurrent] = useState<SectionKey | null>(null)

  // Hydrate previously watched sections from the backend session.
  useEffect(() => {
    let cancelled = false
    api<{ sectionKeys: SectionKey[] }>('/api/session/watches')
      .then((data) => {
        if (cancelled) return
        const keys = Array.isArray(data?.sectionKeys) ? data.sectionKeys : []
        setWatched((prev) => {
          const next = new Set(prev)
          for (const key of keys) next.add(key)
          return next
        })
      })
      .catch(() => {
        // No backend — progress simply starts empty.
      })
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    const targets = sectionKeys
      .map((key) => ({ key, el: document.getElementById(getAnchor(key)) }))
      .filter((entry): entry is { key: SectionKey; el: HTMLElement } =>
        Boolean(entry.el),
      )
    if (targets.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          const key = targets.find((target) => target.el === entry.target)?.key
          if (!key) continue
          setCurrent(key)
          setWatched((prev) => {
            if (prev.has(key)) return prev
            const next = new Set(prev)
            next.add(key)
            // Persist the newly watched section (fire-and-forget).
            void api('/api/session/watches', {
              method: 'PUT',
              body: JSON.stringify({ sectionKey: key }),
            }).catch(() => {
              // Best-effort only.
            })
            return next
          })
        }
      },
      { threshold: 0.3 },
    )

    for (const target of targets) observer.observe(target.el)
    return () => observer.disconnect()
  }, [])

  return { watched, current }
}
