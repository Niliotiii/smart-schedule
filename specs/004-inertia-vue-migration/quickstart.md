# Quickstart: Migração para SPA com Inertia.js e Vue

**Feature**: 004-inertia-vue-migration
**Date**: 2026-04-20

---

## Prerequisites

- Node.js 20+
- Docker running (existing Postgres container)
- Current branch: `004-inertia-vue-migration`
- All existing functionality working (dark theme, CRUD, auth, RBAC, search, pagination)

---

## Setup Commands

```bash
# Install Inertia + Vue dependencies
npm install @adonisjs/inertia @inertiajs/vue3 vue @vitejs/plugin-vue

# Run AdonisJS Inertia configurer (sets up middleware, config, entrypoint)
node ace configure inertia

# Add Vue TypeScript support
npm install -D vue-tsc @vue/tsconfig
```

---

## Post-Setup File Structure

```text
resources/
├── css/
│   └── app.css                    # KEEP — Tailwind CSS v4 (no changes)
├── js/
│   ├── app.ts                     # NEW — Inertia + Vue entrypoint (replaces app.js)
│   ├── Pages/                     # NEW — Inertia page components
│   │   ├── Auth/
│   │   │   └── Login.vue          # From auth/login.edge
│   │   ├── Dashboard/
│   │   │   └── Index.vue          # From dashboard/index.edge
│   │   ├── Users/
│   │   │   ├── Index.vue          # From users/index.edge
│   │   │   ├── Form.vue           # From users/form.edge
│   │   │   └── Show.vue           # From users/show.edge
│   │   └── Profiles/
│   │       ├── Index.vue          # From profiles/index.edge
│   │       ├── Form.vue           # From profiles/form.edge
│   │       └── Show.vue           # From profiles/show.edge
│   ├── Layouts/                   # NEW — Inertia layout components
│   │   ├── AuthenticatedLayout.vue  # Sidebar + Navbar wrapper
│   │   └── GuestLayout.vue         # Login page wrapper
│   ├── Components/                # NEW — Shared Vue components
│   │   ├── Sidebar.vue            # From components/sidebar.edge
│   │   ├── Navbar.vue             # From components/navbar.edge
│   │   ├── Pagination.vue         # From components/pagination.edge
│   │   └── Icon.vue               # From components/icon.edge
│   └── Composables/               # NEW — Vue composables
│       └── useTheme.ts            # From app.js theme logic
└── views/                         # KEEP during migration, delete after
    └── inertia.edge               # NEW — Inertia root HTML template (replaces all other .edge)
```

---

## Integration Scenarios

### Scenario 1: Login Flow (Unauthenticated)

1. User visits `/login`
2. `AuthController.showLogin` returns `inertia.render('Auth/Login')`
3. Inertia serves the `GuestLayout.vue` with `Login.vue` page
4. User submits credentials → `AuthController.login`
5. On success: HTTP redirect to `/dashboard` → Inertia intercepts → SPA navigation
6. On failure: session flash `{ errors: 'Credenciais inválidas' }` → redirect back → Inertia shows flash message

**Test**: Visit `/login`, enter wrong credentials → see error. Enter right credentials → SPA redirect to dashboard.

### Scenario 2: List Users with Search and Pagination

1. User visits `/users` or `/users?search=foo&page=2`
2. `UsersController.index` returns `inertia.render('Users/Index', { users, pagination, search })`
3. `AuthenticatedLayout.vue` renders with sidebar + navbar
4. `Users/Index.vue` renders table with search form + pagination
5. User types in search → submits GET form → Inertia `<Link>` → SPA navigation with new props
6. Pagination clicks → Inertia `<Link>` → SPA navigation preserving search

**Test**: Go to `/users`, search for a name, verify results filter. Click page 2, verify pagination works and search persists.

### Scenario 3: Create/Edit User with Validation

1. User clicks "Novo Usuário" → Inertia `<Link href="/users/create">` → SPA navigation
2. `UsersController.create` returns `inertia.render('Users/Form', { user: null, profiles })`
3. User fills form, submits → `useForm()` POST to `/users`
4. On validation error: Inertia receives `errors` prop → show inline field errors
5. On success: session flash + redirect to `/users` → Inertia SPA redirect → show flash message

**Test**: Create user with invalid email → see validation error. Create with valid data → redirect to list with success message.

### Scenario 4: Delete User with Confirmation

1. User clicks delete icon on user row
2. Browser `confirm('Tem certeza?')` dialog
3. If confirmed: `useForm().delete('/users/:id')` → Inertia sends DELETE
4. On success: flash + redirect to `/users`

**Test**: Click delete, cancel → nothing happens. Confirm → user deleted, success message shown.

### Scenario 5: Theme Toggle

1. User clicks moon/sun icon in navbar
2. `useTheme()` composable toggles `document.documentElement.classList` for `dark`
3. Persists choice to `localStorage`
4. On next Inertia navigation, layout doesn't re-render (persistent layout), theme persists
5. On page reload, FOUC prevention inline script in root HTML template applies theme before Vue mounts

**Test**: Toggle theme, navigate between pages — theme stays. Reload browser — no flash of wrong theme.

### Scenario 6: RBAC — Permission-Based UI

1. User with `users:read` but not `users:create` visits `/users`
2. "Novo Usuário" button is hidden (v-if on `can.usersCreate`)
3. Edit/delete buttons hidden per permissions
4. Sidebar links hidden per permissions
5. Attempting to access `/users/create` directly → Bouncer denies → 403

**Test**: Login with restricted user, verify buttons/links are hidden. Navigate to forbidden URL → 403.

---

## Verification Checklist

After migration is complete, verify:

- [ ] Login works with correct/wrong credentials
- [ ] Logout works and redirects to `/login`
- [ ] Dashboard loads with user info and permission-based cards
- [ ] Users CRUD (create, read, update, delete) all work
- [ ] Profiles CRUD all work with permission checkboxes
- [ ] Search works on users and profiles lists
- [ ] Pagination works and preserves search param
- [ ] Theme toggle works on all pages (light/dark)
- [ ] Theme persists across page reloads
- [ ] RBAC: unauthorized actions are hidden/blocked
- [ ] Navigation between pages is SPA (no full page reload)
- [ ] Browser back/forward buttons work correctly
- [ ] Validation errors display correctly in forms
- [ ] Flash messages (success/error) display correctly
- [ ] Mobile sidebar toggle works
- [ ] Delete confirmations work
- [ ] No Edge templates remain in use (only `inertia.edge`)

---

## Rollback Plan

If critical issues arise:
1. Revert controller changes (restore `view.render()` calls)
2. Restore Edge templates from git history
3. Remove Inertia/Vue dependencies from package.json
4. Revert vite.config.ts changes

All changes are reversible via git since the migration is done on a feature branch.