import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

import { useSiteContent } from '@/context/SiteContentContext'
import { verifyAdminToken } from '@/lib/api/crud'

import type { ResourceKey } from '@/lib/edit/resources'

export interface EditorTarget {
  resourceKey: ResourceKey
  /** `null` opens the create form; a string opens the edit form. */
  id: string | null
}

interface EditModeValue {
  /** True once a valid token has been accepted. */
  enabled: boolean
  /** In-memory only; never persisted. */
  token: string | null
  /** Editing is possible: unlocked AND the page is reading from the API. */
  canEdit: boolean
  verifying: boolean
  error: string | null
  /** The unlock dialog. */
  promptOpen: boolean
  openPrompt: () => void
  closePrompt: () => void
  unlock: (token: string) => Promise<boolean>
  lock: () => void
  /** The entity form. */
  editor: EditorTarget | null
  openEditor: (resourceKey: ResourceKey, id?: string | null) => void
  closeEditor: () => void
}

const EditModeContext = createContext<EditModeValue | null>(null)

/** Don't hijack the shortcut while the user is typing in a field. */
function isTypingTarget(target: EventTarget | null): boolean {
  const el = target as HTMLElement | null
  if (!el) return false
  const tag = el.tagName
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || el.isContentEditable
}

/**
 * Owns the inline editor's unlocked state and the "open this entity" signal.
 * The visible parts (dialog, form, status pill) live in `<EditLayer>`, so this
 * module stays free of component imports.
 */
export function EditModeProvider({ children }: { children: ReactNode }) {
  const { source } = useSiteContent()
  const [token, setToken] = useState<string | null>(null)
  const [verifying, setVerifying] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [promptOpen, setPromptOpen] = useState(false)
  const [editorState, setEditor] = useState<EditorTarget | null>(null)

  const enabled = token !== null
  const canEdit = enabled && source === 'api'
  /* A lost backend closes the form without an extra render pass. */
  const editor = canEdit ? editorState : null

  const openPrompt = useCallback(() => {
    setError(null)
    setPromptOpen(true)
  }, [])

  const closePrompt = useCallback(() => setPromptOpen(false), [])

  const unlock = useCallback(async (candidate: string) => {
    setVerifying(true)
    setError(null)
    try {
      await verifyAdminToken(candidate)
      setToken(candidate)
      setPromptOpen(false)
      return true
    } catch (cause) {
      setError(
        cause instanceof Error && cause.message
          ? cause.message
          : 'That token was not accepted.',
      )
      return false
    } finally {
      setVerifying(false)
    }
  }, [])

  const lock = useCallback(() => {
    setToken(null)
    setEditor(null)
    setError(null)
  }, [])

  const openEditor = useCallback((resourceKey: ResourceKey, id: string | null = null) => {
    setEditor({ resourceKey, id })
  }, [])

  const closeEditor = useCallback(() => setEditor(null), [])

  /* Entry points: `#edit` in the URL, or Shift+E anywhere on the page. */
  useEffect(() => {
    const fromHash = () => {
      if (window.location.hash === '#edit') openPrompt()
    }
    fromHash()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.shiftKey && !event.metaKey && !event.ctrlKey && !event.altKey) {
        if ((event.key === 'E' || event.key === 'e') && !isTypingTarget(event.target)) {
          event.preventDefault()
          openPrompt()
        }
      }
      if (event.key === 'Escape') {
        setPromptOpen(false)
        setEditor(null)
      }
    }

    window.addEventListener('hashchange', fromHash)
    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('hashchange', fromHash)
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [openPrompt])

  const value = useMemo<EditModeValue>(
    () => ({
      enabled,
      token,
      canEdit,
      verifying,
      error,
      promptOpen,
      openPrompt,
      closePrompt,
      unlock,
      lock,
      editor,
      openEditor,
      closeEditor,
    }),
    [
      enabled,
      token,
      canEdit,
      verifying,
      error,
      promptOpen,
      openPrompt,
      closePrompt,
      unlock,
      lock,
      editor,
      openEditor,
      closeEditor,
    ],
  )

  return <EditModeContext.Provider value={value}>{children}</EditModeContext.Provider>
}

/* oxlint-disable-next-line react/only-export-components */
export function useEditMode(): EditModeValue {
  const context = useContext(EditModeContext)
  if (!context) {
    throw new Error('useEditMode must be used within an EditModeProvider')
  }
  return context
}
