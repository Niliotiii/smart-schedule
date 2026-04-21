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
      host: 'localhost',
      port: 24678,
    },
    watch: {
      ignored: ['**/storage/**', '**/tmp/**'],
    },
  },
  optimizeDeps: {
    include: [
      'vue',
      '@inertiajs/vue3',
      '@adonisjs/inertia/helpers',
      'primevue/config',
      'primevue/confirmationservice',
      'primevue/toastservice',
      'primevue/card',
      'primevue/button',
      'primevue/inputtext',
      'primevue/password',
      'primevue/select',
      'primevue/textarea',
      'primevue/checkbox',
      'primevue/datatable',
      'primevue/column',
      'primevue/tag',
      'primevue/message',
      'primevue/toast',
      'primevue/confirmdialog',
      'primevue/toolbar',
      'primevue/iconfield',
      'primevue/inputicon',
      'primevue/usetoast',
      'primevue/useconfirm',
      '@primeuix/themes/aura',
    ],
  },
})