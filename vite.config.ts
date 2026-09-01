import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import { fileURLToPath } from 'node:url'

export default defineConfig(({ command }) => ({
  /** GitHub Pages serves the prototype from /<repo>/, dev serves from root. */
  base: command === 'build' ? '/omnea-request-workspace/' : '/',
  plugins: [react(), tailwindcss()],
  server: {
    port: Number(process.env.PORT) || 5173,
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
}))
