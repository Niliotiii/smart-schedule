# API Contracts: Month Schedule Opening

**Date**: 2026-05-02
**Purpose**: HTTP interface contracts for the feature. AdonisJS Inertia endpoints with JSON responses.

## Base Path

All routes are prefixed under the existing application routing structure. The feature adds new routes under the authenticated scope.

## Authentication

All endpoints require an authenticated session (AdonisJS session-based auth). Admin endpoints additionally require the `manageSchedule` Bouncer ability. User endpoints require the `signalAvailability` Bouncer ability.

---

## Endpoints

### Opened Months (Admin)

#### POST /schedules/months

Open a new month for scheduling.

**Request Body**:
```json
{
  "year": 2026,
  "month": 6,
  "signaling_period_days": 7,
  "schedules": [
    {
      "day": 5,
      "name": "Missa das 19h",
      "description": "Missa de São João",
      "community_id": 1,
      "priest_id": 2,
      "ministry_role_ids": [1, 3, 5]
    },
    {
      "day": 12,
      "name": "Missa das 7h",
      "description": null,
      "community_id": 2,
      "priest_id": 3,
      "ministry_role_ids": [1, 2]
    }
  ]
}
```

**Validation Rules**:
- `year`: required, integer, current year or future
- `month`: required, integer, 1-12
- `signaling_period_days`: required, integer, 1-30
- `schedules`: required, array, min length 1
  - `day`: required, integer, valid day for the month
  - `name`: required, string, 1-255 characters
  - `description`: optional, string, max 1000 characters
  - `community_id`: required, integer, must exist in communities table
  - `priest_id`: required, integer, must exist in priests table
  - `ministry_role_ids`: optional, array of integers, must exist in ministry_roles table

**Success Response** (201 Created):
```json
{
  "opened_month": {
    "id": 1,
    "year": 2026,
    "month": 6,
    "opened_at": "2026-05-02T10:00:00.000Z",
    "signaling_period_days": 7,
    "signaling_deadline": "2026-05-09T10:00:00.000Z",
    "created_by_user_id": 1
  },
  "schedules": [
    {
      "id": 1,
      "opened_month_id": 1,
      "day": 5,
      "name": "Missa das 19h",
      "description": "Missa de São João",
      "community_id": 1,
      "priest_id": 2,
      "roles": [{"id": 1, "name": "Coroinha"}, {"id": 3, "name": "Acólito"}, {"id": 5, "name": "Ministro"}]
    },
    {
      "id": 2,
      "opened_month_id": 1,
      "day": 12,
      "name": "Missa das 7h",
      "description": null,
      "community_id": 2,
      "priest_id": 3,
      "roles": [{"id": 1, "name": "Coroinha"}, {"id": 2, "name": "Cerimonialista"}]
    }
  ]
}
```

**Error Response** (422 Unprocessable Entity):
```json
{
  "errors": [
    {
      "field": "schedules.0.day",
      "message": "The day must be valid for the selected month",
      "rule": "validDay"
    },
    {
      "field": "year",
      "message": "A month opening already exists for this year and month",
      "rule": "unique"
    }
  ]
}
```

---

#### PUT /schedules/months/:openedMonthId/schedules/:scheduleId

Edit an existing schedule within an opened month.

**Request Body**:
```json
{
  "day": 6,
  "name": "Missa das 20h",
  "description": "Missa de São João (alterada)",
  "community_id": 1,
  "priest_id": 2,
  "ministry_role_ids": [1, 3]
}
```

**Validation Rules**: Same as schedule fields in POST /schedules/months.

**Success Response** (200 OK):
```json
{
  "id": 1,
  "opened_month_id": 1,
  "day": 6,
  "name": "Missa das 20h",
  "description": "Missa de São João (alterada)",
  "community_id": 1,
  "priest_id": 2,
  "roles": [{"id": 1, "name": "Coroinha"}, {"id": 3, "name": "Acólito"}]
}
```

**Error Response** (403 Forbidden):
```json
{
  "message": "You do not have permission to manage schedules"
}
```

---

#### DELETE /schedules/months/:openedMonthId/schedules/:scheduleId

Delete a schedule from an opened month. All associated availability signals are cascaded deleted.

**Success Response** (204 No Content)

**Error Response** (404 Not Found):
```json
{
  "message": "Schedule not found"
}
```

---

### Availability Signaling (Users)

