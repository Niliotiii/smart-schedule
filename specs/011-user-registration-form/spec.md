# Feature Specification: Cadastro Completo de Usuários

**Feature Branch**: `011-user-registration-form`  
**Created**: 2026-04-23  
**Status**: Draft  
**Input**: User description: "Ajuste o formulário de Users para que contenha os seguintes dados: aba Informações Gerais nome(*), data de nascimento(*), naturalidade(país, estado e cidade)(*), telefone(*), email, nome do responsavel 1, telefone do responsavel 1, nome do responsavel 2, telefone do responsavel 2, seletor de perfil(Deve ter uma permissão específica para poder editar perfil)(*), seletor de tipo de usuário(*), incluir na escala ou não(boolean)(*). Aba endereço da mesma forma que é feito em igreja. Aba de Sacramentos onde poderá selecionar a comunidade em que o usuário participa(*) e a possibilidade de adicionar sacramentos que o usuário possui preenchendo nome do sacramento(Batismo, Primeira Eucaristia, Crisma)(*), data que recebeu(*), Igreja que recebeu(campo aberto)(*) e pais(*), estado(*) e cidade(*). Deve ter tmabém uma aba para poder cadastrar as funções que o usuário esta apto a desempenhar(n-n)"

## User Scenarios & Testing _(mandatory)_

### User Story 1 – Cadastrar Informações Gerais de um Usuário (Priority: P1)

Como administrador do sistema, quero cadastrar os dados pessoais básicos de um usuário (nome, data de nascimento, naturalidade, telefone, e-mail), responsáveis e configurações de perfil/tipo, para manter a ficha do usuário completa e organizada.

**Why this priority**: O usuário não pode ser registrado sem os dados mínimos obrigatórios, e essas informações são a base para todas as demais abas e funcionalidades (escala, sacramentos, funções).

**Independent Test**: Pode ser testado cadastrando um usuário preenchendo apenas a aba "Informações Gerais"; o registro já deve ser criado e recuperável, mesmo que as demais abas estejam vazias.

**Acceptance Scenarios**:

1. **Given** que o administrador está na tela de cadastro de usuários, **When** ele preenche nome, data de nascimento, país/estado/cidade de naturalidade, telefone, seleciona perfil e tipo de usuário, e marca "incluir na escala", **Then** o sistema salva as informações e exibe confirmação de sucesso.
2. **Given** que o campo nome está vazio, **When** o administrador tenta salvar, **Then** o bloqueia a ação e exibe uma mensagem indicando que os campos obrigatórios (*) precisam ser preenchidos.
3. **Given** que o administrador não possui a permissão específica para editar perfil, **When** ele acessa o formulário, **Then** o campo "perfil" está visível, mas desabilitado ou oculto para edição.

---

### User Story 2 – Vincular Endereço ao Usuário (Priority: P2)

Como administrador, quero registrar o endereço completo do usuário para que seja possível realizar correspondências e contatos físicos quando necessário.

**Why this priority**: Embora não impedir a criação do usuário, o endereço é essencial para comunicação e está alinhado com o padrão já existente na entidade Igreja.

**Independent Test**: Pode ser testado preenchendo e salvando a aba "Endereço" isoladamente, independentemente de outras abas.

**Acceptance Scenarios**:

1. **Given** que o formulário de usuário já foi criado com as informações gerais, **When** o administrador acessa a aba "Endereço" e preenche os dados obrigatórios (país, estado, cidade, logradouro/CEP, conforme o padrão de Igreja), **Then** o endereço é salvo e associado ao usuário.
2. **Given** que o administrador deixa campos obrigatórios do endereço em branco, **When** ele tenta salvar, **Then** o sistema exibe uma mensagem informando quais campos são obrigatórios.

---

### User Story 3 – Associar Comunidade e Sacramentos ao Usuário (Priority: P2)

Como administrador, quero selecionar a comunidade que o usuário participa e registrar os sacramentos que ele já recebeu, para manter o histórico religioso completo e organizado.

