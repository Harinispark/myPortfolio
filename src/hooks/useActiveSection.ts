import { useEffect, useState } from 'react'

/**
 * Tracks which home-page section is currently in view so the navbar can
 * highlight the matching link. Observes only anchors that exist on the page,
 * so it keeps working while later phases add sections.
 */
export function useActiveSection() {
  const [active, setActive] = useState<'hero' | 'journey' | 'originals' | 'skills' | 'about'>(
    'hero',
  )

  useEffect(() => {
    const anchors = ['home', 'journey', 'originals', 'skills', 'about']
    const elements = anchors
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null)
    if (elements.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          const id = entry.target.id
          setActive(id === 'home' ? 'hero' : (id as 'journey' | 'originals' | 'skills' | 'about'))
        }
      },
      {
        rootMargin: '-45% 0px -50% 0px',
        threshold: 0,
      },
    )

    for (const el of elements) observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return active
}