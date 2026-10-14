import { useEditMode } from '@/context/EditModeContext'

import { EditStatusPill } from './EditStatusPill'
import { EntityEditor } from './EntityEditor'
import { UnlockDialog } from './UnlockDialog'

/**
 * Renders every piece of the inline editor's chrome. Mounted once near the app
 * root; each part decides for itself whether it is visible.
 *
 * `UnlockDialog` is keyed on the open flag so every open remounts with an empty
 * field (no reset effect required).
 */
export function EditLayer() {
  const { promptOpen, editor } = useEditMode()
  return (
    <>
      <UnlockDialog key={promptOpen ? 'unlock-open' : 'unlock-closed'} />
      <EntityEditor key={editor ? `${editor.resourceKey}:${editor.id ?? 'new'}` : 'editor-closed'} />
      <EditStatusPill />
    </>
  )
}
