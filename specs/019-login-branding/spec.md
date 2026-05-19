# Feature Specification: Login Branding Refactor

**Feature Branch**: `019-login-branding`  
**Created**: 2026-05-18  
**Status**: Draft  
**Input**: User description: "Refatore a tela de login trazendo identidade visual e marca tendo em vista tudo que conhece do sistema"

## User Scenarios & Testing

### User Story 1 — Login with Brand Identity (Priority: P1)

The login page should convey the brand identity of Smart Schedule — a church schedule management system — through visual design elements. The user sees a professionally designed login screen with visual hierarchy, brand colors, and an inviting atmosphere appropriate for a church management context.

**Why this priority**: This is the core request — visual branding on the login page. Everything else depends on getting this right.

**Independent Test**: Navigating to `/login` shows a redesigned page with visual brand elements (iconography, colors, layout) while maintaining full login functionality.

**Acceptance Scenarios**:

1. **Given** an unauthenticated user, **When** they navigate to `/login`, **Then** they see a visually branded login page with the Smart Schedule name and a relevant icon/illustration
2. **Given** the login page, **When** the user views it, **Then** the form fields (email, password) and "Entrar" button are preserved and functional
3. **Given** the login page, **When** the user submits invalid credentials, **Then** the error message is displayed as before
4. **Given** the login page, **When** the user toggles dark/light mode, **Then** the branded page adapts correctly

---

### User Story 2 — Visual Design Elements (Priority: P1)

The login page should include decorative visual elements (background pattern/gradient, iconography) that reflect the church/schedule management context.

**Why this priority**: Visual polish is the main request — these elements transform the login from a generic form into a branded experience.

**Independent Test**: The login page displays decorative elements (background treatment, icon) that create a cohesive visual identity.

**Acceptance Scenarios**:

1. **Given** the login page, **When** it renders, **Then** it shows a decorative background (gradient or pattern) and a relevant icon/illustration area
2. **Given** the login page in light mode, **When** the page renders, **Then** the background and elements match the light theme
3. **Given** the login page in dark mode, **When** the page renders, **Then** the background and elements adapt to the dark theme

### Edge Cases

- What happens when the login page receives flash errors after redirect? — Errors display in a styled message banner as before.
- How does the page behave when processing a login request? — The "Entrar" button shows a disabled/loading state.
- Does the dark/light toggle still work on the branded login? — Yes, the existing toggle in GuestLayout and theme composable remain unchanged.

## Requirements

### Functional Requirements

- **FR-001**: The login page MUST display the system name "Smart Schedule" with visual prominence
- **FR-002**: The login form fields (email, password) and submit button MUST remain functional exactly as before
- **FR-003**: Flash error and success messages MUST continue to display properly
- **FR-004**: The page MUST use the existing PrimeVue Aura theme surface colors (`bg-surface-section`, `bg-surface-ground`, `text-primary`, `text-muted-color`, etc.)
- **FR-005**: The page MUST respect dark/light mode toggling
- **FR-006**: The login page MUST include a decorative background element that enhances visual appeal
- **FR-007**: The login page MUST include a relevant icon or visual element representing the system's domain (church/schedule management)

### Key Entities

No new entities. The login page is a pure UI refactor with no data model changes.

## Success Criteria

### Measurable Outcomes

- **SC-001**: The login page renders with brand visual elements and all existing functionality works (form submission, error display, dark mode toggle)
- **SC-002**: The page passes TypeScript compilation (`npx tsc --noEmit`) with no errors
- **SC-003**: The production build (`node ace build`) completes without errors

## Assumptions

- The existing `GuestLayout.vue` wrapper with dark/light toggle will be preserved
- No new dependencies are needed — PrimeVue components and Tailwind already available
- The existing form validation (`useFormValidation` composable) remains unchanged
- The login route and controller (`AuthController`) require no changes
- A decorative background can be achieved using Tailwind gradients and/or PrimeVue surface colors without external assets
- An SVG icon or PrimeVue icon will be used for the visual brand element (no external image dependencies)
