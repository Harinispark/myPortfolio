import { PencilIcon } from '@/components/common/icons'
import { cn } from '@/lib/cn'
import { resources, type ResourceKey } from '@/lib/edit/resources'

import { useRowActions } from './useRowActions'

interface EditRowButtonProps {
  resourceKey: ResourceKey
  id: string
  label: string
  className?: string
}

/** A labelled affordance that opens the editor for one row (edit mode only). */
export function EditRowButton({ resourceKey, id, label, className }: EditRowButtonProps) {
  const { canEdit, edit } = useRowActions()
  if (!canEdit) return null

  const def = resources[resourceKey]
  return (
    <button
      type="button"
      onClick={() => edit(resourceKey, id)}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-muted transition-colors hover:border-[var(--accent)] hover:text-fg',
        className,
      )}
      data-edit-ui=""
      title={`Edit ${def.label}`}
    >
      <PencilIcon width={14} height={14} />
      {label}
    </button>
  )
}
