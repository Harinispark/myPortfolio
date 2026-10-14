import type { SVGProps } from 'react'

/**
 * The original brand mark: a red "H" monogram with a gold underscore,
 * drawn for this project. No streaming-service branding anywhere.
 */
export function Monogram(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 64 64"
      role="img"
      aria-label="HARINI monogram"
      {...props}
    >
      <rect
        x="1"
        y="1"
        width="62"
        height="62"
        rx="15"
        fill="var(--color-surface-2)"
        stroke="var(--color-line)"
        strokeWidth="1.5"
      />
      <path
        d="M17 45V19h7v10h16V19h7v26h-7V35H24v10z"
        fill="var(--color-brand)"
      />
      <rect x="17" y="49" width="30" height="3" rx="1.5" fill="var(--color-gold)" />
    </svg>
  )
}