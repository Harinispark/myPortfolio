import { accentLabel } from '@/lib/accents'
import { sectionKeys } from '@/data/sections'

import type { Accent, SectionKey } from '@/types'

/* ------------------------------------------------------------------ */
/* Field + resource descriptors                                        */
/* ------------------------------------------------------------------ */

export type FieldKind =
  | 'text'
  | 'textarea'
  | 'number'
  | 'url'
  | 'boolean'
  | 'accent'
  | 'select'
  | 'stringList'

export interface FieldDef {
  name: string
  label: string
  kind: FieldKind
  /** Must be a non-empty string / non-empty list / valid number. */
  required?: boolean
  /** Empty string is submitted as `null` (matches the API's nullable columns). */
  nullable?: boolean
  placeholder?: string
  help?: string
  /** For `number` fields. */
  min?: number
  max?: number
  /** For `select` fields. */
  options?: Array<{ value: string; label: string }>
  /** Lists require at least one entry when `required`. */
  wide?: boolean
}

export type ResourceKey =
  | 'education'
  | 'internships'
  | 'projects'
  | 'skillCategories'
  | 'certifications'
  | 'continueTiles'
  | 'seasons'

export interface NestedDef {
  name: string
  label: string
  fields: FieldDef[]
  blank: () => Row
}

export interface ResourceDef {
  key: ResourceKey
  /** Express route root. */
  path: string
  /** Singular label, e.g. "Project". */
  label: string
  /** Plural label, e.g. "Projects". */
  plural: string
  /** Prefix used when auto-generating an id. */
  idPrefix: string
  fields: FieldDef[]
  blank: () => Row
  nested?: NestedDef
}

export type Row = Record<string, unknown>

const ACCENT_OPTIONS = (Object.keys(accentLabel) as Accent[]).map((value) => ({
  value,
  label: accentLabel[value],
}))

const TARGET_OPTIONS = sectionKeys.map((value) => ({
  value,
  label: value,
}))

const currentYear = new Date().getFullYear()

/* ------------------------------------------------------------------ */
/* The registry                                                        */
/* ------------------------------------------------------------------ */

