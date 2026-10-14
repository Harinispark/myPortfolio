import { useState, type KeyboardEvent } from 'react'
import { AnimatePresence, motion } from 'motion/react'

import { Chip } from '@/components/common/Chip'
import { KeyArt } from '@/components/common/KeyArt'
import { AddRowButton } from '@/components/edit/AddRowButton'
import { EditRowButton } from '@/components/edit/EditRowButton'
import { RowControls } from '@/components/edit/RowControls'
import { Parallax } from '@/components/motion/Parallax'
import { Stagger, StaggerItem } from '@/components/motion/Stagger'
import { useSiteContent } from '@/context/SiteContentContext'
import { accentClassName } from '@/lib/accents'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

/**
 * "My Journey" — five seasons as tabs; each season opens its episode cards.
 * WAI-ARIA tablist semantics with arrow-key navigation.
 */
export function Journey() {
  const { seasons } = useSiteContent().content
  const [activeSeasonId, setActiveSeasonId] = useState(seasons[0]?.id ?? '')
  const reduced = usePrefersReducedMotion()
  const active =
    seasons.find((season) => season.id === activeSeasonId) ?? seasons[0]
  const activeIndex = seasons.findIndex((season) => season.id === active?.id)

  const onTabKeyDown = (event: KeyboardEvent) => {
    let direction = 0
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') direction = 1
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') direction = -1
    if (direction === 0) return
    event.preventDefault()
    const index = seasons.findIndex((season) => season.id === activeSeasonId)
    const next = seasons[(index + direction + seasons.length) % seasons.length]
    if (next) {
      setActiveSeasonId(next.id)
      document.getElementById(`season-tab-${next.id}`)?.focus()
    }
  }

  return (
    <div>
      <AddRowButton resourceKey="seasons" className="mb-3" />

      {/* Season tabs */}
      <div
        role="tablist"
        aria-label="Journey seasons"
        className="no-scrollbar flex gap-2 overflow-x-auto pb-2"
        onKeyDown={onTabKeyDown}
      >
        {seasons.map((season) => {
          const isActive = season.id === active?.id
          return (
            <button
              key={season.id}
              type="button"
              role="tab"
              id={`season-tab-${season.id}`}
              aria-selected={isActive}
              aria-controls={`season-panel-${season.id}`}
              onClick={() => setActiveSeasonId(season.id)}
              className={cn(
                'hover-lift flex shrink-0 items-baseline gap-2 rounded-xl border px-4 py-2.5 transition-colors',
                accentClassName[season.accent],
                isActive
                  ? 'border-[var(--accent)] bg-surface-2'
                  : 'border-line bg-transparent',
              )}
            >
              <span
                className={cn(
                  'font-display text-xl tracking-[0.08em]',
                  isActive ? 'accent-text' : 'text-muted',
                )}
              >
                {season.code}
              </span>
              <span className="hidden text-sm font-medium text-fg sm:inline">
                {season.title}
              </span>
              <span className="text-xs text-faint">{season.period}</span>
            </button>
          )
        })}
      </div>

      {/* Season panel */}
      <div
        role="tabpanel"
        id={`season-panel-${active?.id}`}
        aria-labelledby={`season-tab-${active?.id}`}
        className="mt-8"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={active?.id}
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: -10 }}
            transition={{ duration: reduced ? 0.001 : 0.3, ease: 'easeOut' }}
          >
            <div className={cn('relative mb-6 overflow-hidden rounded-2xl border border-line', accentClassName[active?.accent ?? 'red'])}>
              <Parallax speed={0.12} className="absolute -inset-y-[12%] inset-x-0">
                <KeyArt
                  variant="season"
                  accent={active?.accent ?? 'red'}
                  title={active?.title ?? ''}
                  code={active?.code}
                  watermark="H"
                />
              </Parallax>
              {active && (
                <RowControls
                  resourceKey="seasons"
                  id={active.id}
                  label={active.title}
                  first={activeIndex <= 0}
                  last={activeIndex === seasons.length - 1}
                />
              )}
              <div className="relative flex flex-wrap items-baseline gap-x-3 gap-y-1 p-6">
                <h3 className="display-md text-fg">{active?.title}</h3>
                <span className="kicker accent-text">{active?.period}</span>
              </div>
            </div>

            {active && (
              <div className="mb-4 flex items-center justify-between gap-3">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-faint">
                  {active.episodes.length} episode
                  {active.episodes.length === 1 ? '' : 's'}
                </p>
                <EditRowButton
                  resourceKey="seasons"
                  id={active.id}
                  label="Edit season & episodes"
                />
              </div>
            )}

            {active?.episodes.length ? (
              <Stagger>
                <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {active.episodes.map((episode) => (
                    <li
                      key={episode.id}
                      className={cn('h-full', accentClassName[active.accent])}
                    >
                      <StaggerItem className="h-full">
                        <article className="hover-lift group panel relative flex h-full flex-col overflow-hidden p-5">
                          <KeyArt
                            variant="badge"
                            accent={active.accent}
                            title={episode.title}
                            num={
                              episode.code.split('E').pop()?.padStart(2, '0') ?? ''
                            }
                            className="art-zoom"
                          />
                          <div className="relative z-10 flex flex-1 flex-col">
                            <p className="accent-text font-display text-lg tracking-[0.16em]">
                              {episode.code}
                            </p>
                            <h4 className="mt-2 font-display text-2xl tracking-[0.03em] text-fg">
                              {episode.title}
                            </h4>
                            {episode.period && (
                              <p className="mt-0.5 text-xs font-semibold uppercase tracking-[0.16em] text-faint">
                                {episode.period}
                              </p>
                            )}
                            <p className="mt-3 text-sm leading-relaxed text-muted">
                              {episode.summary}
                            </p>
                            {episode.bullets && episode.bullets.length > 0 && (
                              <ul className="mt-3 flex flex-col gap-1.5">
                                {episode.bullets.map((bullet) => (
                                  <li key={bullet} className="flex gap-2 text-xs text-muted">
                                    <span aria-hidden="true" className="mt-1.5 size-1 shrink-0 rounded-full bg-[var(--accent)]" />
                                    {bullet}
                                  </li>
                                ))}
                              </ul>
                            )}
                            {episode.tags && episode.tags.length > 0 && (
                              <div className="mt-auto flex flex-wrap gap-1.5 pt-4">
                                {episode.tags.map((tag) => (
                                  <Chip key={tag} className="px-2 py-0.5 text-[0.68rem]">
                                    {tag}
                                  </Chip>
                                ))}
                              </div>
                            )}
                          </div>
                        </article>
                      </StaggerItem>
                    </li>
                  ))}
                </ul>
              </Stagger>
            ) : (
              <p className="text-muted">No episodes yet in this season.</p>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}