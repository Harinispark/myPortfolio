import { useEffect, useState } from 'react'

import { getAnchor, sectionKeys } from '@/data/sections'
import { cn } from '@/lib/cn'

import type { Accent, SectionKey } from '@/types'

/** The page-level glow colour each section contributes. */
const sectionAccent: Record<SectionKey, Accent> = {
  continueExploring: 'red',
  resume: 'blue',
  certifications: 'gold',
  skills: 'purple',
  originals: 'red',
  about: 'gold',
  journey: 'blue',
}

const accents: Accent[] = ['red', 'gold', 'blue', 'purple']

const accentClass: Record<Accent, string> = {
  red: 'accent-red',
  gold: 'accent-gold',
  blue: 'accent-blue',
  purple: 'accent-purple',
}

/**
 * A fixed, page-level ambient glow that cross-fades to each section's accent
 * as you scroll. Four stacked gradient layers (one per accent) are toggled by
 * opacity — far cheaper and smoother than animating a gradient colour.
 *
 * Purely decorative: `aria-hidden`, behind the content, and it does nothing
 * under reduced motion beyond the very first (static) fade.
 */
export function AmbientBackdrop() {
  const [active, setActive] = useState<Accent | null>(null)

  useEffect(() => {
    const targets = sectionKeys
      .map((key) => ({ key, el: document.getElementById(getAnchor(key)) }))
      .filter((entry): entry is { key: SectionKey; el: HTMLElement } =>
        Boolean(entry.el),
      )
    if (targets.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          const key = targets.find((target) => target.el === entry.target)?.key
          if (key) setActive(sectionAccent[key])
        }
      },
      { rootMargin: '-40% 0px -45% 0px', threshold: 0 },
    )

    for (const target of targets) observer.observe(target.el)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      aria-hidden="true"
      style={{ zIndex: -1 }}
      className="pointer-events-none fixed inset-0 overflow-hidden"
    >
      {accents.map((accent) => (
        <div
          key={accent}
          className={cn(
            'absolute inset-0 transition-opacity duration-1000 ease-out',
            accentClass[accent],
          )}
          style={{
            opacity: active === accent ? 1 : 0,
            backgroundImage:
              'radial-gradient(60% 42% at 50% -6%, var(--accent-glow), transparent 68%)',
          }}
        />
      ))}
    </div>
  )
}
