---
description: 'Task list for user reset password feature'
---

# Tasks: Gerar Nova Senha para Usuário

**Input**: Design documents from `specs/021-user-reset-password/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- Monolith project at repository root
- Backend: `app/`
- Frontend: `resources/js/`
- Routes: `start/`
- Database: `database/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Add the new permission and ability that all stories depend on.

- [x] T001 Adicionar `'reset_password'` ao array `ACTIONS` no `database/seeders/database_seeder.ts` e seu label em `actionLabel()`
- [x] T002 [P] Criar ability `usersResetPassword` em `app/abilities/main.ts`
- [x] T003 [P] Adicionar `usersResetPassword` no `app/middleware/inertia_shared_props_middleware.ts`

**Checkpoint**: Permissão e ability prontas. Executar `node ace db:seed` para criar a permissão no banco.

---

## Phase 2: User Story 1 - Administrador gera nova senha (Priority: P1) 🎯 MVP

**Goal**: Administrador com permissão pode clicar em um botão na listagem, gerar nova senha e visualizá-la em um modal one-time.

**Independent Test**: Acessar `/users` com perfil Admin, clicar no botão "Resetar Senha" de qualquer usuário — modal deve aparecer com a nova senha. Fechar o modal e clicar no mesmo botão — senha anterior não deve estar visível, uma nova deve ser gerada.

### Implementation for User Story 1

- [x] T004 Adicionar método `resetPassword` no `app/controllers/users_controller.ts` que:
  - Autoriza com `usersResetPassword`
  - Gera senha com `randomBytes(18).toString('base64').substring(0, 24)` (mesmo padrão existente)
  - Persiste `user.password = generatedPassword` + `user.save()` (hash automático via AuthFinder)
  - Retorna senha via `session.flash({ resetPassword: generatedPassword })`
- [x] T005 Adicionar rota `router.post('users/:id/reset-password', ...)` em `start/routes.ts` (fora do resource)
- [x] T006 [P] Adicionar prop `usersResetPassword` no `resources/js/Pages/Users/Index.vue` (no `defineProps`)
- [x] T007 Adicionar botão "Resetar Senha" na coluna de ações em `resources/js/Pages/Users/Index.vue`:
  - Visível apenas se `can.usersResetPassword`
  - Ícone `pi pi-key`
  - Faz POST para `/users/${data.id}/reset-password`
- [x] T008 Adicionar Dialog (PrimeVue) em `resources/js/Pages/Users/Index.vue`:
  - Exibe a senha em texto claro com aviso "Copie a senha antes de fechar"
  - Ao fechar o dialog, limpa a `ref` da senha (`generatedPassword.value = ''`)
  - Input do tipo text readonly com a senha e botão copiar
- [x] T009 Adicionar toast de sucesso/erro para feedback da operação em `resources/js/Pages/Users/Index.vue`

**Checkpoint**: US1 completo — administrador consegue gerar senha e visualizar no modal.

---

## Phase 3: User Story 2 - Administrador sem permissão não vê o botão (Priority: P2)

**Goal**: Usuários sem a permissão `users:reset_password` não visualizam o botão de resetar senha.

**Independent Test**: Desmarcar a permissão `users:reset_password` de um perfil e acessar a listagem com esse perfil — o botão não deve aparecer.

### Implementation for User Story 2

- [x] T010 [US2] Verificar que `v-if="can.usersResetPassword"` no botão do template é suficiente (já implementado em T007 — testar manualmente)

> **Nota**: Esta US é implementada automaticamente pelo sistema de permissões já existente. O `v-if` no template faz o papel. Apenas validar manualmente.

**Checkpoint**: US2 completo — permissão controla visibilidade do botão.

---

## Phase 4: User Story 3 - Senha gerada é funcional para login (Priority: P2)

**Goal**: A senha gerada é hashada e persistida corretamente, permitindo login.

**Independent Test**: Gerar nova senha para um usuário, fazer logout, e logar com a nova senha.

### Implementation for User Story 3

- [x] T011 [US3] Verificar que a senha é hashada corretamente — o `AuthFinder` no modelo `app/models/user.ts:20-22` já faz isso automaticamente ao salvar. Testar manualmente: gerar senha, fazer logout, logar com a nova senha.

> **Nota**: Esta US é implementada automaticamente pelo `AuthFinder` do AdonisJS. A task T004 já persiste a senha via `user.save()`. Apenas validar manualmente.

**Checkpoint**: US3 completo — senha funcional para login.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Ajustes finais e validação.

- [ ] T012 Validar que a listagem de permissões nos perfis (`/profiles/:id`) mostra `users:reset_password` corretamente
- [ ] T013 Rodar `node ace db:seed` no servidor de produção (VPS) para criar a nova permissão
- [ ] T014 Executar quickstart.md manualmente para validação completa

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — pode começar imediatamente
- **US1 (Phase 2)**: Depende de T001, T002, T003 (ability + permissão)
- **US2 (Phase 3)**: Depende de US1 (implementado via `v-if` no template)
- **US3 (Phase 4)**: Depende de US1 (senha gerada e persistida)
- **Polish (Phase 5)**: Depende de todas as US

### User Story Dependencies

- **US1 (P1)**: Pode começar após Setup — implementação principal
- **US2 (P2)**: Implementado junto com US1 (T007 já inclui `v-if`)
- **US3 (P2)**: Implementado junto com US1 (T004 já persiste a senha)

### Within Each User Story

- T004 (controller) antes de T005 (rota)
- T006 + T007 + T008 (frontend) podem ser paralelos entre si após T005

### Parallel Opportunities

- T002 e T003 podem rodar em paralelo
- T006, T007, T008 podem rodar em paralelo (diferentes partes do mesmo arquivo .vue, requer cuidado)

---

## Parallel Example: User Story 1

```bash
# Setup tasks em paralelo:
# T002: Adicionar ability em app/abilities/main.ts
# T003: Adicionar prop no middleware inertia_shared_props_middleware.ts

# Frontend tasks em paralelo (após T005):
# T006: Adicionar prop no Index.vue
# T007: Adicionar botão no Index.vue
# T008: Adicionar Dialog no Index.vue
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T003)
2. Complete Phase 2: US1 (T004-T009)
3. **STOP and VALIDATE**: Testar US1 independentemente
4. US2 e US3 já estão implementadas como parte da US1

### Incremental Delivery

1. Setup + US1 → Deploy (MVP funcional!)
2. Validar US2 e US3 (já inclusas)
3. Rodar seeder no servidor de produção

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- US2 e US3 são implementadas automaticamente pela US1 (permissão + hash)
- Commit após cada fase ou task relevante
- Rodar `node ace db:seed` após T001
