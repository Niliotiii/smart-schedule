# Data Model: Dashboard Schedule Calendar

**Date**: 2026-05-18

## No New Entities

This feature uses existing entities for read-only display:

### Relevant Existing Entities

- **Schedule**: id, day, name, description, time, openedMonthId, communityId, priestId
- **ScheduleAssignment**: id, scheduleId, userId, ministryRoleId
- **User**: id, fullName, email
- **MinistryRole**: id, name
- **OpenedMonth**: id, year, month, status
- **Community (Church)**: id, name
- **Priest**: id, name

### Data Flow

1. Dashboard controller queries `ScheduleAssignment` for the authenticated user
2. Joins through `Schedule` → `OpenedMonth` (status: rascunho or publicada)
3. Groups assignments by day, preloads schedule info (community, priest, scheduleRoles)
4. Serializes as `scheduleDays: Record<number, ScheduleDay[]>` keyed by day-of-month
