import { useState } from 'react'

import {
  ArrowDownIcon,
  ArrowUpIcon,
  PencilIcon,
  TrashIcon,
} from '@/components/common/icons'
import { cn } from '@/lib/cn'

import { useRowActions } from './useRowActions'

import type { ResourceKey } from '@/lib/edit/resources'

interface RowControlsProps {
  resourceKey: ResourceKey
  id: string
  /** Used in the accessible labels, e.g. the project title. */
  label: string
  first?: boolean
  last?: boolean
  className?: string
}

const buttonClass =
  'grid size-7 place-items-center rounded-full border border-line bg-ink/85 text-muted backdrop-blur transition-colors hover:border-[var(--accent)] hover:text-fg focus-visible:outline-2 focus-visible:outline-offset-1 disabled:opacity-40'

/**
 * The inline toolbar shown on a content card while edit mode is unlocked.
 * Renders nothing for ordinary visitors.
 */
export function RowControls({
  resourceKey,
  id,
  label,
  first = false,
  last = false,
  className,
}: RowControlsProps) {
  const { canEdit, busy, edit, remove, move } = useRowActions()
  const [confirming, setConfirming] = useState(false)

  if (!canEdit) return null

  return (
    <div
      className={cn(
        'absolute right-2 top-2 z-30 flex items-center gap-1',
        className,
      )}
      data-edit-ui=""
    >
      {confirming ? (
        <div className="flex items-center gap-1 rounded-full border border-brand/50 bg-ink/90 px-1.5 py-1 backdrop-blur">
          <span className="px-1 text-[0.62rem] font-semibold uppercase tracking-wide text-fg">
            Delete?
          </span>
          <button
            type="button"
            disabled={busy}
            onClick={() => void remove(resourceKey, id, label)}
            className="rounded-full bg-brand px-2 py-0.5 text-[0.62rem] font-bold uppercase text-fg transition-opacity hover:opacity-90 disabled:opacity-40"
          >
            Yes
          </button>
          <button
            type="button"
            onClick={() => setConfirming(false)}
            className="rounded-full px-2 py-0.5 text-[0.62rem] font-bold uppercase text-muted hover:text-fg"
          >
            No
          </button>
        </div>
      ) : (
        <>
          {!first && (
            <button
              type="button"
              aria-label={`Move ${label} up`}
              disabled={busy}
              onClick={() => void move(resourceKey, id, -1)}
              className={buttonClass}
            >
              <ArrowUpIcon width={14} height={14} />
            </button>
          )}
          {!last && (
            <button
              type="button"
              aria-label={`Move ${label} down`}
              disabled={busy}
              onClick={() => void move(resourceKey, id, 1)}
              className={buttonClass}
            >
              <ArrowDownIcon width={14} height={14} />
            </button>
          )}
          <button
            type="button"
            aria-label={`Edit ${label}`}
            disabled={busy}
            onClick={() => edit(resourceKey, id)}
            className={buttonClass}
          >
            <PencilIcon width={14} height={14} />
          </button>
          <button
            type="button"
            aria-label={`Delete ${label}`}
            disabled={busy}
            onClick={() => setConfirming(true)}
            className={buttonClass}
          >
            <TrashIcon width={14} height={14} />
          </button>
        </>
      )}
    </div>
  )
}
