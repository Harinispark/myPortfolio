import { useState, type KeyboardEvent } from 'react'
import { AnimatePresence, motion } from 'motion/react'

import { KeyArt } from '@/components/common/KeyArt'
import { AddRowButton } from '@/components/edit/AddRowButton'
import { EditRowButton } from '@/components/edit/EditRowButton'
import { useEditMode } from '@/context/EditModeContext'
import { useSiteContent } from '@/context/SiteContentContext'
import { accentClassName } from '@/lib/accents'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

/**
 * "Genres: My Skill Universe" — a vertical list of categories with counts.
 * Hover, tap, or keyboard-focus a genre to reveal its skill tiles.
 */
export function SkillUniverse() {
  const { skillCategories } = useSiteContent().content
  const [activeId, setActiveId] = useState(skillCategories[0]?.id ?? '')
  const reduced = usePrefersReducedMotion()
  const { canEdit } = useEditMode()
  const active =
    skillCategories.find((category) => category.id === activeId) ??
    skillCategories[0]

  /** Arrow keys move between genres; the focused genre opens its tiles. */
  const onTabKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    let direction = 0
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') direction = 1
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') direction = -1
    if (direction === 0) return
    event.preventDefault()
    const index = skillCategories.findIndex(
      (category) => category.id === active?.id,
    )
    const next =
      skillCategories[
        (index + direction + skillCategories.length) % skillCategories.length
      ]
    if (next) {
      setActiveId(next.id)
      document.getElementById(`genre-${next.id}`)?.focus()
    }
  }

  return (
    <>
      <AddRowButton resourceKey="skillCategories" className="mb-4" />
      <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">
      {/* Genre list */}
      <div
        role="tablist"
        aria-label="Skill categories"
        aria-orientation="vertical"
        className="no-scrollbar flex gap-2 overflow-x-auto pb-2 lg:w-72 lg:flex-col lg:gap-2 lg:overflow-visible lg:pb-0"
        onKeyDown={onTabKeyDown}
      >
        {skillCategories.map((category) => {
          const isActive = category.id === active?.id
          return (
            <button
              key={category.id}
              type="button"
              role="tab"
              id={`genre-${category.id}`}
              aria-selected={isActive}
              aria-controls={`genre-panel-${category.id}`}
              onClick={() => setActiveId(category.id)}
              className={cn(
                'hover-lift flex shrink-0 items-center gap-3 rounded-xl border px-4 py-3 text-left transition-colors',
                accentClassName[category.accent],
                isActive
                  ? 'border-[var(--accent)] bg-surface-2'
                  : 'border-line bg-transparent hover:border-[var(--accent)]/60',
              )}
            >
              <span
                aria-hidden="true"
                className="size-2 shrink-0 rounded-full transition-opacity"
                style={{
                  backgroundColor: 'var(--accent)',
                  opacity: isActive ? 1 : 0.4,
                }}
              />
              <span className="flex-1">
                <span
                  className={cn(
                    'block text-sm font-semibold transition-colors',
                    isActive ? 'text-fg' : 'text-muted',
                  )}
                >
                  {category.label}
                </span>
                <span className="block text-xs text-faint">
                  {category.skills.length} skill
                  {category.skills.length === 1 ? '' : 's'}
                </span>
              </span>
              <span
                aria-hidden="true"
                className="font-display text-2xl accent-text"
              >
                {String(category.skills.length).padStart(2, '0')}
              </span>
            </button>
          )
        })}
      </div>

      {/* Skill tiles */}
      <div
        className="min-w-0 flex-1"
        role="tabpanel"
        id={`genre-panel-${active?.id}`}
        aria-labelledby={`genre-${active?.id}`}
      >
        {canEdit && active && (
          <div className="mb-3 flex justify-end">
            <EditRowButton
              resourceKey="skillCategories"
              id={active.id}
              label="Edit category"
            />
          </div>
        )}
        <AnimatePresence mode="wait">
          <motion.ul
            key={active?.id}
            aria-label={`${active?.label} skills`}
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: -8 }}
            transition={{ duration: reduced ? 0.001 : 0.25, ease: 'easeOut' }}
            className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-3"
          >
            {active?.skills.map((skill, index) => (
              <motion.li
                key={skill}
                initial={reduced ? { opacity: 0 } : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: reduced ? 0.001 : 0.3,
                  delay: reduced ? 0 : index * 0.04,
                  ease: 'easeOut',
                }}
                className={cn(accentClassName[active?.accent ?? 'red'])}
              >
                <div className="hover-lift group panel relative flex h-full items-center justify-center overflow-hidden px-4 py-5 text-center">
                  <KeyArt
                    variant="badge"
                    accent={active?.accent ?? 'red'}
                    title={skill}
                    className="art-zoom"
                  />
                  <span className="relative z-10 text-sm font-medium text-fg">
                    {skill}
                  </span>
                </div>
              </motion.li>
            ))}
          </motion.ul>
        </AnimatePresence>
      </div>
      </div>
    </>
  )
}