# Research: Dashboard Signal Access

**Date**: 2026-05-18

## Findings

No research required — the feature reuses existing patterns:
- Dashboard quick-access cards: pattern established in `Dashboard/Index.vue` (Usuários, Perfis, Escalas cards)
- Signal response logic: existing `POST /schedules/:scheduleId/signal` endpoint in `AvailabilitySignalsController`
- Signal UI: existing `ScheduleMonths/Signal.vue` carousel pattern
- Month querying: existing `OpenedMonth` model with status filtering

## Decisions

| Decision | Rationale |
|---|---|
| Reuse existing signal endpoint | No new backend logic needed |
| Follow dashboard card pattern | Consistency with existing UI |
| New consolidated page at `/schedules/signals` | Clean separation from per-month pages |
