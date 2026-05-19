# Feature Specification: Geração Automática de Escalas

**Feature Branch**: `015-auto-schedule-generation`
**Created**: 2026-05-15
**Status**: Draft
**Input**: User description: "Tendo em vista que já possuo as escalas preciso poder gerar a escala automática. A escala deverá seguir regras claras: Será dado preferência para a escala para aqueles que sinalizaram que pode, Será escalado usuários com base nas funções que a escala solicita e as funções que o usuário tem cadastrado, só será incluído usuários com incluir na escala ativado, tentará o máximo possível garantir que os usuários tenham quantidade uniforme de escalas, se o usuário não sinalizou entende-se como disponibilidade para a escala"

## User Scenarios & Testing

### User Story 1 - Gerar escala automaticamente para um mês (Priority: P1)

O administrador de escalas acessa a tela de edição de um mês e clica em "Gerar Escala Automaticamente". O sistema processa todas as escalas do mês, distribuindo usuários de acordo com as regras definidas. Ao final, o administrador vê os resultados — quais escalas foram preenchidas e com quais usuários — e pode ajustar manualmente se necessário.

**Why this priority**: Esta é a funcionalidade central — o propósito principal da feature.

**Independent Test**: Pode ser testado criando um mês com escalas, tendo usuários cadastrados com funções e sinalizações, executando a geração e verificando a distribuição.

**Acceptance Scenarios**:

1. **Given** um mês com escalas abertas, usuários com funções cadastradas e sinalizações registradas, **When** o administrador clica em "Gerar Escala Automaticamente", **Then** o sistema distribui os usuários nas escalas respeitando funções, preferência por disponibilidade, e balanceamento uniforme.
2. **Given** uma escala que requer 2 acólitos, **When** a geração automática é executada, **Then** 2 usuários com função de acólito são designados para aquela escala.
3. **Given** um usuário com "incluir na escala" desativado, **When** a geração automática é executada, **Then** esse usuário nunca é designado para nenhuma escala.

---

### User Story 2 - Visualizar e ajustar resultado da geração (Priority: P2)

Após a geração automática, o administrador vê quais usuários foram alocados em cada escala e pode fazer ajustes manuais substituindo ou removendo usuários conforme necessário.

**Why this priority**: O administrador precisa ter controle sobre o resultado final, podendo corrigir exceções não previstas pelo algoritmo.

**Independent Test**: Pode ser testado gerando a escala, verificando a alocação e realizando ajustes manuais.

**Acceptance Scenarios**:

1. **Given** a geração automática foi concluída, **When** o administrador visualiza as escalas, **Then** cada escala mostra os usuários designados para cada função.
2. **Given** um resultado de geração automática, **When** o administrador remove um usuário de uma função, **Then** o usuário é removido e a vaga fica disponível para substituição manual.
3. **Given** um resultado de geração automática, **When** o administrador substitui um usuário por outro, **Then** a alteração é salva.

---

### User Story 3 - Reprocessar escala (Priority: P3)

O administrador pode executar a geração automática novamente para um mês, seja porque novos usuários foram cadastrados ou porque ajustes manuais não foram satisfatórios. A regeneração substitui completamente a alocação anterior.

**Why this priority**: Útil em cenários de iteração, mas não essencial para o primeiro uso.

**Independent Test**: Pode ser testado gerando, alterando manualmente, regenerando e verificando que as alterações manuais foram sobrescritas.

**Acceptance Scenarios**:

1. **Given** uma geração automática já foi executada, **When** o administrador executa novamente, **Then** a alocação anterior é completamente substituída pela nova.
2. **Given** houve alterações manuais após a primeira geração, **When** o administrador regenera, **Then** as alterações manuais são perdidas (com confirmação antes de regenerar).

### Edge Cases

- O que acontece quando não há usuários suficientes com uma função específica para preencher todas as vagas? Vagas não preenchidas devem ficar vazias e ser sinalizadas ao administrador.
- Como o sistema trata usuários que sinalizaram "não" para uma escala específica? Esses usuários não devem ser alocados naquela escala, mas podem ser alocados em outras escalas do mesmo mês onde sinalizaram "sim" ou não sinalizaram.
- O que acontece se nenhum usuário tiver a função requerida por uma escala? A escala fica sem alocação para aquela função e o administrador é alertado.

## Requirements

### Functional Requirements

- **FR-001**: O sistema DEVE permitir que o administrador execute a geração automática de escalas para um mês específico.
- **FR-002**: O sistema DEVE considerar apenas usuários com "incluir na escala" ativado para alocação.
- **FR-003**: O sistema DEVE alocar usuários nas escalas com base nas funções que o usuário possui cadastradas e nas funções requisitadas pela escala.
- **FR-004**: O sistema DEVE dar preferência para usuários que sinalizaram "sim" para aquela escala específica.
- **FR-005**: Usuários que sinalizaram "não" para uma escala NÃO DEVEM ser alocados naquela escala.
- **FR-006**: Usuários que não sinalizaram para uma escala DEVEM ser considerados como disponíveis para aquela escala.
- **FR-007**: O sistema DEVE distribuir as escalas de forma uniforme entre os usuários elegíveis, priorizando quem tem menos escalas no mês.
- **FR-008**: Após a geração, o administrador DEVE poder visualizar quais usuários foram alocados em cada escala e função.
- **FR-009**: O administrador DEVE poder ajustar manualmente a alocação após a geração automática (remover/substituir usuários).
- **FR-010**: O administrador DEVE poder regenerar a alocação, substituindo completamente a alocação anterior, mediante confirmação.
- **FR-011**: Vagas não preenchidas (por falta de usuários disponíveis com a função requerida) DEVEM ser sinalizadas ao administrador.

### Key Entities

- **Escala (Schedule)**: Representa um evento de escala em um dia específico, com funções e quantidades requeridas.
- **Alocação de Escala (Schedule Assignment)**: Nova entidade que representa um usuário alocado a uma escala em uma função específica. Contém: scheduleId, userId, ministryRoleId.
- **Função do Usuário (User Ministry Role)**: Relacionamento entre usuário e função ministerial que ele pode exercer.
- **Sinalização (Availability Signal)**: Indica se o usuário está disponível ("sim"), indisponível ("não") ou não respondeu (considerado disponível) para uma escala específica.
- **Critério de Balanceamento**: Lógica que prioriza usuários com menor número de alocações no mês para garantir distribuição uniforme.

## Success Criteria

### Measurable Outcomes

- **SC-001**: Administradores podem gerar a escala completa de um mês com dezenas de escalas em segundos, não manualmente.
- **SC-002**: Usuários com "incluir na escala" ativado e funções cadastradas são considerados no processo de alocação.
- **SC-003**: Usuários que sinalizaram "sim" ou não sinalizaram recebem prioridade sobre os que sinalizaram "não" (que são excluídos).
- **SC-004**: A distribuição de escalas entre usuários com a mesma função é uniforme (diferença máxima de 1 escala entre usuários).
- **SC-005**: Administradores conseguem visualizar e ajustar a alocação em menos de 5 minutos após a geração.

## Assumptions

- A geração automática é executada no contexto de um mês já aberto, com escalas já cadastradas.
- O resultado da geração é salvo no banco de dados e persiste entre sessões.
- O algoritmo de balanceamento prioriza distribuição uniforme dentro do mesmo mês, não considerando meses anteriores.
- A funcionalidade está disponível apenas para usuários com permissão de gerenciamento de escalas (scheduleMonthsManage).
- A interface de ajuste manual após geração será baseada na interface de edição de escalas existente.
