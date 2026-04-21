# Feature Specification: Auth, RBAC & Dashboard

**Feature Branch**: `002-auth-rbac-dashboard`
**Created**: 2026-04-19
**Status**: Draft
**Input**: User description: "Quero fazer login com email e senha e cair na tela principal do sistema que será um dashboard com menu lateral esquerdo fixo no desktop e hamburguer no mobile. A princípil deverá ter os menus usuários e perfis, onde ao clicar em cada menu será redirecionado para uma tela de listagem paginada com botão de criar novo no topo superior direito e em cada registro terá botões apenas com ícones para vizualizar, editar e excluir. O sistema de permissões deve ser RBAC onde cada usuário terá um perfil e cada perfil poderá marcar ou não permissões que serão com base nos modulo e ações que possa ser executadas. Essas permissões também será quem ditará se o modulo vai aparecer ou não no menu lateral esquerdo e os botoes de acoes"

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Authentication & Dashboard Access (Priority: P1)

Como um usuário registrado, quero fazer login com meu email e senha para acessar o painel administrativo (dashboard) do sistema, que deve se adaptar a telas desktop e mobile.

**Why this priority**: Sem autenticação, o acesso aos dados sensíveis e aos módulos administrativos fica exposto. É a porta de entrada.

**Independent Test**: O login pode ser testado independentemente inserindo credenciais válidas e verificando o redirecionamento para o dashboard com o menu (sidebar) carregado corretamente de acordo com a responsividade.

**Acceptance Scenarios**:

1. **Given** credenciais válidas na tela de login, **When** submeto o formulário, **Then** sou redirecionado para o Dashboard.
2. **Given** que o usuário está no Dashboard em uma tela desktop, **When** visualizo a página, **Then** o menu lateral esquerdo deve estar fixo.
3. **Given** que o usuário está no Dashboard em um dispositivo mobile, **When** visualizo a página, **Then** o menu deve estar oculto e acessível apenas via um ícone "hamburguer".

---

### User Story 2 - Role-Based Access Control (RBAC) Base (Priority: P1)

Como um administrador do sistema, quero poder criar "Perfis" e associá-los a "Permissões" granulares (baseadas em módulos e ações), para controlar o que cada usuário pode acessar no sistema.

**Why this priority**: A segurança de acesso granular é necessária antes que as telas de CRUD dos módulos sejam expostas.

**Independent Test**: Pode ser testado vinculando um usuário a um perfil específico e validando se o menu e botões restritos somem quando ele faz login.

**Acceptance Scenarios**:

1. **Given** um usuário com um perfil sem permissão para o módulo "Usuários", **When** ele faz login, **Then** o menu lateral não deve exibir a opção "Usuários".
2. **Given** um usuário logado em uma tela de listagem sem a permissão de "excluir", **When** visualizo os registros, **Then** o botão de exclusão (ícone) não deve ser renderizado para esse usuário.

---

### User Story 3 - Users & Profiles Management (CRUD) (Priority: P2)

Como um administrador com as devidas permissões, quero gerenciar Usuários e Perfis através de telas de listagem padronizadas com paginação e botões de ação com ícones (visualizar, editar, excluir), além de um botão para "criar novo".

**Why this priority**: Uma vez que o RBAC existe, precisamos de uma interface para cadastrar e vincular usuários aos perfis e para configurar as permissões dos perfis.

**Independent Test**: A tela de listagem de usuários (e a de perfis) pode ser testada verificando a estrutura visual, a paginação em funcionamento e as ações (ícones) atreladas aos registros, dadas as permissões corretas do usuário logado.

**Acceptance Scenarios**:

1. **Given** que clico no menu "Perfis", **When** a página carrega, **Then** vejo uma lista paginada de perfis com o botão "Criar Novo" no topo superior direito.
2. **Given** que estou visualizando uma listagem de registros, **When** olho para um item da lista, **Then** vejo apenas ícones para as ações de Visualizar, Editar e Excluir.

### Edge Cases

- O que acontece se o usuário atualizado perder a permissão da própria tela que ele acabou de alterar?
- Como o sistema lida com um usuário que não está atrelado a nenhum perfil? O sistema deve proibir o login, ou assumir um perfil padrão (default)?
- Como tratar a expiração da sessão (ex: cookie/token expirado) enquanto o usuário interage na listagem?

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: O sistema DEVE fornecer autenticação via Email e Senha.
- **FR-002**: O sistema DEVE redirecionar usuários autenticados para um Dashboard.
- **FR-003**: O Dashboard DEVE conter um menu lateral esquerdo que seja fixo em resoluções Desktop e oculto (menu hamburguer) em resoluções Mobile.
- **FR-004**: O sistema DEVE implementar controle de acesso baseado em Perfis (RBAC), onde cada Perfil possui N Permissões associadas a `Módulo` + `Ação`.
- **FR-005**: A visibilidade dos itens do menu lateral DEVE ser condicionada às permissões do perfil do usuário logado.
- **FR-006**: As interfaces dos módulos "Usuários" e "Perfis" DEVEM seguir um layout padronizado: tabela de listagem paginada, botão "Criar novo" no canto superior direito e botões apenas com ícones para as ações (Visualizar, Editar, Excluir) em cada linha de registro.
- **FR-007**: A renderização dos botões de ação (Visualizar, Editar, Criar, Excluir) nas listagens DEVE obedecer as permissões concedidas ao perfil do usuário atual.

### Key Entities

- **User**: Representa o indivíduo que faz login. Possui email, senha criptografada, e uma referência para um `Profile`.
- **Profile (Perfil)**: Representa um papel no sistema (ex: Admin, Coordenador). Relaciona-se 1:N com `User` e N:M com `Permission`.
- **Permission**: A definição de uma ação sobre um módulo. (Exemplo prático de estrutura: Entidade base com as chaves `module` (ex: "users") e `action` (ex: "create", "read", "update", "delete")).

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Um usuário consegue completar o ciclo completo (login > navegação > logout) sem enfrentar erros no layout responsivo em testes com telas de 320px a 1920px.
- **SC-002**: Usuários não autorizados são bloqueados de acessar as URLs restritas via acesso direto (navegador) com 100% de sucesso.
- **SC-003**: A renderização da lista de permissões e do menu com base nelas (RBAC) ocorre de forma transparente ao usuário final, sem degradação perceptível na velocidade de carregamento (TTR < 1s).
- **SC-004**: O layout padronizado (tabelas e paginação) é consistentemente aplicado nos módulos "Usuários" e "Perfis", permitindo que um usuário execute uma ação do CRUD em menos de 3 cliques a partir do dashboard.

## Assumptions

- Presume-se que o sistema será utilizado em navegadores modernos, tanto em desktops quanto em smartphones.
- Presume-se que a autenticação utilizará o provedor de sessões baseado em cookies (padrão configurado no `001-project-base`).
- As permissões iniciais do sistema (as ações e módulos existentes) podem ser provisionadas via _seeder_ no banco de dados para evitar a criação de uma tela estritamente para cadastrar módulos lógicos na infraestrutura.
- Um usuário possui apenas um único Perfil ativo por vez (relação 1:N entre Perfil e Usuários).
