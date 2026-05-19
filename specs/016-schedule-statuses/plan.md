# Implementation Plan: Schedule Statuses

**Branch**: `016-schedule-statuses` | **Date**: 2026-05-18 | **Spec**: [spec.md](specs/016-schedule-statuses/spec.md)
**Input**: Feature specification from `/specs/016-schedule-statuses/spec.md`

## Summary

Add a status field to OpenedMonth (`aberta`, `disponivel`, `rascunho`, `publicada`, `encerrada`) that replaces the existing `isSignalingActive` computed getter. Implement a state machine with manual transitions (admin) and automatic transition from `disponivel` → `rascunho` when the signaling deadline passes. Add a `StatusTransition` audit log. Update all frontend views to show current status and gate signaling/editing accordingly.

## Technical Context

**Language/Version**: TypeScript (AdonisJS 6 with Node.js)  
**Primary Dependencies**: AdonisJS 6, Lucid ORM, VineJS, Luxon, PrimeVue, Inertia.js  
**Storage**: PostgreSQL via Lucid ORM (migrations + models)  
**Testing**: AdonisJS Japa  
**Target Platform**: Web (AdonisJS server + Inertia.js/Vue 3 frontend)  
**Project Type**: Monolith web application  
**Performance Goals**: Status transitions should be instant; auto-transition check <100ms overhead on page loads  
**Constraints**: Must preserve existing data via migration; `isSignalingActive` getter must be replaced  
**Scale/Scope**: Single parish context, ~200 users, ~60 schedules per month

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

### Gate 1 — Extensibilidade (Principle I)
- **Requirement**: No hardcoded references to a single ministry; generic status names.
- **Status**: ✅ PASS — Status names (`aberta`, `disponivel`, `rascunho`, `publicada`, `encerrada`) are generic and not tied to any ministry/pastoral group.

### Gate 2 — Respeito à Disponibilidade (Principle II)
- **Requirement**: Availability signals must be respected; no scheduling conflicts.
- **Status**: ✅ PASS — Signaling is only allowed when status is `disponivel`, which guarantees users can only signal during the designated period.

### Gate 3 — Simplicidade (Principle III)
- **Requirement**: Intuitive, mobile-friendly UI.
- **Status**: ✅ PASS — Status shown as a PrimeVue Tag on all views; action buttons shown/hidden based on status; simple.

### Gate 4 — Confiabilidade (Principle IV)
- **Requirement**: Consistent state; handle edge cases gracefully.
- **Status**: ✅ PASS — State machine with explicit transition rules (8 allowed transitions); audit log for traceability; auto-transition guarantee.

### Gate 5 — Segurança (Principle V)
- **Requirement**: Only authorized users can alter data.
- **Status**: ✅ PASS — Reuses existing `scheduleMonthsManage` permission for all manual transitions; signaling requires auth; no new abilities needed.

## Project Structure

### Documentation (this feature)

```text
specs/016-schedule-statuses/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
└── tasks.md             # Phase 2 output (via /speckit.tasks)
```

### Source Code (repository root)

```text
├── app/
│   ├── models/
│   │   ├── opened_month.ts          # MODIFY: add status column, remove isSignalingActive getter
│   │   └── status_transition.ts     # CREATE: audit log model
│   ├── controllers/
│   │   ├── schedule_months_controller.ts      # MODIFY: add changeStatus, gate edit/signal
│   │   └── availability_signals_controller.ts # MODIFY: check status instead of isSignalingActive
│   └── commands/
│       └── transition_expired_months.ts       # CREATE: ACE command for auto-transition
├── database/
│   ├── migrations/
│   │   ├── XXXXXXX_add_status_to_opened_months.ts
│   │   └── XXXXXXX_create_status_transitions_table.ts
│   └── schema.ts                    # AUTO-GENERATED
├── start/
│   └── routes.ts                    # MODIFY: add transition route
└── types/
    └── inertia.ts                   # MODIFY: replace isSignalingActive with status

resources/js/Pages/ScheduleMonths/
├── Index.vue                    # MODIFY: status Tag from status field
├── Show.vue                     # MODIFY: status Tag + gate edit button
├── Signal.vue                   # MODIFY: check status instead of isSignalingActive
└── Edit.vue                     # MODIFY: gate editing, add transition buttons
```

**Structure Decision**: Standard AdonisJS monolith. Backend files under `app/`, frontend Vue pages under `resources/js/Pages/`. No separate frontend project.

## Complexity Tracking

No constitution violations to justify — all gates pass cleanly.

