# Feature Specification: form-validation-feedback

**Feature Branch**: `012-form-validation-feedback`
**Created**: 2026-04-24
**Status**: Draft
**Input**: User description: "Quero que em todos os formulários ao clicar em salvar caso não tenha sido preenchidos campos obrigatórios ou tenha erro de validação, os campos fiquem vermelhos com uma mensagem de erro na parte de baixo. Caso o campo esteja contido em uma aba, o título da aba também deve ficar vermelho"

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Destacar Campos Obrigatórios Não Preenchidos (Priority: P1)

O usuário preenche um formulário e clica em "salvar" sem ter preenchido todos os campos obrigatórios. O sistema destaca visualmente os campos que faltam com cor vermelha e exibe uma mensagem de erro abaixo de cada um, orientando o usuário sobre o que precisa ser corrigido.

**Why this priority**: Garante que o usuário perceba imediatamente quais informações estão faltando, reduzindo frustração e tempo de tentativa e erro.

**Independent Test**: Pode ser testado independentemente criando um formulário com campos obrigatórios, submetendo-o vazio e verificando se os campos ficam vermelhos com mensagens de erro visíveis.

**Acceptance Scenarios**:

1. **Given** que o usuário está em um formulário com campos obrigatórios não preenchidos, **When** ele clica em "salvar", **Then** todos os campos obrigatórios não preenchidos ficam destacados em vermelho com uma mensagem de erro abaixo de cada campo.
2. **Given** que o usuário preenche um campo obrigatório que anteriormente estava inválido, **When** o campo recebe um valor válido, **Then** o destaque vermelho e a mensagem de erro desaparecem.

---

### User Story 2 - Indicar Erros de Validação em Campos Preenchidos (Priority: P1)

O usuário preenche um campo com um valor que não atende às regras de validação (por exemplo, e-mail inválido, CPF incorreto, data fora do intervalo permitido). Ao tentar salvar, o sistema indica que aquele campo contém um erro com destaque visual e mensagem explicativa.

**Why this priority**: Permite ao usuário entender por que um valor inserido não é aceito e como corrigi-lo, mesmo quando o campo não está vazio.

**Independent Test**: Pode ser testado preenchendo campos com valores inválidos, submetendo o formulário e verificando se a mensagem de erro específica daquela validação é exibida.

**Acceptance Scenarios**:

1. **Given** que o usuário inseriu um valor inválido em um campo, **When** ele clica em "salvar", **Then** o campo fica destacado em vermelho e uma mensagem de erro descrevendo o problema de validação é exibida abaixo do campo.
2. **Given** que um campo está com erro de validação visível, **When** o usuário corrige o valor para um valor válido, **Then** o destaque vermelho e a mensagem de erro desaparecem.

---

### User Story 3 - Destacar Abas com Erros (Priority: P2)

O formulário é organizado em abas (tabs). O usuário submete o formulário e existem campos inválidos em abas que não estão visíveis no momento. O título das abas que contêm campos inválidos ficam vermelhos, alertando o usuário sobre onde estão os problemas sem precisar abrir cada aba.

**Why this priority**: Melhora a navegação em formulários longos e complexos, permitindo que o usuário localize rapidamente onde estão os erros quando o formulário está dividido em múltiplas abas.

**Independent Test**: Pode ser testado criando um formulário com abas, deixando campos inválidos em uma aba diferente da ativa, e verificando se o título da aba correspondente fica vermelho.

**Acceptance Scenarios**:

1. **Given** que o formulário possui múltiplas abas e existem campos obrigatórios não preenchidos em uma aba inativa, **When** o usuário clica em "salvar", **Then** o título da aba que contém campos inválidos fica destacado em vermelho.
2. **Given** que uma aba está com o título vermelho devido a campos inválidos, **When** o usuário corrige todos os campos inválidos dentro dessa aba, **Then** o título da aba deixa de estar vermelho.
3. **Given** que múltiplas abas contêm campos inválidos, **When** o usuário clica em "salvar", **Then** todas as abas afetadas ficam com o título vermelho simultaneamente.

---

### Edge Cases

