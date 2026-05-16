# Feature Specification: Month Schedule Opening

**Feature Branch**: `014-month-schedule-opening`  
**Created**: 2026-05-02  
**Status**: Draft  
**Input**: User description: "Preciso poder abrir meses de escalas onde selecionarei um mês e irei criando escalas selecionando o dia, comunidade, padre, inserindo um nome e opcionalmente descrição e também sinalizando as funções que serão necessário para aquela escala. Após a abertura do mês ficará disponível por uma quantidade de dias para que os outros usuários possam sinalizar dias que podem ou não serem escalados. Na abertura do mês eu devo conseguir criar todas as escalas de uma só vez mas, também devo conseguir editar ou excluir escalas do mês aberto. Na hora de sinalizar escalas que poderão os usuários irão acessar uma tela que trará o mês aberto com as escalas em cards no formato carrossel horizontal onde terá os botões sim ou não. Caso ainda esteja dentro do período de sinalização que eu defini, eles conseguirão editar a sinalização. Após ter todas as sinalizações iremos implementar em feature futura a consolidação da escala."

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Administrator Opens a Month and Creates Schedules (Priority: P1)

An administrator selects a calendar month and opens it for scheduling. Within the same workflow, the administrator creates all duty schedules for that month by selecting the day, community, assigned priest, schedule name, optional description, and required ministry roles for each schedule. The administrator also defines how many days the month will remain open for users to signal their availability.

**Why this priority**: This is the foundational flow. Without opening a month and creating schedules, no other part of the feature can function.

**Independent Test**: Can be fully tested by opening a month, adding at least one schedule with all required fields, setting a signaling period, and confirming the month is visible to users.

**Acceptance Scenarios**:

1. **Given** the administrator is on the month opening screen, **When** they select a month and create three schedules with day, community, priest, name, and required roles, **Then** the month is marked as opened and the schedules are persisted.
2. **Given** the administrator is creating schedules, **When** they provide only the mandatory fields (day, community, priest, name) and skip description and some roles, **Then** the schedule is still created successfully.
3. **Given** the administrator has opened a month, **When** they set the signaling period to 7 days, **Then** users can signal availability for exactly 7 days from the opening date.

---

### User Story 2 - Users Signal Availability for Schedules (Priority: P1)

Users access the opened month through a screen that displays all schedules as cards in a horizontal carousel format. For each schedule card, users see the schedule details and two buttons to signal whether they are available ("Sim") or not available ("Não") for that duty. Users complete their signaling for all relevant schedules.

**Why this priority**: This is the core value delivery to users — enabling them to communicate their availability so that future schedule consolidation can occur.

**Independent Test**: Can be fully tested by opening a month with schedules, logging in as a user, viewing the carousel cards, and successfully submitting availability signals.

**Acceptance Scenarios**:

1. **Given** a month is open with 5 schedules, **When** a user views the availability screen, **Then** all 5 schedules are displayed as horizontal carousel cards with "Sim" and "Não" buttons.
2. **Given** a user is on the availability screen, **When** they click "Sim" for a schedule and "Não" for another, **Then** both signals are saved and visually reflected on the cards.
3. **Given** a user has already signaled availability, **When** they revisit the screen within the signaling period, **Then** their previous choices are displayed and can be changed.

---

### User Story 3 - Administrator Edits or Deletes Schedules from an Opened Month (Priority: P2)

After a month has been opened, the administrator can return to it and modify existing schedules — changing the day, community, priest, name, description, or required roles — or remove schedules entirely. This allows corrections and adjustments without needing to reopen the month.

**Why this priority**: This provides operational flexibility and reduces rework, but it depends on the month already being opened (P1).

**Independent Test**: Can be fully tested by opening a month, creating a schedule, then editing its priest and deleting another schedule, confirming both operations persist correctly.

**Acceptance Scenarios**:

1. **Given** a month has a schedule assigned to Community A, **When** the administrator edits it to change the community to Community B, **Then** the schedule is updated and reflects the new community.
2. **Given** a month has an unwanted schedule, **When** the administrator deletes it, **Then** the schedule is removed from the opened month.

---

### User Story 4 - Users Edit Availability Signals Within the Signaling Period (Priority: P2)

