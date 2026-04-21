# Implementation Plan: Alternância de Tema Claro/Escuro

**Branch**: `003-dark-light-theme` | **Date**: 2026-04-20 | **Spec**: [003-dark-light-theme/spec.md](spec.md)
**Input**: Feature specification from `/specs/003-dark-light-theme/spec.md`

## Summary

Implementar alternância de tema claro/escuro usando Tailwind CSS v4 com estratégia de classe (`dark:`), persistindo a preferência via localStorage e respeitando a preferência do sistema operacional (`prefers-color-scheme`). Todas as views Edge existentes receberão variantes dark, um botão de alternância será adicionado à navbar, e a tela de login também suportará temas.

## Technical Context

**Language/Version**: TypeScript / Node.js 24 / AdonisJS 6
**Primary Dependencies**: AdonisJS 6 (Lucid ORM, Auth Session, Edge.js), Tailwind CSS v4 (via `@tailwindcss/vite`), Edge.js templates (SSR)
**Storage**: PostgreSQL (dados) + localStorage (preferência de tema, client-side)
**Testing**: Japa (Test runner do AdonisJS)
**Target Platform**: Navegadores Desktop e Mobile
**Project Type**: Web Application (Monolito com SSR via Edge)
**Performance Goals**: Tema aplicado instantaneamente sem flash (FOUC prevention via inline script em `<head>`)
**Constraints**: Tailwind CSS v4 usa configuração via CSS (`@custom-variant`), não via `tailwind.config.js`
**Scale/Scope**: Todas as páginas do painel administrativo + tela de login

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

- [x] **I. Extensibilidade**: A alternância de tema é genérica e não acoplada a nenhuma pastoral específica.
- [x] **II. Respeito à Disponibilidade e III. Simplicidade**: Um único botão na navbar para alternância — intuitivo e acessível.
- [x] **V. Segurança**: Preferência de tema é client-side (localStorage), sem impacto em dados sensíveis.
- [x] **Tecnologias**: Mantém a arquitetura monolito AdonisJS com Edge.js, usando apenas CSS nativo do Tailwind v4.

## Project Structure

### Documentation (this feature)

```text
specs/003-dark-light-theme/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output (N/A — no DB changes)
├── quickstart.md        # Phase 1 output
└── tasks.md             # Phase 2 output (to be generated)
```

### Source Code (repository root)

```text
/
├── resources/
│   ├── css/
│   │   └── app.css                # Adicionar @custom-variant dark e classes dark
│   ├── js/
│   │   └── app.js                 # Adicionar lógica de tema (toggle, persist, system detect)
│   └── views/
│       ├── auth/
│       │   └── login.edge         # Adicionar classes dark
│       ├── components/
│       │   ├── navbar.edge        # Adicionar botão de tema + classes dark
│       │   ├── sidebar.edge       # Adicionar classes dark
│       │   ├── icon.edge          # Adicionar ícones sun/moon
│       │   ├── pagination.edge   # Adicionar classes dark (se usado)
│       │   └── action_button.edge # Adicionar classes dark
│       ├── dashboard/
│       │   └── index.edge         # Adicionar classes dark + script de tema
│       ├── users/
│       │   ├── index.edge         # Adicionar classes dark + script de tema
│       │   ├── form.edge          # Adicionar classes dark + script de tema
│       │   └── show.edge          # Adicionar classes dark + script de tema
│       └── profiles/
│           ├── index.edge          # Adicionar classes dark + script de tema
│           ├── form.edge           # Adicionar classes dark + script de tema
│           └── show.edge           # Adicionar classes dark + script de tema
└── tests/
    └── functional/
        └── theme_toggle.spec.ts    # Testes funcionais (opcional)
```

**Structure Decision**: Mantém estrutura existente. Todas as mudanças são em recursos front-end (CSS, JS, Edge templates). Não há mudanças no backend (controllers, models, routes).

## Complexity Tracking

> Nenhuma violação da constituição. Nenhuma justificativa de complexidade necessária.
