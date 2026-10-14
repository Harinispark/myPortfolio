import type { ReactNode } from 'react'

import { Button } from '@/components/common/Button'
import {
  GithubIcon,
  LinkedinIcon,
  MailIcon,
  PlayIcon,
  ReplayIcon,
} from '@/components/common/icons'
import { useProfile } from '@/context/ProfileContext'
import { cta, socialLinks } from '@/data/navigation'
import { finale } from '@/data/finale'
import { site } from '@/data/site'

import type { SocialLink } from '@/types'

const socialIcon: Record<SocialLink['id'], ReactNode> = {
  email: <MailIcon width={15} height={15} />,
  github: <GithubIcon width={15} height={15} />,
  linkedin: <LinkedinIcon width={15} height={15} />,
}

/**
 * The season finale: "To be continued…", a CTA, social links, and the
 * replay / watch-again controls.
 */
export function Finale() {
  const { watchAgain, replayIntro } = useProfile()

  return (
    <section
      id="finale"
      aria-labelledby="finale-title"
      className="relative overflow-hidden px-4 py-28 text-center sm:px-6 sm:py-36"
    >
      {/* Ambient red light from behind the type */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'radial-gradient(52% 44% at 50% 32%, rgba(194,20,28,0.16), transparent 72%)',
        }}
      />

      <div className="relative mx-auto max-w-3xl">
        <p className="accent-red kicker">
          <span className="accent-text">{finale.eyebrow}</span>
        </p>
        <h2
          id="finale-title"
          className="display-xl mt-3 text-glow text-fg"
        >
          {finale.title}
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
          {site.tagline}
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Button href={cta.href} size="lg" aria-label={cta.ariaLabel}>
            {cta.label}
          </Button>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
          {socialLinks.map((link) => {
            const isExternal = link.id !== 'email'
            return (
              <Button
                key={link.id}
                href={link.href}
                variant="outline"
                size="md"
                aria-label={link.ariaLabel}
                target={isExternal ? '_blank' : undefined}
                rel={isExternal ? 'noreferrer' : undefined}
              >
                {socialIcon[link.id]}
                {link.label}
              </Button>
            )
          })}
        </div>

        <div className="mt-16 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
          <button
            type="button"
            onClick={replayIntro}
            className="group flex items-center gap-2 text-sm text-muted transition-colors hover:text-fg"
          >
            <ReplayIcon
              width={17}
              height={17}
              className="transition-transform duration-300 group-hover:-rotate-45"
            />
            Replay opening
          </button>
          <button
            type="button"
            onClick={watchAgain}
            className="group flex items-center gap-2 text-sm text-muted transition-colors hover:text-fg"
          >
            <PlayIcon
              width={17}
              height={17}
              className="transition-transform duration-300 group-hover:scale-110"
            />
            Watch again
          </button>
        </div>
      </div>
    </section>
  )
}