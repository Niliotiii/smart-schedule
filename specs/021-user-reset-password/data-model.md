# Data Model: Gerar Nova Senha para Usuário

## Entity: User (existente — sem alterações)

Nenhuma coluna nova. A senha é hashada automaticamente pelo `AuthFinder` ao salvar.

### Fields relevantes

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | number (PK) | Identificador único |
| `password` | string (hashed) | Senha hashada via scrypt (automático pelo AdonisJS Auth) |

## Entity: Permission (nova semente)

| Campo | Valor |
|-------|-------|
| `module` | `users` |
| `action` | `reset_password` |
| `description` | `Permite resetar senha de usuários` |

## State Transitions

1. **Admin clica "Resetar Senha"** → POST `/users/:id/reset-password`
2. **Servidor**: valida permissão → gera `randomBytes(18).base64(24)` → atribui `user.password = generated` → `user.save()` (hash automático)
3. **Servidor retorna**: `{ password: "aB3x...K9z2" }` (senha em texto claro, apenas nesta resposta)
4. **Frontend**: exibe senha no Dialog → ao fechar, limpa `ref` → senha nunca mais visível

## Dados de Semente

- Adicionar `'reset_password'` ao array `ACTIONS` no `database_seeder.ts`
- A permissão `users:reset_password` será criada automaticamente pelo seeder
- O perfil "Administrador" ganhará a nova permissão automaticamente (via `sync` de todas as permissões)
