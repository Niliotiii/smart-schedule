# Phase 0: Outline & Research

**Feature**: Liturgia Diária no Dashboard
**Date**: 2026-04-22
**Plan**: [plan.md](plan.md)

## Research Areas & Decisions

### 1. Redis / Cache Driver for AdonisJS 7

**Question**: Como implementar cache Redis em AdonisJS 7?

**Findings**:
- AdonisJS 7 nao possui driver Redis/cache built-in no monolito padrao.
- O ecossistema usa `ioredis` como driver recomendado.
- Alternativas: `adonisjs-cache` (rejeitada - desatualizada); `keyv` (rejeitada - sem valor agregado).

**Decision**: Usar `ioredis` diretamente no service, encapsulando `GET`/`SETEX` com TTL de 24h.

**Rationale**: Simplicidade, menos abstracoes, controle total.

---

### 2. API Liturgia Diaria v2 - Contrato

**Endpoint**: `https://liturgia.up.railway.app/v2/`
- Default: `GET /v2/` (hoje)
- Especifica: `GET /v2/?dia={dia}&mes={mes}&ano={ano}`

**Resposta 200**:
```json
{
  "data": "2026-04-22",
  "liturgia": "4a feira da 3a Semana da Pascoa",
  "cor": "Branco",
  "oracoes": { "coleta": "...", "oferendas": "...", "comunhao": "...", "extras": [] },
  "leituras": {
    "primeiraLeitura": [{ "tema": "...", "referencia": "...", "texto": "..." }],
    "salmo": [{ "tema": "...", "referencia": "...", "texto": "..." }],
    "segundaLeitura": [],
    "evangelho": [{ "tema": "...", "referencia": "...", "texto": "..." }],
    "extras": []
  },
  "antifonas": { "entrada": "...", "comunhao": "..." }
}
```

**Resposta 404**: `{ "erro": "Data nao encontrada", "data": "..." }`

**Edge cases**:
1. API offline/timeout -> retornar null (estado vazio no card).
2. Data nao publicada (404) -> mensagem amigavel.
3. `segundaLeitura` pode ser vazio.
4. Cores: Verde, Vermelho, Roxo, Rosa, Branco.

**Decision**: Timeout via `AbortController` (3000ms). Em erro/timeout/404, logar e retornar `null`.

---

### 3. Accordion PrimeVue v4

**Findings**: PrimeVue 4 tem `<Accordion>` com `<AccordionPanel>`, `<AccordionHeader>`, `<AccordionContent>`.

**Decision**: Usar `<Accordion :multiple="true">` para permitir multiplas secoes abertas.

---

### 4. Datepicker

**Decision**: `<Calendar>` do PrimeVue 4 com `dateFormat="dd/mm/yy"`.

---

### 5. Passagem de Dados via Inertia

**Decision**: Controller do dashboard busca liturgia e passa como prop `liturgia` na renderizacao Inertia.

---

### 6. Mapeamento de Cor Liturgica

| Cor       | Tailwind class / Hex |
|-----------|----------------------|
| Verde     | bg-green-700         |
| Vermelho  | bg-red-700           |
| Roxo      | bg-purple-700        |
| Rosa      | bg-pink-700          |
| Branco    | bg-gray-100 (dark text) |

---

### 7. Cache Key

**Formato**: `liturgia:DD-MM-YYYY`
**TTL**: 86400 segundos (24h)

---

### 8. Redis Provider

**Decision**: Criar `providers/redis_provider.ts` registrando singleton IoC via `ioredis`. Segue padrao AdonisJS 7 e permite mocking.

---

## Decisions Summary

| # | Decision | Files |
|---|----------|-------|
| 1 | ioredis via provider | providers/redis_provider.ts, app/services/liturgia_diaria_service.ts |
| 2 | AbortController 3000ms | app/services/liturgia_diaria_service.ts |
| 3 | null em falha | liturgia_diaria_service.ts, Dashboard/Index.vue |
| 4 | Accordion :multiple=true | resources/js/Pages/Liturgia/Card.vue |
| 5 | Calendar dd/mm/yy | resources/js/Pages/Liturgia/Card.vue |
| 6 | Passar via Inertia props | Controller, Dashboard/Index.vue |
| 7 | Mapeamento estatico | resources/js/Pages/Liturgia/Card.vue |
| 8 | Chave liturgia:DD-MM-YYYY | app/services/liturgia_diaria_service.ts |
