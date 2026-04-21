# Feature Specification: User Types

**Feature Branch**: `006-user-types`  
**Created**: 2026-04-21  
**Status**: Draft  
**Input**: User description: "Quero poder cadastrar tipos de usuários para poder depois selecionar escolher um tipo de usuário para o usuario. Tipo de usuários seria algo como, acólitos, coroinhas, apoio, etc"

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Manage User Types (Priority: P1)

As an administrator, I want to create, view, update, and delete user types so that I can classify users by their ministry role (e.g., acólitos, coroinhas, apoio).

**Why this priority**: Without user types to choose from, there is nothing to assign to users. This is the foundation for the entire feature.

**Independent Test**: Can be fully tested by creating, editing, and deleting user types through the management interface and verifying they persist correctly.

**Acceptance Scenarios**:

1. **Given** the user types list is empty, **When** an admin creates a new user type with name "Coroinhas", **Then** the type appears in the list with the correct name
2. **Given** a user type "Acólitos" exists, **When** an admin updates its name to "Acólitos Sênior", **Then** the updated name is reflected in the list and on any assigned users
3. **Given** a user type "Apoio" exists, **When** an admin deletes it, **Then** the type is removed and any users previously assigned to it have their type cleared

---

### User Story 2 - Assign User Type to Users (Priority: P2)

As an administrator, I want to select a user type when creating or editing a user so that each user is classified by their ministry role.

**Why this priority**: This is the primary use case — once types exist, assigning them to users is the next critical step.

**Independent Test**: Can be fully tested by creating/editing users and selecting a user type from a dropdown, then verifying the assignment persists.

**Acceptance Scenarios**:

1. **Given** user types "Coroinhas" and "Acólitos" exist, **When** an admin creates a new user and selects "Coroinhas" as the type, **Then** the user is saved with the "Coroinhas" type
2. **Given** a user is assigned type "Coroinhas", **When** an admin changes their type to "Acólitos", **Then** the user's type is updated to "Acólitos"
3. **Given** a user is assigned type "Apoio", **When** an admin removes the type (sets to none), **Then** the user has no assigned type

---

### User Story 3 - View User Type on User Details (Priority: P3)

As an administrator, I want to see the assigned user type when viewing a user's details or the user list so that I can quickly identify each user's ministry role.

**Why this priority**: Displaying the type enhances visibility but doesn't affect core data entry.

**Independent Test**: Can be fully tested by viewing user list and detail pages and confirming the type is displayed.

**Acceptance Scenarios**:

1. **Given** a user is assigned type "Coroinhas", **When** an admin views the user list, **Then** the "Coroinhas" type is visible for that user
2. **Given** a user has no assigned type, **When** an admin views the user list, **Then** no type is shown for that user

---

### Edge Cases

- What happens when an admin tries to create a user type with a name that already exists? The system should reject the duplicate and display an error.
- What happens when deleting a user type that is assigned to multiple users? All assigned users should have their type cleared (set to null).
- What happens when creating a user type with a blank name? The system should reject it with a validation error.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: System MUST allow administrators to create new user types with a name
- **FR-002**: System MUST allow administrators to edit existing user type names
- **FR-003**: System MUST allow administrators to delete user types
- **FR-004**: System MUST validate that user type names are unique and non-empty
- **FR-005**: System MUST allow administrators to assign one user type to a user during creation or editing
- **FR-006**: System MUST allow a user to have no assigned type (type is optional)
- **FR-007**: System MUST display the assigned user type on user list and detail views
- **FR-008**: System MUST clear the user type assignment from all users when a type is deleted
- **FR-009**: System MUST provide a user types management page with list, create, and edit capabilities

### Key Entities

- **UserType**: Represents a ministry role classification (e.g., "Acólitos", "Coroinhas", "Apoio"). Key attributes: name (unique, required). Relates to User as one-to-many (one type can belong to many users).
- **User**: Gains an optional relationship to UserType. A user can have at most one type assigned at a time.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Administrators can create a new user type in under 30 seconds
- **SC-002**: Administrators can assign a user type to a user with a single selection during user creation or editing
- **SC-003**: All users with a specific type are correctly updated when that type is deleted (type cleared for all)
- **SC-004**: The user list displays the user type for each user without requiring page reload

## Assumptions

- User types are distinct from existing RBAC profiles — profiles control permissions, while user types classify ministry roles
- Only administrators can manage user types (create, edit, delete) and assign them to users
- A user can only have one type at a time (single-select, not multi-select)
- User type names are simple strings with no additional metadata needed beyond the name
- Deleting a user type does not delete the users assigned to it — only the type assignment is cleared
