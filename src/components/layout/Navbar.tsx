import { useEffect, useState } from 'react'

import { Logo } from '@/components/brand/Logo'
import { Button } from '@/components/common/Button'
import { MenuIcon } from '@/components/common/icons'
import { AvatarMenu } from '@/components/layout/AvatarMenu'
import { MobileMenu } from '@/components/layout/MobileMenu'
import { Magnetic } from '@/components/motion/Magnetic'
import { ViewTransitionLink } from '@/components/motion/ViewTransitionLink'
import { cta, navItems } from '@/data/navigation'
import { useActiveSection } from '@/hooks/useActiveSection'
import { cn } from '@/lib/cn'

/** Sticky navbar: transparent over the hero, frosted once you scroll. */
export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const activeSection = useActiveSection()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const desktopItems = navItems

  return (
    <>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-40 transition-all duration-300',
          scrolled
            ? 'border-b border-line bg-ink/85 backdrop-blur-md'
            : 'border-b border-transparent bg-transparent',
        )}
      >
        <nav
          aria-label="Primary"
          className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6 lg:gap-8 lg:px-8"
        >
          <Logo />

          <ul className="hidden items-center gap-1 lg:flex">
            {desktopItems.map((item) =>
              item.section === 'resumePage' ? (
                <li key={item.id}>
                  <ViewTransitionLink
                    to={item.href}
                    className="rounded-full px-3 py-2 text-sm font-medium tracking-wide text-muted transition-colors hover:text-fg"
                  >
                    {item.label}
                  </ViewTransitionLink>
                </li>
              ) : (
                <li key={item.id}>
                  <a
                    href={item.href}
                    aria-current={
                      activeSection === item.section ? 'true' : undefined
                    }
                    className={cn(
                      'rounded-full px-3 py-2 text-sm font-medium tracking-wide transition-colors',
                      activeSection === item.section
                        ? 'bg-surface-2 text-gold'
                        : 'text-muted hover:text-fg',
                    )}
                  >
                    {item.label}
                  </a>
                </li>
              ),
            )}
          </ul>

          <div className="ml-auto flex items-center gap-3">
            <div className="hidden sm:block">
              <Magnetic>
                <Button
                  href={cta.href}
                  size="sm"
                  aria-label={cta.ariaLabel}
                >
                  {cta.label}
                </Button>
              </Magnetic>
            </div>

            <AvatarMenu />

            {/* Mobile menu toggle */}
            <button
              type="button"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
              onClick={() => setMobileOpen((value) => !value)}
              className="rounded-full border border-line p-2.5 text-fg transition-colors hover:border-gold/60 hover:text-gold lg:hidden"
            >
              <MenuIcon width={20} height={20} />
            </button>
          </div>
        </nav>
      </header>

      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  )
}