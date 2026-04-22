# Quickstart: Priest Registration

**Date**: 2026-04-22
**Plan**: [plan.md](./plan.md) | **Spec**: [spec.md](./spec.md)

---

## How to Test Manually

1. Ensure you are logged in as an administrator with `priests:read` and `priests:create` permissions.
2. Navigate to `/priests` — the listing page should load with an empty state or existing priests.
3. Click "Novo Padre" (or equivalent) to open the creation form.
4. Fill in the name (required) and optionally the phone, then submit.
5. Verify the success flash message and redirection to `/priests`.
6. Click "Editar" on a priest row to open the edit form.
7. Modify the phone or name, submit, and verify the update persists.
8. Click "Excluir" and confirm — the priest should disappear from the listing (soft deleted).

## Seed Data

No seeders required for this feature. Start with an empty table.

## Permissions Required

| Permission | Action |
| ---------- | ------ |
| `priests:read`   | View priest listing and details |
| `priests:create` | Register a new priest |
| `priests:update` | Edit an existing priest |
| `priests:delete` | Remove a priest (soft delete) |

Add these permissions via the existing permissions/profile system or as part of the migration/feature deployment.
