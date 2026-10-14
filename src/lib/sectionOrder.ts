import { sectionKeys } from '@/data/sections'

import type { SectionKey } from '@/types'

const knownSectionKeys = new Set<string>(sectionKeys)

export function isSectionKey(value: unknown): value is SectionKey {
  return typeof value === 'string' && knownSectionKeys.has(value)
}

/**
 * Repairs a section order read from the API (or crafted by an edited profile)
 * back to a complete, unique, valid sequence: unknown entries are dropped,
 * duplicates are removed, and any missing sections are appended in canonical
 * order.
 */
export function normalizeSectionOrder(
  order: Array<string | SectionKey> | null | undefined,
): SectionKey[] {
  if (!Array.isArray(order)) return [...sectionKeys]

  const seen = new Set<SectionKey>()
  for (const item of order) {
    if (isSectionKey(item) && !seen.has(item)) seen.add(item)
  }
  for (const key of sectionKeys) {
    if (!seen.has(key)) seen.add(key)
  }

  return [...seen]
}