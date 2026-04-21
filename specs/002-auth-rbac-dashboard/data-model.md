# Data Model: Auth, RBAC & Dashboard

O módulo de Autenticação e RBAC introduz entidades cruciais para o ecossistema.

## Entidades

### 1. `User`

Representa um voluntário/colaborador do sistema.

- **Campos Principais**:
  - `id` (PK, Serial/UUID)
  - `full_name` (String, nome de exibição)
  - `email` (String, único)
  - `password` (String, hashed)
  - `profile_id` (FK para Profile, nullable - se o usuário estiver sem perfil, loga mas não tem acesso aos módulos)
- **Relacionamentos**:
  - `belongsTo` Profile

### 2. `Profile` (Perfis)

Representa um papel administrativo ou pastoral (ex: Admin, Coordenador Acólitos).

- **Campos Principais**:
  - `id` (PK, Serial/UUID)
  - `name` (String, ex: "Administrador")
  - `description` (Text, opcional)
- **Relacionamentos**:
  - `hasMany` Users
  - `manyToMany` Permissions (via `profile_permissions`)

### 3. `Permission`

Representa uma ação em um módulo. Ex: Módulo `users`, Ação `create`.

- **Campos Principais**:
  - `id` (PK)
  - `module` (String, ex: "users", "profiles")
  - `action` (String, ex: "create", "read", "update", "delete")
  - `description` (String, ex: "Permite listar os usuários")
  - (Constraint: UNIQUE(module, action))
- **Relacionamentos**:
  - `manyToMany` Profiles (via `profile_permissions`)

### 4. Tabela Pivô: `profile_permissions`

Relaciona quais permissões um perfil tem habilitado.

- **Campos**:
  - `profile_id` (FK)
  - `permission_id` (FK)
  - (Constraint: PRIMARY(profile_id, permission_id))

## Diagrama (Conceitual)

```text
User 1 -- N Profile
Profile N -- N Permission
```

## Regras de Estado

- Um usuário sem perfil, ao acessar, verá o dashboard vazio ou receberá mensagem de "Aguardando atribuição de Perfil".
- Excluir um perfil com usuários atrelados deve ser restrito ou setar a FK de perfil no usuário para nulo.
- Permissões são imutáveis em banco via seed (o código depende desses nomes hardcoded - "users", "create"), logo a tela de Perfis deve apenas LIGAR/DESLIGAR essas permissões a um perfil, e não permitir que o admin edite a tabela `permissions`.
