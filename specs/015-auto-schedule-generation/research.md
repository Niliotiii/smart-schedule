# Research: Geração Automática de Escalas

## Algorithm Design

### Decision: Balance-aware greedy assignment with signal priority

**Rationale**: The greedy approach with round-robin balancing satisfies all FRs while remaining simple to implement, test, and reason about. For the expected scale (~200 users, ~60 schedules), performance is not a concern.

### Algorithm Steps

1. **Collect eligible users**: Query all users with `includeInScale = true` who have at least one ministry role that matches any schedule in the month.

2. **Group by ministry role**: For each ministry role, build a list of users who have that role.

3. **Build signal map**: For each schedule, load availability signals. Users who signaled "não" for a schedule are excluded from that schedule's pool. Users who signaled "sim" or didn't signal are eligible.

4. **Sort schedules**: Process schedules in ascending order of available user count (hardest-to-fill first), to maximize fill rate.

5. **For each schedule and role**:
   - Calculate `target = total_slots / eligible_users` to determine fair share.
   - Filter eligible users (have the role, not signaled "não" for this schedule).
   - Sort by: (a) signaled "sim" before "no signal", (b) current assignment count in month ascending.
   - Pick the top N users (up to the quantity required), assigning them to the schedule.
   - Skip users already assigned to another schedule at the same day/time (conflict).

6. **Post-generation**: Report unfilled positions (slots where not enough eligible users were found).

### Alternatives Considered

- **Constraint satisfaction (CSP)**: More optimal but overkill for the scale; harder to implement and debug.
- **Pure round-robin without priority**: Would ignore signal preferences, violating FR-004.
- **Database-level generation**: Harder to test and less flexible than service-layer code.

## Storage Model

### Decision: New `schedule_assignments` table

**Rationale**: A new table cleanly separates auto-generated assignments from the schedule definitions. It allows for easy regeneration (truncate + re-insert) and manual overrides.

**Columns**: `id`, `schedule_id`, `user_id`, `ministry_role_id`, `created_at`

**Alternatives considered**:
- Adding `assigned_user_id` to `schedule_roles` table: Would limit to one user per role slot; the current design supports multiple users per role.
- JSON column on `schedules`: Harder to query and maintain referential integrity.

## UI Integration

### Decision: Generate button on Edit page

The "Gerar Escala Automaticamente" button goes on the existing Edit page (`Edit.vue`), which already has the DataTable of schedules. After generation, assignments are displayed within each schedule row showing which users are assigned to which roles.

## Determinism

### Decision: Consistent sort order using user ID as tiebreaker

When all priority criteria are equal, sort by user ID ascending. This ensures the same input always produces the same output.
