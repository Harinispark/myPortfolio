import { useCallback, useState } from 'react'

import { useEditMode } from '@/context/EditModeContext'
import { useSiteContent } from '@/context/SiteContentContext'
import { useToast } from '@/context/ToastContext'
import { crud } from '@/lib/api/crud'
import { resources, type ResourceKey, type Row } from '@/lib/edit/resources'

function describe(cause: unknown): string {
  return cause instanceof Error && cause.message ? cause.message : 'Unexpected error'
}

/**
 * Edit / delete / reorder actions for a single content row. Delete and move
 * talk to the CRUD API, then refresh the page bundle so the change is visible.
 */
export function useRowActions() {
  const { token, canEdit, openEditor } = useEditMode()
  const { refresh } = useSiteContent()
  const { publish } = useToast()
  const [busy, setBusy] = useState(false)

  const edit = useCallback(
    (key: ResourceKey, id: string | null) => openEditor(key, id),
    [openEditor],
  )

  const remove = useCallback(
    async (key: ResourceKey, id: string, label: string) => {
      const def = resources[key]
      setBusy(true)
      try {
        await crud.remove(def.path, id, token)
        publish({ title: `${def.label} deleted`, description: label, accent: 'gold' })
        await refresh()
      } catch (cause) {
        publish({ title: 'Delete failed', description: describe(cause), accent: 'red' })
      } finally {
        setBusy(false)
      }
    },
    [token, refresh, publish],
  )

  /** Swaps `sortOrder` with the neighbouring row (or renumbers if tied). */
  const move = useCallback(
    async (key: ResourceKey, id: string, direction: -1 | 1) => {
      const def = resources[key]
      setBusy(true)
      try {
        const list = await crud.list<Row>(def.path)
        const index = list.findIndex((row) => row.id === id)
        const target = index + direction
        if (index < 0 || target < 0 || target >= list.length) return

        const a = list[index]
        const b = list[target]
        const sa = Number(a.sortOrder ?? index)
        const sb = Number(b.sortOrder ?? target)

        if (sa === sb) {
          // Tied values (e.g. several fresh rows at 0) — renumber the whole list.
          const ordered = [...list]
          ordered.splice(target, 0, ordered.splice(index, 1)[0])
          await Promise.all(
            ordered.map((row, position) =>
              Number(row.sortOrder) === position
                ? null
                : crud.update(def.path, String(row.id), { sortOrder: position }, token),
            ),
          )
        } else {
          await Promise.all([
            crud.update(def.path, String(a.id), { sortOrder: sb }, token),
            crud.update(def.path, String(b.id), { sortOrder: sa }, token),
          ])
        }

        await refresh()
      } catch (cause) {
        publish({ title: 'Reorder failed', description: describe(cause), accent: 'red' })
      } finally {
        setBusy(false)
      }
    },
    [token, refresh, publish],
  )

  return { canEdit, busy, edit, remove, move }
}
