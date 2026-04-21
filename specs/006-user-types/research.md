# Research: User Types

**Feature**: 006-user-types | **Date**: 2026-04-21

## Decision 1: UserType Entity Scope

**Decision**: Create a separate `UserType` model with only a `name` field.

**Rationale**: The spec requires ministry role classification (acólitos, coroinhas, apoio). A single `name` field is sufficient — no additional metadata (description, color, icon) was requested. This keeps the entity minimal and aligned with Constitution Principle I (extensibility without over-engineering).

**Alternatives considered**:

- Add `description` field: Rejected — spec explicitly states "no additional metadata needed beyond the name"
- Reuse Profile entity: Rejected — profiles handle RBAC permissions; mixing classification with authorization violates separation of concerns and hinders Constitution Principle I extensibly

## Decision 2: User–UserType Relationship Cardinality

**Decision**: One-to-many (UserType hasMany User, User belongsTo UserType). A user can have at most one type (nullable FK `user_type_id` on users).

**Rationale**: Spec states "a user can only have one type at a time." A simple nullable foreign key is the most straightforward implementation, consistent with the existing `profile_id` pattern on users.

**Alternatives considered**:

- Many-to-many via pivot: Rejected — spec explicitly requires single type per user
- Polymorphic relationship: Rejected — overkill for a single classification axis

## Decision 3: Cascade Behavior on Delete

**Decision**: `onDelete SET NULL` on the `user_type_id` foreign key. When a type is deleted, all assigned users have their `user_type_id` set to NULL.

**Rationale**: Matches spec FR-008 ("clear the user type assignment from all users when a type is deleted"). Database-level SET NULL ensures consistency even with concurrent operations.

**Alternatives considered**:

- `onDelete CASCADE`: Rejected — would delete users, which violates spec ("deleting a user type does not delete the users")
- `onDelete RESTRICT`: Rejected — would prevent deletion while users are assigned, contradicting FR-008
- Application-level nullification: Rejected — race conditions possible; DB-level constraint is safer

## Decision 4: CRUD Pattern

**Decision**: Follow the existing Profiles controller pattern exactly — Inertia render for `index/create/show/edit`, redirect after `store/update/destroy`, Bouncer authorization on every action, Vine validation, paginated query with search.

**Rationale**: Establishes consistency across the codebase. The Profiles CRUD already demonstrates all patterns needed: pagination, search, flash messages, Bouncer guards, preloading relations.

**Alternatives considered**:

- API-only endpoints with separate frontend: Rejected — monolith architecture, Inertia handles both
- Inline editing in DataTable: Rejected — adds complexity, not requested in spec

## Decision 5: RBAC Abilities for User Types

**Decision**: Create new Bouncer abilities (`userTypes:read`, `userTypes:create`, `userTypes:update`, `userTypes:delete`) following the same pattern as existing `users:*` and `profiles:*` abilities.

**Rationale**: Constitution Principle V requires permission control. New resource needs its own ability set. Reusing existing abilities would violate separation of concerns and give unintended access.

**Alternatives considered**:

- Reuse `users:*` abilities: Rejected — managing types is a different operation than managing users; an admin might manage types but not users
- Single `userTypes:manage` ability: Rejected — less granular than existing pattern; inconsistency

## Decision 6: UI Components

**Decision**: Use PrimeVue DataTable, InputText, Select, Button, Card, Toolbar — same component set used in existing Profiles/Users pages.

**Rationale**: Constitutional Principle III (simplicity/usability) aligns with using consistent, polished PrimeVue components. The 005-primevue-ui-refactor already established this component palette.

**Alternatives considered**:

- Custom HTML forms: Rejected — inconsistent with PrimeVue refactor
- Separate UI library: Rejected — adds unnecessary complexity

## Decision 7: User Form Integration

**Decision**: Add a `Select` dropdown for user type on the existing Users/Form.vue. Preload user types alongside profiles in the `create` and `edit` controller actions.

**Rationale**: Minimal change — just one more dropdown on the form. Follows the exact pattern already used for `profileId` selection.

**Alternatives considered**:

- Separate assignment page: Rejected — adds unnecessary navigation; direct selection is simpler
- Multi-select for multiple types: Rejected — spec requires single type per user
