import { useId } from 'react'

import { accentClassName } from '@/lib/accents'
import { cn } from '@/lib/cn'

import type { Accent } from '@/types'

/**
 * Generated cinematic key art rendered as an inline SVG backdrop. It derives
 * entirely from existing data fields (accent, title, code) so no screenshot
 * assets are needed, and every instance gets unique gradient/pattern ids so
 * multiple cards can coexist on the page.
 *
 * Variants:
 * - `poster`   billboard-style art with a gold keyline frame + ORIGINALS mark
 * - `thumb`    episode thumbnail with a big episode number + play glyph dip
 * - `diploma`  certificate art with a verification seal + grid
 * - `season`   journey-season banner with scanlines + a giant "S01" mark
 * - `badge`    small splash with a ghost letter — tiles, tools, episodes
 *
 * The art is purely decorative (`aria-hidden`); real links/buttons are always
 * separate, keyboard-accessible elements rendered on top by the caller.
 */
export type KeyArtVariant =
  | 'poster'
  | 'thumb'
  | 'diploma'
  | 'season'
  | 'badge'

interface KeyArtProps {
  variant?: KeyArtVariant
  accent?: Accent
  /** Title used for the ghost watermark letter. */
  title: string
  /** Free-form code, e.g. a season mark like "S01" or an episode number. */
  code?: string
  /** Short numeral emphasised by the `thumb`/`badge` variants, e.g. "03". */
  num?: string
  /** Overrides the first-letter watermark (e.g. the brand "H"). */
  watermark?: string
  className?: string
}

export function KeyArt({
  variant = 'poster',
  accent = 'red',
  title,
  code,
  num,
  watermark,
  className,
}: KeyArtProps) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '')
  const letter = watermark ?? title.charAt(0).toUpperCase()

  return (
    <div
      aria-hidden="true"
      className={cn(
        'absolute inset-0 overflow-hidden',
        accentClassName[accent],
        className,
      )}
    >
      <svg
        viewBox="0 0 400 300"
        preserveAspectRatio="xMidYMid slice"
        className="h-full w-full"
        focusable="false"
      >
        <defs>
          <linearGradient
            id={`${uid}-base`}
            x1="0"
            y1="0"
            x2="1"
            y2="1"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0" stopColor="var(--accent-bright)" />
            <stop offset="0.55" stopColor="var(--accent)" />
            <stop offset="1" stopColor="var(--accent-deep)" />
          </linearGradient>
          <radialGradient id={`${uid}-vig`} cx="50%" cy="40%" r="76%">
            <stop offset="58%" stopColor="#000" stopOpacity="0" />
            <stop offset="100%" stopColor="#000" stopOpacity="0.55" />
          </radialGradient>
          <pattern
            id={`${uid}-dots`}
            width="13"
            height="13"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="1.5" cy="1.5" r="1.4" fill="#000" opacity="0.32" />
          </pattern>
          <pattern
            id={`${uid}-grid`}
            width="22"
            height="22"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M22 0v22M0 22h22"
              stroke="#fff"
              strokeWidth="0.5"
              opacity="0.16"
              fill="none"
            />
          </pattern>
          <pattern
            id={`${uid}-scan`}
            width="6"
            height="6"
            patternUnits="userSpaceOnUse"
          >
            <rect width="6" height="2.2" fill="#000" opacity="0.18" />
          </pattern>
          <filter id={`${uid}-grain`}>
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.9"
              numOctaves="2"
              stitchTiles="stitch"
            />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.05 0"
            />
          </filter>
        </defs>

        <rect width="400" height="300" fill={`url(#${uid}-base)`} />

        <rect width="400" height="300" filter={`url(#${uid}-grain)`} />

        {variant === 'poster' && (
          <>
            <rect width="400" height="150" fill={`url(#${uid}-dots)`} />
            <text
              x="30"
              y="320"
              transform="rotate(-9 30 300)"
              fontFamily="'Bebas Neue','Arial Narrow',sans-serif"
              fontSize="360"
              fill="#000"
              opacity="0.18"
            >
              {letter}
            </text>
            <circle cx="368" cy="30" r="90" fill="rgba(255,255,255,0.06)" />
            <text
              x="20"
              y="272"
              fontFamily="'Inter',sans-serif"
              fontSize="13"
              fill="#fff"
              opacity="0.4"
              letterSpacing="6"
            >
              ORIGINALS
            </text>
            <rect
              x="14"
              y="14"
              width="372"
              height="272"
              rx="10"
              fill="none"
              stroke="#e9b949"
              strokeOpacity="0.5"
              strokeWidth="1.4"
            />
            <rect width="400" height="300" fill={`url(#${uid}-vig)`} />
          </>
        )}

        {variant === 'thumb' && (
          <>
            <rect
              width="400"
              height="150"
              fill={`url(#${uid}-dots)`}
              opacity="0.7"
            />
            <text
              x="22"
              y="215"
              fontFamily="'Bebas Neue','Arial Narrow',sans-serif"
              fontSize="200"
              fill="#000"
              opacity="0.22"
            >
              {num ?? code ?? ''}
            </text>
            <polygon points="200,120 240,150 200,180" fill="#000" opacity="0.14" />
            <rect width="400" height="300" fill={`url(#${uid}-vig)`} />
          </>
        )}

        {variant === 'diploma' && (
          <>
            <rect width="400" height="300" fill={`url(#${uid}-grid)`} />
            <text
              x="380"
              y="275"
              textAnchor="end"
              fontFamily="'Inter',sans-serif"
              fontSize="13"
              fill="#fff"
              opacity="0.35"
              letterSpacing="5"
            >
              VERIFIED
            </text>
            <g transform="translate(332 52)">
              <circle r="34" fill="none" stroke="#fff" strokeOpacity="0.55" strokeWidth="2" />
              <circle r="27" fill="#000" opacity="0.22" />
              <path
                d="M-12 0 l8 8 l16 -16"
                fill="none"
                stroke="#fff"
                strokeOpacity="0.85"
                strokeWidth="3.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
            <text
              x="18"
              y="272"
              fontFamily="'Bebas Neue','Arial Narrow',sans-serif"
              fontSize="150"
              fill="#000"
              opacity="0.13"
            >
              {letter}
            </text>
            <rect width="400" height="300" fill={`url(#${uid}-vig)`} />
          </>
        )}

        {variant === 'season' && (
          <>
            <rect
              width="400"
              height="300"
              fill={`url(#${uid}-scan)`}
              opacity="0.8"
            />
            <text
              x="22"
              y="238"
              fontFamily="'Bebas Neue','Arial Narrow',sans-serif"
              fontSize="210"
              fill="#000"
              opacity="0.2"
            >
              {code ?? 'S01'}
            </text>
            <rect width="400" height="300" fill={`url(#${uid}-vig)`} />
          </>
        )}

        {variant === 'badge' && (
          <>
            <rect
              width="400"
              height="300"
              fill={`url(#${uid}-dots)`}
              opacity="0.6"
            />
            <text
              x="200"
              y="230"
              textAnchor="middle"
              fontFamily="'Bebas Neue','Arial Narrow',sans-serif"
              fontSize="220"
              fill="#000"
              opacity="0.13"
            >
              {num ?? letter}
            </text>
            <rect width="400" height="300" fill={`url(#${uid}-vig)`} />
          </>
        )}
      </svg>
    </div>
  )
}