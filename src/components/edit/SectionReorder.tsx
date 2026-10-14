import { useState } from 'react'

import { ArrowDownIcon, ArrowUpIcon } from '@/components/common/icons'
import { useEditMode } from '@/context/EditModeContext'
import { useProfile } from '@/context/ProfileContext'
import { useSiteContent } from '@/context/SiteContentContext'
import { useToast } from '@/context/ToastContext'
import { getSectionMeta } from '@/data/sections'
import { crud } from '@/lib/api/crud'
import { normalizeSectionOrder } from '@/lib/sectionOrder'
import { cn } from '@/lib/cn'

import type { WatchProfileId } from '@/types'

function describe(cause: unknown): string {
  return cause instanceof Error && cause.message ? cause.message : 'Unexpected error'
}

const itemButton =
  'grid size-7 place-items-center rounded-full border border-line text-muted transition-colors hover:border-[var(--accent)] hover:text-fg disabled:opacity-30'

/**
 * Reorders the home-page blocks for any viewer profile and persists the result
 * with `PUT /api/profiles/:id`. Only shown while edit mode is unlocked.
 */
export function SectionReorder() {
  const { canEdit, token } = useEditMode()
  const { profiles, activeProfile } = useProfile()
  const { refresh } = useSiteContent()
  const { publish } = useToast()
  const [targetId, setTargetId] = useState<WatchProfileId | ''>(
    activeProfile?.id ?? profiles[0]?.id ?? '',
  )
  const [busy, setBusy] = useState(false)

  if (!canEdit) return null

  const target =
    profiles.find((profile) => profile.id === targetId) ?? activeProfile ?? profiles[0]
  if (!target) return null

  const order = normalizeSectionOrder(target.sectionOrder)

  const move = async (index: number, direction: -1 | 1) => {
    const next = [...order]
    const swap = index + direction
    if (swap < 0 || swap >= next.length) return
    ;[next[index], next[swap]] = [next[swap], next[index]]

    setBusy(true)
    try {
      await crud.update('/api/profiles', target.id, { sectionOrder: next }, token)
      await refresh()
      publish({
        title: 'Section order saved',
        description: `Home layout for ${target.label}`,
        accent: 'gold',
      })
    } catch (cause) {
      publish({ title: 'Could not save order', description: describe(cause), accent: 'red' })
    } finally {
      setBusy(false)
    }
  }

  return (
    <section
      className="mx-auto w-full max-w-7xl px-4 pt-16 sm:px-6 lg:px-8"
      data-edit-ui=""
      aria-label="Home layout editor"
    >
      <div className="panel accent-gold p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="kicker accent-text">Edit mode · Home layout</p>
            <h2 className="text-base font-semibold text-fg">
              Reorder the blocks for a viewer profile
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {profiles.map((profile) => (
              <button
                key={profile.id}
                type="button"
                onClick={() => setTargetId(profile.id)}
                className={cn(
                  'rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] transition-colors',
                  profile.id === target.id
                    ? 'border-[var(--accent)] text-fg'
                    : 'border-line text-muted hover:text-fg',
                )}
              >
                {profile.label}
              </button>
            ))}
          </div>
        </div>

        <ol className="mt-4 flex flex-col gap-2">
          {order.map((key, index) => {
            const meta = getSectionMeta(key)
            const label = meta?.title ?? key
            return (
              <li
                key={key}
                className="flex items-center justify-between gap-3 rounded-xl border border-line bg-surface-2/40 px-4 py-2"
              >
                <span className="text-sm text-fg">{label}</span>
                <span className="flex items-center gap-1">
                  <button
                    type="button"
                    aria-label={`Move ${label} up`}
                    disabled={busy || index === 0}
                    onClick={() => void move(index, -1)}
                    className={itemButton}
                  >
                    <ArrowUpIcon width={14} height={14} />
                  </button>
                  <button
                    type="button"
                    aria-label={`Move ${label} down`}
                    disabled={busy || index === order.length - 1}
                    onClick={() => void move(index, 1)}
                    className={itemButton}
                  >
                    <ArrowDownIcon width={14} height={14} />
                  </button>
                </span>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
