import type { WatchProfile } from '@/types'

/**
 * The four "viewer" profiles. Choosing one reorders the home page; the choice
 * persists server-side (see ProfileContext).
 */
export const watchingProfiles: WatchProfile[] = [
  {
    id: 'harini',
    label: 'Harini',
    kicker: 'Main',
    tagline: 'Full story, in order',
    description:
      'the complete series — education, internships, projects, skills, certifications, and where it is all headed.',
    accent: 'red',
    sectionOrder: [
      'continueExploring',
      'resume',
      'certifications',
      'skills',
      'originals',
      'about',
      'journey',
    ],
  },
  {
    id: 'recruiter',
    label: 'Recruiter',
    kicker: 'Talent scout',
    tagline: 'Credentials first',
    description:
      'the fastest path to the facts — resume, certifications, and skills first.',
    accent: 'gold',
    sectionOrder: [
      'resume',
      'certifications',
      'skills',
      'continueExploring',
      'originals',
      'about',
      'journey',
    ],
  },
  {
    id: 'developer',
    label: 'Developer',
    kicker: 'Peer review',
    tagline: 'Code and stack first',
    description:
      'what is built and how — projects and the tech stack, ahead of everything else.',
    accent: 'blue',
    sectionOrder: [
      'originals',
      'skills',
      'continueExploring',
      'resume',
      'certifications',
      'about',
      'journey',
    ],
  },
  {
    id: 'creative',
    label: 'Creative',
    kicker: 'Binge watcher',
    tagline: 'Story and highlights first',
    description:
      'the narrative — who this person is, the journey so far, and the standout highlights.',
    accent: 'purple',
    sectionOrder: [
      'about',
      'journey',
      'continueExploring',
      'originals',
      'skills',
      'certifications',
      'resume',
    ],
  },
]