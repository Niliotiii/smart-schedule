# Implementation Plan: Senha Automática e Perfil do Usuário

**Branch**: `013-auto-password-profile` | **Date**: 2026-04-24 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/013-auto-password-profile/spec.md`

## Summary

Esta feature altera o fluxo de criação de usuários para gerar senhas automáticas seguras (removendo a necessidade do administrador definir uma senha) e adiciona uma página de perfil pessoal acessível via dropdown no topo direito, onde o usuário pode alterar sua própria senha. A sessão é invalidada após a alteração de senha por segurança.

## Technical Context

**Language/Version**: TypeScript ~6.0, Node.js 22+, AdonisJS 7.x
**Primary Dependencies**: AdonisJS Core, AdonisJS Auth (withAuthFinder + hash), AdonisJS Lucid, AdonisJS Inertia, AdonisJS Bouncer, VineJS, Vue 3.5, PrimeVue 4.5
**Storage**: PostgreSQL via AdonisJS Lucid ORM
**Testing**: Japa (AdonisJS test runner) + Playwright for e2e
**Target Platform**: Web browsers (desktop + mobile)
**Project Type**: Monolithic fullstack web service (AdonisJS + Inertia.js + Vue 3)
**Performance Goals**: Profile page load < 2s; password change endpoint < 1s response time
**Constraints**: UX deve ser "mobile-first" e acessível em no máximo 2 cliques; senha automática deve ter ≥12 caracteres com letras maiúsculas/minúsculas, números e especiais
**Scale/Scope**: Paróquia-scale (centenas de usuários); sem requisitos de alta disponibilidade

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

| Principle | Status | Justification |
|-----------|--------|---------------|
| I. Extensibilidade e Arquitetura Modular | PASS | Perfil e senha são conceitos genéricos; nenhuma regra hardcoded para "Acólitos" |
| II. Respeito à Disponibilidade e Capacidade | N/A | Não afeta escalonamento de voluntários |
| III. Simplicidade e Usabilidade | PASS | Acesso ao perfil em ≤2 cliques; senha automática evita fricção administrativa |
| IV. Confiabilidade e Tolerância a Falhas | PASS | Geração determinística de senha (crypto); fallback de validação em erros |
| V. Segurança e Privacidade | PASS | Senhas hashadas (bcrypt/argon2); sessão invalidada após mudança; acesso restrito ao próprio usuário |

## Project Structure

### Documentation (this feature)

```text
specs/013-auto-password-profile/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
app/
├── controllers/
│   ├── users_controller.ts          # MODIFIED — remove password fields do create/store
│   ├── account_controller.ts        # NEW — perfil pessoal + alteração de senha
│   └── profile_controller.ts        # EXISTING — API v1 (não alterar)
├── validators/
│   ├── user.ts                      # MODIFIED — remove password do createUserValidator
│   └── account.ts                   # NEW — validator para update de perfil + senha
└── models/user.ts                   # EXISTING — serializeAs: null já oculta senha

resources/js/
├── Pages/
│   └── Account/
│       └── Profile.vue              # NEW — página de perfil com aba de senha
├── Components/
│   └── AppTopbar.vue                # MODIFIED — tornar nome clicável com dropdown (Menu PrimeVue)
└── Composables/
    └── useAuth.ts                   # NEW (opcional) — helpers de autenticação no frontend

start/routes.ts                     # MODIFIED — adicionar rotas /account/*
```

**Structure Decision**: Monolito AdonisJS + Inertia.js. Nenhuma mudança estrutural é necessária. Criamos apenas os controllers, pages e validators necessários seguindo padrões existentes.

## Complexity Tracking

> No constitution violations detected. No complexity justification needed.

## Research (Phase 0)

See [research.md](./research.md) for detailed decisions on password generator, session invalidation, dropdown structure, and account controller architecture.

### Key Decisions

1. **Gerador de senha**: `crypto.randomBytes(16).toString('base64')` (~22 chars, high entropy, no extra deps)
2. **Sessão pós-alteração**: Invalidar e redirecionar para login (OWASP recommendation)
3. **Dropdown**: `Menu` do PrimeVue (nativo, já no projeto, acessível)
4. **Controller de conta**: `AccountController` separado, distinto do `ProfileController` (API v1) e `UsersController` (admin CRUD)

## Data Model (Phase 1)

See [data-model.md](./data-model.md). No schema changes required. Existing `users` table and `User` model already support:
- Hashing via `withAuthFinder`
- `serializeAs: null` on password column
- `AuthFinder.verifyCredentials()` for validation

## Contracts (Phase 1)

See [contracts/account-api.md](./contracts/account-api.md) for:
- `GET /account/profile` — Inertia page with user data
- `PUT /account/profile` — Update name, email, phone
- `PUT /account/password` — Change password (invalidates session → redirect to /login)
- `AppTopbar` dropdown menu items: Perfil, Sair

## Quickstart

See [quickstart.md](./quickstart.md) for step-by-step local testing instructions covering user creation with auto-password, profile access, and password change flow.