export const resources: Record<ResourceKey, ResourceDef> = {
  education: {
    key: 'education',
    path: '/api/education',
    label: 'Education',
    plural: 'Education',
    idPrefix: 'edu',
    fields: [
      { name: 'degree', label: 'Degree', kind: 'text', required: true },
      { name: 'institution', label: 'Institution', kind: 'text', required: true },
      { name: 'startYear', label: 'Start year', kind: 'number', required: true },
      { name: 'endYear', label: 'End year', kind: 'number', required: true },
      { name: 'summary', label: 'Summary', kind: 'textarea', nullable: true, wide: true },
    ],
    blank: () => ({
      degree: '',
      institution: '',
      startYear: currentYear,
      endYear: currentYear,
      summary: '',
    }),
  },

  internships: {
    key: 'internships',
    path: '/api/internships',
    label: 'Internship',
    plural: 'Internships',
    idPrefix: 'intern',
    fields: [
      { name: 'role', label: 'Role', kind: 'text', required: true },
      { name: 'organization', label: 'Organization', kind: 'text', required: true },
      { name: 'start', label: 'Start (display)', kind: 'text', required: true, placeholder: 'Sep 2024' },
      { name: 'end', label: 'End (display)', kind: 'text', required: true, placeholder: 'Oct 2024' },
      { name: 'period', label: 'Period', kind: 'text', required: true, placeholder: 'Sep – Oct 2024' },
      { name: 'accent', label: 'Accent', kind: 'accent', required: true, options: ACCENT_OPTIONS },
      { name: 'bullets', label: 'Highlights (one per line)', kind: 'stringList', required: true, wide: true },
    ],
    blank: () => ({
      role: '',
      organization: '',
      start: '',
      end: '',
      period: '',
      accent: 'blue',
      bullets: [],
    }),
  },

  projects: {
    key: 'projects',
    path: '/api/projects',
    label: 'Project',
    plural: 'Projects',
    idPrefix: 'proj',
    fields: [
      { name: 'title', label: 'Title', kind: 'text', required: true },
      { name: 'category', label: 'Category', kind: 'text', required: true, placeholder: 'Full Stack' },
      { name: 'logline', label: 'Logline', kind: 'textarea', required: true, wide: true },
      { name: 'accent', label: 'Accent', kind: 'accent', required: true, options: ACCENT_OPTIONS },
      { name: 'featured', label: 'Featured', kind: 'boolean' },
      { name: 'tech', label: 'Tech (one per line)', kind: 'stringList', required: true, wide: true },
      { name: 'bullets', label: 'Highlights (one per line)', kind: 'stringList', required: true, wide: true },
      { name: 'githubUrl', label: 'GitHub URL', kind: 'url', nullable: true, placeholder: 'https://…' },
      { name: 'liveUrl', label: 'Live URL', kind: 'url', nullable: true, placeholder: 'https://…' },
    ],
    blank: () => ({
      title: '',
      category: '',
      logline: '',
      accent: 'red',
      featured: false,
      tech: [],
      bullets: [],
      githubUrl: '',
      liveUrl: '',
    }),
  },

  skillCategories: {
    key: 'skillCategories',
    path: '/api/skill-categories',
    label: 'Skill category',
    plural: 'Skill categories',
    idPrefix: 'skill',
    fields: [
      { name: 'label', label: 'Label', kind: 'text', required: true },
      { name: 'accent', label: 'Accent', kind: 'accent', required: true, options: ACCENT_OPTIONS },
      { name: 'skills', label: 'Skills (one per line)', kind: 'stringList', required: true, wide: true },
    ],
    blank: () => ({ label: '', accent: 'purple', skills: [] }),
  },

  certifications: {
    key: 'certifications',
    path: '/api/certifications',
    label: 'Certification',
    plural: 'Certifications',
    idPrefix: 'cert',
    fields: [
      { name: 'title', label: 'Title', kind: 'text', required: true },
      { name: 'provider', label: 'Provider', kind: 'text', required: true },
      { name: 'code', label: 'Code', kind: 'text', nullable: true },
      { name: 'year', label: 'Year', kind: 'number', required: true },
      { name: 'accent', label: 'Accent', kind: 'accent', required: true, options: ACCENT_OPTIONS },
      { name: 'credentialUrl', label: 'Credential URL', kind: 'url', nullable: true, placeholder: 'https://…' },
    ],
    blank: () => ({
      title: '',
      provider: '',
      code: '',
      year: currentYear,
      accent: 'gold',
      credentialUrl: '',
    }),
  },

  continueTiles: {
    key: 'continueTiles',
    path: '/api/continue-tiles',
    label: 'Continue tile',
    plural: 'Continue tiles',
    idPrefix: 'tile',
    fields: [
      { name: 'code', label: 'Code', kind: 'text', required: true, placeholder: 'Ep 01' },
      { name: 'title', label: 'Title', kind: 'text', required: true },
      { name: 'logline', label: 'Logline', kind: 'textarea', required: true, wide: true },
      {
        name: 'target',
        label: 'Scroll target',
        kind: 'select',
        required: true,
        options: TARGET_OPTIONS,
      },
      { name: 'progress', label: 'Progress (0–100)', kind: 'number', required: true, min: 0, max: 100 },
      { name: 'accent', label: 'Accent', kind: 'accent', required: true, options: ACCENT_OPTIONS },
    ],
    blank: () => ({
      code: '',
      title: '',
      logline: '',
      target: 'resume' as SectionKey,
      progress: 50,
      accent: 'red',
    }),
  },

  seasons: {
    key: 'seasons',
    path: '/api/seasons',
    label: 'Season',
    plural: 'Seasons',
    idPrefix: 'season',
    fields: [
      { name: 'code', label: 'Code', kind: 'text', required: true, placeholder: 'S01' },
      { name: 'title', label: 'Title', kind: 'text', required: true },
      { name: 'period', label: 'Period', kind: 'text', required: true, placeholder: '2022' },
      { name: 'accent', label: 'Accent', kind: 'accent', required: true, options: ACCENT_OPTIONS },
    ],
    blank: () => ({ code: '', title: '', period: '', accent: 'blue', episodes: [] }),
    nested: {
      name: 'episodes',
      label: 'Episodes',
      blank: () => ({
        code: '',
        title: '',
        summary: '',
        period: '',
        tags: [],
        bullets: [],
      }),
      fields: [
        { name: 'code', label: 'Code', kind: 'text', required: true, placeholder: 'S01E01' },
        { name: 'title', label: 'Title', kind: 'text', required: true },
        { name: 'period', label: 'Period', kind: 'text', nullable: true, placeholder: 'optional' },
        { name: 'summary', label: 'Summary', kind: 'textarea', required: true, wide: true },
        { name: 'tags', label: 'Tags (one per line)', kind: 'stringList', wide: true },
        { name: 'bullets', label: 'Highlights (one per line)', kind: 'stringList', wide: true },
      ],
    },
  },
}

