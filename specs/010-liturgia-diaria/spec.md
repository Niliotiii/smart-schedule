# Feature Specification: Liturgia Diária no Dashboard

**Feature Branch**: `[010-liturgia-diaria]`  
**Created**: 2026-04-22  
**Status**: Draft  
**Input**: User description: "Implemente um service que consuma a API https://github.com/Dancrf/liturgia-diaria/blob/main/docs/v2/README.md, por default a data consultada deverá ser now() mas, deverá aceitar também a seleção de um dia especifico para consultar. Os dados devem ser exibido no dashboard abaixo dos cards de acesso rápido com uma abordagem de Cards Hierárquicos, título do dia liturgico com o campo de datapicker, Body: * Resumo: Cor litúrgica (exibir um pequeno indicador visual com a cor retornada), santo do dia e a frase do Evangelho. Seções Expansíveis (Accordions): Para a Primeira Leitura, Salmo e Evangelho. Isso evita que o dashboard fique excessivamente longo. Implemente o uso do Redis para fazer cache de 24 horas da request para cada dia específico"

## User Scenarios & Testing

### User Story 1 - Visualizar Liturgia do Dia Atual (Priority: P1) 🎯 MVP

Como administrador do sistema, quero visualizar automaticamente a liturgia do dia ao acessar o dashboard, para que eu possa me preparar espiritualmente e conhecer as leituras do dia sem sair do sistema.

**Why this priority**: A visualização do dia atual é o caso de uso primário e imediato — toda vez que o usuário entra no dashboard, ele deve ver o conteúdo litúrgico do dia sem precisar de interação adicional.

**Independent Test**: Acessar o painel principal. O card de liturgia deve carregar automaticamente com a data de hoje, exibindo o título do dia litúrgico, a cor litúrgica com indicador visual, o resumo com santo do dia, e as leituras em accordions. O carregamento deve acontecer em menos de 2 segundos no dashboard, mesmo em requisições subsequentes (cache).

**Acceptance Scenarios**:

1. **Given** um usuário autenticado acessa o dashboard, **When** a página for carregada, **Then** deve exibir o card de liturgia do dia atual com título, cor, resumo e a frase do evangelho já visíveis.
2. **Given** o usuário acessa o dashboard pela segunda vez no mesmo dia, **When** a página for carregada, **Then** o conteúdo litúrgico deve ser exibido instantaneamente (sem chamada à API externa) porque está em cache.

---

### User Story 2 - Selecionar Data Específica da Liturgia (Priority: P1)

Como administrador, quero selecionar uma data diferente da atual para consultar a liturgia de outro dia, para que eu possa me preparar para celebrações futuras ou rever leituras passadas.

**Why this priority**: A seleção de datas é fundamental para flexibilidade litúrgica — sacerdotes e coordenadores precisam consultar datas futuras para preparar celebrações.

**Independent Test**: No card de liturgia do dashboard, clicar no campo datepicker e escolher uma data diferente. O card deve atualizar automaticamente com os dados da nova data selecionada, mantendo a mesma estrutura visual. A data deve ser passada para o serviço de forma que a API externa seja consultada com a data específica.

**Acceptance Scenarios**:

1. **Given** o usuário interage com o datepicker no card de liturgia, **When** uma data diferente do dia atual é selecionada, **Then** o sistema deve buscar e exibir a liturgia correspondente àquela data.
2. **Given** o usuário seleciona uma data futura que ainda não possui cache, **When** a consulta é feita, **Then** o sistema deve chamar a API externa e salvar em cache com TTL de 24 horas.

---

### User Story 3 - Visualizar Leituras em Seções Expansíveis (Priority: P2)

Como administrador, quero expandir cada seção de leitura (Primeira Leitura, Salmo, Evangelho) separadamente, para que o dashboard não fique excessivamente longo, permitindo-me focar apenas na leitura de interesse imediato.

**Why this priority**: A organização por accordions mantém o dashboard limpo e escaneável, evitando que o usuário precise rolar excessivamente para acessar outros widgets.

