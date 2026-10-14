import { Logo } from '@/components/brand/Logo'
import { ViewTransitionLink } from '@/components/motion/ViewTransitionLink'
import { routes } from '@/lib/constants'

/** 404 — "this episode doesn't exist". */
export default function NotFoundPage() {
  return (
    <main
      id="main-content"
      className="flex min-h-svh flex-col items-center justify-center gap-6 bg-ink px-6 text-center"
    >
      <Logo />
      <p className="kicker text-gold">Error 404</p>
      <h1 className="display-lg text-fg">This episode doesn't exist</h1>
      <p className="max-w-md text-muted">
        The reel keeps going though — head back to the homepage and pick
        another one.
      </p>
      <ViewTransitionLink
        to={routes.home}
        className="rounded-full border border-line px-5 py-2 text-sm text-muted transition-colors hover:border-gold/60 hover:text-gold"
      >
        Back to the series
      </ViewTransitionLink>
    </main>
  )
}