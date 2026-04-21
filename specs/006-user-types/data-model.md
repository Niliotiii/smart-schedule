# Data Model: User Types

**Feature**: 006-user-types | **Date**: 2026-04-21

## Entity: UserType

| Field     | Type      | Constraints               | Description                          |
| --------- | --------- | ------------------------- | ------------------------------------ |
| id        | number    | PK, auto-increment        | Unique identifier                    |
| name      | string    | NOT NULL, UNIQUE, max 100 | Ministry role name (e.g. "Acólitos") |
| createdAt | timestamp | NOT NULL, auto-created    | Record creation time                 |
| updatedAt | timestamp | nullable, auto-updated    | Last modification time               |

### Validation Rules

- `name`: Required, string, max 100 characters, unique within `user_types` table

### Relationships

- `users`: HasMany → User (one type can belong to many users)

## Entity: User (modified)

| Field          | Type      | Constraints                                          | Description                   |
| -------------- | --------- | ---------------------------------------------------- | ----------------------------- |
| id             | number    | PK, auto-increment                                   | (existing)                    |
| fullName       | string    | nullable                                             | (existing)                    |
| email          | string    | NOT NULL, unique, max 254                            | (existing)                    |
| password       | string    | NOT NULL                                             | (existing)                    |
| profileId      | number    | nullable, FK → profiles.id                           | (existing)                    |
| **userTypeId** | number    | **nullable, FK → user_types.id, ON DELETE SET NULL** | **Added — links to UserType** |
| createdAt      | timestamp | NOT NULL                                             | (existing)                    |
| updatedAt      | timestamp | nullable                                             | (existing)                    |

### New Relationship

- `userType`: BelongsTo → UserType (a user belongs to at most one type)

## Entity-Relationship Diagram

```
UserType
  │
  │ 1:N (hasMany)
  ▼
User
  ├── N:1 (belongsTo) → Profile  (existing — RBAC permissions)
  └── N:1 (belongsTo) → UserType  (new — ministry role classification)
```

## Migrations

### Migration 1: Create user_types table

```sql
CREATE TABLE user_types (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NULL
);
```

### Migration 2: Add user_type_id to users

```sql
ALTER TABLE users
  ADD COLUMN user_type_id INTEGER NULL
    REFERENCES user_types(id) ON DELETE SET NULL;
```