**Why this priority**: Os sacramentos têm alta importância para o contexto eclesiástico e são usados para validar se o usuário está apto a exercer certas funções ministeriais.

**Independent Test**: Pode-se testar adicionando uma comunidade e um sacramento (Batismo) ao usuário, sem preencher as demais abas, e verificar se o histórico é salvo e exibido corretamente.

**Acceptance Scenarios**:

1. **Given** que o usuário foi cadastrado, **When** o administrador seleciona a comunidade e adiciona um sacramento (ex: Batismo) com data, igreja, país, estado e cidade, **Then** esses dados são salvos e exibidos na lista de sacramentos do usuário.
2. **Given** que o administrador tenta salvar a aba de sacramentos sem selecionar comunidade ou sem preencher os campos obrigatórios do sacramento, **Then** o sistema impede a ação e destaca os campos obrigatórios.
3. **Given** que o usuário já possui sacramentos cadastrados, **When** o administrador edita a data ou a igreja de um sacramento existente, **Then** os dados são atualizados corretamente.

---

### User Story 4 – Cadastrar Funções Desempenháveis pelo Usuário (Priority: P3)

Como administrador, quero registrar quais funções ministeriais ou de serviço o usuário está apto a exercer, para facilitar a organização de escalas e atividades pastorais.

**Why this priority**: Reaproveita o cadastro de usuários para alimentar processos futuros (como escala litúrgica), mas não impede o uso do cadastro básico se estiver vazio.

**Independent Test**: Pode ser testado adicionando funções ao usuário sem preencher sacramentos ou endereço; o vínculo deve ser criado e listado corretamente.

**Acceptance Scenarios**:

1. **Given** que o usuário existe, **When** o administrador acessa a aba "Funções" e seleciona uma ou mais funções (ex: "coroinha", "leitor", "Ministro da Eucaristia"), **Then** as funções são salvas e ligadas ao usuário de forma N:N (um usuário pode ter várias funções, e uma função pode estar associada a vários usuários).
2. **Given** que o administrador remove uma função previamente atribuída, **When** ele salva, **Then** o sistema desvincula a função do usuário sem afetar os demais dados.

### Edge Cases

- O que acontece se o usuário mudar de comunidade posteriormente? Deve-se manter o histórico da comunidade anterior? → Decisão de negócio: v1 considera apenas a comunidade atual.
- Como o sistema se comporta ao tentar remover um usuário que possui sacramentos ou funções vinculadas? → O sistema deve perguntar se deseja excluir em cascata ou impedir a exclusão.
- Se o tipo de usuário ou perfil for alterado, que impactos isso tem em acessos existentes? → Usuários já logados devem ter suas permissões reavaliadas no próximo login.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: O sistema DEVE permitir o cadastro/edição de dados pessoais do usuário em uma aba chamada "Informações Gerais", contendo: nome (obrigatório), data de nascimento (obrigatória), naturalidade composta por país, estado e cidade (obrigatórios), telefone (obrigatório), e-mail (opcional), nome e telefone do responsável 1 (opcional), nome e telefone do responsável 2 (opcional).
- **FR-002**: O sistema DEVE fornecer um seletor de perfil (obrigatório), vinculado à entidade `Profile` já existente no sistema (RBAC). O campo só pode ser editado por usuários que possuam a permissão específica `profiles:edit` (ou equivalente); caso contrário, o campo DEVE ser apresentado como desabilitado ou oculto para edição.
- **FR-003**: O sistema DEVE fornecer um seletor de tipo de usuário (obrigatório) com as categorias definidas pelo projeto.
- **FR-004**: O sistema DEVE apresentar uma opção booleana "Incluir na escala" (obrigatória), permitindo marcar se o usuário pode ser escalado para serviços litúrgicos ou atividades pastorais. O valor é armazenado como um indicador simples no cadastro do usuário, sem acionar lógica adicional — módulos futuros de escalas consultarão este campo para filtrar participantes elegíveis.
- **FR-005**: O sistema DEVE conter uma aba "Endereço" com os mesmos campos e comportamentos existentes no cadastro de Igreja, garantindo consistência na coleta de dados de endereço.
- **FR-006**: O sistema DEVE conter uma aba "Sacramentos" que permita selecionar a comunidade em que o usuário participa (obrigatória).
- **FR-007**: O sistema DEVE permitir adicionar múltiplos registros de sacramentos ao usuário, contendo: nome do sacramento (conjunto fixo inicial: Batismo, Primeira Eucaristia, Crisma — pode ser expandido futuramente via configuração administrativa), data em que o sacramento foi recebido (obrigatória), igreja em que o sacramento foi recebido (campo aberto, obrigatório), país, estado e cidade onde o sacramento foi recebido (obrigatórios).
- **FR-008**: O sistema DEVE conter uma aba "Funções" que permita selecionar uma ou mais funções que o usuário está apto a desempenhar, em uma relação N:N.
- **FR-009**: O sistema DEVE marcar claramente quais campos são obrigatórios (*) e realizar validação antes de salvar, exibindo mensagens amigáveis.
- **FR-010**: O sistema DEVE manter consistência visual e comportamental entre abas, permitindo salvamento por etapa ou validação global antes de salvar o cadastro completo.

