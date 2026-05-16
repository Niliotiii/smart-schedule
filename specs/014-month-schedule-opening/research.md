# Research: Month Schedule Opening

**Date**: 2026-05-02
**Purpose**: Resolve unresolved clarifications from spec.md and document technical decisions for Phase 0.

## Clarifications Resolved

### C1: What happens to user signals when a schedule is edited after signaling begins?

- **Decision**: Preserve existing signals. When an administrator edits a schedule (day, community, priest, name, description, or roles), all existing user availability signals for that schedule remain intact. Users are NOT notified or asked to re-signal.
- **Rationale**: The signal is about the user's general availability for that schedule slot, not about specific metadata. Removing or invalidating signals would create significant admin overhead and user frustration. If the day or priest changes drastically, the admin can delete and recreate the schedule (which does remove signals, per the spec assumption).
- **Alternatives considered**:
  - Invalidate signals: Too disruptive for users.
  - Smart invalidation (preserve for minor edits, invalidate for major): Complex to define "minor" vs "major" and surprising behavior for users.

### C2: Can multiple months be open for signaling simultaneously?

- **Decision**: Yes, multiple months can be open for signaling simultaneously. There is no system-enforced restriction preventing multiple opened months from overlapping their signaling periods.
- **Rationale**: Administrators may want to plan ahead (e.g., open both June and July at the same time). Users will see whichever month they navigate to. The system does not enforce sequential month opening.
- **Alternatives considered**:
  - Only one month at a time: Overly restrictive for parishes that plan quarterly.
  - Sequential opening: Would require closing one month before opening another, which doesn't fit real-world parish planning.

### C3: Is there a limit to how far in advance a month can be opened?

- **Decision**: Limit to 12 months in advance from the current date.
- **Rationale**: Prevents database clutter and unrealistic long-term scheduling while allowing parishes to plan a full year ahead (common for liturgical calendars).
- **Alternatives considered**:
  - No limit: Risk of abandoned far-future data and UI clutter.
  - 6 months: Too restrictive for parishes that plan around the liturgical year.

## Technical Decisions

### Signaling Period Expiration

The signaling period is defined in **days** from the month opening date. Expiration is calculated as `opened_at + signaling_period_days`. Once `now > expiration_date`, the month is considered "closed for signaling." Users can still view schedules but cannot edit signals.

### Horizontal Carousel Implementation

The carousel will be implemented as a PrimeVue `Carousel` component (available in PrimeVue 4.x) on the Inertia Vue page. Each item in the carousel is a schedule card. On mobile, the carousel shows 1 item; on tablet 2; on desktop 3. This aligns with the mobile-first requirement from the Constitution.

### Batch Schedule Creation

Admins create schedules in a batch within the "open month" workflow. The backend controller will accept an array of schedule objects and wrap the insert in a database transaction to ensure atomicity (all schedules created or none).

### Conflict Detection (Priest Same-Day)

When creating or editing a schedule, the system will check if the selected priest is already assigned to another schedule on the same day within the same month. If so, a **warning** is shown to the admin (not a hard block), allowing override. This aligns with Constitution Principle II (respect availability and capacity) without being overly rigid.

### Authorization

- **Admin actions** (open month, create/edit/delete schedules): Protected by Bouncer `manageSchedule` ability, restricted to users with coordinator/admin roles.
- **User actions** (view schedules, signal availability): Protected by Bouncer `signalAvailability` ability, available to any authenticated user.