Users who have already signaled their availability can change their response as long as the signaling period defined by the administrator is still active. Once the period expires, their signals become locked and can no longer be modified.

**Why this priority**: This accommodates users who change their minds or made mistakes, improving data quality, but it is secondary to the initial signaling flow.

**Independent Test**: Can be fully tested by signaling availability, then returning before the deadline to change the response, and confirming the update is saved.

**Acceptance Scenarios**:

1. **Given** a user signaled "Sim" 2 days ago and the signaling period is 7 days, **When** they change the signal to "Não", **Then** the updated signal is saved and reflected immediately.
2. **Given** the signaling period has expired, **When** a user attempts to edit their previous signal, **Then** the system prevents the edit and informs the user that the period has ended.

---

### Edge Cases

- What happens when an administrator edits a schedule after users have already signaled availability for it? [NEEDS CLARIFICATION: Should existing user signals be preserved, invalidated, or removed when the schedule details change?]
- What happens when multiple months are open for signaling simultaneously? [NEEDS CLARIFICATION: Can more than one month be open for user signaling at the same time, or must users signal one month at a time?]
- How does the system handle a schedule assigned to a priest who is already assigned to another schedule on the same day?
- What happens if an administrator deletes a schedule that already has user availability signals attached?
- What happens if a user tries to access the availability screen for a month that has not yet been opened or has already expired?
- How does the system behave if the administrator opens a month very far in the future (e.g., 2 years ahead)? [NEEDS CLARIFICATION: Is there a limit to how far in advance a month can be opened?]

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: System MUST allow an administrator to open a calendar month for scheduling.
- **FR-002**: System MUST allow the administrator to create multiple schedules within an opened month in a single workflow.
- **FR-003**: Each schedule MUST capture the following mandatory fields: day of the month, community, assigned priest, and schedule name.
- **FR-004**: Each schedule MAY capture an optional description and optional required ministry roles/functions.
- **FR-005**: System MUST allow the administrator to define a signaling period (in number of days) when opening the month.
- **FR-006**: System MUST allow the administrator to edit or delete individual schedules from an opened month after creation.
- **FR-007**: During the active signaling period, users MUST be able to view all schedules of the opened month on a dedicated screen.
- **FR-008**: The availability screen MUST display schedules as cards in a horizontal carousel format.
- **FR-009**: Each schedule card MUST present two options for the user to signal availability: "Sim" (available) and "Não" (not available).
- **FR-010**: System MUST persist each user's availability signal and associate it with the corresponding schedule.
- **FR-011**: Users MUST be able to edit their previously submitted availability signals while the signaling period is still active.
- **FR-012**: System MUST prevent users from creating or editing availability signals after the signaling period has expired.
- **FR-013**: Schedule consolidation (final assignment of duties based on availability signals) is explicitly OUT OF SCOPE for this feature and will be addressed in a future feature.

### Key Entities _(include if feature involves data)_

- **Opened Month**: Represents a calendar month that has been made available for scheduling. It has a reference month/year, an opening date, and a defined signaling period duration.
- **Schedule**: Represents a single duty assignment within an opened month. It is linked to a specific day, community, priest, name, optional description, and a set of required ministry roles.
- **Availability Signal**: Represents a user's response indicating whether they are available or not for a specific schedule. It is linked to a user, a schedule, and records the signal value and timestamp.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: An administrator can open a month and create all schedules for that month in under 10 minutes.
- **SC-002**: A user can view all schedules of an opened month and submit availability signals in under 3 minutes.
- **SC-003**: 95% of users successfully complete the availability signaling flow on their first attempt without assistance.
- **SC-004**: Users can edit their availability signals at any point while the signaling period is active, with changes reflected immediately.
- **SC-005**: The availability signaling interface is usable on both desktop and mobile screen sizes.

## Assumptions

- The system already maintains registered communities, priests, and ministry roles from previous features.
- Administrators have the necessary permissions to open months and manage schedules.
- Users are authenticated and identified before they can signal availability.
- Each schedule is associated with exactly one day within the opened month.
- Users have stable internet connectivity while signaling availability.
- The schedule consolidation phase (assigning final duties based on signals) is intentionally deferred to a future feature.
- If an administrator deletes a schedule, all associated availability signals are also removed.

