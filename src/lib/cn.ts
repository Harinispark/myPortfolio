/** Tiny class-name joiner (filter + join). No dependency needed. */
export function cn(
  ...parts: Array<string | false | null | undefined>
): string {
  return parts.filter(Boolean).join(' ')
}