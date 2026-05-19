# Quickstart: Geração Automática de Escalas

## Implementation Steps

### 1. Create migration

```bash
node ace make:migration create_schedule_assignments_table
```

Add columns: `schedule_id`, `user_id`, `ministry_role_id`, `created_at`. Foreign keys to existing tables. Unique constraint on `(schedule_id, user_id, ministry_role_id)`.

### 2. Create ScheduleAssignment model

`app/models/schedule_assignment.ts` — BelongsTo relations to Schedule, User, MinistryRole.

### 3. Add relations to existing models

- `Schedule`: `@hasMany(() => ScheduleAssignment)`
- `User`: `@hasMany(() => ScheduleAssignment)` 
- `MinistryRole`: `@hasMany(() => ScheduleAssignment)`

### 4. Implement ScheduleGeneratorService

`app/services/schedule_generator_service.ts` — Core algorithm:

1. Load all users with `includeInScale = true` who have ministry roles
2. For each schedule, determine required slots by role
3. For each slot, find eligible users (have role, didn't say "não", not already assigned to same day/time)
4. Sort by availability priority + current assignment count
5. Assign top candidates
6. Report unfilled slots

### 5. Add controller action

In `ScheduleMonthsController`, add `generate()` method:
- Authorize `scheduleMonthsManage`
- Load month with schedules and signals
- Call ScheduleGeneratorService
- Delete existing assignments and insert new ones
- Redirect with summary

### 6. Add route

```typescript
router.post('/schedules/months/:openedMonthId/generate', [ScheduleMonthsController, 'generate']).as('scheduleMonths.generate')
```

### 7. Update Edit.vue

- Add "Gerar Escala Automaticamente" button
- Show assignments per schedule in the DataTable
- Show summary flash message after generation

### 8. Write tests

- `tests/unit/schedule_generator_service.spec.ts` — Unit tests for the algorithm
- `tests/integration/schedule_generation.spec.ts` — Integration test via HTTP
