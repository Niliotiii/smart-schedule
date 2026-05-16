# Implementation Plan: Month Schedule Opening

**Branch**: `014-month-schedule-opening` | **Date**: 2026-05-02 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `specs/014-month-schedule-opening/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Build a month-based schedule opening system where administrators open a calendar month, create duty schedules (day, community, priest, name, description, required roles), define a signaling period, and allow users to signal their availability via a horizontal carousel card interface. Administrators can edit/delete schedules from an opened month. Users can edit their signals while the period is active. Schedule consolidation is deferred to a future feature.

**Unresolved product clarifications** (documented in `research.md` with assumptions):
- What happens to user signals when a schedule is edited after signaling begins
- Whether multiple months can be open for signaling simultaneously
- How far in advance a month can be opened

## Technical Context

**Language/Version**: TypeScript 6.0.2, Node.js ~20+  
**Primary Dependencies**: AdonisJS 7.3.1 (monolith), Inertia.js with Vue 3, PrimeVue 4.5.5, TailwindCSS 4.2.2  
**Storage**: PostgreSQL (via AdonisJS Lucid ORM)  
**Testing**: Japa test runner with @japa/plugin-adonisjs, Playwright for E2E  
**Target Platform**: Web (responsive, mobile-first)  
**Project Type**: Web application (monolith with Inertia SSR/SPA frontend)  
**Performance Goals**: Page loads under 2s; availability signaling actions under 500ms  
**Constraints**: Mobile-first responsive design; must support multiple pastoral contexts (not hardcoded to Acólitos)  
**Scale/Scope**: Parish-level user base (hundreds of users, dozens of schedules per month)

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

| Principle | Check | Status | Notes |
| --------- | ----- | ------ | ----- |
| I. Extensibility | Feature must not hardcode Acólitos-specific rules | ✅ PASS | Schedule model is generic (day, community, priest, roles). No ministry-specific logic. |
| II. Availability/Capacity | Must avoid conflicting assignments for same priest on same day | ⚠️ WARN | Same-priest same-day conflicts should be flagged during schedule creation. Documented in FR edge cases. |
| III. Simplicity/Usability | Must be intuitive and mobile-first | ✅ PASS | Carousel cards + Sim/Não buttons are simple. Responsive design via Tailwind + PrimeVue. |
| IV. Reliability | Signals and schedules must remain consistent | ✅ PASS | Transactions for batch schedule creation. Cascading delete for signals on schedule removal. |
| V. Security/Privacy | Only admins manage schedules; users only signal their own | ✅ PASS | Bouncer policies for admin vs user actions. |

**Re-check after Phase 1**: All gates remain valid. No complexity violations introduced.

## Project Structure

### Documentation (this feature)

```text
specs/014-month-schedule-opening/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
app/
├── models/              # Lucid ORM models
├── controllers/         # AdonisJS HTTP controllers
├── services/            # Business logic services
├── validators/          # VineJS validation schemas
├── policies/            # Bouncer authorization policies
└── middleware/          # Auth and Inertia middleware

resources/
├── views/               # Edge templates (minimal)
└── js/
    ├── pages/           # Inertia Vue page components
    ├── components/      # Reusable Vue components
    └── types/           # TypeScript types

database/
├── migrations/          # Lucid migration files
└── seeders/             # Test data seeders

tests/
├── unit/                # Model/service unit tests
├── integration/         # Controller/API integration tests
└── browser/             # Playwright E2E tests
```

**Structure Decision**: Single AdonisJS monolith with Inertia.js + Vue 3 SPA pages. This is the existing architecture and aligns with Constitution Principle I (extensible monolith). No new projects or repositories introduced.

## Complexity Tracking

> No constitution violations requiring justification. All design choices align with the existing monolith architecture.
