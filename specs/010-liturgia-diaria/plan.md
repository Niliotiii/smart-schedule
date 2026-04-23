# Implementation Plan: Liturgia Diária no Dashboard

**Branch**: `010-liturgia-diaria` | **Date**: 2026-04-22 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/010-liturgia-diaria/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Consumir a API Liturgia Diária v2 (https://liturgia.up.railway.app/v2/) e exibir os dados litúrgicos no dashboard do Smart Schedule, com filtro por data (`now()` por padrão ou datepicker), cache de 24 horas via Redis, e layout de Cards Hierárquicos com seções expansíveis (accordions) para Primeira Leitura, Salmo e Evangelho. O card de liturgia será posicionado logo abaixo dos cards de acesso rápido existentes.

## Technical Context

**Language/Version**: TypeScript 6.x (strict), Node.js 22 LTS  
**Primary Dependencies**: AdonisJS 7.x (monolito), Inertia.js 2.x + Vue 3.5 + PrimeVue 4.x, Luxon 3.7, @adonisjs/lucid 22.x (ORM com PostgreSQL)  
**Storage**: PostgreSQL 15+ (apenas para dados de aplicação — as leituras litúrgicas são voláteis e ficam exclusivamente em Redis)  
**Testing**: `@japa/runner` + `@japa/plugin-adonisjs` + `@japa/api-client`; `playwright` para testes E2E  
**Target Platform**: Web (desktop + mobile até 768px); monolito AdonisJS servindo SPA via Inertia  
**Project Type**: web-service/monolito com SPA  
**Performance Goals**: Card de liturgia renderizado em <2s quando em cache Redis; <5s na primeira consulta à API externa. Cache hit 100% para datas já consumidas nas últimas 24h.  
**Constraints**: Sem biblioteca HTTP client pré-instalada — usar `fetch` nativo (Node 22). Sem driver Redis pré-configurado — instalar e configurar `ioredis`. Sem schema/cache previamente definido para liturgia. API externa sem autenticação.  
**Scale/Scope**: 1 chamada/dia no carregamento do dashboard por usuário ativo. Cache por data (DD-MM-YYYY). Até ~365 chaves TTL ativas por ano.

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

| Principle | Evaluation | Notes |
|-----------|------------|-------|
| **I. Extensibilidade e Arquitetura Modular** | PASS | Liturgia é um módulo puramente de consumo e exibição (Service + Controller + Component Vue). Não acopla regras de negócio a acólitos. Pode ser desabilitado/ignorado futuramente sem quebrar o core do sistema. |
| **II. Disponibilidade e Capacidade** | PASS | Cache Redis evita chamadas repetidas à API externa, reduzindo latência e carga. Não interfere no algoritmo de escalonamento. |
| **III. Simplicidade e Usabilidade** | PASS | Dashboard existente já é responsivo. Card hierárquico com accordions mantém layout compacto e escaneável. Datepicker PrimeVue nativo. |
| **IV. Confiabilidade e Tolerância a Falhas** | PASS | Cache Redis + fallback silencioso em caso de falha na API externa (card pode exibir estado vazio/erro sem quebrar o dashboard). |
| **V. Segurança e Privacidade** | PASS | API externa pública, sem dados sensíveis do sistema. Sem persistência em banco relacional. Apenas usuários autenticados veem o dashboard, logo o card é protegido pelo middleware de auth existente. |

**Verdict**: All gates pass. Proceed to Phase 0.

## Project Structure

### Documentation (this feature)

```text
specs/010-liturgia-diaria/
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
├── services/
│   └── liturgia_diaria_service.ts   # Consumo da API externa + cache Redis
├── controllers/
│   └── dashboard_controller.ts       # Ação Index ajustada — popula liturgia via shared props
├── models/
│   └── nenhum (dados não persistem no banco)
├── validators/
│   └── liturgia_diaria.ts            # Validador para query params opcionais (dia, mes, ano)
│
config/
├── cache.ts                          # Configuração do Redis / cache driver (novo)

resources/js/
├── PAGES/
│   └── Dashboard/
│       └── Index.vue                  # Adicionar card de liturgia abaixo dos cards de acesso rápido
│   └── Liturgia/
│       └── Card.vue                   # Componente isolado: título, resumo, accordions, datepicker
├── lib/
│   └── liturgia.ts                    # Types/Interfaces da API externa (DTOs para TypeScript)
│
tests/
├── unit/services/liturgia_diaria_service.spec.ts  # Testes do service (mock de fetch + Redis stub)
└── integration/liturgia_diaria_api.spec.ts        # Testes contrato da API externa (resposta esperada)
```

**Structure Decision**: Monolito AdonisJS com SPA Inertia/Vue. Backend: service + controller + validator. Frontend: novo componente Vue (`Liturgia/Card.vue`) integrado à `Dashboard/Index.vue`. Cache externo: Redis via config dedicada. Testes unitários no service e integração com a API real para validar contrato.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|--------------------------------------|
| Redis extra (além de PostgreSQL) | Especificação obriga cache de 24h. Sem persistência em banco, a única alternativa seria cache em memória (volátil entre deploys) ou chamada direta toda vez (quebraria os SC de performance <2s). | In-memory cache com Map — não sobrevive a reinício do processo e não escala se houver múltiplas instâncias. |

