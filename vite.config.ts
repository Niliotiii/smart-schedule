import { defineConfig } from 'vite'
import adonisjs from '@adonisjs/vite/client'
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import inertia from '@adonisjs/inertia/vite'

export default defineConfig({
  plugins: [
    tailwindcss(),
    vue(),
    inertia(),
    adonisjs({
      entrypoints: ['resources/css/app.css', 'resources/js/app.ts'],
      reload: ['resources/views/**/*.edge', 'resources/js/Pages/**/*.vue'],
    }),
  ],
  server: {
    host: '0.0.0.0',
    hmr: {
      host: '0.0.0.0',
      port: 24678,
      clientPort: 24678,
    },
    watch: {
      ignored: ['**/storage/**', '**/tmp/**'],
    },
  },
})