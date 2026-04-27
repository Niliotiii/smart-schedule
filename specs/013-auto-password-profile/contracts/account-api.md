# Account API Contracts

## Web Routes (Inertia — Backend-Frontend Interface)

### GET /account/profile

**Input**: Auth middleware (session-based)

**Output (Inertia page)**:
```json
{
  "user": {
    "id": 123,
    "fullName": "João da Silva",
    "email": "joao@example.com",
    "phone": "(11) 98765-4321",
    "birthDate": "1990-05-15"
  }
}
```

**Errors**:
- 401 Unauthenticated

---

### PUT /account/profile

**Input**:
```json
{
  "fullName": "João da Silva",
  "email": "joao@example.com",
  "phone": "(11) 98765-4321"
}
```

**Validation Rules**:
- `fullName`: string, trim, maxLength 255
- `email`: string, email, maxLength 254, unique (excluir o próprio ID)
- `phone`: string, trim, minLength 10, maxLength 20

**Output**: Redirect to `/account/profile` with flash success message.

**Errors**:
- 422 — validation errors (Portuguese messages)
- 401 — Unauthenticated

---

### PUT /account/password

**Input**:
```json
{
  "currentPassword": "senha-atual",
  "newPassword": "nova-senha-segura",
  "newPasswordConfirmation": "nova-senha-segura"
}
```

**Validation Rules**:
- `currentPassword`: string, required
- `newPassword`: string, minLength 8, maxLength 32
- `newPasswordConfirmation`: string, sameAs('newPassword')

**Business Rules**:
- `currentPassword` MUST be verified against the stored hash.
- `newPassword` MUST be hashed before storage.

**Output**: Invalidate current session + redirect to `/login` with flash info message: "Senha alterada com sucesso. Faça login novamente."

**Errors**:
- 422 — currentPassword incorrect ("Senha atual incorreta")
- 422 — newPassword doesn't meet complexity
- 422 — newPasswordConfirmation doesn't match newPassword
- 401 — Unauthenticated

---

## UI Contracts (Vue + Inertia Shared Props)

### Inertia Shared Auth Prop

The `auth` prop is already shared via `inertia_shared_props_middleware.ts`. It includes:

```ts
interface AuthSharedProps {
  user: {
    initials: string
    fullName: string | null
    email: string
  } | null
}
```

### AppTopbar Dropdown Menu Items

```ts
interface TopbarMenuItem {
  label: string
  icon: string
  route: string
}

const items: TopbarMenuItem[] = [
  { label: 'Perfil', icon: 'pi pi-user', route: '/account/profile' },
  { label: 'Sair', icon: 'pi pi-sign-out', route: '/logout' },
]
```
