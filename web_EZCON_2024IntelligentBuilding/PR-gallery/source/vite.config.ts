import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig(({ command }) => ({
  base: './',
  publicDir: command === 'serve' ? '..' : false,
  plugins: [react(), tailwindcss()],
  resolve: { alias: { '@': fileURLToPath(new URL('.', import.meta.url)) } },
  server: { host: '0.0.0.0', port: 4173, allowedHosts: ['terminal.local'] },
  build: {
    outDir: '..',
    emptyOutDir: false,
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      input: {
        main: fileURLToPath(new URL('./index.html', import.meta.url)),
        schneider: fileURLToPath(new URL('./schneider-2026/index.html', import.meta.url)),
      },
    },
  },
}))
