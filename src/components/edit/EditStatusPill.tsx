import { LockIcon } from '@/components/common/icons'
import { useEditMode } from '@/context/EditModeContext'

/**
 * A small fixed badge that appears while edit mode is unlocked, with the
 * escape hatch to lock it again. Warns when the page is on bundled data.
 */
export function EditStatusPill() {
  const { enabled, canEdit, lock } = useEditMode()
  if (!enabled) return null

  return (
    <div className="fixed bottom-4 left-4 z-[80] flex items-center gap-3 rounded-full border border-gold/50 bg-ink/90 py-1.5 pl-3 pr-1.5 shadow-xl shadow-black/60 backdrop-blur">
      <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-gold">
        <span className="size-2 animate-pulse rounded-full bg-gold" aria-hidden="true" />
        {canEdit ? 'Editing' : 'Offline'}
      </span>
      {!canEdit && (
        <span className="text-xs text-muted">Backend unreachable — read-only</span>
      )}
      <button
        type="button"
        onClick={lock}
        className="inline-flex items-center gap-1.5 rounded-full border border-line px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-muted transition-colors hover:text-fg"
      >
        <LockIcon width={13} height={13} />
        Lock
      </button>
    </div>
  )
}
