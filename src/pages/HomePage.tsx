import { AnimatePresence, motion } from 'motion/react'

import { SkipLink } from '@/components/common/SkipLink'
import { IntroSplash } from '@/components/intro/IntroSplash'
import { Letterbox } from '@/components/intro/Letterbox'
import { Navbar } from '@/components/layout/Navbar'
import { AmbientBackdrop } from '@/components/motion/AmbientBackdrop'
import { CursorSpotlight } from '@/components/motion/CursorSpotlight'
import { Marquee } from '@/components/motion/Marquee'
import { ProfilePicker } from '@/components/profiles/ProfilePicker'
import { Footer } from '@/components/layout/Footer'
import { SectionRenderer } from '@/components/layout/SectionRenderer'
import { Hero } from '@/components/sections/Hero'
import { Finale } from '@/components/sections/Finale'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { useProfile } from '@/context/ProfileContext'

/** The series itself: intro splash → picker → the site shell. */
export default function HomePage() {
  const { stage, introKey } = useProfile()
  const reduced = usePrefersReducedMotion()

  const fade = {
    initial: reduced ? { opacity: 0 } : { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: reduced ? { opacity: 0 } : { opacity: 0, y: -8 },
    transition: { duration: reduced ? 0.001 : 0.35, ease: 'easeOut' as const },
  }

  return (
    <>
      {/* Section-reactive ambient glow, pinned behind everything. */}
      <AmbientBackdrop />

      {/* Letterbox bars frame the opening, then retract over the page. */}
      <Letterbox closed={stage === 'intro'} />

      <SkipLink />

      {/* Cinematic scrims — static grain + vignette under the chrome layers */}
      <div aria-hidden="true" className="film-grain" />
      <div aria-hidden="true" className="vignette" />

      {/* Pointer-following soft glow (skipped under reduced motion) */}
      <CursorSpotlight />

      <AnimatePresence mode="wait">
        {stage === 'intro' && (
          <motion.div key={`intro-${introKey}`} {...fade}>
            <IntroSplash />
          </motion.div>
        )}

        {stage === 'picker' && (
          <motion.div key="picker" {...fade}>
            <ProfilePicker />
          </motion.div>
        )}

        {stage === 'home' && (
          <motion.div key="home" {...fade}>
            <Navbar />
            <main id="main-content" tabIndex={-1}>
              <Hero />
              <div className="hairline mx-auto max-w-6xl" aria-hidden="true" />
              <Marquee className="my-2" />
              <SectionRenderer />
              <Finale />
            </main>
            <Footer />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}