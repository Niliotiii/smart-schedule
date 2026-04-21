import { createApp, h } from 'vue'
import { createInertiaApp } from '@inertiajs/vue3'
import { resolvePageComponent } from '@adonisjs/inertia/helpers'
import PrimeVue from 'primevue/config'
import Aura from '@primeuix/themes/aura'
import ConfirmationService from 'primevue/confirmationservice'
import ToastService from 'primevue/toastservice'
import Tooltip from 'primevue/tooltip'
import AuthenticatedLayout from './Layouts/AuthenticatedLayout.vue'
import GuestLayout from './Layouts/GuestLayout.vue'

createInertiaApp({
  resolve: async (name: string) => {
    const page = (await resolvePageComponent(
      `./Pages/${name}.vue`,
      import.meta.glob('./Pages/**/*.vue')
    )) as unknown as { default: { layout: any } }

    if (name.startsWith('Auth/')) {
      page.default.layout = page.default.layout || GuestLayout
    } else {
      page.default.layout = page.default.layout || AuthenticatedLayout
    }

    return page
  },
  setup({ el, App, props, plugin }: { el: Element; App: any; props: any; plugin: any }) {
    createApp({ render: () => h(App, props) })
      .use(plugin)
      .use(PrimeVue as any, {
        theme: {
          preset: Aura,
          options: {
            darkModeSelector: '.dark',
            cssLayer: {
              name: 'primeui',
              order: 'theme, base, primeui, components, utilities',
            },
          },
        },
      })
      .use(ConfirmationService as any)
      .use(ToastService as any)
      .directive('tooltip', Tooltip as any)
      .mount(el)
  },
  progress: {
    color: '#4F46E5',
  },
})