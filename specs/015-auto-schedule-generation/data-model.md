# Data Model: Geração Automática de Escalas

## New Entity: ScheduleAssignment

Represents the assignment of a user to a schedule in a specific ministry role, generated automatically (or adjusted manually).

**Table name**: `schedule_assignments`

| Column          | Type          | Constraints                  | Description                    |
|---------------- |-------------- |----------------------------- |------------------------------- |
| id              | integer       | PK, auto-increment           | Unique identifier              |
| schedule_id     | integer       | FK → schedules.id, NOT NULL  | The schedule this assignment is for |
| user_id         | integer       | FK → users.id, NOT NULL      | The assigned user              |
| ministry_role_id| integer       | FK → ministry_roles.id, NOT NULL | The role the user was assigned for |
| created_at      | timestamp     | NOT NULL, auto-set           | When the assignment was created |

**Indexes**:
- `idx_schedule_assignments_schedule` on `schedule_id`
- `idx_schedule_assignments_user` on `user_id`
- Unique constraint on `(schedule_id, user_id, ministry_role_id)` — prevents duplicate assignments

### Relationships

- **ScheduleAssignment → Schedule**: Many-to-One (belongsTo)
- **ScheduleAssignment → User**: Many-to-One (belongsTo)
- **ScheduleAssignment → MinistryRole**: Many-to-One (belongsTo)
- **Schedule → ScheduleAssignment**: One-to-Many (hasMany) — a schedule has many assignments
- **User → ScheduleAssignment**: One-to-Many (hasMany) — a user can be assigned to many schedules in a month

### Validation Rules

- `schedule_id`: Must reference an existing, non-deleted schedule
- `user_id`: Must reference an existing user with `includeInScale = true`
- `ministry_role_id`: Must reference an existing ministry role that the user possesses
- Cannot assign same user to two schedules at the same day/time (application-level conflict check)

## Existing Models to Modify

### Schedule (app/models/schedule.ts)
- Add `@hasMany(() => ScheduleAssignment)` relation

### User (app/models/user.ts)
- Add `@hasMany(() => ScheduleAssignment)` relation (if not already present)

### MinistryRole (app/models/ministry_role.ts)
- Add `@hasMany(() => ScheduleAssignment)` relation
