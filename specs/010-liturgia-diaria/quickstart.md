# Quickstart Guide: Liturgia Diária no Dashboard

## Objective

Verify the feature end-to-end by running through each user story manually or via Playwright.

---

## Prerequisites

1. Redis server running and accessible via `REDIS_URL` (or `REDIS_HOST` + `REDIS_PORT`).
2. Dependencies installed: `npm install` (must include `ioredis` post-implementation).
3. App running: `node ace serve`.

---

## Scenario 1: Visualizar Liturgia do Dia Atual (US1)

**Steps**:
1. Log in as administrador.
2. Navegar para `/dashboard`.
3. **Esperado**: O card de liturgia aparece abaixo dos cards de acesso rápido.
4. Verificar título do dia litúrgico visível.
5. Verificar cor litúrgica com indicador visual (cor sólida).
6. Verificar resumo: santo do dia (se presente) e frase do Evangelho.

**Cache Test**:
- Recarregar a página (F5).
- O card deve aparecer instantaneamente (sem spinner de loading — indicando que veio do cache Redis).

---

## Scenario 2: Selecionar Data Específica (US2)

**Steps**:
1. No card de liturgia, clicar no `Calendar` (datepicker).
2. Selecionar uma data diferente (ex: 25/12/2026).
3. **Esperado**: Os dados da liturgia da nova data são exibidos.
4. Verificar se o título, cor, resumo e leituras correspondem à data selecionada.

**Cache Test**:
- Recarregar a página e selecionar a mesma data.
- O carregamento deve ser instantâneo (cache hit).

---

## Scenario 3: Expandir Seções de Leitura (US3)

**Steps**:
1. No card de liturgia, clicar no accordion "Primeira Leitura".
2. **Esperado**: Apenas essa seção expande. Texto completo da leitura é visível.
3. Verificar que "Salmo" e "Evangelho" permanecem recolhidos.
4. Expandir "Evangelho".
5. **Esperado**: Ambas as seções podem estar abertas ao mesmo tempo (`:multiple="true"`).

---

## Scenario 4: Cache de 24h (FR-008)

**Steps**:
1. Acessar o dashboard e anotar a data da liturgia exibida.
2. Abrir `redis-cli` e executar:
   ```
   GET liturgia:DD-MM-YYYY
   TTL liturgia:DD-MM-YYYY
   ```
3. **Esperado**: A chave existe com um valor JSON stringified e TTL > 0 (aproximadamente 86400 segundos no primeiro acesso).

---

## Scenario 5: Resiliência — API Offline (Exception Flow)

**Steps**:
1. (Simulação) Alterar temporariamente a URL base do service para um endpoint inexistente, ou bloquear `liturgia.up.railway.app` localmente (ex: via `/etc/hosts`).
2. Acessar o dashboard.
3. **Esperado**: O dashboard carrega normalmente. O card de liturgia exibe um estado vazio/amigável (ex: "Não foi possível carregar a liturgia de hoje") sem quebrar outros componentes do dashboard.

---

## Checklist de Validação Final

- [ ] Card aparece abaixo dos quick-access cards no Dashboard.
- [ ] Datepicker permite selecionar qualquer data.
- [ ] Liturgia do dia atual carrega automaticamente.
- [ ] Cor litúrgica exibe indicador visual colorido.
- [ ] Resumo: santo do dia + frase do Evangelho visível.
- [ ] Accordion Primeira Leitura expande/recolhe independentemente.
- [ ] Accordion Salmo expande/recolhe independentemente.
- [ ] Accordion Evangelho expande/recolhe independentemente.
- [ ] Cache Redis contém chave para a data consultada com TTL 86400.
- [ ] Recarga da página com data em cache é instantânea.
- [ ] Dashboard não quebra quando API está offline.
- [ ] Layout responsivo em telas até 768px.
- [ ] TypeScript compila sem erros (`tsc --noEmit`).