## Phase 0: Research

No NEEDS CLARIFICATION in the spec. All decisions resolved directly:

### Status naming
- **Decision**: `aberta`, `disponivel`, `rascunho`, `publicada`, `encerrada`
- **Rationale**: Shortened from user's original descriptions for use as database values and UI tags
- **Alternatives considered**: Keeping originals as described (too verbose for column values and badge labels)

### Auto-transition strategy
- **Decision**: ACE command (`node ace transition:expired`) + on-access guard
- **Rationale**: The ACE command runs periodically (e.g., every 5 min via cron/systemd timer). Additionally, when any page loads a month in `disponivel` status past the deadline, the transition fires inline to guarantee freshness.
- **Alternatives considered**: Pure cron-only (stale data between runs), DB trigger (too opaque for debugging)

### Audit log approach
- **Decision**: Separate `status_transitions` table
- **Rationale**: Clean relational audit trail with FK integrity, simple queries for history display
- **Alternatives considered**: JSON array on OpenedMonth (harder to query/join), no audit (violates FR-010)

### Existing data migration
- **Decision**: Past-deadline → `rascunho`, 2+ months old → `encerrada`, rest → `aberta`
- **Rationale**: Reasonable retroactive classification based on current system state
- **Alternatives considered**: All `aberta` (loses context), all `encerrada` (admins lose access to edit)

## Phase 1: Data Model & Design

### Entity: OpenedMonth

| Field | Type | Default | Notes |
|-------|------|---------|-------|
| id | integer PK | auto | |
| year | integer | | |
| month | integer | | |
| opened_at | timestamp | now() | |
| signaling_period_days | integer | | |
| signaling_deadline | timestamp | | |
| **status** | **varchar(20)** | **'aberta'** | NEW — replaces isSignalingActive |
| created_by_user_id | integer FK | | → users.id |
| created_at | timestamp | now() | |
| updated_at | timestamp | now() | |
| deleted_at | timestamp | null | |

**Status values**: `aberta`, `disponivel`, `rascunho`, `publicada`, `encerrada`

### Entity: StatusTransition

| Field | Type | Notes |
|-------|------|-------|
| id | integer PK | auto |
| opened_month_id | integer FK | → opened_months.id |
| from_status | varchar(20) | |
| to_status | varchar(20) | |
| changed_by_user_id | integer FK | nullable (null for auto-transitions) |
| changed_at | timestamp | |

### State Machine

```
aberta ──→ disponivel ──→ rascunho ──→ publicada ──→ encerrada
  ↑            ↑             ↑             │
  └────────────┘             └─────────────┘
  (re-open)                 (unpublish)
```

Allowed transitions:

| From | To | Trigger |
|------|-----|---------|
| `aberta` | `disponivel` | Admin |
| `disponivel` | `aberta` | Admin (delay signaling) |
| `disponivel` | `rascunho` | Auto (deadline passed) or admin |
| `rascunho` | `disponivel` | Admin (re-open signaling) |
| `rascunho` | `publicada` | Admin |
| `publicada` | `rascunho` | Admin (unpublish) |
| `rascunho` | `encerrada` | Admin |
| `publicada` | `encerrada` | Admin |

### Inertia Contract

Replace `isSignalingActive: boolean` with `status: string` in all month props across Index, Show, Signal, and Edit pages.

### Agent Context Update

The CLAUDE.md `SPECKIT START/END` block will be updated to reference this plan after implementation begins.

## Phase 2: Implementation Tasks

1. **Migration**: Add `status` column to `opened_months` with backfill
2. **Migration**: Create `status_transitions` table
3. **Model**: Add `status` column + helpers to `OpenedMonth`; remove `isSignalingActive` getter
4. **Model**: Create `StatusTransition` model
5. **Command**: Create `TransitionExpiredMonths` ACE command
6. **Controller**: Add `changeStatus()` action to `ScheduleMonthsController`; gate edit/signal
7. **Controller**: Update `AvailabilitySignalsController` to check `status !== 'disponivel'`
8. **Routes**: Add `POST /schedules/months/:id/transition`
9. **Types**: Update `types/inertia.ts` (replace `isSignalingActive` → `status`)
10. **Index.vue**: Status Tag from `status` field with severity mapping
11. **Show.vue**: Status Tag + gate "Editar" button when not `rascunho`
12. **Signal.vue**: Gate on `status !== 'disponivel'` instead of `!isSignalingActive`
13. **Edit.vue**: Gate editing, add status transition buttons, show current status badge
