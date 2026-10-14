import { certifications } from '@/data/certifications'
import { continueTiles } from '@/data/continueExploring'
import { education } from '@/data/education'
import { internships } from '@/data/internships'
import { seasons } from '@/data/journey'
import { projects } from '@/data/projects'
import { skillCategories } from '@/data/skills'
import { watchingProfiles } from '@/data/watchingProfiles'

import type {
  Certification,
  ContinueTile,
  Education,
  Internship,
  Project,
  Season,
  SkillCategory,
  WatchProfile,
} from '@/types'

/**
 * The whole page's content in one object. `GET /api/site` returns exactly this
 * shape; `buildLocalContent()` produces the same thing from the bundled static
 * data files, used as an offline/first-paint fallback before (or instead of)
 * the API responding.
 */
export interface ContentBundle {
  education: Education[]
  internships: Internship[]
  projects: Project[]
  skillCategories: SkillCategory[]
  certifications: Certification[]
  seasons: Season[]
  continueTiles: ContinueTile[]
  profiles: WatchProfile[]
}

export function buildLocalContent(): ContentBundle {
  return {
    education,
    internships,
    projects,
    skillCategories,
    certifications,
    seasons,
    continueTiles,
    profiles: watchingProfiles,
  }
}
