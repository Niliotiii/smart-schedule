# Feature Specification: Dashboard Schedule Calendar

**Feature Branch**: `020-dashboard-schedule-calendar`  
**Created**: 2026-05-18  
**Status**: Draft  
**Input**: User description: "O dashboard deverá ser alterado, atualmente onde esta aparecendo a liturgia diaria deverá ser dividido em abas, sendo a primeira aba um calendário que nos dias que tiver escala que o usuário fizer parte irá aparecer verde e nos outros dias aparecerá cinza. Independente do dia ao clicar deverá aparecer informações sobre a escala usuários vinculados e funções"

## User Scenarios & Testing

### User Story 1 — Tabbed Dashboard with Schedule Calendar (Priority: P1)

The dashboard now has tabs replacing the liturgia section. The first tab shows a calendar where days with schedules the user is assigned to appear highlighted in green, and days without schedules appear in gray. Clicking any day shows details about that day's schedule including assigned users and their roles.

**Why this priority**: This is the core request — replacing the liturgia display with a tabbed schedule calendar view.

**Independent Test**: Dashboard shows two tabs. The first tab contains a calendar with highlighted days. Clicking a highlighted day shows schedule details with users and roles.

**Acceptance Scenarios**:

1. **Given** the dashboard, **When** the user views the schedule calendar tab, **Then** they see a calendar grid with green-highlighted days for dates where they have schedules and gray for dates without
2. **Given** the calendar tab, **When** the user clicks a highlighted day, **Then** they see detailed information about the schedule including the schedule name, time, community, priest, assigned users, and their ministry roles
3. **Given** the calendar tab, **When** the user clicks a non-highlighted day, **Then** they see an empty state indicating no schedules for that day
4. **Given** the calendar tab, **When** schedules span multiple months, **Then** navigating between months shows the correct highlighted days for each month

---

### User Story 2 — Liturgia as Second Tab (Priority: P1)

The existing liturgia content moves to a second tab, preserving all its functionality (date picker, accordion readings, liturgical colors).

**Why this priority**: The liturgia should remain accessible but not be the primary focus of the dashboard.

**Independent Test**: Clicking the second tab shows the full liturgia content with date picker, readings, and accordions.

**Acceptance Scenarios**:

1. **Given** the dashboard, **When** the user clicks the second tab, **Then** they see the existing liturgia content with all functionality preserved (calendar date picker, liturgical readings, orações, antifonas, accordions)
2. **Given** the liturgia tab, **When** the user selects a different date, **Then** the liturgia updates correctly via URL parameters as before

### Edge Cases

- What if the user has no scheduled assignments in any month? — The calendar shows all days in gray; clicking any day shows "no schedule" message.
- What if a schedule has no users assigned yet? — The schedule info shows the schedule details but the assignments section shows "no users assigned" or is empty.
- What about months with no opened schedules? — Only opened months with schedules in "rascunho" or "publicada" status are considered.
- Dark/light mode — Calendar colors (green/gray) must remain distinguishable in both modes.

## Requirements

### Functional Requirements

- **FR-001**: The dashboard MUST replace the standalone liturgia section with a tabbed component containing at least two tabs
- **FR-002**: The first tab MUST display a monthly calendar view showing days colored green if the logged-in user has schedule assignments on that day, and gray otherwise
- **FR-003**: Clicking any day on the calendar MUST display a detail panel showing information about that day's schedules
- **FR-004**: The detail panel MUST show the schedule name, day, time, community, and priest for each schedule on the selected day
- **FR-005**: The detail panel MUST show the users assigned to each schedule and their respective ministry roles
- **FR-006**: The calendar MUST allow navigation between months to view past and future schedules
- **FR-007**: The second tab MUST display the existing liturgia content (readings, orações, antifonas, liturgical color, saint of the day, date picker, accordions) with all functionality preserved
- **FR-008**: The system MUST only show schedules from opened months that have been published or are in editing state

### Key Entities

- **Schedule**: Represents a single schedule/event on a specific day, belongs to an opened month, has a name, time, community, and priest
- **ScheduleAssignment**: Links a user to a schedule with a specific ministry role — used to determine which days are green for the current user
- **OpenedMonth**: A month with opened schedules, has a status (aberta, disponivel, rascunho, publicada, encerrada)
- **MinistryRole**: The role/function a user performs in a schedule (e.g., Acólito, Coroinha, Leitor)

## Success Criteria

### Measurable Outcomes

- **SC-001**: Authenticated users see a tabbed dashboard with schedule calendar as the first tab
- **SC-002**: Users can visually identify which days they have schedules (green) and which they don't (gray)
- **SC-003**: Clicking any day displays the relevant schedule information within 2 seconds
- **SC-004**: The liturgia content remains fully accessible and functional on the second tab
- **SC-005**: The feature passes TypeScript compilation and production build

## Assumptions

- Schedule assignments are determined by the `ScheduleAssignment` model linking users to schedules
- Only opened months with status "rascunho" or "publicada" are relevant for display (active months)
- The existing `LiturgiaCard.vue` component will be reused inside the second tab
- Calendar navigation uses PrimeVue Calendar component already available in the project
- The liturgia date picker (already in LiturgiaCard) stays within the second tab
- Data for the calendar (user's schedules grouped by day) will come from the dashboard controller
