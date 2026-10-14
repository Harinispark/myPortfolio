import type { ReactNode } from 'react'

import { Button } from '@/components/common/Button'
import { Chip } from '@/components/common/Chip'
import {
  ExternalLinkIcon,
  GithubIcon,
  PlayIcon,
} from '@/components/common/icons'
import { KeyArt } from '@/components/common/KeyArt'
import { AddRowButton } from '@/components/edit/AddRowButton'
import { RowControls } from '@/components/edit/RowControls'
import { Parallax } from '@/components/motion/Parallax'
import { Stagger, StaggerItem } from '@/components/motion/Stagger'
import { Tilt } from '@/components/motion/Tilt'
import { useSiteContent } from '@/context/SiteContentContext'
import { accentClassName } from '@/lib/accents'
import { cn } from '@/lib/cn'

import type { Project } from '@/types'

/**
 * "Originals" — billboard-style project cards with an accent gradient
 * key-art panel. GitHub / live links render as disabled placeholders until
 * the project data has real URLs.
 */
export function Originals() {
  const { projects } = useSiteContent().content
  const [featured, ...rest] = projects

  return (
    <div className="flex flex-col gap-6">
      <AddRowButton resourceKey="projects" className="self-start" />
      {featured && (
        <Tilt className="h-full">
          <BillboardCard
            project={featured}
            first
            last={rest.length === 0}
            className="sm:flex-row sm:items-stretch"
          />
        </Tilt>
      )}
      <Stagger className="grid gap-6 md:grid-cols-2">
        {rest.map((project, index) => (
          <StaggerItem key={project.id} className="h-full">
            <Tilt className="h-full">
              <BillboardCard project={project} last={index === rest.length - 1} />
            </Tilt>
          </StaggerItem>
        ))}
      </Stagger>
    </div>
  )
}

function BillboardCard({
  project,
  first,
  last,
  className,
}: {
  project: Project
  first?: boolean
  last?: boolean
  className?: string
}) {
  return (
    <article
      className={cn(
        'hover-lift panel group relative flex h-full flex-col overflow-hidden',
        accentClassName[project.accent],
        className,
      )}
    >
      <RowControls
        resourceKey="projects"
        id={project.id}
        label={project.title}
        first={first}
        last={last}
      />
      {/* Key art */}
      <div className="relative flex aspect-[16/9] items-end overflow-hidden">
        <Parallax speed={0.12} className="absolute -inset-y-[12%] inset-x-0">
          <KeyArt
            variant="poster"
            accent={project.accent}
            title={project.title}
            watermark="H"
            className="art-zoom"
          />
        </Parallax>

        <span
          className="absolute left-5 top-5 rounded-full border border-white/25 bg-black/25 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-white backdrop-blur"
        >
          {project.category}
        </span>

        {/* Decorative play glyph — real CTAs live in the lower panel */}
        <span aria-hidden="true" className="play-overlay absolute bottom-5 right-5 z-10">
          <span className="grid size-12 place-items-center rounded-full bg-linear-to-br from-brand-bright to-brand-deep text-white shadow-lg">
            <PlayIcon width={20} height={20} className="translate-x-[2px]" />
          </span>
        </span>

        <div className="relative p-5 sm:p-7">
          <h3 className="font-display text-4xl tracking-[0.03em] text-white sm:text-5xl">
            {project.title}
          </h3>
          <p className="mt-2 max-w-xl text-sm text-white/85 sm:text-base">
            {project.logline}
          </p>
        </div>
      </div>

      {/* Lower panel */}
      <div className="flex flex-1 flex-col gap-4 p-5 sm:p-6">
        <ul className="flex flex-col gap-1.5">
          {project.bullets.map((bullet) => (
            <li key={bullet} className="flex gap-2 text-sm text-muted">
              <span
                aria-hidden="true"
                className="mt-2 size-1 shrink-0 rounded-full bg-[var(--accent)]"
              />
              {bullet}
            </li>
          ))}
        </ul>

        <div className="flex flex-wrap gap-2">
          {project.tech.map((tech) => (
            <Chip key={tech}>{tech}</Chip>
          ))}
        </div>

        <div className="mt-auto flex flex-wrap items-center gap-3 pt-1">
          <ProjectLink
            href={project.links.github}
            variant="outline"
            icon={<GithubIcon width={15} height={15} />}
            label="GitHub"
          />
          <ProjectLink
            href={project.links.live}
            variant="gold"
            icon={<ExternalLinkIcon width={15} height={15} />}
            label="View Project"
          />
        </div>
      </div>
    </article>
  )
}

function ProjectLink({
  href,
  label,
  icon,
  variant,
}: {
  href?: string
  label: string
  icon: ReactNode
  variant: 'outline' | 'gold'
}) {
  if (href) {
    return (
      <Button
        href={href}
        variant={variant}
        size="sm"
        target="_blank"
        rel="noreferrer"
      >
        {icon}
        {label}
      </Button>
    )
  }

  return (
    <span
      title="Link coming soon — add it in src/data/projects.ts"
      className="inline-flex"
    >
      <Button disabled variant={variant} size="sm" aria-label={`${label} — link coming soon`}>
        {icon}
        {label}
      </Button>
    </span>
  )
}