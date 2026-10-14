import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

import { api } from '@/lib/api/client'
import { buildLocalContent, type ContentBundle } from '@/lib/api/content'

interface SiteContentValue {
  content: ContentBundle
  /** Where the current content came from: the API, or the bundled fallback. */
  source: 'api' | 'local'
  /** Re-fetch the bundle (called after an inline edit so the page updates). */
  refresh: () => Promise<void>
}

const SiteContentContext = createContext<SiteContentValue | null>(null)

/**
 * Loads the site content from the backend once on mount. The bundled static
 * data renders immediately (no layout shift, works offline); when the API
 * answers, the content is swapped to the database-backed version.
 *
 * `refresh()` re-runs the same request — the inline editor calls it after every
 * create/update/delete so the public page reflects the database.
 */
export function SiteContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<ContentBundle>(() => buildLocalContent())
  const [source, setSource] = useState<'api' | 'local'>('local')

  const applyBundle = useCallback((data: ContentBundle | null) => {
    // Ignore failures and truncated/misconfigured responses; the bundled
    // content stays in place so the site always renders.
    if (!data) return
    if (Array.isArray(data.projects) && Array.isArray(data.profiles)) {
      setContent(data)
      setSource('api')
    }
  }, [])

  const refresh = useCallback(async () => {
    const data = await api<ContentBundle>('/api/site').catch(() => null)
    applyBundle(data)
  }, [applyBundle])

  useEffect(() => {
    let cancelled = false
    api<ContentBundle>('/api/site')
      .then((data) => {
        if (!cancelled) applyBundle(data)
      })
      .catch(() => {
        // Backend unreachable — keep the bundled content.
      })
    return () => {
      cancelled = true
    }
  }, [applyBundle])

  const value = useMemo<SiteContentValue>(
    () => ({ content, source, refresh }),
    [content, source, refresh],
  )

  return (
    <SiteContentContext.Provider value={value}>{children}</SiteContentContext.Provider>
  )
}

/* oxlint-disable-next-line react/only-export-components */
export function useSiteContent(): SiteContentValue {
  const context = useContext(SiteContentContext)
  if (!context) {
    throw new Error('useSiteContent must be used within a SiteContentProvider')
  }
  return context
}
