# Quickstart: Month Schedule Opening

**Date**: 2026-05-02
**Purpose**: How to set up, run, and test this feature locally.

## Prerequisites

- Node.js ~20+
- PostgreSQL running (configured in `.env`)
- Existing project dependencies installed (`npm install`)

## Database Setup

1. Run the migrations for this feature:
   ```bash
   node ace migration:run
   ```

   New migrations created by this feature:
   - `database/migrations/014_create_opened_months_table.ts`
   - `database/migrations/014_create_schedules_table.ts`
   - `database/migrations/014_create_schedule_roles_table.ts`
   - `database/migrations/014_create_availability_signals_table.ts`

2. (Optional) Seed test data:
   ```bash
   node ace db:seed
   ```

## Running the Application

1. Start the dev server:
   ```bash
   npm run dev
   ```

2. The application will be available at `http://localhost:3333` (or the port configured in `.env`).

## Testing

### Unit and Integration Tests

```bash
npm test
```

Tests are organized under:
- `tests/unit/services/schedule_service.spec.ts`
- `tests/integration/controllers/schedule_months_controller.spec.ts`
- `tests/integration/controllers/availability_signals_controller.spec.ts`

### Browser (E2E) Tests

```bash
npx playwright test tests/browser/schedule_signaling.spec.ts
```

## Feature-Specific URLs

Once running, the feature is accessible at:

| Role | URL | Description |
| ---- | --- | ----------- |
| Admin | `/schedules/months/create` | Open a month and create schedules |
| Admin | `/schedules/months/:id/edit` | Edit/delete schedules |
| User | `/schedules/months/:id/signal` | Signal availability |
| All | `/schedules/months` | List opened months |

## Development Workflow

1. Check out the feature branch:
   ```bash
   git checkout 014-month-schedule-opening
   ```

2. Make changes to models, controllers, or Vue components.

3. Run type checking:
   ```bash
   npm run typecheck
   ```

4. Run linting:
   ```bash
   npm run lint
   ```

5. Run tests:
   ```bash
   npm test
   ```

6. Start the dev server to verify UI changes:
   ```bash
   npm run dev
   ```
