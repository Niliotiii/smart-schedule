# Feature Specification: Cadastro de Funções (Ministry Roles)

**Feature Branch**: `009-ministry-roles`
**Created**: 2026-04-22
**Status**: Draft
**Input**: User description: "Quero poder cadastrar funções que serão desempenhadas exemplo: librífero, ceroferário, turiferário. Devo ter um CRUD completo semelhante a tipo de usuário onde irei registrar nome e descrição da função"

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Cadastrar nova função (Priority: P1)

Como administrador do sistema, quero cadastrar novas funções litúrgicas (ex: librífero, ceroferário, turiferário) informando nome e descrição, para que eu possa organizar as funções desempenhadas durante as celebrações.

**Why this priority**: Este é o núcleo da funcionalidade. Sem a capacidade de cadastrar funções, não há como organizar os papéis litúrgicos.

**Independent Test**: Pode ser testado independentemente criando uma nova função com nome e descrição e verificando se ela aparece na listagem.

**Acceptance Scenarios**:

1. **Given** que estou na tela de listagem de funções, **When** clico em "Nova Função", preencho o nome "Librífero", a descrição "Responsável por carregar o livro das sagradas escrituras" e clico em salvar, **Then** o sistema deve registrar a nova função e redirecionar para a listagem exibindo uma mensagem de sucesso.
2. **Given** que estou no formulário de criação de função, **When** tento salvar sem preencher o nome, **Then** o sistema deve exibir mensagens de validação informando que o nome é obrigatório.

---

### User Story 2 - Listar e buscar funções (Priority: P1)

Como administrador do sistema, quero visualizar todas as funções cadastradas em uma lista paginada e poder buscar por nome, para que eu possa encontrar rapidamente a função que preciso.

**Why this priority**: A listagem com busca é essencial para gerenciar as funções cadastradas e facilita a navegação no sistema.

**Independent Test**: Pode ser testado independentemente acessando a tela de listagem e verificando se as funções são exibidas com paginação e busca funcional.

**Acceptance Scenarios**:

1. **Given** que existem funções cadastradas no sistema, **When** acesso a tela de listagem, **Then** deve exibir todas as funções em uma tabela paginada com colunas para nome e descrição.
2. **Given** que estou na listagem de funções, **When** digito "libri" no campo de busca, **Then** deve filtrar e exibir apenas as funções cujo nome contenha "libri".

---

### User Story 3 - Visualizar detalhes de uma função (Priority: P2)

Como administrador do sistema, quero visualizar os detalhes de uma função específica, para que eu possa conferir todas as informações cadastradas antes de editar.

**Why this priority**: A visualização de detalhes melhora a experiência do usuário e é um padrão já estabelecido no sistema (igrejas, padres, tipos de usuário).

**Independent Test**: Pode ser testado independentemente clicando no botão de visualizar em uma função da listagem e verificando se os dados são exibidos corretamente.

**Acceptance Scenarios**:

1. **Given** que estou na listagem de funções, **When** clico no botão de visualizar de uma função chamada "Turiferário", **Then** devo ser redirecionado para a tela de detalhes exibindo o nome "Turiferário", a descrição e a data de criação.

---

### User Story 4 - Editar uma função existente (Priority: P2)

Como administrador do sistema, quero editar os dados de uma função cadastrada, para que eu possa corrigir informações ou atualizar a descrição conforme necessário.

**Why this priority**: A edição é necessária para manter os dados atualizados e corrigir eventuais erros de cadastro.

**Independent Test**: Pode ser testado independentemente acessando a tela de edição de uma função existente, alterando os dados e verificando se as mudanças são persistidas.

**Acceptance Scenarios**:

