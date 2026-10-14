import { PlusIcon } from '@/components/common/icons'
import { cn } from '@/lib/cn'
import { resources, type ResourceKey } from '@/lib/edit/resources'

import { useRowActions } from './useRowActions'

interface AddRowButtonProps {
  resourceKey: ResourceKey
  /** Overrides the default "Add <label>" text. */
  label?: string
  className?: string
}

/** A small "add" affordance shown while edit mode is unlocked. */
export function AddRowButton({ resourceKey, label, className }: AddRowButtonProps) {
  const { canEdit, edit } = useRowActions()
  if (!canEdit) return null

  const def = resources[resourceKey]
  return (
    <button
      type="button"
      onClick={() => edit(resourceKey, null)}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border border-dashed border-line px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-muted transition-colors hover:border-[var(--accent)] hover:text-fg',
        className,
      )}
      data-edit-ui=""
    >
      <PlusIcon width={14} height={14} />
      {label ?? `Add ${def.label}`}
    </button>
  )
}
