import { api } from './client'

/** Auth header for a mutation, or nothing when no token is held. */
export function adminHeaders(token: string | null): Record<string, string> {
  return token ? { 'X-Admin-Token': token } : {}
}

/**
 * Thin CRUD helpers over the resource endpoints. Reads are public; writes send
 * the admin token. `path` is the resource root, e.g. `/api/projects`.
 */
export const crud = {
  list: <T>(path: string) => api<T[]>(path),

  get: <T>(path: string, id: string) =>
    api<T>(`${path}/${encodeURIComponent(id)}`),

  create: <T>(path: string, body: unknown, token: string | null) =>
    api<T>(path, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: adminHeaders(token),
    }),

  update: <T>(path: string, id: string, body: unknown, token: string | null) =>
    api<T>(`${path}/${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: JSON.stringify(body),
      headers: adminHeaders(token),
    }),

  remove: (path: string, id: string, token: string | null) =>
    api<void>(`${path}/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: adminHeaders(token),
    }),
}

/** Verifies an admin token against the backend. */
export function verifyAdminToken(token: string) {
  return api<{ ok: boolean }>('/api/admin/verify', {
    headers: adminHeaders(token),
  })
}
