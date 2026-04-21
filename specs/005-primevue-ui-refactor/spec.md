# Feature Specification: PrimeVue UI Refactor

**Feature Branch**: `005-primevue-ui-refactor`
**Created**: 2026-04-20
**Status**: Draft
**Input**: User description: "Instale o prime-vue (npm install primevue @primeuix/themes) e refatore a UI tendo como exemplo o projeto sakai-vue que é um template de tema"

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Layout Shell with PrimeVue Components (Priority: P1)

Um usuário autenticado acessa o sistema e vê uma interface redesenhada usando componentes PrimeVue: sidebar com menu navegável estilo sakai-vue, topbar com toggle de tema e avatar do usuário, e área de conteúdo fluida. A navegação entre páginas é via SPA (Inertia) sem recarregamento.

**Why this priority**: A layout shell é a base de toda a experiência visual — sem ela, nenhuma outra refatoração de UI faz sentido. É a fundação que todas as páginas compartilham.

**Independent Test**: Pode ser testada acessando qualquer página autenticada e verificando que o sidebar, topbar e área de conteúdo renderizam com componentes PrimeVue e navegação funciona corretamente.

**Acceptance Scenarios**:

1. **Given** que o usuário está autenticado, **When** acessa qualquer página protegida, **Then** o layout exibe sidebar com itens de menu (Dashboard, Usuários, Perfis) usando estilo de menu PrimeVue e topbar com avatar e toggle de tema
2. **Given** que o usuário está em um dispositivo móvel, **When** clica no botão hamburger, **Then** o sidebar abre como overlay com máscara de fundo e pode ser fechado tocando fora
3. **Given** que o usuário está em desktop, **When** navega entre páginas via sidebar, **Then** a navegação ocorre via SPA sem recarregamento e o item ativo fica destacado

---

### User Story 2 - Refactored CRUD Pages with PrimeVue DataTable (Priority: P2)

Um administrador gerencia usuários e perfis através de páginas de listagem, criação e edição usando componentes PrimeVue: DataTable com paginação, ordenação e busca integrada; formulários com InputText, Select e validação; dialogs de confirmação para exclusão; e toasts de feedback.

**Why this priority**: As páginas CRUD são a funcionalidade principal do sistema e se beneficiam enormemente dos componentes ricos do PrimeVue (DataTable, Toast, Dialog, formulários).

**Independent Test**: Pode ser testada acessando /users, criando um usuário, editando e excluindo — todos os fluxos CRUD devem funcionar com componentes PrimeVue.

**Acceptance Scenarios**:

1. **Given** que o administrador acessa a listagem de usuários, **When** visualiza a tabela, **Then** os dados são exibidos em um DataTable com paginação, busca e ações por linha
2. **Given** que o administrador clica em "Novo Usuário", **When** preenche o formulário e submete, **Then** os dados são salvos e um toast de sucesso é exibido
3. **Given** que o administrador clica em excluir um usuário, **When** confirma a exclusão no dialog, **Then** o usuário é removido e um toast de sucesso aparece
4. **Given** que o administrador busca usuários pelo campo de busca, **When** digita um termo e submete, **Then** os resultados são filtrados na tabela com feedback visual

---

### User Story 3 - Theming System with PrimeVue Design Tokens (Priority: P3)

Qualquer usuário alterna entre tema claro e escuro usando o toggle no topbar. O sistema aplica o tema globalmente usando PrimeVue design tokens e o preset Aura, garantindo consistência visual em todos os componentes PrimeVue e elementos customizados. A preferência de tema é persistida.

**Why this priority**: O theming já funciona parcialmente com Tailwind dark mode — refatorar para PrimeVue design tokens melhora consistência mas depende da base de componentes estar em produção (P1).

**Independent Test**: Pode ser testado clicando no toggle de tema e verificando que todos os componentes mudam de tema consistentemente, e que a preferência persiste ao recarregar.

**Acceptance Scenarios**:

1. **Given** que o usuário está em tema claro, **When** clica no toggle de tema, **Then** todo o layout e componentes mudam para tema escuro com transição suave
2. **Given** que o usuário definiu tema escuro, **When** recarrega a página, **Then** o tema escuro é restaurado automaticamente
3. **Given** que o sistema respeita a preferência do sistema operacional, **When** um novo usuário acessa pela primeira vez, **Then** o tema inicial corresponde à preferência do sistema

---

### User Story 4 - Login Page with PrimeVue Styling (Priority: P4)

Um usuário não autenticado visualiza e utiliza a página de login estilizada com componentes PrimeVue (InputText, Password, Button) dentro de um layout de visitante centralizado e responsivo.

**Why this priority**: A página de login é importante mas tem escopo limitado — um formulário simples — e depende do GuestLayout já existente.

**Independent Test**: Pode ser testada acessando /login, inserindo credenciais e verificando que o formulário usa componentes PrimeVue com validação visual.

**Acceptance Scenarios**:

1. **Given** que o usuário não está autenticado, **When** acessa /login, **Then** visualiza um formulário centralizado com campos InputText e Password do PrimeVue
2. **Given** que o usuário submete credenciais inválidas, **When** recebe erro de autenticação, **Then** uma mensagem de erro é exibida usando componentes PrimeVue (Message ou Toast)

---

### Edge Cases

