# Implementation Plan: Auth, RBAC & Dashboard

**Branch**: `002-auth-rbac-dashboard` | **Date**: 2026-04-19 | **Spec**: [002-auth-rbac-dashboard/spec.md](spec.md)
**Input**: Feature specification from `/specs/002-auth-rbac-dashboard/spec.md`

## Summary

Implementar a camada de autenticação (Email/Senha), um Dashboard base com layout responsivo (sidebar desktop, hambúrguer mobile) e as telas CRUD de Usuários e Perfis baseadas em controle de acesso granular (RBAC). A interface deve padronizar a listagem e os botões de ações através do uso de views Edge.

## Technical Context

**Language/Version**: TypeScript / Node.js 24 / AdonisJS 6
**Primary Dependencies**: AdonisJS 6 (Lucid ORM, Auth Session, Edge.js) + [NEEDS CLARIFICATION: Qual framework CSS/UI utilizar para a interface administrativa e botões com ícones? TailwindCSS + ícones SVG?]
**Storage**: PostgreSQL
**Testing**: Japa (Test runner do AdonisJS)
**Target Platform**: Navegadores Desktop e Mobile
**Project Type**: Web Application (Monolito com SSR via Edge)
**Performance Goals**: Tempo de resposta do servidor HTML em < 200ms; Interações rápidas via views limpas.
**Constraints**: Módulo de Permissões (RBAC) amarrado dinamicamente com as rotas/Ações (Middleware/Bouncer).
**Scale/Scope**: Painel Administrativo multi-pastoral.

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

- [x] **I. Extensibilidade**: O uso do sistema RBAC amarra permissões a "Módulos" genéricos que futuramente abrigarão os módulos pastorais.
- [x] **II. Respeito à Disponibilidade e III. Simplicidade**: Interfaces simples, paginadas e padronizadas respeitando a diretiva de ser "intuitivo" e "responsivo (mobile-first)".
- [x] **V. Segurança**: Usuários sem perfil adequado ou sem login serão negados pelas travas do sistema de autenticação / RBAC no nível do servidor (Server Side Rendering).
- [x] **Tecnologias**: Continua mantendo a arquitetura proposta (Monolito com AdonisJS servindo HTML).

## Project Structure

### Documentation (this feature)

```text
specs/002-auth-rbac-dashboard/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
└── tasks.md             # Phase 2 output (to be generated)
```

### Source Code (repository root)

```text
/
├── app/
│   ├── Controllers/      # AuthController, DashboardController, UsersController, ProfilesController
│   ├── Middleware/       # AuthMiddleware, AclMiddleware (RBAC)
│   ├── Models/           # User, Profile, Permission, ProfilePermission
│   └── Services/         # Auth, RBAC validations
├── database/
│   ├── migrations/       # Criação das tabelas para RBAC e ajustes de User
│   └── seeders/          # Inicialização de Permissões e Perfil Admin padrão
├── resources/
│   └── views/
│       ├── layouts/      # App layout (sidebar, navbar responsivo)
│       ├── components/   # Botões padronizados, paginação, ícones
│       ├── auth/         # Tela de Login
│       ├── dashboard/    # Index do painel
│       ├── users/        # Index, Form, Show
│       └── profiles/     # Index, Form (com checkbox de permissões), Show
└── start/
    └── routes.ts         # Agrupamento e proteção de rotas por ACL
```

**Structure Decision**: Seguiremos a arquitetura nativa do AdonisJS. Componentizaremos pequenos fragmentos HTML em components do Edge (como a Sidebar, botões de ação e paginação) para garantir o design e simplificar as views dos CRUDs.

## Complexity Tracking

> Nenhuma violação da constituição. Nenhuma justificativa de complexidade necessária.
