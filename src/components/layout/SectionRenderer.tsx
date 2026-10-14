import type { ComponentType, ReactNode } from 'react'

import { Reveal } from '@/components/common/Reveal'
import { SectionHeading } from '@/components/common/SectionHeading'
import { SectionReorder } from '@/components/edit/SectionReorder'
import { useProfile } from '@/context/ProfileContext'
import { getSectionMeta } from '@/data/sections'

import type { SectionKey, SectionMeta } from '@/types'

// Components are imported statically — every section renders on the home page
// anyway, so there is no gain in code-splitting them.
import { About } from '@/components/sections/About'
import { Certifications } from '@/components/sections/Certifications'
import { ContinueExploring } from '@/components/sections/ContinueExploring'
import { Journey } from '@/components/sections/Journey'
import { Originals } from '@/components/sections/Originals'
import { ResumeSection } from '@/components/sections/ResumeSection'
import { SkillUniverse } from '@/components/sections/SkillUniverse'

const sectionComponents: Record<SectionKey, ComponentType> = {
  continueExploring: ContinueExploring,
  resume: ResumeSection,
  certifications: Certifications,
  skills: SkillUniverse,
  originals: Originals,
  about: About,
  journey: Journey,
}

/**
 * Renders the reorderable home-page blocks below the hero, in the order set
 * by the active watch profile. Each block gets the shared section shell
 * (anchor id + heading) so nav deep-links and layout stay consistent no
 * matter how a profile reorders things.
 */
export function SectionRenderer() {
  const { sectionOrder } = useProfile()

  return (
    <>
      <SectionReorder />
      {sectionOrder.map((key) => {
        const Component = sectionComponents[key]
        const meta = getSectionMeta(key)
        return (
          <SectionBlock key={meta.key} meta={meta}>
            <Component />
          </SectionBlock>
        )
      })}
    </>
  )
}

function SectionBlock({
  meta,
  children,
}: {
  meta: SectionMeta
  children: ReactNode
}) {
  return (
    <section
      id={meta.anchor}
      aria-labelledby={`${meta.key}-heading`}
      className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8"
    >
      <Reveal>
        <SectionHeading meta={meta} headingId={`${meta.key}-heading`} />
      </Reveal>
      <Reveal delay={0.08} className="mt-10 sm:mt-12">
        {children}
      </Reveal>
    </section>
  )
}