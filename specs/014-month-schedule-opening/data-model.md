# Data Model: Month Schedule Opening

**Date**: 2026-05-02
**Purpose**: Entity definitions, fields, relationships, and validation rules for the feature.

## Entities

### opened_months

Represents a calendar month that has been opened for scheduling.

| Field | Type | Constraints | Description |
| ----- | ---- | ----------- | ----------- |
| id | serial | PK | Unique identifier |
| year | integer | NOT NULL | Calendar year (e.g., 2026) |
| month | integer | NOT NULL | Calendar month (1-12) |
| opened_at | timestamp | NOT NULL, DEFAULT now() | When the month was opened |
| signaling_period_days | integer | NOT NULL | Number of days the month remains open for signaling |
| signaling_deadline | timestamp | NOT NULL, generated | `opened_at + signaling_period_days` |
| created_by_user_id | integer | NOT NULL, FK → users.id | Admin who opened the month |
| created_at | timestamp | DEFAULT now() | Record creation timestamp |
| updated_at | timestamp | DEFAULT now() | Record update timestamp |

**Validation Rules**:
- `year` must be current year or future, but no more than 12 months ahead
- `month` must be 1-12
- `signaling_period_days` must be >= 1 and <= 30
- Combination of `year` + `month` must be unique (one opened_month per calendar month)

**State Transitions**:
- `opened` → `signaling_closed`: Automatically when `now() > signaling_deadline`
- There is no explicit "closed" state column; signaling_closed is derived from the deadline

---

### schedules

Represents a single duty assignment within an opened month.

| Field | Type | Constraints | Description |
| ----- | ---- | ----------- | ----------- |
| id | serial | PK | Unique identifier |
| opened_month_id | integer | NOT NULL, FK → opened_months.id | Parent opened month |
| day | integer | NOT NULL | Day of the month (1-31) |
| name | varchar(255) | NOT NULL | Schedule name (e.g., "Missa das 19h") |
| description | text | NULLABLE | Optional description |
| community_id | integer | NOT NULL, FK → communities.id | Assigned community |
| priest_id | integer | NOT NULL, FK → priests.id | Assigned priest |
| created_at | timestamp | DEFAULT now() | Record creation timestamp |
| updated_at | timestamp | DEFAULT now() | Record update timestamp |

**Validation Rules**:
- `day` must be valid for the month (e.g., max 30 for April)
- `name` must be 1-255 characters
- `opened_month_id` + `day` + `community_id` + `priest_id` is NOT required to be unique (same priest can have multiple duties on same day, though warned)

---

### schedule_roles (pivot)

Links schedules to the ministry roles required for that schedule.

| Field | Type | Constraints | Description |
| ----- | ---- | ----------- | ----------- |
| id | serial | PK | Unique identifier |
| schedule_id | integer | NOT NULL, FK → schedules.id | Parent schedule |
| ministry_role_id | integer | NOT NULL, FK → ministry_roles.id | Required role |

**Validation Rules**:
- Combination of `schedule_id` + `ministry_role_id` must be unique (no duplicate roles on same schedule)

---

### availability_signals

Represents a user's availability response for a specific schedule.

| Field | Type | Constraints | Description |
| ----- | ---- | ----------- | ----------- |
| id | serial | PK | Unique identifier |
| schedule_id | integer | NOT NULL, FK → schedules.id | Target schedule |
| user_id | integer | NOT NULL, FK → users.id | Responding user |
| response | enum | NOT NULL | "sim" or "nao" |
| signaled_at | timestamp | NOT NULL, DEFAULT now() | When the signal was submitted |
| updated_at | timestamp | DEFAULT now() | Last update timestamp |

**Validation Rules**:
- Combination of `schedule_id` + `user_id` must be unique (one signal per user per schedule)
- `response` must be either "sim" or "nao"
- Insert/update is only allowed while the parent opened_month's `signaling_deadline` has not passed

**On Delete Behavior**:
- When `schedule` is deleted, all related `availability_signals` are cascaded deleted
- When `user` is deleted, all their `availability_signals` are cascaded deleted
- When `opened_month` is deleted, all related `schedules` and `availability_signals` are cascaded deleted

## Entity Relationship Diagram

```text
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  opened_months  │────<│    schedules    │────<│availability_    │
│                 │ 1:M │                 │ 1:M │signals          │
│  - year         │     │  - day          │     │  - response     │
│  - month        │     │  - name         │     │  - signaled_at  │
│  - opened_at    │     │  - description  │     │                 │
│  - signaling_   │     │                 │     └─────────────────┘
│    period_days  │     │                 │           ↑
│  - signaling_   │     │                 │           │
│    deadline     │     │                 │           │
└─────────────────┘     │                 │     ┌─────────────────┐
        ↑               │                 │     │     users       │
        │               │                 │     └─────────────────┘
   ┌─────────────────┐  │                 │           ↑
   │     users       │  │                 │           │
   │  (created_by)   │  └─────────────────┘     ┌─────────────────┐
   └─────────────────┘            ↑              │  ministry_roles │
                                  │              └─────────────────┘
                           ┌─────────────────┐         ↑
                           │  schedule_roles │         │
                           │    (pivot)      │─────────┘
                           └─────────────────┘
                                  ↑
                                  │
                           ┌─────────────────┐
                           │   communities   │
                           └─────────────────┘
                                  ↑
                                  │
                           ┌─────────────────┐
                           │     priests     │
                           └─────────────────┘
```

## State Transitions

### Opened Month Lifecycle

```
┌─────────┐    admin opens    ┌──────────────┐    deadline reached    ┌─────────────┐
│  DRAFT  │ ────────────────→ │   OPENED     │ ──────────────────────→ │  SIGNALING  │
│  (none) │                   │ (signaling   │                         │   CLOSED    │
└─────────┘                   │  active)     │                         │ (view only) │
                              └──────────────┘                         └─────────────┘
```

### Schedule Lifecycle

```
┌─────────┐    admin creates    ┌──────────┐    admin edits    ┌──────────┐
│  NONE   │ ───────────────────→│  ACTIVE  │ ←───────────────→ │  ACTIVE  │
└─────────┘                     │          │                   │ (updated)│
                                └──────────┘                   └──────────┘
                                      │
                                      │ admin deletes
                                      ↓
                                ┌──────────┐
                                │  DELETED │
                                │ (cascade │
                                │  signals)│
                                └──────────┘
```

## Validation Rules Summary

| Rule | Entity | Condition |
| ---- | ------ | --------- |
| Unique month | opened_months | `year` + `month` must be unique |
| Valid month | opened_months | `month` between 1 and 12 |
| Max advance | opened_months | `year`/`month` no more than 12 months ahead |
| Valid day | schedules | `day` must be valid for the month/year |
| Valid period | opened_months | `signaling_period_days` between 1 and 30 |
| Unique role per schedule | schedule_roles | `schedule_id` + `ministry_role_id` unique |
| Unique signal per user | availability_signals | `schedule_id` + `user_id` unique |
| Valid response | availability_signals | `response` must be "sim" or "nao" |
| Deadline guard | availability_signals | Insert/update only when `now() <= signaling_deadline` |
