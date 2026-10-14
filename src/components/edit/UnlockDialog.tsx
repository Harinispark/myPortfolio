import { useRef, useState, type FormEvent } from 'react'

import { Button } from '@/components/common/Button'
import { CloseIcon, LockIcon } from '@/components/common/icons'
import { useEditMode } from '@/context/EditModeContext'
import { useFocusTrap } from '@/hooks/useFocusTrap'

/**
 * The token prompt. Opens from `Shift+E` or the `#edit` URL hash. The token is
 * checked against `GET /api/admin/verify` and then kept in memory only.
 *
 * Mounted with a `key`, so each open starts from a clean, empty field.
 */
export function UnlockDialog() {
  const { promptOpen, closePrompt, unlock, verifying, error } = useEditMode()
  const [value, setValue] = useState('')
  const panelRef = useRef<HTMLDivElement>(null)

  useFocusTrap(panelRef, promptOpen)

  if (!promptOpen) return null

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault()
    if (value.trim() === '') return
    await unlock(value.trim())
  }

  return (
    <div
      className="fixed inset-0 z-[95] flex items-start justify-center bg-black/70 p-4 pt-[18vh] backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Unlock edit mode"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) closePrompt()
      }}
    >
      <div
        ref={panelRef}
        className="w-full max-w-sm rounded-2xl border border-line bg-surface p-5 shadow-2xl shadow-black/70"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="grid size-9 place-items-center rounded-full border border-line text-gold">
              <LockIcon width={18} height={18} />
            </span>
            <div>
              <p className="kicker accent-text">Edit mode</p>
              <h2 className="text-base font-semibold text-fg">Enter admin token</h2>
            </div>
          </div>
          <button
            type="button"
            aria-label="Close"
            onClick={closePrompt}
            className="grid size-8 place-items-center rounded-full text-muted transition-colors hover:text-fg"
          >
            <CloseIcon width={18} height={18} />
          </button>
        </div>

        <form onSubmit={onSubmit} className="mt-4">
          <label htmlFor="admin-token" className="sr-only">
            Admin token
          </label>
          <input
            id="admin-token"
            type="password"
            autoComplete="off"
            data-autofocus
            value={value}
            onChange={(event) => setValue(event.target.value)}
            placeholder="Admin token"
            className="w-full rounded-xl border border-line bg-surface-2/70 px-3 py-2 text-sm text-fg placeholder:text-faint focus-visible:border-[var(--accent)] focus-visible:outline-none"
          />

          {error && (
            <p className="mt-2 text-xs text-brand-bright" role="alert">
              {error}
            </p>
          )}

          <div className="mt-4 flex items-center justify-end gap-3">
            <Button variant="ghost" size="sm" type="button" onClick={closePrompt}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" disabled={verifying}>
              {verifying ? 'Checking…' : 'Unlock'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
