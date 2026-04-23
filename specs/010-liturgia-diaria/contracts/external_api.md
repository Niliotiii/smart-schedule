# External API Contract: Liturgia Diária v2

**Base URL**: `https://liturgia.up.railway.app/v2/`
**Authentication**: None (public API)
**Rate Limit**: Unknown — assume reasonable use (1 req/user/day)
**Content-Type**: `application/json; charset=utf-8`

---

## Endpoints

### GET `/v2/`

**Description**: Retorna a liturgia do dia atual (no timezone UTC do servidor da API).

**Parameters**: None

**Responses**:

- **200 OK**
  ```json
  {
    "data": "string (YYYY-MM-DD)",
    "liturgia": "string",
    "cor": "string (Verde|Vermelho|Roxo|Rosa|Branco)",
    "oracoes": {
      "coleta": "string",
      "oferendas": "string",
      "comunhao": "string",
      "extras": ["string"]
    },
    "leituras": {
      "primeiraLeitura": [{ "tema": "string", "referencia": "string", "texto": "string" }],
      "salmo": [{ "tema": "string", "referencia": "string", "texto": "string" }],
      "segundaLeitura": [{ "tema": "string", "referencia": "string", "texto": "string" }],
      "evangelho": [{ "tema": "string", "referencia": "string", "texto": "string" }],
      "extras": [{ "tema": "string", "referencia": "string", "texto": "string" }]
    },
    "antifonas": {
      "entrada": "string",
      "comunhao": "string"
    }
  }
  ```

- **404 Not Found**
  ```json
  {
    "erro": "string",
    "data": "string"
  }
  ```

---

### GET `/v2/?dia={dia}&mes={mes}&ano={ano}`

**Description**: Retorna a liturgia de uma data específica.

**Query Parameters**:

| Parameter | Type | Required | Constraints |
|-----------|------|----------|-------------|
| `dia` | `integer` | Yes (with mes+ano) | 1–31 |
| `mes` | `integer` | Yes (with dia+ano) | 1–12 |
| `ano` | `integer` | Yes (with dia+mes) | Integer ≥ 1970 |

**Responses**: Same as `GET /v2/`

---

## Error Scenarios

| Scenario | HTTP Status | Body | System Behavior |
|----------|-------------|------|-----------------|
| Data not yet published | 404 | `{ erro, data }` | Service returns `null` to controller |
| Invalid date params | 400 | (unknown — treat as error) | Service returns `null` |
| API timeout (>3s) | — | — | `AbortController` triggers; service returns `null` |
| API offline | — | — | `fetch` rejects; service returns `null` |

## Client-Side Contract (Inertia Props)

The backend passes a single prop to `Dashboard/Index.vue`:

```typescript
interface DashboardProps {
  liturgia: LiturgiaData | null
}
```

If `null`, the card renders in an empty/fallback state without breaking the dashboard.
