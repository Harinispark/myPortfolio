import { useId } from 'react'

import { cn } from '@/lib/cn'

import type { FieldDef } from '@/lib/edit/resources'

interface FieldProps {
  def: FieldDef
  value: unknown
  error?: string
  /** Optional prefix so nested (episode) fields get unique ids. */
  idPrefix?: string
  onChange: (value: unknown) => void
}

const inputClass =
  'w-full rounded-xl border border-line bg-surface-2/70 px-3 py-2 text-sm text-fg placeholder:text-faint transition-colors focus-visible:border-[var(--accent)] focus-visible:outline-none'

/** A single form control, chosen by the field's `kind`. */
export function Field({ def, value, error, idPrefix = '', onChange }: FieldProps) {
  const reactId = useId()
  const id = `${idPrefix}${def.name}-${reactId}`
  const errorId = `${id}-error`

  const describedBy = def.help || error ? errorId : undefined

  const control = () => {
    switch (def.kind) {
      case 'textarea':
        return (
          <textarea
            id={id}
            rows={3}
            value={String(value ?? '')}
            placeholder={def.placeholder}
            onChange={(event) => onChange(event.target.value)}
            aria-invalid={error ? true : undefined}
            aria-describedby={describedBy}
            className={cn(inputClass, 'resize-y')}
          />
        )

      case 'stringList':
        return (
          <textarea
            id={id}
            rows={4}
            value={String(value ?? '')}
            placeholder={def.placeholder ?? 'One per line'}
            onChange={(event) => onChange(event.target.value)}
            aria-invalid={error ? true : undefined}
            aria-describedby={describedBy}
            className={cn(inputClass, 'resize-y font-mono text-xs')}
          />
        )

      case 'number':
        return (
          <input
            id={id}
            type="number"
            value={value === null || value === undefined ? '' : String(value)}
            min={def.min}
            max={def.max}
            placeholder={def.placeholder}
            onChange={(event) =>
              onChange(event.target.value === '' ? '' : Number(event.target.value))
            }
            aria-invalid={error ? true : undefined}
            aria-describedby={describedBy}
            className={inputClass}
          />
        )

      case 'url':
        return (
          <input
            id={id}
            type="url"
            inputMode="url"
            value={String(value ?? '')}
            placeholder={def.placeholder ?? 'https://…'}
            onChange={(event) => onChange(event.target.value)}
            aria-invalid={error ? true : undefined}
            aria-describedby={describedBy}
            className={inputClass}
          />
        )

      case 'boolean':
        return (
          <label className="flex cursor-pointer items-center gap-3 text-sm text-muted">
            <input
              id={id}
              type="checkbox"
              checked={Boolean(value)}
              onChange={(event) => onChange(event.target.checked)}
              className="size-4 accent-[var(--accent)]"
            />
            {def.label}
          </label>
        )

      case 'accent':
      case 'select':
        return (
          <select
            id={id}
            value={String(value ?? '')}
            onChange={(event) => onChange(event.target.value)}
            aria-invalid={error ? true : undefined}
            aria-describedby={describedBy}
            className={inputClass}
          >
            <option value="" disabled>
              Choose…
            </option>
            {def.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )

      default:
        return (
          <input
            id={id}
            type="text"
            value={String(value ?? '')}
            placeholder={def.placeholder}
            onChange={(event) => onChange(event.target.value)}
            aria-invalid={error ? true : undefined}
            aria-describedby={describedBy}
            className={inputClass}
          />
        )
    }
  }

  return (
    <div className={cn('flex flex-col gap-1.5', def.wide && 'sm:col-span-2')}>
      <label
        htmlFor={id}
        className="text-xs font-semibold uppercase tracking-[0.14em] text-muted"
      >
        {def.label}
        {def.required && <span className="text-brand-bright"> *</span>}
      </label>
      {control()}
      {(error || def.help) && (
        <p id={errorId} className={cn('text-xs', error ? 'text-brand-bright' : 'text-faint')}>
          {error ?? def.help}
        </p>
      )}
    </div>
  )
}
