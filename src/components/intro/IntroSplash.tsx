import { useEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'

import { Monogram } from '@/components/brand/Monogram'
import { site } from '@/data/site'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { useProfile } from '@/context/ProfileContext'
import { cn } from '@/lib/cn'

const LETTERS = site.wordmark.split('') // "HARINI"

const SKIP_AFTER_MS = 1400
const AUTO_ADVANCE_MS = 4400
const AUTO_ADVANCE_REDUCED_MS = 1100

/**
 * The open of the series: a big HARINI wordmark animates in, the gold SERIES
 * tag joins it, and the screen auto-advances into the profile picker (or
 * straight home when a profile is already saved). Pressing Escape or the skip
 * button (after it appears) advances early.
 */
export function IntroSplash() {
  const { advanceFromIntro } = useProfile()
  const reduced = usePrefersReducedMotion()
  const [skippable, setSkippable] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const timer = window.setTimeout(() => setSkippable(true), SKIP_AFTER_MS)
    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => {
    const delay = reduced ? AUTO_ADVANCE_REDUCED_MS : AUTO_ADVANCE_MS
    const timer = window.setTimeout(advanceFromIntro, delay)
    return () => window.clearTimeout(timer)
  }, [advanceFromIntro, reduced])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && skippable) advanceFromIntro()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [skippable, advanceFromIntro])

  const letterStagger = reduced ? 0 : 0.14

  return (
    <div
      ref={containerRef}
      role="presentation"
      onClick={() => {
        if (skippable) advanceFromIntro()
      }}
      className="fixed inset-0 z-50 flex cursor-pointer flex-col items-center justify-center overflow-hidden bg-ink px-6 text-center"
    >
      {/* Ambient red glow bleeding from the top */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'radial-gradient(52% 42% at 50% 0%, rgba(194,20,28,0.16), transparent 70%)',
        }}
      />

      <motion.div
        initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.82 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: reduced ? 0.001 : 0.7, ease: 'easeOut' }}
        className="mb-8"
      >
        <Monogram width={96} height={96} className="drop-shadow-[0_10px_40px_rgba(194,20,28,0.45)]" />
      </motion.div>

      <h1
        className="select-none"
        aria-label={site.wordmark}
        style={{ fontSize: 'clamp(4.5rem, 18vw, 11rem)', lineHeight: 0.85 }}
      >
        {LETTERS.map((letter, index) => (
          <motion.span
            key={`${letter}-${index}`}
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 40, rotateX: 90 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{
              duration: reduced ? 0.001 : 0.55,
              delay: reduced ? 0.05 : index * letterStagger,
              ease: 'easeOut',
            }}
            className="inline-block font-display tracking-[0.04em] text-fg"
            style={{ perspective: 500 }}
          >
            {letter}
          </motion.span>
        ))}
      </h1>

      <motion.p
        initial={reduced ? { opacity: 0 } : { opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduced ? 0.001 : 0.6, delay: reduced ? 0.15 : 0.9 }}
        className="mt-4 text-sm font-semibold uppercase tracking-[0.52em] text-gold"
      >
        {site.seriesTag}
      </motion.p>

      <motion.p
        initial={reduced ? { opacity: 0 } : { opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduced ? 0.001 : 0.6, delay: reduced ? 0.25 : 1.35 }}
        className="mt-6 max-w-md text-sm text-muted sm:text-base"
      >
        {site.tagline}
      </motion.p>

      {/* Auto-advance progress bar */}
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/5"
      >
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{
            duration: reduced ? AUTO_ADVANCE_REDUCED_MS / 1000 : AUTO_ADVANCE_MS / 1000,
            ease: 'linear',
          }}
          className="h-full origin-left bg-brand"
        />
      </div>

      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation()
          advanceFromIntro()
        }}
        tabIndex={skippable ? 0 : -1}
        aria-hidden={!skippable}
        className={cn(
          'absolute bottom-6 right-6 rounded-full border border-line bg-surface/60 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-muted backdrop-blur transition-all hover:border-gold/60 hover:text-gold',
          !skippable && 'pointer-events-none opacity-0',
        )}
      >
        Skip
      </button>
    </div>
  )
}