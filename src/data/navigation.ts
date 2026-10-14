import type { Cta, FooterConfig, NavItem, SocialLink } from '@/types'

export const navItems: NavItem[] = [
  { id: 'home', label: 'Home', href: '#home', section: 'hero' },
  { id: 'journey', label: 'Journey', href: '#journey', section: 'journey' },
  { id: 'originals', label: 'Originals', href: '#originals', section: 'originals' },
  { id: 'skills', label: 'Skills', href: '#skills', section: 'skills' },
  { id: 'about', label: 'About', href: '#about', section: 'about' },
  { id: 'resume', label: 'Resume', href: '/resume', section: 'resumePage' },
]

export const cta: Cta = {
  id: 'lets-build',
  label: "Let's build",
  href: 'mailto:harinimohan1969@gmail.com?subject=Let%27s%20build%20together',
  ariaLabel:
    'Email Harini M about a role, referral, or collaboration opportunity',
}

export const socialLinks: SocialLink[] = [
  {
    id: 'email',
    label: 'Email',
    href: 'mailto:harinimohan1969@gmail.com',
    handle: 'harinimohan1969@gmail.com',
    ariaLabel: 'Email Harini M at harinimohan1969@gmail.com',
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/harini-m-630a3027a',
    handle: 'in/harini-m-630a3027a',
    ariaLabel: "Harini M's LinkedIn profile (opens in a new tab)",
  },
  {
    id: 'github',
    label: 'GitHub',
    href: 'https://github.com/Harinispark',
    handle: 'Harinispark',
    ariaLabel: "Harini M's GitHub profile (opens in a new tab)",
  },
]

export const footerConfig: FooterConfig = {
  note: 'Personal project, not affiliated with any streaming service.',
  madeWith: 'Built with React, TypeScript, Tailwind CSS & Framer Motion',
}