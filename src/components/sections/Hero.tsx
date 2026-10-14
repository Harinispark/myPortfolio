import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'

import { Button } from '@/components/common/Button'
import { PlayIcon } from '@/components/common/icons'
import { Photo } from '@/components/common/Photo'
import { Magnetic } from '@/components/motion/Magnetic'
import { site, portrait } from '@/data/site'
import { routes } from '@/lib/constants'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { useProfile } from '@/context/ProfileContext'

const nameLetters = Array.from(site.name)

/**
 * The billboard. Portrait on the right (masked and faded into the dark
 * theme), name and pitch on the left, with "Play intro" and "View Resume".
 */
export function Hero() {
  const { replayIntro } = useProfile()
  const reduced = usePrefersReducedMotion()

  // Portrait drifts gently as the billboard scrolls away.
  const portraitRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: portraitRef,
    offset: ['start end', 'end start'],
  })
  const portraitY = useTransform(scrollYProgress, [0, 1], ['-6%', '6%'])

  const variants = {
    hidden: reduced ? { opacity: 0 } : { opacity: 0, y: 24 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: reduced ? 0.001 : 0.6, ease: 'easeOut' as const },
    },
  }

  return (
    <section
      id="home"
      aria-labelledby="hero-title"
      className="relative flex min-h-svh items-center overflow-hidden pt-28 pb-16 sm:pt-32"
    >
      {/* Ambient cinema light */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'radial-gradient(46% 38% at 72% 8%, rgba(194,20,28,0.13), transparent 70%)',
        }}
      />

      {/* Slow-drifting aurora blobs (static under reduced motion) */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <span className="hero-blob hero-blob-red" />
        <span className="hero-blob hero-blob-gold" />
      </div>

      <div className="relative mx-auto grid w-full max-w-7xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
        {/* Copy */}
        <motion.div
          initial="hidden"
          animate="show"
          variants={{ hidden: variants.hidden, show: variants.show }}
          transition={{ staggerChildren: reduced ? 0 : 0.1, delayChildren: reduced ? 0 : 0.15 }}
          className="order-2 text-center lg:order-1 lg:text-left"
        >
          <motion.p
            variants={variants}
            className="kicker mb-4 flex items-center justify-center gap-2 text-gold lg:justify-start"
          >
            <span aria-hidden="true" className="size-1.5 rounded-full bg-brand shadow-[0_0_10px_var(--color-brand)]" />
            {site.location}
          </motion.p>

          <h1 id="hero-title" className="text-fg">
            <span className="sr-only">
              {site.name} — The Series
            </span>
            <span
              aria-hidden="true"
              className="block text-brand-bright display-xl text-glow"
            >
              {nameLetters.map((letter, index) => (
                <motion.span
                  key={`${letter}-${index}`}
                  className="inline-block"
                  initial={
                    reduced
                      ? { opacity: 0 }
                      : { opacity: 0, y: '0.42em', rotateX: -55 }
                  }
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{
                    delay: reduced ? 0 : 0.12 + index * 0.045,
                    duration: reduced ? 0.001 : 0.55,
                    ease: 'easeOut',
                  }}
                >
                  {letter === ' ' ? '\u00A0' : letter}
                </motion.span>
              ))}
            </span>
            <span
              aria-hidden="true"
              className="mt-1 block text-4xl tracking-[0.06em] text-muted sm:text-5xl"
            >
              The Series
            </span>
          </h1>

          <motion.p
            variants={variants}
            className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted sm:mx-0 sm:text-lg"
          >
            {site.pitch}
          </motion.p>

          <motion.div
            variants={variants}
            className="mt-8 flex flex-wrap items-center justify-center gap-4 lg:justify-start"
          >
            <Magnetic>
              <Button onClick={replayIntro} size="lg">
                <PlayIcon width={18} height={18} />
                Play intro
              </Button>
            </Magnetic>
            <Button to={routes.resume} size="lg" variant="outline">
              View Resume
            </Button>
          </motion.div>

          <motion.p
            variants={variants}
            className="mt-6 text-xs uppercase tracking-[0.18em] text-faint"
          >
            {site.availability}
          </motion.p>
        </motion.div>

        {/* Portrait */}
        <motion.div
          ref={portraitRef}
          initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: reduced ? 0.001 : 0.8, ease: 'easeOut' }}
          className="order-1 flex justify-center lg:order-2 lg:justify-end"
        >
          <motion.div
            style={reduced ? undefined : { y: portraitY }}
            className="accent-red relative aspect-[4/5] w-60 sm:w-72 lg:w-96"
          >
            {/* Accent glow painted behind the masked cutout */}
            <div aria-hidden="true" className="hero-glow absolute inset-0" />
            <Photo
              variant="hero"
              src={portrait.src}
              alt={portrait.alt}
              width={portrait.width}
              height={portrait.height}
              priority
              focus="50% 14%"
              className="relative z-10 h-full w-full"
            />
            {/* Bottom seam: melt the shoulders into the page background */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-2/5 bg-linear-to-t from-ink via-ink/55 to-transparent"
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
