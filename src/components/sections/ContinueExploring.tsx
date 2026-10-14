import { Carousel } from '@/components/common/Carousel'
import { PlayIcon } from '@/components/common/icons'
import { KeyArt } from '@/components/common/KeyArt'
import { ProgressBar } from '@/components/common/ProgressBar'
import { AddRowButton } from '@/components/edit/AddRowButton'
import { RowControls } from '@/components/edit/RowControls'
import { Parallax } from '@/components/motion/Parallax'
import { Tilt } from '@/components/motion/Tilt'
import { getAnchor } from '@/data/sections'
import { useSiteContent } from '@/context/SiteContentContext'
import { accentClassName } from '@/lib/accents'
import { cn } from '@/lib/cn'
import { useWatchedSections } from '@/hooks/useWatchedSections'

import type { ContinueTile } from '@/types'

/**
 * "Continue Exploring" — five episode tiles, each deep-linking into a section
 * of the page. Progress fills to 100% once that section has been visited;
 * the in-view section is badge "Now exploring".
 */
export function ContinueExploring() {
  const { continueTiles } = useSiteContent().content
  const { watched, current } = useWatchedSections()

  return (
    <>
      <AddRowButton resourceKey="continueTiles" className="mb-4" />
      <Carousel ariaLabel="Continue exploring — five episodes that link into the page">
        {continueTiles.map((tile, index) => {
          const isCurrent = current === tile.target
          const isWatched = watched.has(tile.target)
          return (
            <Tilt key={tile.id} className="shrink-0" max={6}>
              <EpisodeTile
                tile={tile}
                progress={isWatched ? 100 : tile.progress}
                isCurrent={isCurrent}
                isWatched={isWatched}
              />
              <RowControls
                resourceKey="continueTiles"
                id={tile.id}
                label={tile.title}
                first={index === 0}
                last={index === continueTiles.length - 1}
              />
            </Tilt>
          )
        })}
      </Carousel>
    </>
  )
}

function EpisodeTile({
  tile,
  progress,
  isCurrent,
  isWatched,
}: {
  tile: ContinueTile
  progress: number
  isCurrent: boolean
  isWatched: boolean
}) {
  const href = `#${getAnchor(tile.target)}`
  const episodeNum = tile.code.replace(/\D+/g, '').padStart(2, '0')

  return (
    <a
      href={href}
      aria-label={`${tile.code} — ${tile.title}. ${tile.logline} ${
        isCurrent ? 'You are here.' : ''
      }`}
      className={cn(
        'hover-lift sheen group relative flex w-64 flex-col overflow-hidden rounded-2xl border border-line bg-surface sm:w-72',
        accentClassName[tile.accent],
      )}
    >
      {/* Thumbnail art */}
      <div className="relative aspect-[16/9] overflow-hidden">
        <Parallax speed={0.12} className="absolute -inset-y-[12%] inset-x-0">
          <KeyArt
            variant="thumb"
            accent={tile.accent}
            title={tile.title}
            num={episodeNum}
            className="art-zoom"
          />
        </Parallax>

        {/* Decorative play glyph — the card itself is the real link */}
        <span
          aria-hidden="true"
          className="play-overlay absolute inset-0 z-10 grid place-items-center"
        >
          <span className="grid size-14 place-items-center rounded-full bg-black/55 text-white ring-1 ring-white/40 backdrop-blur-sm">
            <PlayIcon width={24} height={24} className="translate-x-[2px]" />
          </span>
        </span>

        <span className="absolute left-3 top-3 z-10 rounded-full border border-white/25 bg-black/40 px-2.5 py-0.5 text-[0.62rem] font-bold uppercase tracking-[0.18em] text-white/90 backdrop-blur-sm">
          {tile.code}
        </span>
      </div>

      {/* Body */}
      <div className="relative flex flex-1 flex-col gap-2 p-4">
        <h3 className="font-display text-2xl tracking-[0.03em] text-fg transition-colors group-hover:text-white">
          {tile.title}
        </h3>
        <p className="text-sm leading-snug text-muted">{tile.logline}</p>

        <div className="relative mt-auto pt-2">
          <ProgressBar
            value={progress}
            accent={tile.accent}
            ariaLabel={`${tile.title} — ${Math.round(progress)} percent watched`}
          />
          <p className="mt-2 flex items-center justify-between text-[0.68rem] uppercase tracking-[0.16em] text-faint">
            <span>{isCurrent ? 'Now exploring' : isWatched ? 'Watched' : 'Up next'}</span>
            <span className="accent-text font-semibold">{Math.round(progress)}%</span>
          </p>
        </div>
      </div>
    </a>
  )
}