# Quickstart: Gerar Nova Senha para Usuário

## O que será implementado

1. **Seeder**: `'reset_password'` adicionado ao array `ACTIONS` em `database/seeders/database_seeder.ts`
2. **Ability**: `usersResetPassword` em `app/abilities/main.ts`
3. **Middleware**: `usersResetPassword` no `inertia_shared_props_middleware.ts`
4. **Controller**: método `resetPassword` em `users_controller.ts`
5. **Rota**: `POST /users/:id/reset-password` em `start/routes.ts`
6. **Frontend**: botão e Dialog one-time password em `resources/js/Pages/Users/Index.vue`

## Arquivos modificados

```text
app/abilities/main.ts                       → +1 ability
app/controllers/users_controller.ts         → +1 método
app/middleware/inertia_shared_props_middleware.ts → +1 prop
database/seeders/database_seeder.ts         → +1 action
resources/js/Pages/Users/Index.vue          → +botão + dialog
start/routes.ts                             → +1 rota
```

## Como testar

1. Rodar `node ace db:seed` para criar a permissão `users:reset_password`
2. Acessar `/users` — botão "Resetar Senha" deve estar visível para admin
3. Clicar no botão → modal deve aparecer com a nova senha
4. Fechar modal → senha não deve estar mais visível
5. Clicar no botão novamente → nova senha gerada (diferente da anterior)
6. Fazer login com a nova senha — deve funcionar
7. Login com senha antiga — deve ser rejeitado
