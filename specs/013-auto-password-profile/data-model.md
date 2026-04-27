# Data Model: Senha Automática e Perfil do Usuário

## Schema Changes

Nenhuma alteração no banco de dados é necessária para esta feature. O schema existente na tabela `users` já suporta todos os requisitos:

- A coluna `password` (string, not null) já armazena o hash da senha gerada automaticamente.
- O modelo `User` já utiliza `withAuthFinder` do AdonisJS Auth, que intercepta a escrita do campo `password` e converte para hash via `hash` service.
- A propriedade `@column({ serializeAs: null })` no campo `password` garante que o hash nunca é serializado em respostas.

## Relevant Entities

### User

| Atributo | Tipo | Regras | Observação |
|----------|------|--------|------------|
| id | number (PK) | auto-increment | — |
| fullName | string, nullable | max 255 | Nome completo |
| email | string | único, max 254 | Identificador de login |
| password | string | min 8, max 32 | **Hash armazenado com bcrypt/argon2** |
| profileId | number, FK | ref profiles | — |
| userTypeId | number, FK | ref user_types | — |
| phone | string | min 10, max 20 | — |
| createdAt | dateTime | auto | — |
| updatedAt | dateTime | auto | — |
| deletedAt | dateTime, nullable | soft-delete | — |

### Session (gerenciada por AdonisJS Auth)

| Atributo | Tipo | Observação |
|----------|------|------------|
| sessionId | string | Gerenciado pelo driver web do AdonisJS |
| userId | number | Referência ao usuário logado |
| invalidada | boolean | Após alteração de senha, a sessão atual é destruída |

### Derived Password (runtime only)

A senha automática é gerada em runtime pelo controller `UsersController.store()` e nunca é persistida em texto plano:

| Propriedade | Valor | Origem |
|-------------|-------|--------|
| plainTextPassword | string de ~22 caracteres | `crypto.randomBytes(16).toString('base64')` |
| hashedPassword | bcrypt hash | `withAuthFinder` intercepta `user.password = plainTextPassword` |

## State Transitions

```
[Usuário criado com senha automática] --(primeiro login)--> [usuário deve alterar senha]
[Senha alterada com sucesso] --(invalida sessão)--> [redirecionado para login]
[Login com nova senha] --(sucesso)--> [nova sessão ativa]
```

## Edge Case Handling (data level)

| Cenário | Comportamento |
|---------|--------------|
| Falha na geração de senha (`crypto.randomBytes` falha) | Lança exceção; transação é revertida; usuário não é criado |
| Hash collision (praticamente impossível) | `unique` no e-mail evita duplicados; o hash da senha não é único por design |
| Senha alterada enquanto usuário tem sessão ativa em outro dispositivo | Outra sessão será invalidada no próximo request (verificação de sessão) |
