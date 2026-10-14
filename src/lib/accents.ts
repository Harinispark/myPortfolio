import type { Accent } from '@/types'

/** Maps a typed Accent to its CSS component class. See src/index.css. */
export const accentClassName: Record<Accent, string> = {
  red: 'accent-red',
  gold: 'accent-gold',
  blue: 'accent-blue',
  purple: 'accent-purple',
}

export const accentLabel: Record<Accent, string> = {
  red: 'Red',
  gold: 'Gold',
  blue: 'Blue',
  purple: 'Purple',
}