#### GET /schedules/months/:openedMonthId

View an opened month with all its schedules and the current user's signals (if any).

**Success Response** (200 OK):
```json
{
  "opened_month": {
    "id": 1,
    "year": 2026,
    "month": 6,
    "signaling_deadline": "2026-05-09T10:00:00.000Z",
    "is_signaling_active": true
  },
  "schedules": [
    {
      "id": 1,
      "day": 5,
      "name": "Missa das 19h",
      "description": "Missa de São João",
      "community": {"id": 1, "name": "Matriz"},
      "priest": {"id": 2, "name": "Padre José"},
      "roles": [{"id": 1, "name": "Coroinha"}, {"id": 3, "name": "Acólito"}],
      "user_signal": {
        "id": 10,
        "response": "sim",
        "signaled_at": "2026-05-02T14:30:00.000Z"
      }
    },
    {
      "id": 2,
      "day": 12,
      "name": "Missa das 7h",
      "description": null,
      "community": {"id": 2, "name": "Capela N.S. Aparecida"},
      "priest": {"id": 3, "name": "Padre Pedro"},
      "roles": [{"id": 1, "name": "Coroinha"}],
      "user_signal": null
    }
  ]
}
```

---

#### POST /schedules/:scheduleId/signal

Submit or update an availability signal for a specific schedule.

**Request Body**:
```json
{
  "response": "sim"
}
```

**Validation Rules**:
- `response`: required, enum("sim", "nao")

**Success Response** (200 OK for update, 201 Created for new):
```json
{
  "id": 10,
  "schedule_id": 1,
  "user_id": 5,
  "response": "sim",
  "signaled_at": "2026-05-02T14:30:00.000Z",
  "updated_at": "2026-05-02T14:30:00.000Z"
}
```

**Error Response** (403 Forbidden — signaling period expired):
```json
{
  "message": "The signaling period for this month has ended. You can no longer edit your availability."
}
```

**Error Response** (422 Unprocessable Entity):
```json
{
  "errors": [
    {
      "field": "response",
      "message": "The response field must be one of: sim, nao",
      "rule": "enum"
    }
  ]
}
```

---

### List Opened Months (Admin + Users)

#### GET /schedules/months

List all opened months, ordered by year and month descending.

**Query Parameters**:
- `status`: optional, enum("open", "closed"). Filters by signaling period status.

**Success Response** (200 OK):
```json
{
  "opened_months": [
    {
      "id": 1,
      "year": 2026,
      "month": 6,
      "opened_at": "2026-05-02T10:00:00.000Z",
      "signaling_deadline": "2026-05-09T10:00:00.000Z",
      "is_signaling_active": true,
      "schedule_count": 5,
      "signal_count": 12
    },
    {
      "id": 2,
      "year": 2026,
      "month": 5,
      "opened_at": "2026-04-20T08:00:00.000Z",
      "signaling_deadline": "2026-04-27T08:00:00.000Z",
      "is_signaling_active": false,
      "schedule_count": 8,
      "signal_count": 24
    }
  ]
}
```

---

## Error Codes

| Code | Status | Meaning |
| ---- | ------ | ------- |
| E1001 | 422 | Month already opened for this year/month |
| E1002 | 422 | Invalid day for selected month |
| E1003 | 422 | Signaling period must be between 1 and 30 days |
| E1004 | 403 | User cannot manage schedules (missing admin permission) |
| E1005 | 403 | Signaling period has expired |
| E1006 | 422 | Schedule must have at least one entry when opening a month |
| E1007 | 422 | Duplicate role assignment on the same schedule |
| E1008 | 409 | Priest has another schedule on the same day (warning-level) |

## Inertia Pages

In addition to JSON API endpoints, the feature exposes Inertia page routes for server-side rendering:

| Route | Page Component | Purpose |
| ----- | -------------- | ------- |
| GET /schedules/months/create | `pages/schedule_months/create.vue` | Admin month opening + batch schedule creation |
| GET /schedules/months/:id/edit | `pages/schedule_months/edit.vue` | Admin edit/delete schedules from opened month |
| GET /schedules/months/:id/signal | `pages/schedule_months/signal.vue` | User availability signaling (carousel view) |
| GET /schedules/months | `pages/schedule_months/index.vue` | List of opened months |

All Inertia pages receive their initial data via `props` from the corresponding controller index/show methods.
