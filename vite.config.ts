import { fileURLToPath, URL } from 'node:url'

import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // Vercel serves from the domain root, and vercel.json rewrites every
  // unmatched path back to index.html so client-side routes survive a reload.
  base: '/',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    // Exposed on the LAN so the mobile layout can be tested on a real phone.
    host: true,
    port: 5173,
    // Forward /api to the Express service so the browser talks same-origin
    // (cookies work without CORS headaches in development).
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
    },
  },
})
