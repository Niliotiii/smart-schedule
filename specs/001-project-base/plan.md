# Implementation Plan: Project Foundation

**Branch**: `001-project-base` | **Date**: 2026-04-19 | **Spec**: [001-project-base/spec.md](spec.md)
**Input**: Feature specification from `/specs/001-project-base/spec.md`

## Summary

Construir a infraestrutura básica do projeto utilizando AdonisJS como um framework monolítico e provisionar o ambiente (aplicação e banco de dados PostgreSQL) utilizando Docker. Essa base permitirá o desenvolvimento focado em regras de negócio sem fricção com setup local.

## Technical Context

**Language/Version**: TypeScript / Node.js (compatível com AdonisJS v6)
**Primary Dependencies**: AdonisJS v6, Docker, Docker Compose
**Storage**: PostgreSQL (via Lucide/AdonisJS ORM)
**Testing**: Japa (Test runner padrão do AdonisJS)
**Target Platform**: Container Linux (Docker) local e em nuvem
**Project Type**: Web Application (Monolito)
**Performance Goals**: Inicialização do container em < 5 minutos; Resposta local em < 200ms
**Constraints**: O ambiente local deve rodar estritamente via Docker, sem necessidade de instalação local de BD ou Node (além do npm para scaffolds se necessário, mas o projeto em si rodará no container).
**Scale/Scope**: Ambiente de desenvolvimento para N desenvolvedores.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **I. Extensibilidade**: A base AdonisJS e PostgreSQL suporta o crescimento para múltiplas pastorais.
- [x] **V. Segurança**: O uso de containers garante isolamento e as variáveis de ambiente protegerão credenciais.
- [x] **Tecnologias e Arquitetura**: Respeita a exigência da constituição de utilizar arquitetura de Monolito com AdonisJS.

## Project Structure

### Documentation (this feature)

```text
specs/001-project-base/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
└── tasks.md             # Phase 2 output (to be generated)
```

### Source Code (repository root)

```text
/
├── app/                  # Controllers, Models, Services (AdonisJS standard)
├── config/               # Configurações do framework e banco
├── database/             # Migrations e seeders
├── start/                # Rotas e eventos
├── tests/                # Testes unitários e de integração (Japa)
├── docker-compose.yml    # Orquestração de containers (App + DB)
├── Dockerfile            # Imagem da aplicação
└── package.json          # Dependências
```

**Structure Decision**: O projeto seguirá a estrutura padrão imposta pelo comando `npm create adonisjs@latest`, que já é otimizada para o padrão MVC/Monolito. A raiz do repositório abrigará o projeto web, adicionando na raiz os arquivos de orquestração Docker (`docker-compose.yml`, `Dockerfile`).

## Complexity Tracking

> Nenhuma violação da constituição. Nenhuma justificativa de complexidade necessária.