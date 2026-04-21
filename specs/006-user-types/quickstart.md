# Quickstart: User Types

**Feature**: 006-user-types | **Date**: 2026-04-21

## Setup Commands

```bash
# Run migrations
node ace migration:run

# Seed new permissions (user_types:read, user_types:create, user_types:update, user_types:delete)
node ace db:seed

# Start dev server
node ace serve --dev
```

## Integration Scenarios

### Scenario 1: Create a User Type

1. Navigate to /user-types
2. Click "Novo" button in Toolbar
3. Enter name (e.g. "Coroinhas")
4. Click "Salvar"
5. Redirect to /user-types — new type visible in list

### Scenario 2: Assign Type to User

1. Navigate to /users/create (or /users/:id/edit)
2. Fill user details
3. Select type from "Tipo de Usuário" dropdown
4. Click "Salvar"
5. User is saved with selected type
6. View user detail — type displayed

### Scenario 3: Delete a User Type

1. Navigate to /user-types
2. Click delete action on a type row
3. Confirm deletion via ConfirmDialog
4. Type removed from list
5. All users previously assigned to that type now have no type

### Scenario 4: Search User Types

1. Navigate to /user-types
2. Type search term in IconField
3. DataTable filters by name (ilike)
4. Pagination updates accordingly

## Verification Checklist

- [ ] user_types table created with name (unique, not null)
- [ ] user_type_id column added to users (nullable FK, ON DELETE SET NULL)
- [ ] CRUD works: create, read, update, delete user types
- [ ] Duplicate name rejected with validation error
- [ ] Deleting a type clears user_type_id on all assigned users
- [ ] User form shows type dropdown populated from user_types
- [ ] User show page displays type name
- [ ] User list page displays type name
- [ ] Bouncer abilities enforce access control on all actions
- [ ] Pagination and search work on user types list
- [ ] Menu includes "Tipos de Usuário" link
