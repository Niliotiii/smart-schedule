# Quickstart: Church Registration

**Date**: 2026-04-21 | **Plan**: [plan.md](./plan.md)

---

## Setup Commands

### 1. Prepare reference data files

Ensure the following static data files exist in `database/data/` (populated from IBGE CSV):

```text
database/data/
├── countries.ts   # ~250 rows
├── states.ts      # ~27 rows
└── cities.ts      # ~5,557 rows
```

### 2. Run migrations

```bash
node ace migration:run
```

Migrations include:
1. New tables: `countries`, `states`, `cities`, `addresses`, `churches` (all with `deleted_at` at creation).
2. Alter existing tables: `users`, `profiles`, `user_types` — add `deleted_at` column for soft delete.

### 3. Seed reference data

```bash
node ace db:seed --files="database/seeders/country_seeder.ts"
node ace db:seed --files="database/seeders/state_seeder.ts"
node ace db:seed --files="database/seeders/city_seeder.ts"
```

Or seed all at once (if `database_seeder.ts` is updated to include them):

```bash
node ace db:seed
```

### 4. Register Bouncer abilities + menu item

- Add `churchesRead`, `churchesCreate`, `churchesUpdate`, `churchesDelete` to `app/abilities/main.ts`.
- Add `"Igrejas"` link to `AppMenu.vue`.

### 5. Start application

```bash
npm run dev
```

---

## Integration Scenarios

### Local development (no external CEP/geolocation)

- Disable or mock external API calls via test environment variable.
- All address fields can be entered manually; CEP lookup returns a no-op or mock result.

### Production with external services

- ViaCEP and Nominatim use the real internet; set `USER_AGENT` env for Nominatim.
- If Correios ConectaGov credentials are provided, configure them in `config/cep.ts`.
- Ensure outbound HTTPS is allowed to `viacep.com.br` and `nominatim.openstreetmap.org`.

---

## Verification Steps

1. Navigate to `/churches` → see empty list.
2. Click "Nova Igreja" → form opens with Info + Endereco tabs.
3. Enter valid CEP (e.g., `01001-000`) → address auto-fills.
4. Switch state → city dropdown filters.
5. Save → record appears in list with lat/lng populated (after Nominatim resolves).
6. Edit → change address, re-save, verify lat/lng updated.
