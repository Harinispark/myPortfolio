import type { SectionKey, SectionMeta } from '@/types'

/** Canonical order used to validate every persisted profile order. */
export const sectionKeys: SectionKey[] = [
  'continueExploring',
  'resume',
  'certifications',
  'skills',
  'originals',
  'about',
  'journey',
]

export const sectionOrderRegistry = sectionKeys as readonly SectionKey[]

export const sections: Record<SectionKey, SectionMeta> = {
  continueExploring: {
    key: 'continueExploring',
    anchor: 'continue-exploring',
    eyebrow: 'Hold the card',
    title: 'Continue Exploring',
    subtitle: 'Pick up where the story left off — every entry deep-links into the series.',
  },
  resume: {
    key: 'resume',
    anchor: 'resume',
    eyebrow: 'The Screenplay',
    title: 'The Full Story',
    subtitle: 'Education, internships, projects, skills, and certifications — the whole script.',
  },
  certifications: {
    key: 'certifications',
    anchor: 'certifications',
    eyebrow: 'Credits & badges',
    title: 'Certifications',
    subtitle: 'Credentials earned along the way, with the issuing studio and year.',
  },
  skills: {
    key: 'skills',
    anchor: 'skills',
    eyebrow: 'Genres',
    title: 'My Skill Universe',
    subtitle: 'One genre per category — hover, tap, or focus to open its skill tiles.',
  },
  originals: {
    key: 'originals',
    anchor: 'originals',
    eyebrow: 'Originals',
    title: 'Originals',
    subtitle: 'Projects Harini built herself — every one database-driven and web-ready.',
  },
  about: {
    key: 'about',
    anchor: 'about',
    eyebrow: 'The Pilot',
    title: 'About Me',
    subtitle: 'The opening episode: who is on screen and what to expect.',
  },
  journey: {
    key: 'journey',
    anchor: 'journey',
    eyebrow: 'My Journey',
    title: 'Journey',
    subtitle: 'Five seasons, from the first class to the next chapter.',
  },
}

export function getSectionMeta(key: SectionKey): SectionMeta {
  return sections[key]
}

export function getAnchor(key: SectionKey): string {
  return sections[key].anchor
}