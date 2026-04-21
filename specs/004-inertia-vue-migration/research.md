# Research: Migração para SPA com Inertia.js e Vue

**Feature**: 004-inertia-vue-migration
**Date**: 2026-04-20
**Status**: Complete

---

## Research Tasks

### R1: AdonisJS Inertia.js Integration

**Decision**: Use `@adonisjs/inertia` package with the `node ace configure inertia` command for initial scaffolding.

**Rationale**: AdonisJS provides a first-party Inertia adapter (`@adonisjs/inertia`) that handles:

- Inertia.js middleware and request/response handling
- SSR or SPA mode configuration
- Shared data injection (auth user, errors, flash messages)
- CSRF token management (integrates with `@adonisjs/shield`)
- Vite integration for Vue SFC compilation

**Alternatives considered**:

- Manual Inertia.js setup without `@adonisjs/inertia`: Requires more boilerplate, would need custom middleware for shared data and CSRF. The official package is simpler and better maintained.
- React instead of Vue: Not requested — user explicitly wants Vue for the richer UI ecosystem.
- Keep Edge templates: No SPA navigation, slower development velocity — contradicts the feature requirement.

---

### R2: SPA Mode vs SSR Mode

**Decision**: Use SPA mode (not SSR) for the initial migration.

**Rationale**:

- SPA mode is simpler — no Node.js server-side rendering of Vue components needed
- The current Edge templates are already server-rendered; switching to SPA mode still provides SPA navigation (the main user benefit)
- SPA mode avoids the complexity of Node.js SSR hydration issues
- The AdonisJS Inertia package supports both modes; starting with SPA mode allows easy upgrade to SSR later if needed
- CSR (client-side rendering) with Inertia gives us SPA navigation without the SSR infrastructure overhead

**Alternatives considered**:

- SSR mode: Adds complexity (hydration mismatches, Node.js-only rendering). Can be added later if SEO or initial load performance becomes critical. Not needed for an internal parish management tool.

---

### R3: Vue 3 with Composition API

**Decision**: Use Vue 3 with Composition API and `<script setup>` syntax.

**Rationale**:

- Vue 3 is the current standard; Vue 2 is in maintenance mode
- Composition API with `<script setup>` is the recommended Vue 3 approach — more concise, better TypeScript support
- This matches the broader Vue ecosystem direction

**Alternatives considered**:

- Vue 3 Options API: Verbose, less TypeScript-friendly, not the modern standard
- Vue 2: Deprecated, no reason to start a new project with it

---

### R4: Controller Migration Strategy

**Decision**: Replace `view.render('template', data)` with `inertia.render('PageComponent', data)` in all controllers. Keep the same route structure.

**Rationale**:

- Inertia controllers return JSON page objects instead of rendered HTML
- Route URLs remain identical — `/users`, `/profiles`, `/dashboard`, etc.
- Controllers can be migrated one at a time during development, but all must be migrated before deployment (no mixing Edge and Inertia for the same routes)
- The `inertia.render()` method sends the component name + props as JSON; Inertia on the client hydrates the Vue component
- Flash messages and validation errors are handled automatically through Inertia's shared data mechanism

**Alternatives considered**:

- Incremental migration (Edge + Inertia side by side for different routes): Possible but complex — requires Edge layout + Inertia layout to coexist. Not worth it for this project size (7 pages).

---

### R5: Authentication and Session Handling

**Decision**: Keep session-based auth (`@adonisjs/auth` web guard) unchanged. Inertia automatically handles session cookies.

**Rationale**:

- Inertia.js works with cookie-based session auth by default
- The `@adonisjs/inertia` package automatically shares the CSRF token and auth state
- Login/logout redirects work via Inertia's `Inertia.visit()` or standard HTTP redirects — Inertia intercepts them
- No JWT migration needed

**Alternatives considered**:

- Switch to token-based auth: Unnecessary change, breaks existing session flow, contradicts FR-009.

---

### R6: Theme Toggle Migration

**Decision**: Migrate theme toggle from inline `<script>` + `window.toggleTheme` to a Vue composable (`useTheme`) with a Vue plugin for global reactivity.

**Rationale**:

- The current implementation uses DOM manipulation (`document.documentElement.classList.toggle('dark')`) and `window.toggleTheme` for onclick handlers — this is the pattern that broke with ES modules
- Vue's reactivity system properly manages the dark class, localStorage persistence, and OS preference detection
- FOUC prevention still needs an inline `<script>` in the HTML `<head>` — Inertia's root HTML wrapper (`app.tsx` or `app.edge`) retains control over the `<head>` element
- The composable pattern (`useTheme()`) is idiomatic Vue 3 and testable

**Alternatives considered**:

- Keep `app.js` with `window.toggleTheme`: Defeats the purpose of migration, still has ES module issues
- Use a third-party library like `@vueuse/useDark`: Adds a dependency for something that's trivial to implement ourselves (5 lines of logic)

---

### R7: Shared Data and Bouncer RBAC with Inertia

**Decision**: Use Inertia shared data middleware to inject `auth.user`, `auth.can` (Bouncer abilities), and flash messages into every Inertia response.

**Rationale**:

- Currently, `SilentAuthMiddleware` loads user + profile + permissions, and `InitializeBouncerMiddleware` shares `ctx.bouncer.edgeHelpers` with Edge templates
- In Inertia, we need an equivalent: a middleware that adds shared props to every response
- `@adonisjs/inertia` provides `inertia.share()` to add shared data
- Bouncer abilities like `usersRead`, `profilesRead` etc. need to be serialized as boolean values for the Vue frontend
- Flash messages (`success`, `errors`) are automatically handled by Inertia's form helper and shared props