1. **Given** que estou na tela de detalhes de uma função chamada "Ceroferário", **When** clico em "Editar", altero a descrição para "Responsável por conduzir o círio pascal" e salvo, **Then** o sistema deve atualizar os dados e redirecionar para a listagem com mensagem de sucesso.
2. **Given** que estou no formulário de edição e removo o nome da função, **When** tento salvar, **Then** o sistema deve exibir mensagem de validação informando que o nome é obrigatório.

---

### User Story 5 - Excluir uma função (Priority: P2)

Como administrador do sistema, quero excluir funções que não são mais utilizadas, para que a lista permaneça organizada e relevante.

**Why this priority**: A exclusão é parte de um CRUD completo e evita poluição da base de dados com registros obsoletos.

**Independent Test**: Pode ser testado independentemente clicando em excluir em uma função da listagem, confirmando a exclusão e verificando se desaparece da listagem.

**Acceptance Scenarios**:

1. **Given** que estou na listagem de funções e existe uma função chamada "Turiferário", **When** clico em excluir e confirmo a ação, **Then** o sistema deve marcar a função como excluída (soft delete) e removê-la da listagem com uma mensagem de sucesso.
2. **Given** que estou na listagem de funções, **When** clico em excluir e cancelo a confirmação, **Then** a função deve permanecer na listagem sem alterações.

---

### Edge Cases

- What happens when a user tries to register a function name that already exists? (Duplicate name)
- How does the system handle deleting a function that is referenced by other records in the system? (Referential integrity)
- What happens when the description field is left empty during creation? (Optional field behavior)
- How does the system handle navigation away from the form with unsaved changes? (Dirty form state)

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: System MUST allow administrators to create new ministry roles with a name and an optional description
- **FR-002**: System MUST enforce that the role name is required and unique within the system
- **FR-003**: System MUST allow administrators to view a paginated list of all ministry roles
- **FR-004**: System MUST support searching ministry roles by name with debounced input
- **FR-005**: System MUST allow administrators to view the details of a specific ministry role
- **FR-006**: System MUST allow administrators to edit existing ministry role information
- **FR-007**: System MUST allow administrators to delete ministry roles using soft delete (mark as deleted without removing from database)
- **FR-008**: System MUST display user-friendly success and error messages for all CRUD operations
- **FR-009**: System MUST restrict access to ministry role management based on user permissions
- **FR-010**: System MUST display form validation errors clearly inline on the respective fields

### Key Entities _(include if feature involves data)_

- **MinistryRole (Função)**: Represents a liturgical or ministry role that can be performed (e.g., librífero, ceroferário, turiferário). Key attributes: name (required, unique), description (optional, free text), timestamps (created_at, updated_at), soft-delete timestamp (deleted_at).

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Administrators can register a new ministry role in under 1 minute with just name and optional description
- **SC-002**: The listing page loads within 2 seconds of page load for up to 50 registered roles
- **SC-003**: Search results update within 1 second after typing stops (debounced)
- **SC-004**: 100% of CRUD operations display appropriate success or error feedback to the user
- **SC-005**: All ministry role data persists correctly across sessions
- **SC-006**: Deleted roles do not appear in listings (soft delete behavior)

## Assumptions

- Only users with the appropriate permissions can access ministry role management
- The feature follows the same UI/UX patterns as existing modules (User Types, Churches, Priests)
- Soft delete strategy is consistent with other modules in the system
- Ministry roles are independent entities and do not have complex relationships with other modules at this stage
- The system uses role-based access control (RBAC) with the existing permissions framework
- Portuguese (pt-BR) is the primary language for the user interface

## Dependencies & Related Features

- **Existing System**: Depends on the existing User Types module pattern and PrimeVue UI components
- **RBAC System**: Requires integration with the existing AdonisJS Bouncer permissions framework
- **Sidebar Navigation**: Menu item for "Funções" should appear for users with the appropriate read permission
- **Database**: Requires new migration for the ministry_roles table with soft delete support
- **Related Features**: User Types (#006) established the UI pattern; Churches (#007) and Priests (#008) followed the same pattern and should be consistent
