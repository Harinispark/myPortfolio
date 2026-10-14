import { useSiteContent } from '@/context/SiteContentContext'
import { cn } from '@/lib/cn'

interface MarqueeProps {
  className?: string
}

/**
 * The "Now trending" rail — a continuous ticker built from the site's real
 * content (projects, skill genres, certifications, seasons). Purely
 * decorative, so it is `aria-hidden` and never the source of navigation.
 *
 * The track pauses on hover/focus and holds still under reduced motion (the
 * CSS honours both the OS query and the in-app Motion toggle).
 */
export function Marquee({ className }: MarqueeProps) {
  const { content } = useSiteContent()

  const items = [
    ...content.projects.map((project) => project.title),
    ...content.skillCategories.map((category) => category.label),
    ...content.certifications.map((cert) => cert.title),
    ...content.seasons.map((season) => `${season.code} · ${season.title}`),
  ]

  if (items.length === 0) return null

  // Duplicated once so the -50% translate loops seamlessly.
  const track = [...items, ...items]

  return (
    <div
      aria-hidden="true"
      className={cn(
        'marquee group relative overflow-hidden border-y border-line bg-ink-soft/50 py-3.5',
        className,
      )}
    >
      <div className="marquee-track flex w-max items-center">
        {track.map((item, index) => (
          <span
            key={`${item}-${index}`}
            className="flex shrink-0 items-center gap-4 pr-4 text-xs font-semibold uppercase tracking-[0.22em] text-muted"
          >
            <span className="text-gold">◆</span>
            <span className="whitespace-nowrap">{item}</span>
          </span>
        ))}
      </div>

      {/* Edge fades so items melt out instead of hard-cutting. */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-linear-to-r from-ink to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-linear-to-l from-ink to-transparent" />
    </div>
  )
}