**Alternatives considered**:

- Fetch auth/permissions via separate API calls: Extra HTTP requests, slower, more complex state management
- Store permissions in a Pinia store: Overkill — shared Inertia props are simpler and always in sync with the server

---

### R8: Vite Configuration for Vue + Inertia

**Decision**: Add `@vitejs/plugin-vue` to Vite config, replace the `reload` watcher for `.edge` files with `.vue` files, keep `@tailwindcss/vite` plugin.

**Rationale**:

- Vite needs the Vue plugin to compile `.vue` Single File Components
- Inertia pages go in `resources/js/Pages/` (convention)
- Vue shared components go in `resources/js/Components/` or `resources/js/shared/`
- The `@adonisjs/vite` plugin already handles the AdonisJS integration; the Inertia adapter extends it
- HMR (Hot Module Replacement) works for Vue SFCs out of the box with the Vue plugin

**Alternatives considered**:

- Webpack instead of Vite: Vite is already configured and working; no reason to switch.

---

### R9: Layout Migration (Sidebar + Navbar)

**Decision**: Create a single Vue `AuthenticatedLayout.vue` component that wraps the sidebar + navbar, and an `UnauthenticatedLayout.vue` for the login page. Both will be Inertia layouts.

**Rationale**:

- Currently, `dashboard_layout.edge` is duplicated in every page (sidebar + navbar + main wrapper) — the Edge component pattern is verbose
- Inertia layouts in Vue are persistent by default — the layout doesn't re-render on navigation, only the page content changes
- This eliminates the `toggleSidebar()` inline `<script>` from every page — it becomes a reactive Vue method
- A single layout file replaces the pattern of `{ user, currentUrl }` data passing — Inertia shared props handles this automatically

**Alternatives considered**:

- Multiple layouts per page: Overkill — only 2 layout types needed (authenticated + login)
- Vue Pinia for sidebar state: Unnecessary — local component state is sufficient for open/closed toggle

---

### R10: Form Handling and Validation Errors

**Decision**: Use Inertia's `<Link>` for navigation and `useForm()` composable for form submissions. Validation errors are automatically available as `errors` prop.

**Rationale**:

- Inertia's `useForm()` composable handles form submission, method spoofing (PUT/DELETE), CSRF tokens, and error display
- Current Edge templates use `@error('field')` for validation errors — Inertia provides `errors` as a reactive prop
- Flash messages (`success`) are available via Inertia's `page.props.flash`
- The `csurfField()` in Edge becomes automatic with Inertia — CSRF tokens are sent via the X-CSRF-TOKEN header or X-XSRF-TOKEN cookie

**Alternatives considered**:

- Manual `fetch()` calls: Loses Inertia's automatic redirect handling, error management, and progress tracking
- Third-party form library (e.g., `vee-validate`): Overkill — Inertia's `useForm()` handles everything needed

---

### R11: Pagination with Inertia

**Decision**: Serialize Lucid paginator results to plain objects and pass as Inertia props. Use computed URL generation for pagination links in Vue components.

**Rationale**:

- Lucid's `paginate()` returns a `SimplePaginator` with methods like `.baseUrl()`, `.currentPage`, `.lastPage`, etc.
- Inertia can only pass serializable data as props — need to convert paginator to a plain object
- The current Edge templates manually build pagination HTML — this becomes a reusable Vue component
- Pagination links use Inertia `<Link>` components to avoid full page reloads

**Alternatives considered**:

- Use `@adonisjs/lucid` paginator's `toJSON()`: Works but includes unnecessary data — better to manually serialize just the needed fields

---

### R12: Delete Confirmation and Method Spoofing

**Decision**: Use Inertia's `<Link method="delete">` for delete actions, with a Vue confirmation dialog or browser `confirm()`.

**Rationale**:

- Currently, delete forms use `onsubmit="return confirm('...')"` — this must work the same way
- Inertia `<Link>` supports `method="delete"` and `as="button"` for one-click actions
- For confirmation, we can use a simple `confirm()` call or create a small Vue modal component
- Method spoofing (`_method=PUT/PATCH/DELETE`) is handled automatically by Inertia

**Alternatives considered**:

- Always use confirmation modals for delete: More polished UX but more code; can be added incrementally. Start with browser `confirm()`.

---

## Summary of Decisions

| #   | Topic                        | Decision                                                           |
| --- | ---------------------------- | ------------------------------------------------------------------ |
| R1  | AdonisJS Inertia integration | Use `@adonisjs/inertia` + `node ace configure inertia`             |
| R2  | Rendering mode               | SPA mode (client-side rendering) — no server-side Vue rendering    |
| R3  | Vue version                  | Vue 3 with Composition API + `<script setup>`                      |
| R4  | Controller migration         | Replace `view.render()` with `inertia.render()` — same routes      |
| R5  | Authentication               | Keep session-based auth — Inertia handles cookies automatically    |
| R6  | Theme toggle                 | Migrate to Vue composable `useTheme()` + inline FOUC script        |
| R7  | RBAC shared data             | Inertia shared props middleware for auth + Bouncer abilities       |
| R8  | Vite config                  | Add `@vitejs/plugin-vue`, watch `.vue` files for HMR               |
| R9  | Layout migration             | Two Inertia layouts: `AuthenticatedLayout.vue` + `GuestLayout.vue` |
| R10 | Forms & validation           | Inertia `useForm()` + `<Link>` components                          |
| R11 | Pagination                   | Serialize paginator to plain object, Vue pagination component      |
| R12 | Delete & method spoofing     | Inertia `<Link method="delete">` + browser `confirm()`             |
