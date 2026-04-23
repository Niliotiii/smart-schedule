# Research Report: Priest Registration

**Date**: 2026-04-22
**Feature**: [spec.md](./spec.md)

---

## Decision 1: Reuse Existing CRUD Architecture

**Decision**: Follow the exact architectural pattern established by `ChurchesController`, `Church` model, `church.ts` validator, and `Churches/` Vue pages.

**Rationale**:
- The Church feature (007) was just completed and serves as a proven, fresh reference.
- All layers — controller structure (index/create/store/show/edit/update/destroy), validator pattern, Inertia page props, Bouncer abilities, soft-delete model method — are identical.
- Deviating would introduce unnecessary cognitive overhead and risk inconsistencies.

**Alternatives considered**:
- Simplify to a plain API + separate SPA frontend — rejected because it breaks the existing Inertia monolith architecture and constitution principle of consistency.

---

## Decision 2: Soft Delete Implementation

**Decision**: Continue the manual soft-delete pattern: `deleted_at` column + `delete()` override + `withoutTrashed()` query scope.

**Rationale**:
- All existing models (User, Profile, UserType, Church, Address) already implement this pattern.
- Lucid 22.4.2 still has no built-in SoftDeletes mixin.
- Consistency across the entire data model is more valuable than a one-off simplification.

**Alternatives considered**:
- Hard delete for priests — rejected because accidental deletion of pastoral records is a real risk, and the existing codebase already pays the soft-delete cost everywhere.

---

## Decision 3: Phone Field Optional

**Decision**: Phone is `nullable` in the database and optional in the Vine validator.

**Rationale**:
- The specification explicitly requires phone to be optional at this stage.
- A future iteration may enforce phone as required; making it nullable now avoids a schema migration later if the requirement changes.
- No format validation (e.g., regex for Brazilian numbers) to keep v1 minimal; `maxLength(20)` is sufficient.

**Alternatives considered**:
- Enforce Brazilian phone format (e.g., `(00) 00000-0000`) — rejected because the user explicitly wants optional for v1. Format validation can be added later without a schema change.

---

## Decision 4: No Relationship to Church in v1

**Decision**: The `priests` table has no foreign key to `churches` in this version.

**Rationale**:
- The spec does not mention assigning priests to churches.
- Adding a nullable `church_id` now without the UI to manage it would be premature.
- Future features (e.g., "assign priest to a church for a mass/event") can add this relationship naturally when needed.

**Alternatives considered**:
- Add `church_id` FK now, nullable — rejected because it adds a migration and model relationship with no functional use in v1.

---

## Summary

| Decision                  | Chosen Approach                                      |
| ------------------------ | ---------------------------------------------------- |
| Architecture Pattern      | Reuse `ChurchesController` / `Church` / `Churches/` pattern exactly |
| Soft Delete               | Manual `deleted_at` + query scope (same as all existing models) |
| Phone Field               | Optional (`nullable`), `maxLength(20)`, no format regex |
| Church Relationship       | None in v1; deferred to future scheduling feature    |
