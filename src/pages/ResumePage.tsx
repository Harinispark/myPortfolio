import { useEffect } from 'react'

import { Logo } from '@/components/brand/Logo'
import { Button } from '@/components/common/Button'
import {
  DownloadIcon,
  GithubIcon,
  LinkedinIcon,
  MailIcon,
} from '@/components/common/icons'
import { ViewTransitionLink } from '@/components/motion/ViewTransitionLink'
import { useSiteContent } from '@/context/SiteContentContext'
import { socialLinks } from '@/data/navigation'
import { site } from '@/data/site'
import { routes } from '@/lib/constants'

import type { SocialLink } from '@/types'

/**
 * /resume — the resume as a paper sheet. Dark site chrome stays on screen;
 * the document itself is printed cleanly (set as the document title when
 * printing).
 */
export default function ResumePage() {
  const { education, internships, projects, skillCategories, certifications } =
    useSiteContent().content

  useEffect(() => {
    const previous = document.title
    document.title = `Resume — ${site.name}`
    return () => {
      document.title = previous
    }
  }, [])

  return (
    <main id="main-content" className="bg-ink">
      {/* Toolbar — hidden when printing */}
      <div className="no-print mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-4 px-4 py-6 sm:px-6">
        <Logo href="#main-content" />
        <div className="flex items-center gap-3">
          <ViewTransitionLink
            to={routes.home}
            className="rounded-full border border-line px-4 py-2 text-sm text-muted transition-colors hover:border-gold/60 hover:text-gold"
          >
            Back to series
          </ViewTransitionLink>
          <Button onClick={() => window.print()} size="sm" variant="gold">
            <DownloadIcon width={15} height={15} />
            Print / Save PDF
          </Button>
        </div>
      </div>

      {/* The paper sheet */}
      <article className="mx-auto max-w-4xl px-4 pb-20 sm:px-6">
        <div className="rounded-2xl bg-white p-6 text-neutral-900 shadow-2xl shadow-black/60 sm:p-10">
          <header className="border-b-2 border-neutral-900 pb-6">
            <h1 className="font-display text-5xl tracking-[0.03em] sm:text-6xl">
              {site.name.toUpperCase()}
            </h1>
            <p className="mt-2 max-w-2xl text-sm font-medium text-neutral-700">
              {site.headline}
            </p>
            <p className="mt-1 text-sm text-neutral-500">
              {site.location} · {site.availability}
            </p>

            <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-neutral-600">
              {socialLinks.map((link) => {
                const isExternal = link.id !== 'email'
                return (
                  <li key={link.id} className="flex items-center gap-2">
                    <ContactIcon id={link.id} />
                    <a
                      href={link.href}
                      target={isExternal ? '_blank' : undefined}
                      rel={isExternal ? 'noreferrer' : undefined}
                      className="underline decoration-neutral-300 underline-offset-2 hover:decoration-neutral-500"
                    >
                      {link.handle}
                    </a>
                  </li>
                )
              })}
            </ul>
          </header>

          {/* Objective */}
          <section className="mt-8">
            <SheetHeading>Objective</SheetHeading>
            <p className="text-sm leading-relaxed text-neutral-700">{site.about}</p>
          </section>

          {/* Education */}
          <section className="mt-8">
            <SheetHeading>Education</SheetHeading>
            {education.map((entry) => (
              <div key={entry.id} className="flex flex-wrap items-baseline justify-between gap-2">
                <div>
                  <p className="font-semibold">{entry.degree}</p>
                  <p className="text-sm text-neutral-600">{entry.institution}</p>
                </div>
                <SheetYear>{`${entry.startYear} – ${entry.endYear}`}</SheetYear>
              </div>
            ))}
          </section>

          {/* Internships */}
          <section className="mt-8">
            <SheetHeading>Internships</SheetHeading>
            <div className="flex flex-col gap-4">
              {internships.map((internship) => (
                <div key={internship.id}>
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <p className="font-semibold">{internship.role}</p>
                    <SheetYear>{internship.period}</SheetYear>
                  </div>
                  <p className="text-sm text-neutral-600">{internship.organization}</p>
                  <ul className="mt-1.5 flex flex-col gap-1">
                    {internship.bullets.map((bullet) => (
                      <li key={bullet} className="flex gap-2 text-sm text-neutral-700">
                        <span aria-hidden="true" className="mt-2 size-1 shrink-0 rounded-full bg-neutral-400" />
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* Projects */}
          <section className="mt-8">
            <SheetHeading>Projects</SheetHeading>
            <div className="flex flex-col gap-5">
              {projects.map((project) => (
                <div key={project.id}>
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <p className="font-semibold">{project.title}</p>
                    <span className="text-xs uppercase tracking-widest text-neutral-500">
                      {project.category}
                    </span>
                  </div>
                  <ul className="mt-1 flex flex-col gap-1">
                    {project.bullets.map((bullet) => (
                      <li key={bullet} className="flex gap-2 text-sm text-neutral-700">
                        <span aria-hidden="true" className="mt-2 size-1 shrink-0 rounded-full bg-neutral-400" />
                        {bullet}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-1.5 text-xs text-neutral-500">
                    <span className="font-semibold text-neutral-600">Tech:</span>{' '}
                    {project.tech.join(' · ')}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Skills */}
          <section className="mt-8">
            <SheetHeading>Technical & Professional Skills</SheetHeading>
            <div className="grid gap-x-8 gap-y-2 sm:grid-cols-2">
              {skillCategories.map((category) => (
                <p key={category.id} className="text-sm text-neutral-700">
                  <span className="font-semibold">{category.label}: </span>
                  {category.skills.join(', ')}
                </p>
              ))}
            </div>
          </section>

          {/* Certifications */}
          <section className="mt-8">
            <SheetHeading>Certifications</SheetHeading>
            <ul className="flex flex-col gap-1.5">
              {certifications.map((cert) => (
                <li key={cert.id} className="flex flex-wrap items-baseline justify-between gap-2 text-sm">
                  <span className="font-medium">
                    {cert.title}
                    {cert.code ? <span className="text-neutral-500"> · {cert.code}</span> : null}
                  </span>
                  <span className="text-neutral-500">
                    {cert.provider} · {cert.year}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </article>
    </main>
  )
}

function SheetHeading({ children }: { children: string }) {
  return (
    <h2 className="mb-3 border-b border-neutral-200 pb-1 text-xs font-bold uppercase tracking-[0.18em] text-neutral-500">
      {children}
    </h2>
  )
}

function SheetYear({ children }: { children: string }) {
  return <span className="text-xs font-semibold text-neutral-500">{children}</span>
}

function ContactIcon({ id }: { id: SocialLink['id'] }) {
  if (id === 'email') return <MailIcon width={16} height={16} className="shrink-0" />
  if (id === 'github') return <GithubIcon width={16} height={16} className="shrink-0" />
  return <LinkedinIcon width={16} height={16} className="shrink-0" />
}
