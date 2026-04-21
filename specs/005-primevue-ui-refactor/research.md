# Research: PrimeVue UI Refactor

**Feature**: 005-primevue-ui-refactor | **Date**: 2026-04-20

## Decision 1: Component Library Choice

**Decision**: PrimeVue 4 with Aura preset

**Rationale**: PrimeVue 4 is the latest major version with native Vue 3 + Composition API support, built-in theming via `@primeuix/themes`, and a comprehensive component set (DataTable, Dialog, Toast, forms) that directly replaces all hand-rolled HTML in the project. The Aura preset provides a clean, modern design token system. The sakai-vue template demonstrates exactly this stack working in production.

**Alternatives considered**:
- Vuetify 3: Heavier, Material Design-focused, less aligned with the existing Tailwind approach
- Custom components only: Would not provide the rich DataTable, Dialog, Toast, etc. without significant effort
- Naive UI: Good component set but less adoption, no sakai-like template reference

## Decision 2: Theming Strategy

**Decision**: Aura preset with `.dark` selector for dark mode, integrated with Tailwind CSS v4 via `tailwindcss-primeui/v4`

**Rationale**: The existing project uses Tailwind CSS v4 with `@custom-variant dark (&:where(.dark, .dark *))`. PrimeVue's `darkModeSelector: '.dark'` option generates dark-mode CSS scoped to the `.dark` class, which is exactly what the existing `useTheme` composable toggles on `document.documentElement`. The `tailwindcss-primeui/v4` CSS import maps PrimeVue design tokens (like `--p-primary-color`, `--p-surface-0`) to Tailwind utility classes (like `bg-primary`, `text-surface-0`), enabling seamless mixing of PrimeVue components and Tailwind utilities.

**Alternatives considered**:
- Lara preset: Older design, less refined tokens
- Custom preset: Overkill for this project size, Aura is a good default
- No design token integration: Would require duplicating color values in Tailwind and PrimeVue

## Decision 3: CSS Layer Ordering

**Decision**: `@layer tailwind-base, primeui, tailwind-utilities` in app.css

**Rationale**: PrimeVue 4 supports CSS layers via `cssLayer` theme option. This ordering ensures: (1) Tailwind base/reset styles have lowest specificity, (2) PrimeVue component styles sit in the middle, (3) Tailwind utility classes can override PrimeVue styles when needed. This is the recommended integration pattern from the PrimeVue documentation and the tailwindcss-primeui package.

**Alternatives considered**:
- No layers: Would cause specificity conflicts between Tailwind resets and PrimeVue component styles
- Different layer order: Would break either Tailwind overrides or PrimeVue component rendering

## Decision 4: Icon Strategy

**Decision**: Replace custom `Icon.vue` SVG component with PrimeIcons

**Rationale**: PrimeIcons is a font icon library bundled with PrimeVue, providing 300+ icons (including home, users, shield, pencil, trash, search, chevrons, sun, moon, etc.) that map directly to the existing SVG icons in `Icon.vue`. Using PrimeIcons eliminates the need for a custom SVG component, ensures consistent icon sizing with PrimeVue components, and matches the sakai-vue reference pattern. The existing Icon.vue icons (home, users, shield, logout, plus, eye, pencil, trash, chevron-left, chevron-right, magnifying-glass, sun, moon, menu) all have direct PrimeIcons equivalents.

**Alternatives considered**:
- Keep Icon.vue alongside PrimeIcons: Inconsistent styling, dual icon systems
- Heroicons or other icon libraries: Would need additional setup, PrimeIcons is already aligned with PrimeVue

## Decision 5: Confirmation and Toast Pattern

**Decision**: PrimeVue ConfirmationService + ConfirmDialog for deletes, Toast + useToast for success/error feedback

**Rationale**: The current codebase uses `window.confirm()` for delete confirmations and manual `<div>` elements for flash messages. PrimeVue's ConfirmationService provides an accessible, themeable confirmation dialog that replaces `confirm()`. The Toast service provides a global notification system with severity levels (success, error, info, warn) that replaces the manual flash `<div>` elements. Both services are registered globally in `app.ts` and used via composables (`useConfirm`, `useToast`).

**Alternatives considered**:
- SweetAlert2: Additional dependency, doesn't integrate with PrimeVue theming
- Custom modal component: Additional code to maintain, no accessibility benefits
- Keep `confirm()`: Blocks UI thread, not themeable, poor UX on mobile

## Decision 6: Dark Mode Integration

**Decision**: Refactor `useTheme` composable to toggle `.dark` class (same as current) but also coordinate with PrimeVue's `darkModeSelector`

**Rationale**: The current `useTheme.ts` composable toggles the `.dark` class on `document.documentElement` and persists to localStorage. PrimeVue's `darkModeSelector: '.dark'` option generates dark CSS scoped to the same class. This means the existing toggle mechanism will automatically apply PrimeVue's dark theme — no additional PrimeVue theme switching logic needed. The composable just needs minor cleanup, not a full rewrite.

**Alternatives considered**:
- Use PrimeVue's theme switching API (`$appState.darkTheme`): sakai-vue pattern, but overly complex for a simple toggle
- Separate class for PrimeVue vs Tailwind: Would require synchronizing two toggle mechanisms

## Decision 7: Layout Shell Architecture

**Decision**: Sakai-vue inspired layout with AppSidebar, AppTopbar, and AppMenu components replacing Sidebar.vue and Navbar.vue

**Rationale**: The sakai-vue template uses a well-structured layout pattern: fixed sidebar with hierarchical menu, sticky topbar with hamburger toggle and user area, and scrollable content area. This maps directly to the current AuthenticatedLayout (sidebar + navbar + content slot). The new components (AppSidebar, AppTopbar, AppMenu) will use PrimeVue styling utilities and PrimeIcons while preserving the existing RBAC-based menu filtering. The sidebar will support static mode (desktop) and overlay mode (mobile) with a mask backdrop.

**Alternatives considered**:
- Use PrimeVue MegaMenu or PanelMenu: These are standalone components that don't match the sidebar layout pattern
- Keep current layout structure with PrimeVue styling only: Would miss the sakai-vue layout improvements
- Full sakai-vue layout composable: Over-engineered for this project size (no theme configurator needed)