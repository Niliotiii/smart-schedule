# Data Model: Ministry Roles (Funções)

**Feature**: Cadastro de Funções (Ministry Roles)
**Branch**: 009-ministry-roles
**Date**: 2026-04-22

---

## Entities

### MinistryRole (funções)

A liturgical or ministry role that can be assigned to participants in services. Examples: librífero, ceroferário, turiferário.

| Field        | Type                | Constraints                                       | Notes                                        |
|--------------|---------------------|---------------------------------------------------|----------------------------------------------|
| id           | serial / integer    | PK, auto-increment                                 |                                              |
| name         | string(255)         | NOT NULL, unique, max 255 chars                    | Display name (e.g. "Librífero")              |
| description  | text / string       | NULLABLE                                           | Optional longer description                  |
| created_at   | datetime            | auto-create                                        | Luxon DateTime                               |
| updated_at   | datetime            | auto-create, auto-update                            | Luxon DateTime                                |
| deleted_at   | datetime            | NULLABLE                                           | Soft-delete marker ( Luxon DateTime )          |

#### Validation Rules

- **name**: required, string, maxLength 255, unique across non-soft-deleted records.
- **description**: optional, string.

#### ORM Model Behavior

- `delete()`: sets `deleted_at = now()` and saves.
- `restore()`: sets `deleted_at = null` and saves.
- `static withoutTrashed(query)`: scope filtering `deleted_at IS NULL`.

#### Relationships

> At this feature stage, MinistryRole has **no relationships** to other entities. It is an independent catalog table, analogous to `user_types`.

Future potential relationships (out-of-scope for this spec):
- `hasMany` → `Participant` (a role can have many participants over time)
- `hasMany` → `ServiceRole` (a role can be assigned to many services)

#### Indexes

- Primary: `id`
- Unique: `name` where `deleted_at IS NULL` (handled at application layer via Vine validator; DB unique constraint optional but not strictly required since soft-delete can cause restored duplicates).

---

## Soft Delete Strategy

Identical to `UserType`, `Church`, and `Priest`:

- `deleted_at` column on table.
- Model overrides `delete()` to write timestamp.
- `restore()` clears timestamp.
- Queries use `withoutTrashed` scope for listings/shows.
- Unique validation (`name`) ignores soft-deleted records by querying `whereNull('deleted_at')`.

---

## Migrations

One migration required:

1. `database/migrations/XXXXXXXX_create_ministry_roles_table.ts`
   - `table.increments('id')`
   - `table.string('name', 255).notNullable()`
   - `table.text('description').nullable()`
   - `table.timestamp('created_at')`
   - `table.timestamp('updated_at').nullable()`
   - `table.timestamp('deleted_at').nullable()`
