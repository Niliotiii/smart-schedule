# Feature Specification: Schedule Statuses

**Feature Branch**: `016-schedule-statuses`  
**Created**: 2026-05-18  
**Status**: Draft  
**Input**: User description: "As escalas devem respeitar os seguintes status Aberta (Quando criada), disponível para sinalizar (quando disponível para sinalizar), rascunho (após o período de sinalização), postada (quando postada quando postada) e encerrada (quando concluída). Implemente esses status e lógicas para permitir tais funcionalidades. Caso tenha sugestões de outros nomes de status que tenham melhor aplicação poderá alterar"

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Admin manages month lifecycle from opening to closing (Priority: P1)

The admin creates a new month for scheduling. The month starts in **Aberta** status, meaning it exists in the system but may not yet be visible for signaling. When ready, the admin makes it **Disponível** so users can signal their availability. After the signaling deadline passes, the month automatically moves to **Rascunho** where the admin can generate and edit allocations. Once allocations are finalized, the admin **Publica** the month so all users can view the schedule. After the month's last schedule has passed, the admin **Encerra** the month.

**Why this priority**: The entire feature exists to support this lifecycle. Without these transitions, there is no status management.

**Independent Test**: Can be tested by creating a month, verifying initial status, changing status through each state, and confirming the correct behavior at each step.

**Acceptance Scenarios**:

1. **Given** no month exists for a given month/year, **When** the admin creates one via the creation form, **Then** the month is created with status **Aberta**
2. **Given** a month in **Aberta** status, **When** the admin activates signaling, **Then** the month moves to **Disponível** and users can see the signaling page
3. **Given** a month in **Disponível** status past the signaling deadline, **When** the system processes the transition (via a check or scheduled task), **Then** the month moves to **Rascunho** automatically
4. **Given** a month in **Rascunho** status with allocations ready, **When** the admin publishes it, **Then** the month moves to **Publicada** and allocations become visible to all users
5. **Given** a month in **Publicada** status after all schedules have passed, **When** the admin closes it, **Then** the month moves to **Encerrada**

---

### User Story 2 - Users can only signal when month is in signaling period (Priority: P1)

Users access the signaling page to indicate their availability for schedules. They should only be able to submit signals when the month is in **Disponível** status. If they try to access signaling before or after, they see an appropriate message.

**Why this priority**: Signaling is the core user-facing feature of the status system. Enforcing the correct timing prevents invalid data.

**Independent Test**: Can be tested by accessing the signal page for a month in Aberta (should not work), Disponível (should work), and Rascunho/Publicada/Encerrada (should not work).

**Acceptance Scenarios**:

1. **Given** a month in **Aberta** status, **When** a user navigates to the signaling page, **Then** they see a message that signaling is not yet available
2. **Given** a month in **Disponível** status before the deadline, **When** a user submits their availability signals, **Then** the signals are saved successfully
3. **Given** a month in **Disponível** status past the deadline, **When** a user tries to submit a signal, **Then** the system rejects the submission
4. **Given** a month in **Rascunho**, **Publicada**, or **Encerrada** status, **When** a user navigates to the signaling page, **Then** they see a message that the signaling period has ended

---

### User Story 3 - Admin can only edit allocations in draft mode (Priority: P2)

The admin manages schedule allocations (manual and auto-generated). Editing of allocations (adding/removing users from slots) should only be allowed when the month is in **Rascunho** status. Once published, allocations are locked for editing unless the admin unpublishes.

**Why this priority**: This protects finalized allocations from accidental changes and ensures the published schedule is authoritative.

**Independent Test**: Can be tested by attempting to edit allocations in each status and verifying the UI blocks or allows editing appropriately.

**Acceptance Scenarios**:

1. **Given** a month in **Rascunho** status, **When** the admin opens the edit page, **Then** they can modify schedule slots and allocations
2. **Given** a month in **Publicada** status, **When** the admin tries to open the edit page, **Then** they see the schedule as read-only or receive a warning
3. **Given** a month in **Publicada** status, **When** the admin unpublishes it, **Then** the month returns to **Rascunho** and editing is re-enabled

---

### User Story 4 - Users can view published schedules (Priority: P3)

Once a month is **Publicada**, all users (including those without admin role) can view the finalized schedule with allocations. Before publication, only admins can see allocation details.

**Why this priority**: This delivers the final value of the scheduling system — users knowing when and where they are scheduled.

**Independent Test**: Can be tested by navigating to the public schedule view for a published vs. unpublished month.

