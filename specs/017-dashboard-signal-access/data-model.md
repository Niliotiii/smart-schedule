# Data Model: Dashboard Signal Access

**Date**: 2026-05-18

No new entities. All data is served by existing models:
- **OpenedMonth** — queried where `status = 'disponivel'`, includes schedules with eager-loaded signals for current user
- **Schedule** — within each month, includes roles, community, priest
- **AvailabilitySignal** — per-schedule user response (sim/nao)
