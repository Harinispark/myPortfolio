/**
 * Keyboard-accessible skip link. Visually hidden until focused, then appears
 * in the top-left corner and jumps straight to the main content.
 */
export function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[80] focus:rounded-full focus:bg-gold focus:px-5 focus:py-2 focus:font-semibold focus:text-ink"
    >
      Skip to content
    </a>
  )
}