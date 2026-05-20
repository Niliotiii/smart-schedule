# Research: Gerar Nova Senha para Usuário

## Password Generation

**Decision**: Reutilizar `randomBytes(18).toString('base64').substring(0, 24)` — padrão já existente em `users_controller.ts:110`.
**Rationale**: Já implementado e testado no fluxo de criação de usuário. Gera 24 caracteres base64 com entropia suficiente (~144 bits).
**Alternatives considered**: `crypto.randomUUID()` (menos caracteres), `bcrypt` gen salt (formato não amigável para copiar).

## Password Hashing

**Decision**: Automático via `AuthFinder` no modelo User (`app/models/user.ts:20-22`).
**Rationale**: Ao atribuir `user.password = generatedPassword` e salvar, o hook do AdonisJS Auth faz o hash automaticamente com scrypt.

## Permission System

**Decision**: Seguir padrão existente: adicionar `reset_password` no array `ACTIONS` do seeder e criar ability `usersResetPassword`.
**Rationale**: O sistema de permissões é baseado em módulo + ação. O seeder cria automaticamente `users:reset_password`. A ability no Bouncer segue o mesmo padrão das demais: `checkPermission(user, 'users:reset_password')`.

## Route Design

**Decision**: `POST /users/:id/reset-password` — rota fora do resource padrão.
**Rationale**: O `router.resource('users', ...)` não cobre essa ação. Usar `router.post('users/:id/reset-password', ...)` seguindo o padrão AdonisJS para rotas adicionais fora do resource.

## One-Time Password Display

**Decision**: Dialog do PrimeVue com `closable: true`. A senha é armazenada em um `ref` local no componente Vue. Quando o dialog é fechado, a `ref` é limpa (`password.value = null`).
**Rationale**: Não há necessidade de controle server-side — o dado sensível (senha em texto claro) nunca é armazenado no servidor. A senha é retornada na resposta da API e exibida imediatamente. Ao fechar, o frontend descarta a referência.

## Error Handling

**Decision**: Toast de erro em caso de falha, seguindo padrão existente no projeto.
**Rationale**: O controller já usa `session.flash()` para sucesso. Para requisições AJAX (Inertia), usar toast via flash ou resposta JSON.
