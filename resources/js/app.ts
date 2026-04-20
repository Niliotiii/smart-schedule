import { createApp, h } from 'vue'
import { createInertiaApp } from '@inertiajs/vue3'
import { resolvePageComponent } from '@adonisjs/inertia/helpers'
import AuthenticatedLayout from './Layouts/AuthenticatedLayout.vue'
import GuestLayout from './Layouts/GuestLayout.vue'

createInertiaApp({
  resolve: async (name: string) => {
    const page = await resolvePageComponent(
      `./Pages/${name}.vue`,
      import.meta.glob('./Pages/**/*.vue')
    )

    if (name.startsWith('Auth/')) {
      page.default.layout = page.default.layout || GuestLayout
    } else {
      page.default.layout = page.default.layout || AuthenticatedLayout
    }

    return page
  },
  setup({ el, App, props, plugin }) {
    createApp({ render: () => h(App, props) })
      .use(plugin)
      .mount(el)
  },
  progress: {
    color: '#4F46E5',
  },
})