- O que acontece quando o formulário é submetido e não há nenhum erro? Todos os destaques vermelhos e mensagens devem estar ausentes e o salvamento prosseguir normalmente.
- Como o sistema lida com campos que tornam-se obrigatórios condicionalmente baseados no valor de outro campo? O campo condicional obrigatório deve ser validado e destacado em vermelho apenas quando a condição que o torna obrigatório for atendida.
- O que ocorre se o formulário tiver abas aninhadas ou múltiplos níveis de abas? Todas as abas ancestrais que contêm campos inválidos devem ter seus títulos destacados em vermelho.
- Como é tratado o caso de um campo estar dentro de uma seção colapsável/expansível dentro de uma aba? A lógica de destaque da aba deve continuar funcionando corretamente independentemente do estado de colapso da seção.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: O sistema DEVE validar todos os campos obrigatórios de um formulário quando o usuário clicar em "salvar".
- **FR-002**: Quando um campo obrigatório não estiver preenchido após o clique em "salvar", o campo DEVE ser visualmente destacado com cor vermelha.
- **FR-003**: Quando um campo possuir erro de validação (obrigatório não preenchido ou valor inválido), uma mensagem de erro descritiva DEVE ser exibida abaixo do campo.
- **FR-004**: O sistema DEVE validar campos preenchidos contra as regras de validação definidas (por exemplo, formato de e-mail, comprimento mínimo/máximo, valores numéricos dentro de um intervalo).
- **FR-005**: Quando um campo preenchido falhar em uma regra de validação, o campo DEVE ser destacado em vermelho e uma mensagem de erro específica à regra violada DEVE ser exibida abaixo do campo.
- **FR-006**: Quando um campo com destaque vermelho e/ou mensagem de erro for corrigido pelo usuário para um valor válido, o destaque vermelho e a mensagem de erro DEVEM desaparecer.
- **FR-007**: Se um campo inválido estiver contido dentro de uma aba (tab) que não esteja ativa no momento da submissão, o título dessa aba DEVE ser destacado em vermelho.
- **FR-008**: Quando todos os campos inválidos dentro de uma aba forem corrigidos, o título da aba DEVE deixar de ser destacado em vermelho.
- **FR-009**: O sistema DEVE suportar formulários com múltiplas abas, destacando cada aba afetada individualmente.
- **FR-010**: O sistema DEVE aplicar o comportamento de validação visual a todos os formulários existentes na aplicação.

### Key Entities

- **Formulário**: Representa um conjunto de campos de entrada organizados para coleta de dados do usuário. Pode ser simples (sem abas) ou dividido em abas.
- **Campo de Formulário**: Elemento individual de entrada de dados (texto, número, data, seleção, etc.). Possui atributos como obrigatoriedade, regras de validação e estado de exibição de erro.
- **Aba (Tab)**: Seção agrupadora dentro de um formulário que contém um subconjunto de campos. Possui um título identificador que pode ser destacado em vermelho quando campos internos estão inválidos.
- **Erro de Validação**: Estado resultante da falha de um campo em passar pela validação. Inclui uma mensagem descritiva associada.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: 100% dos formulários da aplicação devem exibir destaque vermelho e mensagem de erro ao tentar salvar com campos obrigatórios não preenchidos.
- **SC-002**: 100% dos campos com erro de validação (obrigatório ou inválido) devem exibir uma mensagem de erro descritiva ao tentar salvar.
- **SC-003**: Em formulários com abas, 100% das abas contendo campos inválidos devem ter seus títulos destacados em vermelho após tentativa de salvamento.
- **SC-004**: O destaque de erro (campo, mensagem e título da aba) deve desaparecer em menos de 300ms após o usuário corrigir o campo para um valor válido.
- **SC-005**: Usuários devem conseguir identificar e localizar todos os campos com erro em um formulário com abas em menos de 5 segundos após o clique em salvar.

## Assumptions

- Todos os formulários da aplicação utilizam um componente ou padrão de formulário unificado, permitindo que a lógica de validação visual seja aplicada de maneira centralizada.
- Campos obrigatórios já estão identificados na estrutura dos formulários existentes (por exemplo, via atributo "required" ou equivalente).
- As regras de validação (formatos, intervalos, etc.) já estão definidas para os campos que as necessitam.
- A cor vermelha utilizada para o destaque deve estar alinhada ao sistema de design e tema da aplicação (modo claro/escuro).
- A validação visual ocorre apenas ao acionar a ação de salvar; não inclui validação em tempo real durante a digitação, salvo implementação futura.
