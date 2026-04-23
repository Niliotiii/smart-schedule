# Quickstart: Ministry Roles (Funções)

**Feature**: Cadastro de Funções (Ministry Roles)
**Branch**: 009-ministry-roles
**Date**: 2026-04-22

This document provides a fast-path reference for testing the feature end-to-end after implementation.

---

## Prerequisites

1. Run migrations: `node ace migration:run`
2. Seed permissions: `node ace db:seed`
3. Log in as administrator (admin@paroquia.com / secret)
4. Sidebar menu "Funções" should be visible

---

## Test Scenarios

### Scenario 1 — Create a Ministry Role

1. Click "Funções" in sidebar
2. Click "Nova Função"
3. Fill:
   - Nome: `Librífero`
   - Descrição: `Responsável por carregar o livro das sagradas escrituras`
4. Click "Salvar"
5. **Expected**: Redirected to list, toast "Função criada com sucesso", new row present

### Scenario 2 — Search

1. On listing page, type `libri` in search box
2. Wait 1 second
3. **Expected**: Only "Librífero" visible; pagination resets to page 1

### Scenario 3 — View Details

1. Click the eye icon on "Librífero" row
2. **Expected**: Show page with name, description, created-at timestamp, "Editar" and "Voltar" buttons

### Scenario 4 — Edit

1. From Show page, click "Editar"
2. Change description to `Leva o livro do Evangelho`
3. Click "Salvar"
4. **Expected**: Redirect to listing, toast "Função atualizada com sucesso", description updated

### Scenario 5 — Validation (Name Required)

1. Create new role, leave Nome empty
2. Click "Salvar"
3. **Expected**: Inline error under Nome field: "O campo nome é obrigatório"

### Scenario 6 — Duplicate Name

1. Try to create a second role named `Librífero`
2. **Expected**: Inline error: "Nome já está em uso"

### Scenario 7 — Delete

1. On listing, click trash icon on a role
2. Confirm deletion
3. **Expected**: Toast "Função excluída com sucesso", item disappears from list
4. Reload page
5. **Expected**: Item still absent (soft delete confirmed)

### Scenario 8 — Cancel Delete

1. On listing, click trash icon
2. Click "Não" in confirmation dialog
3. **Expected**: No change, item remains

### Scenario 9 — Permissions ( negative )

1. Create a user with profile that has **no** `ministryRolesRead` permission
2. Log in as that user
3. **Expected**: "Funções" menu item hidden; direct URL access returns 403

---

## API Contract Summary

| Method | Route                       | Action | Permission Required       |
|--------|-----------------------------|--------|---------------------------|
| GET    | `/ministry-roles`            | List   | `ministry_roles:read`     |
| GET    | `/ministry-roles/create`     | Create form | `ministry_roles:create` |
| POST   | `/ministry-roles`            | Store  | `ministry_roles:create`   |
| GET    | `/ministry-roles/:id`        | Show   | `ministry_roles:read`    |
| GET    | `/ministry-roles/:id/edit`   | Edit form | `ministry_roles:update` |
| PUT    | `/ministry-roles/:id`        | Update | `ministry_roles:update`   |
| DELETE | `/ministry-roles/:id`        | Destroy| `ministry_roles:delete`   |

All endpoints return Inertia renders (or redirects on mutation) with `flash.success` and `errors` bags.
