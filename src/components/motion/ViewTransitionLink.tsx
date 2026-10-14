import type { MouseEvent, ReactNode } from 'react'
import { Link, useNavigate, type LinkProps } from 'react-router-dom'

import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

/**
 * Minimal typing for the View Transitions API. We read it off `document`
 * defensively rather than extending `Document`, so the file compiles whether
 * or not the installed TS DOM lib already declares it.
 */
type StartViewTransition = (callback: () => void) => unknown

function getStartViewTransition(): StartViewTransition | undefined {
  const candidate = (document as Document & {
    startViewTransition?: StartViewTransition
  }).startViewTransition
  return typeof candidate === 'function' ? candidate.bind(document) : undefined
}

interface ViewTransitionLinkProps extends Omit<LinkProps, 'to'> {
  to: string
  children: ReactNode
}

/**
 * A router `<Link>` that plays a cross-fade page transition on navigation when
 * the browser supports the View Transitions API and the visitor has not asked
 * for reduced motion. Otherwise it degrades to a normal instant link.
 */
export function ViewTransitionLink({
  to,
  children,
  onClick,
  ...rest
}: ViewTransitionLinkProps) {
  const navigate = useNavigate()
  const reduced = usePrefersReducedMotion()

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event)
    if (event.defaultPrevented) return

    // Let the browser handle modified clicks / new-tab intent normally.
    if (
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      event.button !== 0
    ) {
      return
    }

    const startViewTransition = reduced ? undefined : getStartViewTransition()
    if (!startViewTransition) return

    event.preventDefault()
    startViewTransition(() => {
      navigate(to)
    })
  }

  return (
    <Link to={to} onClick={handleClick} {...rest}>
      {children}
    </Link>
  )
}
