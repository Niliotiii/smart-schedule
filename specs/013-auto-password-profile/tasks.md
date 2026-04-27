# Tasks: Senha Automática e Perfil do Usuário

**Input**: Design documents from `/specs/013-auto-password-profile/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

### Implementation for Foundational

- [x] T001 [P] Atualizar `createUserValidator` em `app/validators/user.ts` para remover campos `password` e `passwordConfirmation`
- [x] T002 [P] Atualizar `updateUserValidator` em `app/validators/user.ts` para tornar `password` e `passwordConfirmation` opcionais (já são, mas verificar se a alteração do T001 não impacta)
- [x] T003 [P] Criar `account_validator.ts` em `app/validators/account.ts` com validações para update de perfil e alteração de senha
- [x] T004 Criar helper `generateAutoPassword()` em `app/utils/password.ts` (ou diretamente no controller) usando `crypto.randomBytes(16).toString('base64')`

**Checkpoint**: Foundation ready — validator de usuário sem senha obrigatória, validator de conta criado, gerador de senha pronto. User story implementation can now begin.

---

## Phase 3: User Story 1 — Senha automática na criação de usuário (Priority: P1) 🎯 MVP

**Goal**: Administrador cria usuário sem digitar senha; sistema gera automaticamente uma senha segura e a armazena como hash.

**Independent Test**: Criar um usuário pelo formulário de admin sem campos de senha, verificar no banco que o campo `password` contém um hash válido, e tentar login com senha gerada (conhecida via seed/teste).

### Implementation for User Story 1

- [x] T005 [US1] Atualizar `UsersController.store` em `app/controllers/users_controller.ts` para gerar senha automática via `generateAutoPassword()` e passar para `User.create({ password: generatedPassword, ... })`
- [x] T006 [P] [US1] Atualizar `Users/Form.vue` em `resources/js/Pages/Users/Form.vue` para ocultar os campos "Senha" e "Confirmação de Senha" quando `props.user` é `null` (modo criação)
- [x] T007 [US1] Garantir que o serializer do `UsersController.index/show` em `app/controllers/users_controller.ts` NUNCA exponha o campo `password` (já está oculto via `serializeAs: null` no modelo, mas confirmar no controller)

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently. Criar usuário via admin gera senha automática sem expô-la.

---

## Phase 4: User Story 2 — Perfil do usuário via nome no topo direito (Priority: P2)

**Goal**: Usuário logado clica no próprio nome no topo direito, abre um dropdown com opções (Perfil, Sair) e acessa uma página de perfil pessoal.

**Independent Test**: Logar no sistema, clicar no nome no topo direito, verificar que dropdown aparece com "Perfil", clicar em "Perfil" e ser redirecionado para `/account/profile` com os dados pessoais carregados.

### Implementation for User Story 2

- [x] T008 [P] [US2] Criar `AccountController` em `app/controllers/account_controller.ts` com métodos `show` e `updateProfile`
- [x] T009 [P] [US2] Adicionar rotas de conta em `start/routes.ts`: `GET/PUT /account/profile` e `PUT /account/password` dentro do grupo autenticado
- [x] T010 [P] [US2] Criar página `Account/Profile.vue` em `resources/js/Pages/Account/Profile.vue` com formulário de dados pessoais (nome, e-mail, telefone)
- [x] T011 [US2] Atualizar `AppTopbar.vue` em `resources/js/Components/AppTopbar.vue` para tornar o nome do usuário clicável e exibir dropdown `Menu` do PrimeVue com itens "Perfil" e "Sair"

**Checkpoint**: User Story 2 is independently testable. Perfil acessível em 2 cliques, dados pessoais editáveis, dropdown funcional.

---

## Phase 5: User Story 3 — Alteração de senha pelo próprio usuário (Priority: P3)

**Goal**: Na página de perfil, usuário pode alterar sua senha informando senha atual, nova senha e confirmação. Após sucesso, sessão é invalidada e redirecionado para login.

**Independent Test**: Acessar perfil, preencher senha atual correta + nova senha válida + confirmação igual, salvar, verificar redirecionamento para `/login` com mensagem, e conseguir logar com nova senha.

### Implementation for User Story 3

- [x] T012 [P] [US3] Adicionar método `changePassword` em `app/controllers/account_controller.ts` com verificação de senha atual via `User.verifyCredentials`
- [x] T013 [P] [US3] Atualizar `account_validator.ts` em `app/validators/account.ts` com validação para `currentPassword`, `newPassword`, `newPasswordConfirmation`
- [x] T014 [US3] Adicionar aba/seção "Alterar Senha" em `resources/js/Pages/Account/Profile.vue` com campos de senha atual, nova senha e confirmação
- [x] T015 [US3] Implementar invalidação de sessão após alteração de senha em `AccountController.changePassword` usando `auth.use('web').logout()` e redirecionar para `/login` com flash message
- [x] T016 [US3] Adicionar mensagem de sucesso em `resources/js/Pages/Auth/Login.vue` para exibir flash "Senha alterada com sucesso. Faça login novamente."

**Checkpoint**: User Story 3 is independently testable. Alteração de senha funciona, validações em português, sessão invalidada, novo login com nova senha funciona.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T017 [P] Corrigir importação de `crypto` no Node.js (`node:crypto`) e garantir compatibilidade
- [x] T018 [P] Executar `npm run typecheck` e corrigir erros de TypeScript em todos os arquivos criados/modificados
- [x] T019 [P] Executar `npm run lint` e corrigir warnings/erros de ESLint
- [x] T020 Validar quickstart.md: executar todos os cenários de teste descritos no documento
- [x] T021 [P] Revisar que nenhuma senha (plain text ou hash) é exposta em responses de API, Inertia props ou logs
- [x] T022 [P] Verificar que o botão "Sair" no dropdown do AppTopbar chama `/logout` via POST (ou método correto já existente)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Foundational (Phase 2)**: No dependencies — pode começar imediatamente. BLOCKS todas as user stories.
- **User Story 1 (Phase 3)**: Depende do Foundational (T001-T004). Pode começar assim que T001 e T004 completos.
- **User Story 2 (Phase 4)**: Depende do Foundational (T001-T004). Pode começar em paralelo com US1.
- **User Story 3 (Phase 5)**: Depende do Foundational + User Story 2 (precisa da página de perfil criada). Requer T009 (rotas) e T010 (página Profile.vue).
- **Polish (Phase 6)**: Depende de todas as user stories completas.

### User Story Dependencies

| Story | Depende de | Independente de |
|-------|-----------|-----------------|
| US1 (P1) | Foundational | US2, US3 |
| US2 (P2) | Foundational | US1, US3 |
| US3 (P3) | Foundational, US2 | US1 |

### Within Each User Story

- Models/validators before controllers
- Controllers before rotas
- Rotas before páginas Vue
- Core implementation before integração

### Parallel Opportunities

- T001 e T002 e T003 e T004 podem rodar em paralelo (arquivos diferentes)
- T005 e T006 podem rodar em paralelo (controller e Vue component)
- T008 e T009 e T010 e T011 podem rodar em paralelo (controller, rotas, página, topbar)
- T012 e T013 e T014 podem rodar em paralelo (controller, validator, Vue component)
- T017 até T022 (Polish) podem rodar grande parte em paralelo

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 2: Foundational (T001-T004)
2. Complete Phase 3: User Story 1 (T005-T007)
3. **STOP and VALIDATE**: Testar criação de usuário com senha automática
4. Deploy/demo if ready

### Incremental Delivery

1. Complete Foundational → Foundation ready
2. Add User Story 1 → Testar senha automática → Deploy/Demo (MVP!)
3. Add User Story 2 → Testar dropdown e perfil → Deploy/Demo
4. Add User Story 3 → Testar alteração de senha → Deploy/Demo
5. Cada story adiciona valor sem quebrar as anteriores

### Parallel Team Strategy

Com múltiplos desenvolvedores:

1. Time completa Foundational juntos
2. Uma vez completo:
   - Dev A: User Story 1 (T005-T007)
   - Dev B: User Story 2 (T008-T011)
3. Quando US2 estiver pronto:
   - Dev A ou B: User Story 3 (T012-T016)
4. Todos juntos: Polish (T017-T022)

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- O helper `generateAutoPassword` pode ser implementado diretamente no controller se preferir evitar criar novo arquivo; neste caso, T004 é incorporado em T005
