import { certifications } from './certifications'
import { internships } from './internships'
import { projects } from './projects'

import type { Stat } from '@/types'

/**
 * The resume side-panel stats are derived from the data arrays, never
 * hand-written, so "3 Projects / 2 Internships / 2 Certifications" can never
 * drift out of sync with the content.
 */
export const stats: Stat[] = [
  { id: 'projects', value: projects.length, label: 'Projects', accent: 'red' },
  {
    id: 'internships',
    value: internships.length,
    label: 'Internships',
    accent: 'blue',
  },
  {
    id: 'certifications',
    value: certifications.length,
    label: 'Certifications',
    accent: 'gold',
  },
]