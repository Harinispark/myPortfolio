import { useEffect, useMemo, useState } from 'react'

import { Button } from '@/components/common/Button'
import { Chip } from '@/components/common/Chip'
import { DownloadIcon } from '@/components/common/icons'
import { StatTile } from '@/components/common/StatTile'
import { AddRowButton } from '@/components/edit/AddRowButton'
import { RowControls } from '@/components/edit/RowControls'
import { Stagger, StaggerItem } from '@/components/motion/Stagger'
import { useEditMode } from '@/context/EditModeContext'
import { useSiteContent } from '@/context/SiteContentContext'
import { sections } from '@/data/sections'
import { site } from '@/data/site'
import { routes } from '@/lib/constants'

import type {
  Certification,
  Education,
  Internship,
  Project,
  SkillCategory,
  Stat,
} from '@/types'

/** Resume sub-title used inside the timeline. */
function BlockTitle({ children }: { children: string }) {
  return (
    <h3 className="display-md mb-4 text-fg">
      <span className="accent-text">·</span> {children}
    </h3>
  )
}

/** Education block ---------------------------------------------------- */
function EducationBlock({ entries }: { entries: Education[] }) {
  return (
    <section className="relative">
      <BlockTitle>Education</BlockTitle>
      <AddRowButton resourceKey="education" className="mb-3" />
      <div className="flex flex-col gap-4">
        {entries.map((entry, index) => (
          <article
            key={entry.id}
            className="panel relative flex flex-wrap items-center justify-between gap-3 p-5"
          >
            <RowControls
              resourceKey="education"
              id={entry.id}
              label={entry.degree}
              first={index === 0}
              last={index === entries.length - 1}
            />
            <div>
              <p className="text-base font-semibold text-fg">{entry.degree}</p>
              <p className="text-sm text-muted">{entry.institution}</p>
              {entry.summary && (
                <p className="mt-2 max-w-xl text-sm text-muted">{entry.summary}</p>
              )}
            </div>
            <PeriodPill period={`${entry.startYear} – ${entry.endYear}`} />
          </article>
        ))}
      </div>
    </section>
  )
}

/** Internships block -------------------------------------------------- */
function InternshipsBlock({ items }: { items: Internship[] }) {
  return (
    <section className="mt-14">
      <BlockTitle>Internships</BlockTitle>
      <AddRowButton resourceKey="internships" className="mb-3" />
      <div className="flex flex-col gap-4">
        {items.map((internship, index) => (
          <InternshipCard
            key={internship.id}
            internship={internship}
            first={index === 0}
            last={index === items.length - 1}
          />
        ))}
      </div>
    </section>
  )
}

function InternshipCard({
  internship,
  first,
  last,
}: {
  internship: Internship
  first?: boolean
  last?: boolean
}) {
  return (
    <article className="panel relative p-5">
      <RowControls
        resourceKey="internships"
        id={internship.id}
        label={internship.role}
        first={first}
        last={last}
      />
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <div>
          <p className="text-base font-semibold text-fg">{internship.role}</p>
          <p className="text-sm text-muted">{internship.organization}</p>
        </div>
        <PeriodPill period={internship.period} />
      </div>
      <ul className="mt-3 flex flex-col gap-1.5">
        {internship.bullets.map((bullet) => (
          <li key={bullet} className="flex gap-2 text-sm text-muted">
            <span aria-hidden="true" className="mt-2 size-1 shrink-0 rounded-full bg-brand" />
            {bullet}
          </li>
        ))}
      </ul>
    </article>
  )
}

/** Projects block (compact) ------------------------------------------- */
function ProjectsBlock({ items }: { items: Project[] }) {
  return (
    <section className="mt-14">
      <BlockTitle>Projects</BlockTitle>
      <AddRowButton resourceKey="projects" className="mb-3" />
      <div className="flex flex-col gap-4">
        {items.map((project, index) => (
          <ProjectRow
            key={project.id}
            project={project}
            first={index === 0}
            last={index === items.length - 1}
          />
        ))}
      </div>
    </section>
  )
}

function ProjectRow({
  project,
  first,
  last,
}: {
  project: Project
  first?: boolean
  last?: boolean
}) {
  return (
    <article className="panel relative p-5">
      <RowControls
        resourceKey="projects"
        id={project.id}
        label={project.title}
        first={first}
        last={last}
      />
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="text-base font-semibold text-fg">{project.title}</p>
        <span className="text-xs uppercase tracking-[0.14em] text-faint">
          {project.category}
        </span>
      </div>
      <ul className="mt-2 flex flex-col gap-1.5">
        {project.bullets.map((bullet) => (
          <li key={bullet} className="flex gap-2 text-sm text-muted">
            <span aria-hidden="true" className="mt-2 size-1 shrink-0 rounded-full bg-brand" />
            {bullet}
          </li>
        ))}
      </ul>
      <div className="mt-3 flex flex-wrap gap-2">
        {project.tech.map((tech) => (
          <Chip key={tech}>{tech}</Chip>
        ))}
      </div>
    </article>
  )
}

