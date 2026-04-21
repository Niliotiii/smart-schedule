import { defineConfig } from '@adonisjs/inertia'

export default defineConfig({
  rootView: 'app',
  encryptHistory: false,
  ssr: {
    enabled: false,
    bundle: 'ssr/ssr.js',
    entrypoint: 'inertia/ssr.tsx',
  },
})
