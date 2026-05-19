# Implementation Plan: Geração Automática de Escalas

**Branch**: `015-auto-schedule-generation` | **Date**: 2026-05-15 | **Spec**: [spec.md](specs/015-auto-schedule-generation/spec.md)
**Input**: Feature specification from `/specs/015-auto-schedule-generation/spec.md`

## Summary

Implementar algoritmo de geração automática de escalas que distribui usuários nas escalas de um mês respeitando: funções cadastradas do usuário, sinalização de disponibilidade (sim/não/sem resposta = sim), "incluir na escala" ativado, e balanceamento uniforme entre usuários elegíveis.

## Technical Context

**Language/Version**: TypeScript (Node.js via AdonisJS 7)  
**Primary Dependencies**: AdonisJS 7, Lucid ORM, VineJS, Luxon  
**Storage**: PostgreSQL via Lucid ORM (migrations + models)  
**Testing**: AdonisJS Japa (japa)  
**Target Platform**: Web (AdonisJS server + Inertia.js/Vue 3 frontend)  
**Project Type**: Monolith web application  
**Performance Goals**: Algorithm should process a month (up to 60 schedules, 200 users) in under 5 seconds  
**Constraints**: Must be deterministic; must handle partial fills (not enough users for a role) gracefully  
**Scale/Scope**: Single parish context, up to ~200 users and ~60 schedules per month  

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

### Gate 1 — Extensibilidade (Principle I)
- **Requirement**: No hardcoded references to a single ministry/pastoral group; algorithm must work by ministry roles generically.
- **Status**: ✅ PASS — Algorithm matches by user ministry roles (many-to-many), not by hardcoded labels.

### Gate 2 — Respeito à Disponibilidade (Principle II)
- **Requirement**: Must use availability signals; no conflicting schedules for same user; warn on over-allocation.
- **Status**: ✅ PASS — FR-004/005/006 define signal-based priority; balanceamento uniforme prevents overload.

### Gate 3 — Simplicidade (Principle III)
- **Requirement**: UI should be intuitive, mobile-first.
- **Status**: ✅ PASS — Single button "Gerar Escala Automaticamente" on edit page; results shown inline.

### Gate 4 — Confiabilidade (Principle IV)
- **Requirement**: Deterministic algorithm; gracefully handle insufficient volunteers.
- **Status**: ✅ PASS — FR-011 requires signaling unfilled positions; algorithm must be deterministic (sort users consistently).

### Gate 5 — Segurança (Principle V)
- **Requirement**: Only authorized users can generate/alter scales.
- **Status**: ✅ PASS — Uses existing `scheduleMonthsManage` permission.

## Project Structure

### Documentation (this feature)

```text
specs/015-auto-schedule-generation/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
└── tasks.md             # Phase 2 output (via /speckit.tasks)
```

### Source Code (repository root)

```text
# AdonisJS monolith (no separate frontend directory)
app/
├── controllers/
│   └── schedule_months_controller.ts   # + storeGenerate action
├── models/
│   ├── schedule_assignment.ts          # NEW model
│   └── schedule.ts                     # + hasMany assignments
├── services/
│   ├── schedule_service.ts             # + generate algorithm
│   └── schedule_generator_service.ts   # NEW: algorithm logic
├── validators/
│   └── schedule.ts                     # + assignment endpoints
├── abilities/
│   └── main.ts                         # + scheduleMonthsManage (already exists)

database/
├── migrations/
│   └── NNNNNNNNNNNN_create_schedule_assignments_table.ts  # NEW

resources/js/Pages/ScheduleMonths/
├── Edit.vue          # + "Gerar Escala Automaticamente" button + assignment display
└── Show.vue          # + assignment display

tests/
├── unit/
│   └── schedule_generator_service.spec.ts  # NEW
└── integration/
    └── schedule_generation.spec.ts         # NEW
```

**Structure Decision**: Monolith AdonisJS — no separate backend/frontend directories. New entities added within existing app structure following project conventions.

## Complexity Tracking

No constitution violations to justify.