/** Skills + certifications blocks -------------------------------------- */
function SkillsBlock({ categories }: { categories: SkillCategory[] }) {
  const { canEdit } = useEditMode()
  return (
    <section className="mt-14">
      <BlockTitle>Skills</BlockTitle>
      <AddRowButton resourceKey="skillCategories" className="mb-3" />
      <div className="flex flex-col gap-3">
        {categories.map((category, index) => (
          <div
            key={category.id}
            className={`relative flex flex-wrap items-baseline gap-2 text-sm ${canEdit ? 'pr-24' : ''}`}
          >
            <RowControls
              resourceKey="skillCategories"
              id={category.id}
              label={category.label}
              first={index === 0}
              last={index === categories.length - 1}
              className="right-0 top-0"
            />
            <span className="w-36 shrink-0 text-xs font-semibold uppercase tracking-[0.14em] text-fg">
              {category.label}
            </span>
            <span className="text-muted">{category.skills.join(' · ')}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

function CertificationsBlock({ items }: { items: Certification[] }) {
  const { canEdit } = useEditMode()
  return (
    <section className="mt-14">
      <BlockTitle>Certifications</BlockTitle>
      <AddRowButton resourceKey="certifications" className="mb-3" />
      <ul className="flex flex-col gap-2.5">
        {items.map((cert, index) => (
          <li
            key={cert.id}
            className={`relative flex flex-wrap items-center justify-between gap-2 text-sm ${canEdit ? 'pr-24' : ''}`}
          >
            <RowControls
              resourceKey="certifications"
              id={cert.id}
              label={cert.title}
              first={index === 0}
              last={index === items.length - 1}
              className="right-0 top-1/2 -translate-y-1/2"
            />
            <span className="text-fg">
              {cert.title}
              {cert.code ? <span className="text-faint"> · {cert.code}</span> : null}
            </span>
            <span className="text-muted">
              {cert.provider} · {cert.year}
            </span>
          </li>
        ))}
      </ul>
    </section>
  )
}

/** Side panel --------------------------------------------------------- */
function ResumeSidePanel({ stats }: { stats: Stat[] }) {
  return (
    <aside
      aria-label="Resume actions and highlights"
      className="flex flex-col gap-4 lg:sticky lg:top-24"
    >
      <div className="panel flex flex-col gap-3 p-5">
        <p className="kicker accent-red">
          <span className="accent-text">{sections.resume.eyebrow}</span>
        </p>
        <Button to={routes.resume} size="md">
          View Resume
        </Button>
        <PdfDownloadButton />
      </div>

      <Stagger className="flex flex-col gap-3" stagger={0.1}>
        {stats.map((stat) => (
          <StaggerItem key={stat.id}>
            <StatTile stat={stat} />
          </StaggerItem>
        ))}
      </Stagger>

      <div className="panel flex items-center justify-between gap-2 p-4">
        <span className="text-xs uppercase tracking-[0.14em] text-muted">
          {site.location}
        </span>
        <span className="text-xs uppercase tracking-[0.14em] text-faint">
          {site.availability}
        </span>
      </div>
    </aside>
  )
}

/**
 * Download button. Probes for public/resume.pdf once; when the file exists it
 * becomes a real link, otherwise it stays an accessible disabled placeholder
 * instead of silently 404ing.
 */
function PdfDownloadButton() {
  const [exists, setExists] = useState<boolean | null>(null)

  useEffect(() => {
    let cancelled = false
    fetch(routes.resumePdf, { method: 'HEAD' })
      .then((response) => {
        // On hosts that rewrite unknown paths to index.html (e.g. the SPA
        // fallback), a missing PDF can still answer 200 — so require the
        // response to actually be a PDF.
        const type = response.headers.get('content-type') ?? ''
        if (!cancelled) setExists(response.ok && type.includes('pdf'))
      })
      .catch(() => {
        if (!cancelled) setExists(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  if (exists) {
    return (
      <Button href={routes.resumePdf} variant="outline" size="md" download>
        <DownloadIcon width={16} height={16} />
        Download Resume
      </Button>
    )
  }

  return (
    <Button
      variant="outline"
      size="md"
      disabled
      title="PDF coming soon — drop public/resume.pdf into the project to enable this button"
      aria-label="Download resume PDF — coming soon"
      className="cursor-not-allowed"
    >
      <DownloadIcon width={16} height={16} />
      PDF coming soon
    </Button>
  )
}

function PeriodPill({ period }: { period: string }) {
  return (
    <span className="rounded-full border border-line bg-surface-2 px-3 py-1 text-xs font-medium tracking-wide text-faint">
      {period}
    </span>
  )
}

/** "The Screenplay: The Full Story" ------------------------------------ */
export function ResumeSection() {
  const { content } = useSiteContent()

  // Derived, never hand-written — so the counts can't drift from the content.
  const stats = useMemo<Stat[]>(
    () => [
      { id: 'projects', value: content.projects.length, label: 'Projects', accent: 'red' },
      {
        id: 'internships',
        value: content.internships.length,
        label: 'Internships',
        accent: 'blue',
      },
      {
        id: 'certifications',
        value: content.certifications.length,
        label: 'Certifications',
        accent: 'gold',
      },
    ],
    [content],
  )

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_18rem]">
      <div className="min-w-0">
        <EducationBlock entries={content.education} />
        <InternshipsBlock items={content.internships} />
        <ProjectsBlock items={content.projects} />
        <SkillsBlock categories={content.skillCategories} />
        <CertificationsBlock items={content.certifications} />
      </div>
      <ResumeSidePanel stats={stats} />
    </div>
  )
}