### Key Entities _(include if feature involves data)_

- **Usuário**: Representa a pessoa a ser cadastrada. Atributos: nome, data de nascimento, naturalidade (país, estado, cidade), telefone, e-mail, nome/telefone dos responsáveis 1 e 2, opção de escala, tipo de usuário, perfil.
- **Endereço do Usuário**: Representação do endereço físico, com os mesmos campos/modelo do endereço da entidade Igreja (logradouro, número, complemento, bairro, cidade, estado, CEP, país).
- **Comunidade**: Entidade existente (provavelmente relacionada à Igreja) à qual o usuário está vinculado. Deve ser selecionável no cadastro de sacramentos.
- **Sacramento**: Registro histórico do usuário. Atributos: tipo de sacramento, data, igreja (campo aberto), localização (país, estado, cidade). Relaciona-se ao usuário em cardinalidade N:1 (um usuário pode ter vários sacramentos).
- **Função/Ministério**: Entidade que define funções desempenháveis (ex: Coroinha, Leitor). Relaciona-se ao usuário em cardinalidade N:N (um usuário pode ter várias funções; uma função pode estar em vários usuários).

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Usuários completam o cadastro da aba "Informações Gerais" com sucesso em menos de 3 minutos em condições normais.
- **SC-002**: 100% dos campos obrigatórios sinalizados com (*) são validados antes de salvar, sem permitir submissões com dados incompletos.
- **SC-003**: O vínculo N:N entre usuários e funções é criado, editado e excluído corretamente em 100% dos casos testados.
- **SC-004**: Administradores sem a permissão específica de editar perfil conseguem visualizar, mas não alterar, o campo perfil, prevenindo alterações não autorizadas.
- **SC-005**: A aba "Endereço" reutiliza o padrão de campos do cadastro de Igreja, garantindo consistência de dados e reduzindo curva de aprendizado para operadores já treinados.

## Assumptions

- O projeto já possui uma entidade Igreja com campos de endereço bem definidos, e esses mesmos campos podem ser reaproveitados para o usuário.
- O dicionário de "tipos de usuário" e "funções" já existem ou serão criados em especificações anteriores/posteriores.
- A comunidade é uma entidade existente no sistema e não precisa ser criada neste escopo.
- O conceito de "perfil" é distinto de "tipo de usuário", podendo estar relacionado a permissões e RBAC.
- O campo "incluir na escala" é um indicador booleano simples, sem lógica de negócio adicional além do armazenamento.
- O e-mail e os dados dos responsáveis são opcionais, conforme a descrição original do usuário.
- A exclusão de sacramentos e funções é lógica ou física, a critério de decisão futura de arquitetura.
- Se o "perfil" for um atributo existente de RBAC, sua edição controlada por permissão específica já é suportada pelo sistema de autorização atual.
