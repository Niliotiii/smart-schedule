# Data Model: Liturgia Diária no Dashboard

**Date**: 2026-04-22
**Plan**: [plan.md](plan.md)
**Spec**: [spec.md](spec.md)

## Overview

Este feature **não persiste dados no banco relacional** (PostgreSQL). Todos os dados litúrgicos são voláteis e vêm de uma API externa. A única camada de persistência é o **cache Redis**, com chave baseada na data consultada e TTL de 24 horas.

## Entities

### Liturgia (DTO — Data Transfer Object)

Representa a resposta da API externa. Não é um model Lucid.

| Field | Type | Nullable | Description |
|-------|------|----------|-------------|
| `data` | `string` (date) | No | Data da liturgia no formato `YYYY-MM-DD` |
| `liturgia` | `string` | No | Título do dia litúrgico (ex: "4ª feira da 3ª Semana da Páscoa") |
| `cor` | `string` | No | Cor litúrgica: `Verde`, `Vermelho`, `Roxo`, `Rosa`, `Branco` |
| `oracoes` | `Oracoes` | No | Orações do dia |
| `leituras` | `Leituras` | No | Conjunto de leituras |
| `antifonas` | `Antifonas` | No | Antífonas de entrada e comunhão |

#### Oracoes

| Field | Type | Nullable | Description |
|-------|------|----------|-------------|
| `coleta` | `string` | Yes | Oração de coleta |
| `oferendas` | `string` | Yes | Oração sobre as oferendas |
| `comunhao` | `string` | Yes | Oração após a comunhão |
| `extras` | `string[]` | Yes | Orações extras (se houver) |

#### Leituras

| Field | Type | Nullable | Description |
|-------|------|----------|-------------|
| `primeiraLeitura` | `Leitura[]` | Yes | Primeira leitura |
| `salmo` | `Leitura[]` | Yes | Salmo responsorial |
| `segundaLeitura` | `Leitura[]` | Yes | Segunda leitura (domingos e solenidades) |
| `evangelho` | `Leitura[]` | Yes | Evangelho do dia |
| `extras` | `Leitura[]` | Yes | Leituras extras |

#### Leitura

| Field | Type | Nullable | Description |
|-------|------|----------|-------------|
| `tema` | `string` | Yes | Tema/título da leitura |
| `referencia` | `string` | Yes | Referência bíblica (ex: "João 6,1-15") |
| `texto` | `string` | Yes | Texto completo da leitura |

#### Antifonas

| Field | Type | Nullable | Description |
|-------|------|----------|-------------|
| `entrada` | `string` | Yes | Antífona de entrada |
| `comunhao` | `string` | Yes | Antífona da comunhão |

---

### LiturgiaCache (Redis Schema)

| Attribute | Type | Description |
|-----------|------|-------------|
| `key` | `string` | `liturgia:{DD-MM-YYYY}` |
| `value` | `string` | JSON stringified do payload completo da API |
| `ttl` | `number` | 86400 segundos (24 horas) |

**No schema relacional.** A chave e o valor são strings brutas no Redis.

---

## Validators

### LiturgiaDateValidator

Usado para validar os parâmetros opcionais de consulta (`dia`, `mes`, `ano`).

| Field | Rule | Description |
|-------|------|-------------|
| `dia` | `number`, `1`–`31` | Dia do mês |
| `mes` | `number`, `1`–`12` | Mês |
| `ano` | `number`, `≥1970` | Ano (ano litúrgico não retrocede infinitamente) |

**Constraint**: Se um dos três é fornecido, todos devem ser fornecidos (uso validador de Vine.js com schema composto via `vine.object` opcional).

---

## Types / Interfaces (TypeScript)

```typescript
// resources/js/lib/liturgia.ts
export interface Leitura {
  tema?: string
  referencia?: string
  texto?: string
}

export interface Oracoes {
  coleta?: string
  oferendas?: string
  comunhao?: string
  extras?: string[]
}

export interface Antifonas {
  entrada?: string
  comunhao?: string
}

export interface Leituras {
  primeiraLeitura?: Leitura[]
  salmo?: Leitura[]
  segundaLeitura?: Leitura[]
  evangelho?: Leitura[]
  extras?: Leitura[]
}

export interface LiturgiaData {
  data: string          // "2026-04-22"
  liturgia: string      // "4ª feira da 3ª Semana da Páscoa"
  cor: string           // "Branco"
  oracoes: Oracoes
  leituras: Leituras
  antifonas: Antifonas
}

export type LiturgicalColor = 'Verde' | 'Vermelho' | 'Roxo' | 'Rosa' | 'Branco'
```

---

## Relationships

Nenhuma entidade relacional. O card de liturgia é uma ilha de dados externa dentro do dashboard.

```
[Dashboard/Index.vue] -> (prop liturgia) -> controller
  -> LiturgiaDiariaService -> Redis (cache check)
    -> Cache hit? Retorna LiturgiaData
    -> Cache miss? -> API externa -> Salva no Redis -> Retorna LiturgiaData
```
