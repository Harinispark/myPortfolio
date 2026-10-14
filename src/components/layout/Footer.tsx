import type { ReactNode } from 'react'

import { Logo } from '@/components/brand/Logo'
import {
  GithubIcon,
  LinkedinIcon,
  MailIcon,
} from '@/components/common/icons'
import { footerConfig, socialLinks } from '@/data/navigation'

import type { SocialLink } from '@/types'

const socialIcon: Record<SocialLink['id'], ReactNode> = {
  email: <MailIcon width={18} height={18} />,
  github: <GithubIcon width={18} height={18} />,
  linkedin: <LinkedinIcon width={18} height={18} />,
}

/** Site footer: wordmark, social links, and the affiliation note. */
export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-8 px-4 py-10 sm:px-6 lg:px-8">
        <Logo />

        <nav aria-label="Social links">
          <ul className="flex items-center gap-3">
            {socialLinks.map((link) => {
              const isExternal = link.id !== 'email'
              return (
                <li key={link.id}>
                  <a
                    href={link.href}
                    aria-label={link.ariaLabel}
                    target={isExternal ? '_blank' : undefined}
                    rel={isExternal ? 'noreferrer' : undefined}
                    className="hover-lift accent-gold grid size-11 place-items-center rounded-full border border-line bg-surface-2/60 text-muted transition-colors hover:border-gold/60 hover:text-gold"
                  >
                    {socialIcon[link.id]}
                  </a>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="text-center">
          <p className="text-xs leading-relaxed text-faint">{footerConfig.note}</p>
          <p className="mt-1.5 text-xs leading-relaxed text-faint">
            {footerConfig.madeWith}
          </p>
        </div>
      </div>
    </footer>
  )
}