import { Carousel } from '@/components/common/Carousel'
import { Chip } from '@/components/common/Chip'
import { KeyArt } from '@/components/common/KeyArt'
import { AddRowButton } from '@/components/edit/AddRowButton'
import { RowControls } from '@/components/edit/RowControls'
import { Parallax } from '@/components/motion/Parallax'
import { Tilt } from '@/components/motion/Tilt'
import { useSiteContent } from '@/context/SiteContentContext'
import { accentClassName } from '@/lib/accents'
import { cn } from '@/lib/cn'

import type { Certification } from '@/types'

/** Certifications rail: provider tag, credential code, and year badge. */
export function Certifications() {
  const { certifications } = useSiteContent().content
  return (
    <>
      <AddRowButton resourceKey="certifications" className="mb-4" />
      <Carousel ariaLabel="Certifications — credentials earned along the way">
        {certifications.map((cert, index) => (
          <Tilt key={cert.id} className="shrink-0" max={6}>
            <CertificationCard
              cert={cert}
              first={index === 0}
              last={index === certifications.length - 1}
            />
          </Tilt>
        ))}
      </Carousel>
    </>
  )
}

function CertificationCard({
  cert,
  first,
  last,
}: {
  cert: Certification
  first?: boolean
  last?: boolean
}) {
  return (
    <article
      className={cn(
        'hover-lift panel relative flex w-80 flex-col overflow-hidden p-6',
        accentClassName[cert.accent],
      )}
    >
      <RowControls
        resourceKey="certifications"
        id={cert.id}
        label={cert.title}
        first={first}
        last={last}
      />
      {/* Diploma key art */}
      <Parallax speed={0.14} className="absolute -inset-y-[14%] inset-x-0">
        <KeyArt
          variant="diploma"
          accent={cert.accent}
          title={cert.title}
          watermark="H"
        />
      </Parallax>

      <p className="kicker relative mt-1">{cert.provider}</p>

      <h3 className="relative mt-2 font-display text-3xl tracking-[0.03em] text-fg">
        {cert.title}
      </h3>

      {cert.code && (
        <p className="relative mt-1 text-xs font-semibold uppercase tracking-[0.24em] text-faint">
          {cert.code}
        </p>
      )}

      <div className="relative mt-auto flex items-center gap-3 pt-6">
        <Chip className="accent-border bg-surface-2">
          <span className="accent-text font-semibold">{cert.year}</span>
        </Chip>
        <span className="text-[0.68rem] uppercase tracking-[0.16em] text-faint">
          Credential
        </span>
      </div>
    </article>
  )
}