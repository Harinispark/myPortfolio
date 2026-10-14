/**
 * Domain model for "HARINI — The Series".
 *
 * Every piece of content on the site lives in `src/data/*` and conforms to
 * these types. Components render whatever the data files say — nothing is
 * hard-coded in JSX.
 */

/** Visual accent colour: red / gold / blue / purple. */
export type Accent = 'red' | 'gold' | 'blue' | 'purple'

/**
 * Reorderable home-page blocks. The hero always renders first and the finale
 * always renders last; everything in between follows the active
 * `WatchProfile.sectionOrder`.
 */
export type SectionKey =
  | 'continueExploring'
  | 'resume'
  | 'certifications'
  | 'skills'
  | 'originals'
  | 'about'
  | 'journey'

/** Who is "watching" the site right now. */
export type WatchProfileId = 'harini' | 'recruiter' | 'developer' | 'creative'

export interface SiteMeta {
  /** Verified, public identity details. No phone number, no street address. */
  name: string // "Harini M"
  wordmark: string // "HARINI"
  seriesTag: string // "SERIES"
  tagline: string // "Every profile watches the same true story…"
  location: string // "Chennai, India"
  headline: string // full professional headline
  pitch: string // one-liner used in the hero
  about: string // "The Pilot" bio paragraph
  email: string
  availability: string // displayed beside the CTA, e.g. "Open to 2026 roles"
}

export interface PortraitMeta {
  src: string
  alt: string // "Portrait of Harini M"
  /** Intrinsic dimensions — used to reserve space and avoid layout shift. */
  width: number
  height: number
}

export interface SocialLink {
  id: 'email' | 'github' | 'linkedin'
  label: string
  href: string // mailto:… | https://…
  handle: string // visible handle, e.g. "Harinispark"
  ariaLabel: string
}

export interface NavItem {
  id: string
  label: string // link text
  href: string // "#journey" or "/resume"
  section: SectionKey | 'hero' | 'resumePage' // drives active-state tracking
}

export interface Cta {
  id: string
  label: string // "Let's build"
  href: string // mailto:…
  ariaLabel: string
}

export interface FooterConfig {
  note: string // "Personal project, not affiliated with any streaming service."
  madeWith: string // "Built with React, TypeScript, Tailwind CSS & Framer Motion"
}

export interface WatchProfile {
  id: WatchProfileId
  label: string // "Harini"
  kicker: string // "Main"
  tagline: string // "Full story, in order"
  description: string // spoken in the "Now watching as …" toast
  accent: Accent
  sectionOrder: SectionKey[]
}

export interface SectionMeta {
  key: SectionKey
  anchor: string // scroll anchor id, e.g. "originals"
  eyebrow: string // small kicker above the title
  title: string // "Originals"
  subtitle?: string
}

export interface Education {
  id: string
  degree: string // "B.Tech in Information Technology"
  institution: string
  startYear: number
  endYear: number
  summary?: string
}

export interface Internship {
  id: string
  role: string
  organization: string
  start: string // display string, e.g. "Sep 2024"
  end: string // "Oct 2024" | "Jul 2025"
  period: string // rendered alongside the card, e.g. "Sep – Oct 2024"
  bullets: string[]
  accent: Accent
}

export interface Project {
  id: string
  title: string
  category: string // "Full Stack" | "Backend" | "Web"
  logline: string // one-line billboard description
  bullets: string[]
  tech: string[]
  accent: Accent
  featured: boolean // ordering for the Originals section
  links: {
    github?: string
    live?: string
  }
}

export interface SkillCategory {
  id: string
  label: string // "Programming"
  accent: Accent
  skills: string[]
}

export interface Certification {
  id: string
  title: string
  provider: string
  code?: string // e.g. "CC0101EN"
  year: number
  accent: Accent
  credentialUrl?: string
}

export interface Episode {
  id: string
  code: string // "S01E01"
  title: string
  summary: string
  period?: string // where a year differs from the season year
  tags?: string[]
  bullets?: string[]
}

export interface Season {
  id: string
  code: string // "S01"
  title: string // "The Beginning"
  period: string // "2022"
  accent: Accent
  episodes: Episode[]
}

export interface ContinueTile {
  id: string
  code: string // "Ep 01"
  title: string // "The Full Story"
  logline: string
  target: SectionKey // scroll target
  /** Decorative "watch progress" 0–100 shown as a bar; the tiled section
   *  overrides this with real scroll progress on the live tile. */
  progress: number
  accent: Accent
}

export interface Stat {
  id: string
  value: number
  label: string // "Projects"
  accent: Accent
}

export interface ToastMessage {
  id: string
  title: string
  description?: string
  accent: Accent
}