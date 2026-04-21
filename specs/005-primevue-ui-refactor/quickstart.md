# Quickstart: PrimeVue UI Refactor

**Feature**: 005-primevue-ui-refactor | **Date**: 2026-04-20

## Prerequisites

- Node.js >= 18
- Existing AdonisJS + Inertia + Vue 3 + Tailwind CSS v4 setup working
- All existing tests passing

## Setup Commands

```bash
# 1. Install PrimeVue and related packages
npm install primevue @primeuix/themes primeicons tailwindcss-primeui

# 2. No additional AdonisJS ace commands needed — configuration is manual
```

## Integration Steps

### Step 1: Configure CSS — `resources/css/app.css`

```css
@import 'tailwindcss';
@import 'tailwindcss-primeui/v4';

@layer tailwind-base, primeui, tailwind-utilities;

@custom-variant dark (&:where(.dark, .dark *));
```

### Step 2: Configure PrimeVue — `resources/js/app.ts`

```typescript
import { createApp, h } from 'vue'
import { createInertiaApp } from '@inertiajs/vue3'
import { resolvePageComponent } from '@adonisjs/inertia/helpers'
import PrimeVue from 'primevue/config'
import Aura from '@primeuix/themes/aura'
import ConfirmationService from 'primevue/confirmationservice'
import ToastService from 'primevue/toastservice'
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
      .use(PrimeVue, {
        theme: {
          preset: Aura,
          options: {
            darkModeSelector: '.dark',
            cssLayer: {
              name: 'primeui',
              order: 'tailwind-base, primeui, tailwind-utilities',
            },
          },
        },
      })
      .use(ConfirmationService)
      .use(ToastService)
      .mount(el)
  },
  progress: {
    color: '#4F46E5',
  },
})
```

### Step 3: Confirm it works

```bash
# Start dev server
node ace serve --hmr

# Visit http://localhost:3333
# You should see the app load without errors
# PrimeVue components will render with Aura styling
# Dark mode toggle should switch PrimeVue components too
```

## Verification Checklist

- [ ] `npm install` completes without errors
- [ ] Dev server starts without errors
- [ ] Existing pages load correctly (no PrimeVue components yet — just setup)
- [ ] Dark mode toggle still works (`.dark` class toggle)
- [ ] No console errors about missing PrimeVue configuration