export const resourceList = Object.values(resources)

/* ------------------------------------------------------------------ */
/* Ids, coercion, validation                                           */
/* ------------------------------------------------------------------ */

/** URL-safe slug used to build a readable id. */
function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40)
}

/** Deterministic-ish unique id: `<slug|prefix>-<base36 time>-<random>`. */
export function generateId(prefix: string, seed: string): string {
  const stem = slugify(seed) || prefix
  const stamp = Date.now().toString(36).slice(-4)
  const rand = Math.random().toString(36).slice(2, 6)
  return `${stem}-${stamp}${rand}`
}

/** Splits a textarea value into a clean list (one entry per line). */
export function toList(value: unknown): string[] {
  if (Array.isArray(value)) return value.map((item) => String(item).trim()).filter(Boolean)
  return String(value ?? '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
}

/** One value from a field, coerced to what the API expects. */
function coerce(field: FieldDef, raw: unknown): unknown {
  switch (field.kind) {
    case 'number': {
      const n = typeof raw === 'number' ? raw : Number(raw)
      return Number.isFinite(n) ? n : 0
    }
    case 'boolean':
      return Boolean(raw)
    case 'stringList':
      return toList(raw)
    case 'url': {
      const text = String(raw ?? '').trim()
      return text === '' ? null : text
    }
    default: {
      const text = String(raw ?? '').trim()
      if (text === '') return field.nullable ? null : ''
      return text
    }
  }
}

/** Field values (no id / sortOrder) ready for POST/PUT. */
export function coerceFields(def: ResourceDef, values: Row): Row {
  const payload: Row = {}
  for (const field of def.fields) payload[field.name] = coerce(field, values[field.name])
  return payload
}

/** Nested (episodes) list ready for POST/PUT, with ids + sortOrder. */
export function coerceNested(
  def: ResourceDef,
  values: Row,
): Row[] {
  const nested = def.nested
  if (!nested) return []
  const list = Array.isArray(values[nested.name]) ? (values[nested.name] as Row[]) : []
  return list.map((item, index) => {
    const entry: Row = { sortOrder: index }
    entry.id =
      typeof item.id === 'string' && item.id.trim() !== ''
        ? item.id.trim()
        : generateId('ep', String(item.title ?? item.code ?? ''))
    for (const field of nested.fields) entry[field.name] = coerce(field, item[field.name])
    return entry
  })
}

const URL_RE = /^https?:\/\/\S+$/i

/** Client-side mirror of the backend Zod rules → `{ field: message }`. */
export function validate(def: ResourceDef, values: Row): Record<string, string> {
  const errors: Record<string, string> = {}

  for (const field of def.fields) {
    const value = values[field.name]

    if (field.kind === 'url') {
      const text = String(value ?? '').trim()
      if (!field.nullable || text !== '') {
        if (!URL_RE.test(text)) errors[field.name] = 'Enter a full URL (https://…)'
      }
      continue
    }

    if (field.kind === 'stringList') {
      const list = toList(value)
      if (field.required && list.length === 0) errors[field.name] = 'Add at least one entry'
      continue
    }

    if (field.kind === 'number') {
      const n = Number(value)
      if (!Number.isFinite(n)) {
        errors[field.name] = 'Must be a number'
      } else if (field.min !== undefined && n < field.min) {
        errors[field.name] = `Must be at least ${field.min}`
      } else if (field.max !== undefined && n > field.max) {
        errors[field.name] = `Must be at most ${field.max}`
      }
      continue
    }

    if (field.kind === 'boolean') continue

    if (field.required) {
      const text = String(value ?? '').trim()
      if (text === '') errors[field.name] = 'Required'
    }
  }

  if (def.nested) {
    const list = Array.isArray(values[def.nested.name]) ? (values[def.nested.name] as Row[]) : []
    list.forEach((item, index) => {
      for (const field of def.nested!.fields) {
        if (field.kind === 'url' || field.kind === 'boolean' || field.kind === 'number') continue
        if (field.kind === 'stringList') continue
        if (field.required && String(item[field.name] ?? '').trim() === '') {
          errors[`${def.nested!.name}.${index}.${field.name}`] = 'Required'
        }
      }
    })
  }

  return errors
}
