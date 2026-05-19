# Feature Specification: Help Modal with Rules

**Feature Branch**: `018-help-modal-rules`
**Created**: 2026-05-18
**Status**: Draft
**Input**: "no menu lateral esquerdo acima do botão de sair crie um botão que ao ser clicado abrirá uma tela de abas, onde a primeira aba irá explicar as regras de alocação automatica e a segunda para regras dos status de escala-mes"

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Help button in sidebar (Priority: P1)

As any authenticated user, I want to find a help/info button in the left sidebar menu, above the "Sair" button, so that I can easily access information about how the system works.

**Why this priority**: This is the entry point for the entire feature.

**Independent Test**: A user sees a button with a help icon (e.g., question mark or info icon) in the sidebar, positioned between the nav items and the "Sair" button. Clicking it opens a modal.

**Acceptance Scenarios**:

1. **Given** I am logged into the system, **When** I open the sidebar, **Then** I see a "Ajuda" or "?" button positioned above the "Sair" button
2. **Given** I click the help button, **When** the modal opens, **Then** I see a dialog with two tabs: "Regras de Alocação" and "Status de Escala"
3. **Given** the modal is open, **When** I click outside it or press Escape, **Then** the modal closes

---

### User Story 2 - Allocation rules tab (Priority: P1)

As a coordinator or user, I want to see a clear explanation of how automatic allocation works, so I can understand which criteria the system uses to assign people to schedules.

**Why this priority**: Transparency about the allocation algorithm helps users trust the system.

**Independent Test**: Opening the help modal and clicking "Regras de Alocação" tab displays the allocation rules text.

**Acceptance Scenarios**:

1. **Given** I open the help modal, **When** the first tab "Regras de Alocação" is selected, **Then** I see the explanation of how auto-allocation works
2. **Given** I am viewing the allocation rules, **When** I read the content, **Then** I see information about: filtering users who marked "sim", avoiding users who marked "não", preventing same-day conflicts, balancing assignment load, and restricting by role/user type
3. **Given** the content is longer than the modal, **When** I scroll, **Then** the content scrolls naturally within the modal

---

### User Story 3 - Schedule status rules tab (Priority: P2)

As a coordinator, I want to see the status workflow for schedule months, so I understand what each status means and which transitions are allowed.

**Why this priority**: Understanding the state machine helps coordinators manage schedules correctly.

**Independent Test**: Opening the help modal and clicking "Status de Escala" tab displays the status rules.

**Acceptance Scenarios**:

1. **Given** I open the help modal, **When** I click the "Status de Escala" tab, **Then** I see the description of all statuses (aberta, disponivel, rascunho, publicada, encerrada)
2. **Given** I am viewing the status rules, **When** I read the content, **Then** I see which transitions are allowed between statuses

### Edge Cases

- User on mobile: modal should be responsive and fill the screen appropriately
- Very long rules text: modal should have a fixed max-height with internal scroll
- Multiple rapid clicks on the help button: should only open one modal instance

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: System MUST display a help/info button in the left sidebar, positioned above the "Sair" button
- **FR-002**: Clicking the help button MUST open a modal dialog with tabs
- **FR-003**: The modal MUST have a tab "Regras de Alocação" as the first tab (active by default)
- **FR-004**: The modal MUST have a tab "Status de Escala" as the second tab
- **FR-005**: The "Regras de Alocação" tab MUST explain: filtering by "sim" response, excluding "não" responses, preventing same-day conflicts, balancing assignments, and filtering by role/user type
- **FR-006**: The "Status de Escala" tab MUST list all statuses (aberta, disponivel, rascunho, publicada, encerrada) with descriptions and allowed transitions
- **FR-007**: The modal MUST be closable via a close button, clicking outside, or pressing Escape
- **FR-008**: Content in each tab MUST scroll if it exceeds the modal height

### Key Entities _(include if feature involves data)_

No new entities — this is a static informational feature. Content is defined directly in the page/component.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Users can access allocation and status rules in under 2 clicks from any page
- **SC-002**: Rules content is readable and well-formatted on both desktop and mobile
- **SC-003**: No changes needed to backend — all content is frontend-only

## Assumptions

- The button will use an info/question icon and be labeled "Ajuda" or similar
- The modal uses the existing PrimeVue Dialog/TabView components already available in the project
- Rules content is static text defined inline in the component, no backend required
- The help button is visible to all authenticated users (no permission gate needed)
