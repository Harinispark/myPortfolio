import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'

import { CloseIcon } from '@/components/common/icons'
import { accentClassName } from '@/lib/accents'
import { cn } from '@/lib/cn'

import type { Accent, ToastMessage } from '@/types'

interface ToastInput {
  title: string
  description?: string
  accent?: Accent
}

interface ToastContextValue {
  publish: (toast: ToastInput) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

const TOAST_LIFETIME_MS = 4200
const MAX_STACKED = 3

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([])
  const reduced = useReducedMotion()

  const dismiss = useCallback((id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
  }, [])

  const publish = useCallback(
    (input: ToastInput) => {
      const id =
        typeof crypto !== 'undefined' && 'randomUUID' in crypto
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random().toString(36).slice(2)}`

      setToasts((current) => [
        ...current.slice(-(MAX_STACKED - 1)),
        {
          id,
          title: input.title,
          description: input.description,
          accent: input.accent ?? 'red',
        },
      ])

      window.setTimeout(() => dismiss(id), TOAST_LIFETIME_MS)
    },
    [dismiss],
  )

  const value = useMemo(() => ({ publish }), [publish])

  return (
    <ToastContext.Provider value={value}>
      {children}

      <div
        aria-live="polite"
        role="status"
        className="pointer-events-none fixed inset-x-0 bottom-6 z-[70] flex flex-col items-center gap-3 px-4 sm:items-end sm:pr-8"
      >
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              layout={!reduced}
              initial={reduced ? { opacity: 0 } : { opacity: 0, y: 28, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduced ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.98 }}
              transition={{ duration: reduced ? 0.001 : 0.32, ease: 'easeOut' }}
              className={cn(
                'pointer-events-auto relative w-full max-w-sm overflow-hidden rounded-2xl border border-line bg-surface/95 p-4 pr-10 shadow-2xl backdrop-blur',
                accentClassName[toast.accent],
              )}
            >
              {/* Accent edge highlight */}
              <span
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-1 bg-[var(--accent)]"
              />
              <span
                aria-hidden="true"
                className="absolute inset-0 opacity-[0.07]"
                style={{
                  backgroundImage: `linear-gradient(140deg, var(--accent-bright), var(--accent-deep))`,
                }}
              />
              <p className="relative font-display text-xl tracking-wide text-fg">
                {toast.title}
              </p>
              {toast.description && (
                <p className="relative mt-1 text-sm leading-snug text-muted">
                  {toast.description}
                </p>
              )}
              <button
                type="button"
                aria-label="Dismiss notification"
                onClick={() => dismiss(toast.id)}
                className="absolute right-3 top-3 rounded-full p-1 text-faint transition-colors hover:bg-surface-2 hover:text-fg"
              >
                <CloseIcon width={16} height={16} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}

/* oxlint-disable-next-line react/only-export-components */
export function useToast(): ToastContextValue {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}