# Feature Specification: Dashboard Signal Access

**Feature Branch**: `017-dashboard-signal-access`
**Created**: 2026-05-18
**Status**: Draft
**Input**: User description: "Remova o botão de Sinalizar da tela schedules/months e adicione como um botão de acesso rápido na tela de dashboard semelhante aos que já existem. Ao clicar deve ser direcionado para uma tela que permita sinalizar para todas as escalas que estão aptas a sinalização"

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Quick-access signal button on Dashboard (Priority: P1)

As an authenticated user, I want to find a "Sinalizar" button on the Dashboard so that I can quickly access all schedules that are open for signaling without navigating through the schedules management pages.

**Why this priority**: This is the core ask — moving signal access to the dashboard for convenience.

**Independent Test**: A user with `scheduleMonthsRead` permission sees a "Sinalizar" card on the dashboard. Clicking it takes them to a consolidated signal page.

**Acceptance Scenarios**:

1. **Given** I am on the Dashboard, **When** I have permission to view schedules, **Then** I see a "Sinalizar" quick-access card with an icon and description
2. **Given** I am on the Dashboard, **When** I click the "Sinalizar" card, **Then** I am redirected to a page showing all schedules available for signaling across all months
3. **Given** I do NOT have `scheduleMonthsRead` permission, **When** I view the Dashboard, **Then** the "Sinalizar" card appears disabled with a "Sem permissão" tag

---

### User Story 2 - Consolidated signal page across all open months (Priority: P1)

As an authenticated user, I want to see and signal availability for all schedules across all months that are currently in "disponivel" status, grouped by month, so I can handle all my signaling in one place.

**Why this priority**: The consolidated view is the main functional change — users can signal for multiple months at once.

**Independent Test**: A user navigates to the signal page and sees all schedules from all months with status "disponivel", with working "Sim"/"Não" buttons per schedule.

**Acceptance Scenarios**:

1. **Given** there are multiple months with status "disponivel", **When** I open the signal page, **Then** I see schedules grouped by month, each with its own "Sim"/"Não" buttons
2. **Given** no months are in "disponivel" status, **When** I open the signal page, **Then** I see a message "Nenhuma escala disponível para sinalização no momento"
3. **Given** I click "Sim" on a schedule, **When** the request succeeds, **Then** a success toast appears and the button reflects my choice
4. **Given** I click "Não" on a schedule, **When** the request succeeds, **Then** a toast confirms and the button reflects my choice

---

### User Story 3 - Remove standalone signal button from schedules index (Priority: P2)

As an admin, I want the "Sinalizar" button removed from the schedules/months list page, since signal access is now centralized on the dashboard.

**Why this priority**: Cleanup task — the old button should be removed to avoid confusion.

**Independent Test**: The schedules/months index page no longer displays the flag icon button for signaling.

**Acceptance Scenarios**:

1. **Given** I am on the schedules/months list page, **When** I look at a month row's actions, **Then** there is no "Sinalizar disponibilidade" button

### Edge Cases

- User with no `scheduleMonthsRead` permission should not see the card (except as disabled via the existing pattern)
- If a month transitions from "disponivel" while the user is on the signal page, the server-side validation still rejects invalid signals
- User can change their response (e.g., from "Sim" to "Não") on the same page

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: System MUST provide a "Sinalizar" quick-access card on the Dashboard for users with `scheduleMonthsRead` permission
- **FR-002**: Clicking the "Sinalizar" card MUST redirect to a page listing all schedules available for signaling
- **FR-003**: The signal page MUST show schedules from ALL months whose status is "disponivel"
- **FR-004**: Schedules MUST be grouped or identifiable by month on the signal page
- **FR-005**: Each schedule MUST display day, name, time, community, priest, and roles
- **FR-006**: Each schedule MUST have "Sim" and "Não" buttons for the user to signal availability
- **FR-007**: The user's current signal (if any) MUST be visible per schedule
- **FR-008**: System MUST preserve the scroll position and page state after signaling
- **FR-009**: The "Sinalizar" button MUST be removed from the schedules/months index page actions column

### Key Entities _(include if feature involves data)_

- **OpenedMonth**: Month with schedules, identified by status "disponivel" for signaling
- **Schedule**: Individual schedule entry within a month, with day, time, community, priest, roles
- **Signal (AvailabilitySignal)**: User's response ("sim" or "nao") to a schedule

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Users can access all available schedules for signaling in one click from the Dashboard
- **SC-002**: Users can signal availability for any schedule on the consolidated page without page reloads
- **SC-003**: The signal page clearly shows which month each schedule belongs to
- **SC-004**: No functionality loss — all signaling features from the old per-month page are preserved in the consolidated view

## Assumptions

- The "Sinalizar" card on the dashboard follows the same visual pattern as the existing "Usuários", "Perfis", and "Escalas" cards
- The consolidated signal page reuses the existing signal response logic (POST to `/schedules/:scheduleId/signal`)
- Only months with status "disponivel" are shown on the signal page
- Users can have existing signals that should be displayed when loading the page
