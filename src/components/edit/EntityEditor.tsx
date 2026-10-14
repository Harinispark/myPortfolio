import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'

import { Button } from '@/components/common/Button'
import {
  ArrowDownIcon,
  ArrowUpIcon,
  CloseIcon,
  PlusIcon,
  TrashIcon,
} from '@/components/common/icons'
import { useEditMode } from '@/context/EditModeContext'
import { useSiteContent } from '@/context/SiteContentContext'
import { useToast } from '@/context/ToastContext'
import { useFocusTrap } from '@/hooks/useFocusTrap'
import { crud } from '@/lib/api/crud'
import {
  coerceFields,
  coerceNested,
  generateId,
  resources,
  validate,
  type ResourceDef,
  type Row,
} from '@/lib/edit/resources'
import { cn } from '@/lib/cn'

import { Field } from './Field'

function describe(cause: unknown): string {
  return cause instanceof Error && cause.message ? cause.message : 'Unexpected error'
}

/** Reads arrays into newline-joined strings so the textareas can edit them. */
function toFormValues(def: ResourceDef, row: Row): Row {
  const out: Row = { ...row }
  for (const field of def.fields) {
    if (field.kind === 'stringList' && Array.isArray(out[field.name])) {
      out[field.name] = (out[field.name] as string[]).join('\n')
    }
  }
  if (def.nested && Array.isArray(out[def.nested.name])) {
    out[def.nested.name] = (out[def.nested.name] as Row[]).map((episode) => {
      const entry: Row = { ...episode }
      for (const field of def.nested!.fields) {
        if (field.kind === 'stringList' && Array.isArray(entry[field.name])) {
          entry[field.name] = (entry[field.name] as string[]).join('\n')
        }
      }
      return entry
    })
  }
  return out
}

function labelOf(values: Row): string {
  for (const key of ['title', 'label', 'code', 'degree', 'role', 'name']) {
    const value = values[key]
    if (typeof value === 'string' && value.trim()) return value.trim()
  }
  return 'item'
}

/**
 * The create/edit form, opened from an inline control. It fetches the raw row
 * (including `sortOrder`) when editing, validates, then POSTs or PUTs before
 * refreshing the page bundle.
 */
