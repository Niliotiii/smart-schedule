# Research: Dashboard Schedule Calendar

**Date**: 2026-05-18

## Decisions

### 1. Calendar visualization approach

**Decision**: Use a custom calendar grid built with PrimeVue surface tokens and Tailwind, not the PrimeVue Calendar component.

**Rationale**: PrimeVue Calendar is designed for date picking (input/selection), not for displaying a month grid with colored day indicators and click-to-expand detail panels. A custom grid gives full control over day coloring (green/gray) and per-day click interactions while staying consistent with the app's design system.

### 2. Data fetching strategy

**Decision**: Pre-load all user assignments for the current month (and adjacent months if needed) in the dashboard controller, pass them as serialized data to the page.

**Rationale**: No need for live updates. The assignment data changes infrequently (only when schedules are edited). Pre-loading avoids extra API calls and keeps the calendar instantly responsive.

### 3. Calendar component location

**Decision**: Create `resources/js/Pages/ScheduleCalendar/Card.vue` as a new component used inside Dashboard/Index.vue.

**Rationale**: Keeps the calendar logic isolated and testable. Dashboard/Index.vue becomes a simple tabbed container.

### Alternatives considered

- PrimeVue Calendar's `dateTemplate` slot — rejected because it only customizes day appearance in the date picker popup, not a full-page calendar grid
- Inline calendar library — rejected to avoid adding a new dependency when a Tailwind grid suffices
- Client-side fetch on month change — rejected; pre-loading is simpler and sufficient
