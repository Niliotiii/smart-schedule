# Research: Login Branding Refactor

**Date**: 2026-05-18

## Decisions

### 1. Background approach: Tailwind gradient with PrimeVue surface colors

**Decision**: Use a multi-stop background gradient on the login card using `bg-gradient-to-br` with PrimeVue surface color tokens (`from-primary/5 via-surface-section to-primary/10`).

**Rationale**: No external assets needed. Works with the existing Aura theme. Automatically adapts to dark/light mode since surface colors change with theme.

### 2. Brand icon: PrimeVue "pi-calendar-clock" icon

**Decision**: Use the existing `pi-calendar-clock` icon (already used in the app menu for "Escalas") in a styled container.

**Rationale**: No external dependencies. The icon is already in the app's icon set. It's conceptually relevant (schedule management).

### 3. Layout: Enhanced card with visual framing

**Decision**: Keep the centered card layout but add a subtle gradient border-top accent and a larger icon area.

**Rationale**: Minimal structural change. Maximum visual impact. The card pattern is the standard for login pages and works well responsively.

### Alternatives considered

- External SVG illustration — rejected because it adds an asset dependency and may not adapt well to dark mode
- Background image — rejected because it requires an external asset and adds loading delay
- Full-page hero layout — rejected because it's too much structural change for a login page
