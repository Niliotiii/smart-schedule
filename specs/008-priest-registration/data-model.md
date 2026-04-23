# Data Model: Priest Registration

**Date**: 2026-04-22
**Plan**: [plan.md](./plan.md) | **Spec**: [spec.md](./spec.md)

---

## Entity Overview

| Entity | Purpose | Pre-populated |
| ------ | ------- | ------------- |
| Priest | A pastoral figure registered in the system for future scheduling | NO — user-created |

---

## Entity Definitions

### Priest

```text
- id (PK, serial)
- name (varchar(255), not null) — full name of the priest
- phone (varchar(20), nullable) — contact phone number
- created_at (timestamp)
- updated_at (timestamp)
- deleted_at (timestamp, nullable) — soft delete
```

**Relationships**: None in v1. Future features may link to `Church` or `Event` via FK.

**Constraints**:
- `name` must be non-empty after trimming.
- `phone` limited to 20 characters; no format regex enforced in v1.

**Validation Rules**:
- `name`: mandatory, max 255 characters, cannot be whitespace-only.
- `phone`: optional, max 20 characters.

---

## Migrations Order

1. `create_priests_table`

---

## Seeders

None required for this feature.
