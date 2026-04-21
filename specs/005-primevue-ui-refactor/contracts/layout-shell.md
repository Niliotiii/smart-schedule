# Layout Shell Contract

**Feature**: 005-primevue-ui-refactor | **Date**: 2026-04-20

## AuthenticatedLayout

The main shell for authenticated users, inspired by sakai-vue's AppLayout pattern.

### Structure

```
┌──────────────────────────────────────────────────┐
│  AppTopbar                                        │
│  [≡] Smart Schedule           [🌙] [Avatar]       │
├────────┬─────────────────────────────────────────┤
│        │                                         │
│  App   │         <slot />                         │
│  Side  │         (page content)                  │
│  bar   │                                         │
│        │                                         │
│  ───── │                                         │
│  Sair  │                                         │
└────────┴─────────────────────────────────────────┘
```

### Mobile (overlay mode)

```
┌──────────────────────────────────────────────────┐
│  AppTopbar                                        │
│  [≡] Smart Schedule           [🌙] [Avatar]       │
├─────────────────────────────────────────────────┤
│                                                  │
│           <slot />                               │
│           (page content)                         │
│                                                  │
└──────────────────────────────────────────────────┘

When hamburger tapped:
┌─────────────┬────────────────────────────────────┐
│  AppSidebar  │  ░░░ mask ░░░                     │
│  Dashboard   │  ░░░░░░░░░░                       │
│  Users       │  ░░░░░░░░░░                       │
│  Profiles    │  ░░░░░░░░░░                       │
│  ─────────   │  ░░░░░░░░░░                       │
│  Logout      │  ░░░░░░░░░░                       │
└─────────────┴────────────────────────────────────┘
```

### Behavior

- **Desktop (>= 992px)**: Sidebar is static, always visible, content offset by sidebar width
- **Mobile (< 992px)**: Sidebar hidden by default, hamburger in topbar toggles overlay with mask
- **Mask click**: Closes sidebar overlay on mobile
- **Active menu item**: Highlighted based on `$page.url`

### Global Services in Layout

The AuthenticatedLayout must include:

```vue
<ConfirmDialog />
<Toast />
```

These are global instances needed by ConfirmationService and ToastService used throughout the app.

## GuestLayout

Simple centered layout for unauthenticated pages (Login).

### Structure

```
┌──────────────────────────────────────────────────┐
│                                    [🌙]          │
│                                                  │
│              ┌──────────────────┐                │
│              │                  │                │
│              │   <slot />       │                │
│              │   (login form)   │                │
│              │                  │                │
│              └──────────────────┘                │
│                                                  │
└──────────────────────────────────────────────────┘
```

Includes theme toggle button in top-right corner.

## AppTopbar

### Props

| Prop | Type | Description |
|------|------|-------------|
| auth | `{ user: { initials, fullName, email } \| null }` | Authenticated user info |
| onToggleSidebar | `() => void` | Hamburger menu click handler |

### Elements

- Hamburger button (visible on mobile only) — PrimeIcons `pi pi-bars`
- Logo text "Smart Schedule" (bold, uses primary color)
- Theme toggle button — PrimeIcons `pi pi-moon` / `pi pi-sun`
- User avatar circle (initials) and name

## AppSidebar

### Props

| Prop | Type | Description |
|------|------|-------------|
| can | `Record<string, boolean>` | RBAC permissions from `page.props.can` |
| currentUrl | `string` | Current page URL for active highlighting |
| open | `boolean` | Mobile overlay state |

### Emits

| Emit | Description |
|------|-------------|
| close | Close mobile overlay |

### Menu Items

| Label | Icon | Route | Permission |
|-------|------|-------|------------|
| Dashboard | `pi pi-home` | `/dashboard` | Always visible |
| Usuários | `pi pi-users` | `/users` | `can.usersRead` |
| Perfis | `pi pi-shield` | `/profiles` | `can.profilesRead` |
| ──── | (divider) | — | — |
| Sair | `pi pi-sign-out` | POST `/logout` | Always visible |

## AppMenu

Renders menu items from a computed list filtered by RBAC permissions. Uses Inertia `<Link>` for SPA navigation.

### Props

| Prop | Type | Description |
|------|------|-------------|
| can | `Record<string, boolean>` | RBAC permissions |
| currentUrl | `string` | Current URL for active highlighting |