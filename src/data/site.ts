import type { PortraitMeta, SiteMeta } from '@/types'

export const site: SiteMeta = {
  name: 'Harini M',
  wordmark: 'HARINI',
  seriesTag: 'SERIES',
  tagline:
    'Every profile watches the same true story. It only changes what plays first.',
  location: 'Chennai, India',
  headline:
    'Information Technology Undergraduate | Aspiring Software Tester, Application Support and IT Operations Engineer',
  pitch:
    'Information Technology undergraduate who likes taking systems apart to see how they hold up — looking for a first role in software testing, application support, or IT operations.',
  about:
    'Motivated Information Technology undergraduate with hands-on experience building database-driven and web-based applications. Strong interest in structured problem-solving, system workflows, and data management. Eager to begin a career in Software Testing, Application Support, or IT Operations where I can contribute and grow in a dynamic environment.',
  email: 'harinimohan1969@gmail.com',
  availability: 'Open to 2026 graduate roles',
}

/**
 * The portrait. Drop `harini-portrait.png` into `public/` with this exact
 * name. `width`/`height` are the image's intrinsic pixels (used to reserve
 * space). Until the file exists the app renders a styled placeholder.
 */
export const portrait: PortraitMeta = {
  src: '/harini-portrait.png',
  alt: 'Portrait of Harini M',
  width: 1182,
  height: 1330,
}