**Acceptance Scenarios**:

1. **Given** a month in **Publicada** status, **When** any user visits the schedule view, **Then** they see all schedules with assigned users
2. **Given** a month in **Rascunho** status, **When** a non-admin user visits the schedule view, **Then** they see only the schedule dates without allocation details

---

### Edge Cases

- What happens if the signaling deadline passes while the month is in **Disponível** status? → Auto-transition to **Rascunho** should occur on next access or via a scheduled check
- What happens if an admin tries to delete a month that is **Publicada** or **Encerrada**? → Should require confirmation and may be restricted
- What happens if no allocations exist before publishing? → The system should warn the admin that allocations are empty
- What happens when transitioning from **Rascunho** back to **Disponível** (re-opening signaling)? → Should be allowed to extend signaling period
- What happens if the signaling deadline is in the past when creating a month? → Should be validated to prevent immediate auto-transition

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: System MUST define a status field on the OpenedMonth entity with values: `aberta`, `disponivel`, `rascunho`, `publicada`, `encerrada`
- **FR-002**: System MUST set the initial status to `aberta` when a new month is created
- **FR-003**: System MUST allow admin users to manually transition between statuses according to the defined state machine
- **FR-004**: System MUST automatically transition `disponivel → rascunho` when the signaling deadline passes
- **FR-005**: System MUST block signaling submissions when status is not `disponivel`
- **FR-006**: System MUST block editing of schedule allocations when status is not `rascunho`
- **FR-007**: System MUST allow unpublishing (return from `publicada` to `rascunho`) to enable re-editing
- **FR-008**: System MUST show a read-only schedule view to all users when status is `publicada` or `encerrada`
- **FR-009**: System MUST display the current status on the month index, show, and edit pages
- **FR-010**: System MUST log status transitions with timestamp and user who performed the action

### Status Transition Rules

The allowed transitions are:

| From | To | Trigger |
|------|-----|---------|
| `aberta` | `disponivel` | Manual (admin) |
| `disponivel` | `aberta` | Manual (admin) — to delay signaling |
| `disponivel` | `rascunho` | Automatic (deadline passed) or manual |
| `rascunho` | `disponivel` | Manual (admin reopens signaling) |
| `rascunho` | `publicada` | Manual (admin publishes) |
| `publicada` | `rascunho` | Manual (admin unpublishes) |
| `rascunho` | `encerrada` | Manual (admin closes) |
| `publicada` | `encerrada` | Manual (admin closes) |

### Key Entities

- **OpenedMonth**: The scheduling cycle for a given month/year. Currently has `openedAt`, `signalingDeadline`, `isSignalingActive`. Will gain a `status` field and a transition isSignalingActive logic. Will gain a `status` field that replaces and simplifies `isSignalingActive`.
- **StatusTransition**: Audit log of when and by whom each status change was made. Attributes: from_status, to_status, changed_by_user_id, changed_at.
- **OpenedMonth**: The month being scheduled. Currently has `openedAt`, `signalingDeadline`, `isSignalingActive`. Will gain a `status` field that replaces `isSignalingActive`. The signaling deadline and status together determine whether signaling is active.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Admin can complete the full lifecycle (create → publish → close) for any month without errors
- **SC-002**: Users cannot submit availability signals outside the signaling period (status = `disponivel`)
- **SC-003**: Published schedules are visible to all users in read-only mode with no ability to modify allocations
- **SC-004**: Status transitions are documented in an audit log with timestamp and user identity
- **SC-005**: Auto-transition from `disponivel` to `rascunho` happens within 5 minutes of the signaling deadline passing

## Assumptions

- The status applies to the `opened_months` entity (month-level), not individual schedules
- The `isSignalingActive` boolean field currently on `opened_months` will be superseded by the status field and can be deprecated
- Status names are suggested as `aberta`, `disponivel`, `rascunho`, `publicada`, `encerrada` — refined from the user's original descriptions for conciseness
- Auto-transition will be implemented as a check when the edit/signal page is accessed, plus a scheduled task or cron for timely transition
- Existing months in the database will need a migration to assign a status retrospectively (e.g., `aberta` for open months, `encerrada` for past months)
- Only admin users with `scheduleMonthsManage` permission can perform manual status transitions
- The signaling page URL (`/schedules/months/:id/signal`) will check status before rendering the form
- The edit page URL (`/schedules/months/:id/edit`) will check status before allowing modifications
