import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: process.env.GITHUB_PAGES === 'true' ? '/pixel-sec/' : '/',
  server: {
    host: true,
    port: 43917,
    strictPort: true,
  },
  preview: {
    host: true,
    port: 43917,
    strictPort: true,
  },
})
