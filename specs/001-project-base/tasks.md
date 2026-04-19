# Implementation Tasks: Project Foundation

**Branch**: `001-project-base`
**Status**: Draft

## Implementation Strategy

This feature will be implemented in phases aligned with the user stories.
The MVP consists of the basic application scaffolding and Docker orchestration.

- **Phase 1 & 2**: Create the AdonisJS boilerplate and configure Docker.
- **Phase 3**: Ensure database connectivity and configuration.
- **Phase 4**: Polish documentation and scripts.

---

## Phase 1: Setup & Project Initialization

*Goal: Establish the base repository structure and tooling.*

- [x] T001 Initialize AdonisJS project in current directory `npm create adonisjs@latest --here` (Configure with Web/API starter, Lucille ORM, and PostgreSQL driver)
- [x] T002 Update `package.json` scripts if necessary for Docker environments

---

## Phase 2: Foundational/Blocking

*Goal: Core infrastructure that all user stories depend on.*

- [x] T003 Create `Dockerfile` for the AdonisJS application
- [x] T004 Create `docker-compose.yml` defining the `app` service and the `postgres` service
- [x] T005 [US1] Create `.env.example` mapping the required AdonisJS and PostgreSQL variables
- [x] T006 [P] [US1] Add a health check route in `start/routes.ts` returning a simple JSON response for testing the web server

---

## Phase 4: User Story 2 - Database Connectivity

*Goal: Como um desenvolvedor, quero que a aplicação web já esteja previamente configurada para se comunicar com o banco de dados local provisionado, para que eu possa focar na criação de tabelas e modelos em vez de configuração de infraestrutura.*
*Independent Test: Run a migration via Ace inside the container successfully.*

- [x] T007 [US2] Configure `config/database.ts` to read connection parameters from the Docker environment variables
- [x] T008 [US2] Create an initial test migration (e.g., `node ace make:migration verify_connection`) just to validate the connection

---

## Phase 5: Polish & Cross-Cutting Concerns

*Goal: Finalize documentation and ensure developer experience.*

- [x] T009 [P] Update `README.md` with instructions from `specs/001-project-base/quickstart.md`
- [x] T010 Validate the setup by running `docker compose up -d` and `docker compose exec app node ace migration:run`

---

## Dependencies

- Phase 2 (Docker) depends on Phase 1 (AdonisJS scaffolding)
- Phase 3 (Env & Routes) depends on Phase 2 (Docker structure)
- Phase 4 (Database Connection) depends on Phase 3
- Phase 5 (Polish) depends on all functional phases

### Parallel Execution Examples

- While T003 (Dockerfile) is being worked on, T004 (Docker Compose) can be drafted conceptually.
- T006 (Routes) and T005 (.env.example) can be developed in parallel once the base project exists.
- T009 (README) can be updated independently of the database connection tasks.