- O que acontece quando o sidebar é redimensionado ou colapsado em diferentes breakpoints? — O sidebar usa modo overlay em mobile e estático em desktop, seguindo o padrão sakai-vue.
- Como o sistema se comporta quando o PrimeVue falha ao carregar? — Assume-se que é instalado localmente via npm, sem dependência de CDN.
- O que acontece quando um usuário com permissões limitadas vê o menu? — Itens não autorizados ficam ocultos (comportamento existente via Bouncer/`can`).
- Como o DataTable lida com um conjunto vazio de dados? — Deve exibir mensagem amigável usando emptyMessage do DataTable.
- Como o tema reage quando a preferência do sistema muda enquanto o app está aberto? — O composable detecta via `matchMedia` listener.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: O sistema DEVE instalar PrimeVue e @primeuix/themes como dependências de produção
- **FR-002**: O sistema DEVE configurar PrimeVue no entrypoint Vue com o preset Aura, tema escuro via seletor `.app-dark`, e integração com Tailwind CSS via `tailwindcss-primeui`
- **FR-003**: O sistema DEVE refatorar o Sidebar para usar estilo sakai-vue: itens de menu com ícones PrimeIcons, destaque de item ativo, suporte a modo estático e overlay mobile
- **FR-004**: O sistema DEVE refatorar o Navbar/Topbar para estilo sakai-vue: botão hamburger, logo, toggle de tema (ícone lua/sol), e área do usuário
- **FR-005**: O sistema DEVE refatorar o AuthenticatedLayout para usar a estrutura de layout sakai-vue (sidebar fixo + topbar sticky + área de conteúdo scrollável)
- **FR-006**: O sistema DEVE substituir a tabela HTML customizada por PrimeVue DataTable com paginação, busca integrada (IconField + InputIcon), e colunas de ações
- **FR-007**: O sistema DEVE substituir formulários HTML customizados por componentes PrimeVue (InputText, Select, Password, etc.) com estilos consistentes
- **FR-008**: O sistema DEVE substituir `confirm()` nativo por ConfirmationService (PrimeVue) para dialogs de confirmação de exclusão
- **FR-009**: O sistema DEVE substituir mensagens flash manuais por Toast (PrimeVue useToast) para feedback de sucesso e erro
- **FR-010**: O sistema DEVE refatorar o useTheme composable para integrar com PrimeVue design tokens e o seletor `.app-dark`, mantendo persistência em localStorage e detecção de preferência do sistema
- **FR-011**: O sistema DEVE manter todas as funcionalidades existentes: autenticação, RBAC (Bouncer), navegação SPA (Inertia), busca, paginação, CRUD completo
- **FR-012**: O sistema DEVE manter a página de login funcional usando componentes PrimeVue no GuestLayout
- **FR-013**: O sistema DEVE manter o layout responsivo (mobile-first) com sidebar overlay em telas menores e sidebar estático em desktop

### Key Entities

- **Layout Shell**: Estrutura visual compartilhada com sidebar, topbar e área de conteúdo — substitui os componentes atuais Sidebar.vue, Navbar.vue e AuthenticatedLayout.vue
- **DataTable Config**: Configuração reutilizável para tabelas de listagem com paginação, filtros e ações — substitui as tabelas HTML manuais
- **Theme Configuration**: Estado reativo do tema (claro/escuro, preset Aura) com design tokens PrimeVue — substitui o useTheme atual baseado em classes CSS Tailwind
- **Menu Definition**: Estrutura de itens de menu com permissões RBAC, ícones PrimeIcons e rotas — substitui os links hardcoded no Sidebar atual

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Todas as 7 páginas existentes (Login, Dashboard, Users Index/Form/Show, Profiles Index/Form/Show) renderizam corretamente com componentes PrimeVue sem regressões funcionais
- **SC-002**: A navegação entre páginas acontece via SPA sem recarregamento completo, mantendo o comportamento atual do Inertia
- **SC-003**: O toggle de tema alterna todo o layout entre claro e escuro em menos de 1 segundo, com todos os componentes PrimeVue respondendo consistentemente
- **SC-004**: A interface é totalmente usável em dispositivos móveis (320px de largura) e desktop (1280px+), com sidebar overlay e estático respectivamente
- **SC-005**: O DataTable suporta paginação, busca e exclusão com confirmação via dialog — mesma funcionalidade que a implementação atual mas com UX aprimorada
- **SC-006**: O sistema de permissões RBAC continua funcionando: itens de menu e ações são exibidos/escondidos conforme as permissões do usuário autenticado

## Assumptions

- PrimeVue será instalado via npm (não CDN) como dependência de produção
- O preset Aura será usado como base, sem necessidade de configurador de tema dinâmico (sem AppConfigurator como no sakai-vue)
- `tailwindcss-primeui` será usado para integração entre PrimeVue design tokens e Tailwind
- Os layouts e páginas existentes terão seus templates substituídos mas a lógica Inertia (props, router) permanece idêntica
- O CRUD de Usuários e Perfis mantém as mesmas rotas e controllers — apenas a camada visual muda
- A busca e paginação continuarão usando o mecanismo server-side atual (query params via Inertia router.get)
- O ConfirmationService substituirá apenas `confirm()` nativo — não serão adicionados fluxos de undo/soft-delete
- Os ícones customizados (componente Icon.vue com SVGs) serão substituídos por PrimeIcons onde houver equivalente
