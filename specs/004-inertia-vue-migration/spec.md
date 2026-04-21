# Feature Specification: Migração para SPA com Inertia.js e Vue

**Feature Branch**: `004-inertia-vue-migration`
**Created**: 2026-04-20
**Status**: Draft
**Input**: User description: "Quero migrar a interface gráfica para parar de usar SSR com .edge e passar usar inertia+vue para ter um tempo de desenvolvimento menor e mais opções de UI"

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Acesso às funcionalidades existentes após migração (Priority: P1)

Como usuário autenticado, quero continuar acessando todas as funcionalidades que já existem no sistema (dashboard, listagem de usuários, formulários, perfis, permissões) sem perda de funcionalidade, para que minha experiência não seja impactada pela mudança tecnológica.

**Why this priority**: É a história mais crítica — a migração não pode quebrar funcionalidade existente. Sem paridade completa, a migração é um retrocesso.

**Independent Test**: Pode ser testado acessando cada página do sistema após a migração (login, dashboard, usuários CRUD, perfis CRUD) e verificando que todas as ações (criar, ler, editar, excluir, buscar, paginar) funcionam como antes.

**Acceptance Scenarios**:

1. **Given** que o sistema foi migrado, **When** faço login, **Then** sou redirecionado para o dashboard e vejo os mesmos dados e opções
2. **Given** que estou no dashboard, **When** clico em "Usuários" ou "Perfis", **Then** a listagem carrega com os mesmos dados, filtros e paginação
3. **Given** que estou na listagem de usuários, **When** crio, edito ou excluo um usuário, **Then** a operação funciona corretamente com feedback visual
4. **Given** que estou na listagem de perfis, **When** crio, edito ou excluo um perfil com permissões, **Then** as permissões são salvas e exibidas corretamente
5. **Given** que estou em qualquer página, **When** navego entre páginas, **Then** a navegação é fluida sem recarregamento completo da página

---

### User Story 2 - Alternância de tema claro/escuro após migração (Priority: P2)

Como usuário, quero que a funcionalidade de alternância entre tema claro e escuro continue funcionando após a migração, para que minha preferência visual seja mantida.

**Why this priority**: O tema foi implementado recentemente e não pode ser perdido na migração. É uma funcionalidade de UX já validada.

**Independent Test**: Pode ser testado clicando no botão de tema e verificando que a alternância funciona, a preferência persiste, e o FOUC não ocorre.

**Acceptance Scenarios**:

1. **Given** que estou em qualquer página, **When** clico no botão de alternância de tema, **Then** o tema muda instantaneamente sem recarregar a página
2. **Given** que selecionei o tema escuro, **When** fecho e reabro o navegador, **Then** o tema escuro é mantido
3. **Given** que é minha primeira visita sem preferência salva, **When** o sistema operacional está em modo escuro, **Then** o tema escuro é aplicado

---

### User Story 3 - Navegação sem recarregamento de página (Priority: P3)

Como usuário, quero que a navegação entre páginas seja instantânea sem recarregamento completo, para que a sensação de uso seja mais fluida e rápida.

**Why this priority**: É o principal benefício perceptível da migração — a SPA navigation. Depende da migração completa (US1) para ser testada.

**Independent Test**: Pode ser testado navegando entre dashboard, usuários e perfis e verificando que não há recarregamento completo da página (sem flash branco, sem spinner de carregamento do navegador).

**Acceptance Scenarios**:

1. **Given** que estou no dashboard, **When** clico no link "Usuários" na sidebar, **Then** a página de usuários carrega sem recarregamento completo
2. **Given** que estou na listagem de usuários, **When** clico em "Novo Usuário", **Then** o formulário aparece sem recarregamento completo
3. **Given** que submeto um formulário com sucesso, **When** sou redirecionado, **Then** a navegação acontece sem recarregamento completo

---

### Edge Cases

- O que acontece quando uma requisição falha (erro de servidor)? O sistema deve exibir uma mensagem de erro amigável
- O que acontece quando o usuário clica no botão "Voltar" do navegador? O estado da página anterior deve ser restaurado
- O que acontece quando o CSRF token expira? O sistema deve lidar com isso gracefully (reautenticar ou renovar o token)
- O que acontece com formulários que exigem confirmação antes de excluir? O mecanismo de confirmação deve funcionar via mecanismo nativo do novo framework
- O que acontece com validações de backend? Erros de validação devem ser exibidos nos formulários via dados compartilhados automaticamente

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: O sistema DEVE manter todas as funcionalidades existentes (CRUD de usuários, CRUD de perfis, autenticação, RBAC, dashboard, busca, paginação) após a migração
- **FR-002**: O sistema DEVE permitir navegação entre páginas sem recarregamento completo (SPA navigation)
- **FR-003**: O sistema DEVE manter o controle de acesso (RBAC) funcionando corretamente — usuários só veem e acessam o que suas permissões permitem
- **FR-004**: O sistema DEVE exibir mensagens de sucesso e erro provenientes do backend (flash messages) na interface
- **FR-005**: O sistema DEVE exibir erros de validação nos formulários quando o backend rejeitar dados
- **FR-006**: O sistema DEVE manter a funcionalidade de alternância de tema claro/escuro
- **FR-007**: O sistema DEVE manter a persistência de preferência de tema via.localStorage
- **FR-008**: O sistema DEVE manter a detecção de preferência do SO na primeira visita
- **FR-009**: O sistema DEVE funcionar com autenticação via sessão (mantendo o auth session existente)

### Key Entities

- **Página SPA**: Cada rota existente (login, dashboard, usuários index/create/edit/show, perfis index/create/edit/show) deve ser convertida para um componente de página equivalente
- **Dados Compartilhados**: Dados compartilhados entre todas as páginas (usuário autenticado, erros, mensagens flash, permissões) devem ser passados automaticamente

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: 100% das funcionalidades pré-migração permanecem operacionais após a migração (zero regressão funcional)
- **SC-002**: A navegação entre páginas acontece sem recarregamento completo em 100% dos links internos
- **SC-003**: O tempo de resposta percebido pelo usuário ao navegar entre páginas é reduzido em pelo menos 50% comparado à navegação anterior
- **SC-004**: O tempo de desenvolvimento de novas telas é reduzido pela possibilidade de usar componentes reutilizáveis e o ecossistema de UI

## Assumptions

- A migração substitui todos os templates Edge por componentes Vue, removendo a dependência de templates server-side para renderização de páginas
- O backend continua servindo os mesmos controllers e rotas, adaptados para retornar respostas no formato esperado pelo novo mecanismo de renderização em vez de templates server-side
- A autenticação continua sendo via sessão, sem migração para JWT/token
- As rotas existentes (URLs) permanecem as mesmas — apenas a forma de renderizar a resposta muda
- O template principal (layout com sidebar/navbar) será um componente compartilhado, eliminando a duplicação atual dos templates
- A funcionalidade de tema será gerenciada via composable/plugin em vez de script inline no HTML
- O Tailwind CSS v4 continuará sendo usado, com as mesmas classes de tema já implementadas
