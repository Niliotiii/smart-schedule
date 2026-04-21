# Data Model: Church Registration

**Date**: 2026-04-21
**Plan**: [plan.md](./plan.md) | **Spec**: [spec.md](./spec.md)

---

## Entity Overview

| Entity    | Purpose                                              | Pre-populated |
| --------- | ---------------------------------------------------- | ------------- |
| Country   | Reference list of sovereign nations                    | YES — seeders |
| State     | Brazilian federative units (UFs) from IBGE           | YES — seeders |
| City      | Brazilian municipalities from IBGE                   | YES — seeders |
| Address   | Polymorphic, reusable physical address record        | NO — user-created |
| Church    | A religious community, linked to one Address         | NO — user-created |

---

## Entity Definitions

### Country

```text
- id (PK, serial)
- code (varchar(2), ISO 3166-1 alpha-2, unique) — e.g., "BR"
- name (varchar(100), not null) — e.g., "Brazil"
- created_at (timestamp)
- updated_at (timestamp)
```

**Relationships**: hasMany State, hasMany City

**Constraints**: `code` unique index. Default in UI dropdown is Brazil.

---

### State

```text
- id (PK, serial)
- country_id (FK → countries.id, not null)
- ibge_code (integer, unique) — e.g., 11 for Rondônia
- uf (varchar(2), unique) — e.g., "RO"
- name (varchar(100), not null) — e.g., "Rondônia"
- created_at (timestamp)
- updated_at (timestamp)
```

**Relationships**: belongsTo Country, hasMany City

**Constraints**: `uf` unique index. `country_id` indexed.

---

### City

```text
- id (PK, serial)
- state_id (FK → states.id, not null)
- ibge_code (integer, unique) — e.g., 1100015
- name (varchar(150), not null) — e.g., "Alta Floresta D'Oeste"
- created_at (timestamp)
- updated_at (timestamp)
```

**Relationships**: belongsTo State

**Constraints**: `state_id` indexed. `ibge_code` unique index.

---

### Address

```text
- id (PK, serial)
- addressable_id (integer, not null)
- addressable_type (varchar(255), not null)
- postal_code (varchar(20), not null) — CEP or postal code
- country_id (FK → countries.id, not null)
- state_id (FK → states.id, nullable)
- city_id (FK → cities.id, nullable)
- neighborhood (varchar(150), not null)
- street (varchar(255), not null)
- number (varchar(50), not null)
- complement (varchar(255), nullable)
- latitude (decimal(10, 8), nullable)
- longitude (decimal(11, 8), nullable)
- created_at (timestamp)
- updated_at (timestamp)
```

**Relationships**:
- morphTo `addressable` (polymorphic — currently Church)
- belongsTo Country, State, City

**Constraints**:
- Composite index on `(addressable_type, addressable_id)`
- Foreign keys on `country_id`, `state_id`, `city_id`

**Validation Rules**:
- `postal_code`, `country_id`, `neighborhood`, `street`, `number` are mandatory.
- `state_id` and `city_id` are nullable to support non-Brazilian addresses where IBGE data may not exist.
- `latitude` / `longitude` between valid geographic ranges.

---

### Church

```text
- id (PK, serial)
- name (varchar(255), not null)
- created_at (timestamp)
- updated_at (timestamp)
```

**Relationships**:
- morphOne `address` → Address (via `addressable`)

**Validation Rules**:
- `name` mandatory, max 255 characters, unique per organization context (or globally unique for MVP).
- Deleting a Church must cascade-delete its linked Address record (or set up a model hook).

---

## Polymorphic Address Relationship

The `addresses` table stores a single normalized address that belongs to an entity. The `(addressable_id, addressable_type)` pair determines the owner.

**Currently**: only `Church` owns an address.

**Future expansion**: `Event`, `Organization`, or `User` can link to `Address` by adding:

```ts
@morphOne(() => Address, { name: 'addressable' })
declare address: MorphOne<typeof Address>
```

No schema changes required.

---

## Migrations Order

1. `create_countries_table`
2. `create_states_table`
3. `create_cities_table`
4. `create_addresses_table`
5. `create_churches_table`

---

## Seeders

| Seeder        | Rows  | Method                           |
| ------------- | ----- | -------------------------------- |
| CountrySeeder | ~250  | `Country.createMany(array)`      |
| StateSeeder   | ~27   | `State.createMany(array)`        |
| CitySeeder    | ~5,557| `db.insertQuery().multiInsert(...)` for performance |

Data arrays live in:
- `database/data/countries.ts`
- `database/data/states.ts`
- `database/data/cities.ts`

```
npm run db:seed
```
