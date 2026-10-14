import { Button } from '@/components/common/Button'
import { Photo } from '@/components/common/Photo'
import { about } from '@/data/about'
import { cta } from '@/data/navigation'
import { portrait, site } from '@/data/site'

/** "The Pilot: About Me" — the bio panel with a cast card for the lead. */
export function About() {
  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_20rem]">
      <div>
        {about.paragraphs.map((paragraph, index) => (
          <p
            key={index}
            className={
              index < about.paragraphs.length - 1
                ? 'mb-4 text-lg leading-relaxed text-muted'
                : 'text-lg leading-relaxed text-muted'
            }
          >
            {paragraph}
          </p>
        ))}
        <div className="mt-8">
          <Button href={cta.href}>{cta.label}</Button>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        {/* Cast card — the lead actress of this series */}
        <aside
          aria-label="Cast — who is on screen"
          className="panel overflow-hidden"
        >
          <div className="accent-red relative aspect-[4/5] bg-surface">
            <div aria-hidden="true" className="hero-glow absolute inset-0" />
            <Photo
              variant="hero"
              src={portrait.src}
              alt={portrait.alt}
              width={portrait.width}
              height={portrait.height}
              focus="50% 18%"
              priority
              className="relative z-10 h-full w-full"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-2/5 bg-linear-to-t from-ink via-ink/55 to-transparent"
            />
          </div>
          <div className="p-5">
            <p className="kicker accent-red">
              <span className="accent-text">Cast</span>
            </p>
            <p className="mt-1 font-display text-3xl tracking-[0.04em] text-fg">
              {site.name}
            </p>
            <p className="mt-1 text-sm text-muted">{site.availability}</p>
          </div>
        </aside>

        <div className="grid content-start gap-3 sm:grid-cols-2 lg:grid-cols-1">
          {about.quickFacts.map((fact) => (
            <div key={fact.id} className="panel hover-lift accent-red px-4 py-3">
              <p className="kicker">{fact.label}</p>
              <p className="mt-1 text-sm font-medium text-fg">{fact.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}