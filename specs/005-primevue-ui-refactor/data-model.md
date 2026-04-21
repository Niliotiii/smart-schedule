# Data Model: PrimeVue UI Refactor

**Feature**: 005-primevue-ui-refactor | **Date**: 2026-04-20

This feature is a UI-only refactor with no database changes. The "data model" here refers to the component data/prop contracts that flow between Inertia controllers and Vue components.

## Existing Inertia Props (Unchanged)

The controllers will continue passing the same props. No backend changes.

### Auth Props (shared via middleware)

```typescript
auth: {
  user: {
    id: number
    fullName: string | null
    email: string
    initials: string
  } | null
}
can: {
  usersCreate: boolean
  usersRead: boolean
  usersUpdate: boolean
  usersDelete: boolean
  profilesCreate: boolean
  profilesRead: boolean
  profilesUpdate: boolean
  profilesDelete: boolean
}
flash: {
  success?: string | null
  errors?: string | null
}
```

### Users/Index Props

```typescript
users: Array<{ id: number; fullName: string | null; email: string; profileId: number | null; profile: { id: number; name: string } | null }>
pagination: { total: number; currentPage: number; lastPage: number; perPage: number; firstItem: number; lastItem: number }
search: string
can: { usersCreate: boolean; usersRead: boolean; usersUpdate: boolean; usersDelete: boolean }
flash?: { success?: string | null }
```

### Users/Form Props

```typescript
user: { id: number; fullName: string | null; email: string; profileId: number | null } | null
profiles: Array<{ id: number; name: string }>
```

### Users/Show Props

```typescript
userToShow: { id: number; fullName: string | null; email: string; profileId: number | null; profile: { id: number; name: string } | null; createdAt: string }
can: { usersUpdate: boolean }
```

### Profiles/Index, Form, Show Props

Same structure as Users equivalents with profile-specific fields (name, description, permissions).

## New Composable Data

### useTheme Composable (updated)

```typescript
interface UseThemeReturn {
  isDark: Ref<boolean>
  toggleTheme: () => void
}
```

Behavior: Toggles `.dark` class on `document.documentElement`. Persists to localStorage. Detects system preference on mount. PrimeVue's `darkModeSelector: '.dark'` automatically reacts.

### Menu Items (new data structure)

```typescript
interface MenuItem {
  label: string
  icon: string        // PrimeIcons class name, e.g., 'pi pi-home'
  to: string         // Route path, e.g., '/dashboard'
  visible: boolean   // Controlled by RBAC can props
}
```

Defined in `AppMenu.vue` as a computed property based on `$page.props.can`.

### ConfirmDialog Options (new pattern)

```typescript
confirm.require({
  message: string
  header: string
  icon: string      // PrimeIcons class
  acceptLabel: string
  rejectLabel: string
  accept: () => void
  reject: () => void
})
```

### Toast Options (new pattern)

```typescript
toast.add({
  severity: 'success' | 'error' | 'info' | 'warn'
  summary: string
  detail?: string
  life: number      // Duration in ms, e.g., 3000
})
```

## Component Prop Contracts

### AppSidebar

```typescript
defineProps<{
  can: Record<string, boolean>  // RBAC permissions from $page.props.can
  currentUrl: string            // $page.url for active item highlighting
  open: boolean                 // Mobile overlay state
}>()
defineEmits<{
  close: []                     // Close mobile overlay
}>()
```

### AppTopbar

```typescript
defineProps<{
  auth: { user: { initials: string; fullName: string | null; email: string } | null }
}>()
defineEmits<{
  toggleSidebar: []
}>()
```

### AppMenu

```typescript
defineProps<{
  can: Record<string, boolean>
  currentUrl: string
}>()
```

No emits — uses Inertia `<Link>` for navigation directly.

## File Changes Summary

| File | Action | Key Changes |
|------|--------|-------------|
| `resources/css/app.css` | MODIFY | Add `@import "tailwindcss-primeui/v4"`, layer order |
| `resources/js/app.ts` | MODIFY | Register PrimeVue, Aura, ConfirmationService, ToastService |
| `resources/js/Layouts/AuthenticatedLayout.vue` | MODIFY | Use AppSidebar, AppTopbar, add ConfirmDialog + Toast |
| `resources/js/Layouts/GuestLayout.vue` | MODIFY | PrimeVue styled layout |
| `resources/js/Components/Sidebar.vue` | DELETE | Replaced by AppSidebar.vue |
| `resources/js/Components/Navbar.vue` | DELETE | Replaced by AppTopbar.vue |
| `resources/js/Components/Icon.vue` | DELETE | Replaced by PrimeIcons |
| `resources/js/Components/Pagination.vue` | DELETE | Replaced by PrimeVue DataTable paginator |
| `resources/js/Components/AppSidebar.vue` | NEW | Sakai-vue styled sidebar |
| `resources/js/Components/AppTopbar.vue` | NEW | Sakai-vue styled topbar |
| `resources/js/Components/AppMenu.vue` | NEW | Menu component with PrimeIcons |
| `resources/js/Composables/useTheme.ts` | MODIFY | Integrate with PrimeVue dark mode |
| `resources/js/Pages/Auth/Login.vue` | MODIFY | PrimeVue InputText, Password, Button, Message |
| `resources/js/Pages/Dashboard/Index.vue` | MODIFY | PrimeVue Card, Tag |
| `resources/js/Pages/Users/Index.vue` | MODIFY | PrimeVue DataTable, Column, Toolbar, IconField |
| `resources/js/Pages/Users/Form.vue` | MODIFY | PrimeVue InputText, Password, Select, Button |
| `resources/js/Pages/Users/Show.vue` | MODIFY | PrimeVue Card, Tag |
| `resources/js/Pages/Profiles/Index.vue` | MODIFY | PrimeVue DataTable, Column, Toolbar |
| `resources/js/Pages/Profiles/Form.vue` | MODIFY | PrimeVue InputText, Textarea, Checkbox, Button |
| `resources/js/Pages/Profiles/Show.vue` | MODIFY | PrimeVue Card, Tag |
| `package.json` | MODIFY | Add primevue, @primeuix/themes, tailwindcss-primeui, primeicons |