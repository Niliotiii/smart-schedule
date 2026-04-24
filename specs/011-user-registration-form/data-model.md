# Data Model: Cadastro Completo de Usuários

**Date**: 2026-04-23
**Feature**: specs/011-user-registration-form

## Entity Overview

```text
User ||--o{ Sacrament : has_many
User ||--o{ Address : has_one (polymorphic)
User }o--|| UserType : belongs_to
User }o--|| Profile : belongs_to
User }o--o{ MinistryRole : many_to_many
User }o--|| Country : birth_country
User }o--|| State : birth_state
User }o--|| City : birth_city
Sacrament }o--|| Church : received_at
Sacrament }o--|| SacType : sac_type
Sacrament }o--|| Country : received_country
Sacrament }o--|| State : received_state
Sacrament }o--|| City : received_city
```

---

## User (Expanded)

**Table**: `users` (existing table extended via migration)

| Field | Type | Nullable | Description |
|-------|------|----------|-------------|
| `id` | PK | no | Primary key |
| `fullName` | string | **no** | Nome completo |
| `birthDate` | date | **no** | Data de nascimento |
| `birthCountryId` | FK → countries | **no** | País de naturalidade |
| `birthStateId` | FK → states | **no** | Estado de naturalidade |
| `birthCityId` | FK → cities | **no** | Cidade de naturalidade |
| `phone` | string(20) | **no** | Telefone principal |
| `email` | string(254) | yes | E-mail |
| `responsible1Name` | string(255) | yes | Nome do responsável 1 |
| `responsible1Phone` | string(20) | yes | Telefone do responsável 1 |
| `responsible2Name` | string(255) | yes | Nome do responsável 2 |
| `responsible2Phone` | string(20) | yes | Telefone do responsável 2 |
| `profileId` | FK → profiles | **no** | Perfil (RBAC) |
| `userTypeId` | FK → user_types | **no** | Tipo de usuário |
| `includeInScale` | boolean | **no** | Incluir na escala? (default: false) |
| `communityId` | FK → churches | **no** | Comunidade que participa |
| `password` | string | no | Senha de acesso |
| `createdAt` | timestamp | no | - |
| `updatedAt` | timestamp | yes | - |
| `deletedAt` | timestamp | yes | Soft-delete |

**Relationships**:
- `belongsTo(() => Profile)`
- `belongsTo(() => UserType)`
- `belongsTo(() => Country, { foreignKey: 'birthCountryId' })`
- `belongsTo(() => State, { foreignKey: 'birthStateId' })`
- `belongsTo(() => City, { foreignKey: 'birthCityId' })`
- `hasOne(() => Address)` (polymorphic)
- `hasMany(() => Sacrament)`
- `manyToMany(() => MinistryRole)` (pivot: `ministry_role_user`)

---

## Address (Reused)

**Table**: `addresses` (existing polymorphic table)

| Field | Type | Nullable | Description |
|-------|------|----------|-------------|
| `id` | PK | no | Primary key |
| `addressableId` | integer | no | FK polimórfica |
| `addressableType` | string(255) | no | Valor: `'User'` |
| `postalCode` | string(20) | **no** | CEP |
| `countryId` | FK → countries | **no** | País |
| `stateId` | FK → states | no | Estado |
| `cityId` | FK → cities | no | Cidade |
| `neighborhood` | string(150) | **no** | Bairro |
| `street` | string(255) | **no** | Rua |
| `number` | string(50) | **no** | Número |
| `complement` | string(255) | yes | Complemento |
| `latitude` | decimal(10,8) | yes | Latitude |
| `longitude` | decimal(11,8) | yes | Longitude |

**Validation Rules**:
- CEP deve conter 8 dígitos (formato validado via serviço de consulta externa opcional).
- Country, State, City devem corresponder às entidades catalogadas no sistema.
- Se Country != Brasil, CEP optional.

---

## Sacrament

**Table**: `sacraments` (new migration)

| Field | Type | Nullable | Description |
|-------|------|----------|-------------|
| `id` | PK | no | Primary key |
| `userId` | FK → users | **no** | Usuário vinculado |
| `sacramentTypeId` | FK → sacrament_types | **no** | Tipo de sacramento |
| `receivedDate` | date | **no** | Data que recebeu |
| `receivedChurch` | string(255) | **no** | Igreja que recebeu (campo livre) |
| `receivedCountryId` | FK → countries | **no** | País onde recebeu |
| `receivedStateId` | FK → states | **no** | Estado onde recebeu |
| `receivedCityId` | FK → cities | **no** | Cidade onde recebeu |
| `createdAt` | timestamp | no | - |
| `updatedAt` | timestamp | yes | - |
| `deletedAt` | timestamp | yes | Soft-delete |

---

## SacramentType (Catalog)

**Table**: `sacrament_types` (new migration)

| Field | Type | Nullable | Description |
|-------|------|----------|-------------|
| `id` | PK | no | Primary key |
| `name` | string(100) | **no** | Nome do sacramento |
| `description` | text | yes | Descrição |
| `createdAt` | timestamp | no | - |
| `updatedAt` | timestamp | yes | - |

**Initial Seed Data**: Batismo, Primeira Eucaristia, Crisma.

---

## MinistryRoleUser (Pivot)

**Table**: `ministry_role_user` (new migration)

| Field | Type | Nullable | Description |
|-------|------|----------|-------------|
| `id` | PK | no | Primary key |
| `userId` | FK → users | no | - |
| `ministryRoleId` | FK → ministry_roles | no | - |
| `createdAt` | timestamp | no | - |
| `updatedAt` | timestamp | no | - |

**Constraints**: Composite unique index on (`userId`, `ministryRoleId`).

**Relationships**:
- `User.manyToMany(() => MinistryRole, { pivotTable: 'ministry_role_user' })`
- `MinistryRole.manyToMany(() => User, { pivotTable: 'ministry_role_user' })`

---

## Validation Rules Summary

| Entity | Rule |
|--------|------|
| User | `fullName` required, max 255 chars |
| User | `birthDate` required, must be a past date |
| User | `birthCountryId`, `birthStateId`, `birthCityId` required, must exist in catalog tables |
| User | `phone` required, min 10 digits |
| User | `email` optional, must be valid email format |
| User | `profileId`, `userTypeId` required, must exist in respective tables |
| User | `communityId` required when saving sacraments tab |
| User | `includeInScale` required boolean |
| Address | `postalCode` required if country is Brasil, 8 digits |
| Address | `countryId`, `stateId`, `cityId`, `neighborhood`, `street`, `number` required |
| Sacrament | `sacramentTypeId`, `receivedDate`, `receivedChurch`, `receivedCountryId`, `receivedStateId`, `receivedCityId` all required |
| Sacrament | `receivedDate` must be past date |

## State Transitions

Nenhuma máquina de estado complexa. O cadastro segue fluxo linear:
1. Rascunho preenchido → Submit → Validação global → Persistência.
2. Em edição: dados existentes carregados nas abas → Submit → Validação → Atualização.