export function EntityEditor() {
  const { editor, token, closeEditor } = useEditMode()
  const { refresh } = useSiteContent()
  const { publish } = useToast()
  const panelRef = useRef<HTMLDivElement>(null)

  const def = editor ? resources[editor.resourceKey] : null
  const open = Boolean(editor)

  const [values, setValues] = useState<Row | null>(() =>
    editor && def && !editor.id ? { id: '', ...def.blank() } : null,
  )
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState<boolean>(Boolean(editor?.id))
  const [submitting, setSubmitting] = useState(false)

  useFocusTrap(panelRef, open)

  useEffect(() => {
    if (!editor || !def || !editor.id) return
    let cancelled = false
    crud
      .get<Row>(def.path, editor.id)
      .then((row) => {
        if (!cancelled) setValues(toFormValues(def, row))
      })
      .catch((cause) => {
        publish({ title: 'Could not open', description: describe(cause), accent: 'red' })
        if (!cancelled) closeEditor()
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [editor, def, publish, closeEditor])

  const nestedKey = def?.nested?.name

  const episodes = useMemo<Row[]>(() => {
    if (!nestedKey) return []
    const list = values?.[nestedKey]
    return Array.isArray(list) ? (list as Row[]) : []
  }, [values, nestedKey])

  if (!editor || !def) return null

  const setField = (name: string, value: unknown) =>
    setValues((current) => (current ? { ...current, [name]: value } : current))

  const setEpisodeField = (index: number, name: string, value: unknown) =>
    setValues((current) => {
      if (!current || !nestedKey) return current
      const list = Array.isArray(current[nestedKey]) ? [...(current[nestedKey] as Row[])] : []
      list[index] = { ...list[index], [name]: value }
      return { ...current, [nestedKey]: list }
    })

  const addEpisode = () =>
    setValues((current) => {
      if (!current || !def.nested) return current
      const list = Array.isArray(current[def.nested.name])
        ? [...(current[def.nested.name] as Row[])]
        : []
      list.push({ ...def.nested.blank() })
      return { ...current, [def.nested.name]: list }
    })

  const removeEpisode = (index: number) =>
    setValues((current) => {
      if (!current || !def.nested) return current
      const list = (current[def.nested.name] as Row[]).filter((_, i) => i !== index)
      return { ...current, [def.nested.name]: list }
    })

  const moveEpisode = (index: number, direction: -1 | 1) =>
    setValues((current) => {
      if (!current || !def.nested) return current
      const list = [...(current[def.nested.name] as Row[])]
      const target = index + direction
      if (target < 0 || target >= list.length) return current
      const [item] = list.splice(index, 1)
      list.splice(target, 0, item)
      return { ...current, [def.nested.name]: list }
    })

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault()
    if (!values) return

    const found = validate(def, values)
    setErrors(found)
    if (Object.keys(found).length > 0) {
      publish({ title: 'Check the highlighted fields', accent: 'red' })
      return
    }

    setSubmitting(true)
    try {
      const fields = coerceFields(def, values)
      if (def.nested) fields[def.nested.name] = coerceNested(def, values)

      if (editor.id) {
        await crud.update(def.path, editor.id, fields, token)
        publish({ title: `${def.label} updated`, description: labelOf(values), accent: 'gold' })
      } else {
        const list = await crud.list<Row>(def.path)
        const nextSort =
          list.reduce((max, row) => Math.max(max, Number(row.sortOrder ?? 0)), 0) + 1
        const id =
          String(values.id ?? '').trim() ||
          generateId(
            def.idPrefix,
            String(values.title ?? values.label ?? values.code ?? values.degree ?? values.role ?? ''),
          )
        await crud.create(def.path, { id, sortOrder: nextSort, ...fields }, token)
        publish({ title: `${def.label} created`, description: labelOf(values), accent: 'gold' })
      }

      await refresh()
      closeEditor()
    } catch (cause) {
      publish({ title: 'Save failed', description: describe(cause), accent: 'red' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-[90] flex items-start justify-center overflow-y-auto bg-black/70 p-3 backdrop-blur-sm sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={`${editor.id ? 'Edit' : 'Add'} ${def.label}`}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) closeEditor()
      }}
    >
      <div
        ref={panelRef}
        className="my-auto w-full max-w-2xl rounded-2xl border border-line bg-surface shadow-2xl shadow-black/70"
      >
        <header className="flex items-center justify-between gap-4 border-b border-line px-5 py-4">
          <div>
            <p className="kicker accent-text">
              {editor.id ? 'Edit' : 'New'}
            </p>
            <h2 className="display-md text-fg">{def.label}</h2>
          </div>
          <button
            type="button"
            aria-label="Close"
            onClick={closeEditor}
            className="grid size-9 place-items-center rounded-full border border-line text-muted transition-colors hover:text-fg"
          >
            <CloseIcon width={18} height={18} />
          </button>
        </header>

        {loading || !values ? (
          <p className="px-5 py-10 text-center text-sm text-muted">Loading…</p>
        ) : (
          <form onSubmit={onSubmit} className="px-5 py-5">
            <div className="grid gap-4 sm:grid-cols-2">
              {!editor.id && (
                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <label
                    htmlFor="edit-row-id"
                    className="text-xs font-semibold uppercase tracking-[0.14em] text-muted"
                  >
                    ID
                  </label>
                  <input
                    id="edit-row-id"
                    type="text"
                    value={String(values.id ?? '')}
                    placeholder="Leave blank to auto-generate"
                    onChange={(event) => setField('id', event.target.value)}
                    className="w-full rounded-xl border border-line bg-surface-2/70 px-3 py-2 font-mono text-xs text-fg placeholder:text-faint focus-visible:border-[var(--accent)] focus-visible:outline-none"
                  />
                </div>
              )}

              {def.fields.map((item) => (
                <Field
                  key={item.name}
                  def={item}
                  value={values[item.name]}
                  error={errors[item.name]}
                  onChange={(value) => setField(item.name, value)}
                />
              ))}
            </div>

            {def.nested && (
              <fieldset className="mt-6 border-t border-line pt-5">
                <div className="mb-3 flex items-center justify-between">
                  <legend className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                    {def.nested.label} ({episodes.length})
                  </legend>
                  <button
                    type="button"
                    onClick={addEpisode}
                    className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-line px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-muted transition-colors hover:border-[var(--accent)] hover:text-fg"
                  >
                    <PlusIcon width={14} height={14} />
                    Add episode
                  </button>
                </div>

                <div className="flex flex-col gap-3">
                  {episodes.map((episode, index) => (
                    <div
                      key={String(episode.id ?? index)}
                      className="rounded-xl border border-line bg-surface-2/40 p-4"
                    >
                      <div className="mb-3 flex items-center justify-between gap-2">
                        <span className="text-xs font-semibold uppercase tracking-[0.14em] text-faint">
                          {episode.code ? String(episode.code) : `Episode ${index + 1}`}
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            aria-label="Move episode up"
                            disabled={index === 0}
                            onClick={() => moveEpisode(index, -1)}
                            className="grid size-7 place-items-center rounded-full border border-line text-muted transition-colors hover:text-fg disabled:opacity-30"
                          >
                            <ArrowUpIcon width={14} height={14} />
                          </button>
                          <button
                            type="button"
                            aria-label="Move episode down"
                            disabled={index === episodes.length - 1}
                            onClick={() => moveEpisode(index, 1)}
                            className="grid size-7 place-items-center rounded-full border border-line text-muted transition-colors hover:text-fg disabled:opacity-30"
                          >
                            <ArrowDownIcon width={14} height={14} />
                          </button>
                          <button
                            type="button"
                            aria-label="Remove episode"
                            onClick={() => removeEpisode(index)}
                            className="grid size-7 place-items-center rounded-full border border-line text-muted transition-colors hover:text-brand-bright"
                          >
                            <TrashIcon width={14} height={14} />
                          </button>
                        </div>
                      </div>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {def.nested!.fields.map((item) => (
                          <Field
                            key={item.name}
                            def={item}
                            idPrefix={`ep-${index}-`}
                            value={episode[item.name]}
                            error={errors[`${def.nested!.name}.${index}.${item.name}`]}
                            onChange={(value) => setEpisodeField(index, item.name, value)}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                  {episodes.length === 0 && (
                    <p className="text-sm text-muted">No episodes yet.</p>
                  )}
                </div>
              </fieldset>
            )}

            <div className="mt-6 flex items-center justify-end gap-3 border-t border-line pt-5">
              <Button variant="ghost" size="md" type="button" onClick={closeEditor}>
                Cancel
              </Button>
              <Button
                variant="primary"
                size="md"
                type="submit"
                disabled={submitting}
                className={cn(submitting && 'opacity-60')}
              >
                {submitting ? 'Saving…' : editor.id ? 'Save changes' : 'Create'}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
