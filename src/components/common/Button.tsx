import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
} from 'react'

import { ViewTransitionLink } from '@/components/motion/ViewTransitionLink'
import { cn } from '@/lib/cn'

type Variant = 'primary' | 'gold' | 'outline' | 'ghost'
type Size = 'sm' | 'md' | 'lg'

interface SharedProps {
  variant?: Variant
  size?: Size
  className?: string
  children: ReactNode
  /**
   * Internal route (e.g. `/resume`). Renders a client-side link that plays a
   * view transition instead of a full page load.
   */
  to?: string
}

type ButtonAsButton = SharedProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'children'> & {
    href?: undefined
  }

type ButtonAsAnchor = SharedProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'className' | 'children'> & {
    href: string
  }

export type ButtonProps = ButtonAsButton | ButtonAsAnchor

const base =
  'inline-flex items-center justify-center gap-2 rounded-full font-semibold uppercase tracking-[0.06em] transition-all duration-200 focus-visible:outline-2'

const sizes: Record<Size, string> = {
  sm: 'px-4 py-2 text-xs',
  md: 'px-6 py-2.5 text-sm',
  lg: 'px-8 py-3.5 text-sm sm:text-base',
}

const variants: Record<Variant, string> = {
  primary:
    'sheen accent-red text-fg bg-linear-to-br from-brand-bright to-brand-deep shadow-lg shadow-brand/25 hover:-translate-y-0.5 hover:shadow-[0_18px_50px_-16px_var(--accent-glow)]',
  gold: 'sheen accent-gold text-ink bg-linear-to-br from-gold to-[#c99c2f] shadow-lg shadow-gold/20 hover:-translate-y-0.5 hover:shadow-[0_18px_50px_-16px_var(--accent-glow)]',
  outline:
    'accent-gold border border-line bg-surface-2/50 text-fg hover:border-gold/70 hover:text-gold',
  ghost: 'text-muted hover:text-fg hover:bg-surface-2/60',
}

const disabledClasses =
  'cursor-not-allowed opacity-45 saturate-0 hover:translate-y-0 hover:shadow-none'

export function Button(props: ButtonProps) {
  const { variant = 'primary', size = 'md', className, children } = props

  const classes = cn(
    base,
    sizes[size],
    variants[variant],
    'disabled' in props && props.disabled && disabledClasses,
    className,
  )

  const to = props.to
  if (to !== undefined) {
    const { to: _t, variant: _v, size: _s, className: _c, children: _ch, ...rest } = props
    return (
      <ViewTransitionLink
        to={to}
        className={classes}
        {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {children}
      </ViewTransitionLink>
    )
  }

  if ('href' in props && props.href !== undefined) {
    const { href, variant: _v, size: _s, className: _c, children: _ch, ...rest } = props
    return (
      <a href={href} className={classes} {...rest}>
        {children}
      </a>
    )
  }

  const { variant: _v, size: _s, className: _c, children: _ch, ...rest } = props
  return (
    <button type={rest.type ?? 'button'} className={classes} {...rest}>
      {children}
    </button>
  )
}