/**
 * Tiny typed fetch wrapper for the backend API.
 *
 * In development Vite proxies `/api` to the Express service (same origin), so
 * the session cookie flows without CORS. In production set `VITE_API_BASE` to
 * the deployed API origin.
 */
const BASE = (import.meta.env.VITE_API_BASE as string | undefined) ?? ''

export class ApiError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const headers = new Headers(init?.headers)
  if (init?.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  const response = await fetch(`${BASE}${path}`, {
    credentials: 'include',
    ...init,
    headers,
  })

  if (!response.ok) {
    let message = response.statusText || `Request failed (${response.status})`
    try {
      const data = (await response.json()) as { error?: { message?: string } }
      if (data?.error?.message) message = data.error.message
    } catch {
      // Non-JSON error body — keep the status text.
    }
    throw new ApiError(response.status, message)
  }

  if (response.status === 204) return undefined as T
  return (await response.json()) as T
}
