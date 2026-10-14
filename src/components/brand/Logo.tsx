import { site } from '@/data/site'
import { cn } from '@/lib/cn'
import { Monogram } from '@/components/brand/Monogram'

interface LogoProps {
  className?: string
  /** Renders a button-like link that scrolls to the top of the page. */
  href?: string
  onClick?: () => void
}

export function Logo({ className, href = '#home', onClick }: LogoProps) {
  return (
    <a
      href={href}
      aria-label={`${site.wordmark} — ${site.seriesTag} — home`}
      onClick={onClick}
      className={cn('group flex items-center gap-3', className)}
    >
      <Monogram
        width={42}
        height={42}
        className="transition-transform duration-300 group-hover:scale-105"
      />
      <span className="leading-none">
        <span className="block font-display text-[1.4rem] tracking-[0.12em] text-fg transition-colors group-hover:text-brand-bright">
          {site.wordmark}
        </span>
        <span className="mt-0.5 block text-[0.62rem] font-semibold uppercase tracking-[0.46em] text-gold">
          {site.seriesTag}
        </span>
      </span>
    </a>
  )
}