**Independent Test**: No card de liturgia, clicar no accordion de "Primeira Leitura" e ver o texto completo da leitura expandir. Clicar novamente para recolher. Fazer o mesmo para Salmo e Evangelho. As interações devem ser isoladas — expandir um não afeta o estado dos outros.

**Acceptance Scenarios**:

1. **Given** o card de liturgia está renderizado no dashboard, **When** o usuário clica no accordion "Primeira Leitura", **Then** apenas essa seção expande mostrando o texto da primeira leitura, enquanto Salmo e Evangelho permanecem recolhidos.
2. **Given** o usuário expande o accordion do Evangelho, **When** ele clica para recolher, **Then** a seção volta ao estado recolhido, mantendo o layout compacto.

---

## Requirements

### Functional Requirements

- **FR-001**: O sistema DEVE consumir a API Liturgia Diária v2 (`https://liturgia.up.railway.app/v2/`) para obter dados litúrgicos.
- **FR-002**: Por padrão, a consulta DEVE retornar a liturgia do dia atual (data do sistema) quando o usuário acessa o dashboard.
- **FR-003**: O sistema DEVE permitir que o usuário selecione uma data específica via datepicker, passando os parâmetros `dia`, `mes`, `ano` para a API externa.
- **FR-004**: Os dados da liturgia DEVEm ser exibidos no dashboard, abaixo dos cards de acesso rápido existentes.
- **FR-005**: A exibição DEVE apresentar uma abordagem de Cards Hierárquicos com o título do dia litúrgico visível.
- **FR-006**: O card DEVE exibir um resumo visível contendo: cor litúrgica (com pequeno indicador visual colorido), santo do dia (se presente na resposta) e a frase do Evangelho.
- **FR-007**: O card DEVE apresentar seções expansíveis (accordions) para: Primeira Leitura, Salmo e Evangelho, permitindo que o usuário expandir/recolher individualmente cada leitura.
- **FR-008**: O sistema DEVE utilizar Redis para fazer cache de 24 horas das respostas da API, usando a data consultada como chave de cache.
- **FR-009**: Se os dados da data solicitada já existirem em cache, o sistema DEVE retornar os dados do cache sem chamar a API externa.
- **FR-010**: O sistema DEVE exibir corretamente as diferentes cores litúrgicas retornadas pela API (Verde, Vermelho, Roxo, Rosa, Branco).

### Key Entities

- **LiturgiaCache**: Representa o cache de uma consulta litúrgica. Chave: data consultada (DD-MM-YYYY). Valor: payload completo da API externa (JSON). TTL: 24 horas.
- **LiturgiaResposta**: Dados retornados pela API externa, incluindo: data, título do dia litúrgico, cor litúrgica, orações (coleta, oferendas, comunhão, extras), leituras (primeiraLeitura, salmo, segundaLeitura, evangelho, extras), antifonas.

## Success Criteria

### Measurable Outcomes

- **SC-001**: O card de liturgia deve carregar no dashboard em menos de 2 segundos para datas já em cache.
- **SC-002**: O card de liturgia deve carregar no dashboard em menos de 5 segundos para datas que requerem chamada à API externa (primeira consulta).
- **SC-003**: 100% das consultas de datas já acessadas em 24 horas devem retornar do cache sem nova chamada à API externa.
- **SC-004**: O usuário deve conseguir selecionar qualquer data entre o início do ano litúrgico atual e 1 ano à frente e visualizar os dados corretamente.
- **SC-005**: O layout do dashboard com o card de liturgia deve permanecer responsivo e visível em dispositivos de tela pequena (até 768px de largura).

## Assumptions

- A API Liturgia Diária v2 estará disponível e acessível a partir do servidor da aplicação (não exige autenticação).
- A instância de Redis já estará configurada no projeto ou será configurada como parte desta feature.
- O dashboard atual possui layout flexível que permite a adição de novos componentes na seção inferior sem quebrar o design existente.
- A cor litúrgica retornada pela API será uma das cinco strings conhecidas (Verde, Vermelho, Roxo, Rosa, Branco), podendo ser mapeada para cores CSS hexadecimais.
- O datepicker a ser utilizado será o componente nativo do PrimeVue (Calendar).
