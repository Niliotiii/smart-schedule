# Research: Cadastro Completo de Usuários

**Date**: 2026-04-23
**Feature**: specs/011-user-registration-form

## Context

O projeto Smart Schedule utiliza AdonisJS 7 + InertiaJS + Vue 3 + PrimeVue. O cadastro de usuários atual é mínimo (nome, email, senha, perfil, tipo de usuário) e precisa ser expandido para capturar dados pessoais, endereço, sacramentos e funções ministeriais.

## Decisions

### Decision 1: Reutilizar padrão polimórfico de Endereço
- **Chosen**: O endereço do usuário será armazenado na tabela `addresses` existente, utilizando o padrão polimorfismo (`addressable_type` = 'User', `addressable_id` = user.id).
- **Rationale**: A tabela `addresses` já existe com este padrão. Criar uma tabela separada para endereço de usuário duplicaria estrutura e violaria o princípio DRY.
- **Alternatives considered**: Criar tabela `user_addresses` separada — rejeitado porque a tabela existente já suporta polimorfismo.

### Decision 2: Campos de naturalidade como países/estados/cidades
- **Chosen**: Reutilizar as entidades Country, State, City já existentes no banco, armazenando `birthCountryId`, `birthStateId`, `birthCityId` na tabela `users`.
- **Rationale**: O projeto já possui tabelas de catalogação geográfica (`countries`, `states`, `cities`). Usar select com estes catálogos evita erros de digitação e suporta futuras análises por região.
- **Alternatives considered**: Campos textuais livres — rejeitado por não oferecer consistência.

### Decision 3: Sacramento como entidade independente
- **Chosen**: Criar tabela `sacraments` vinculada a `users` (N:1), com uma tabela de catálogo `sacrament_types` para tipos fixos.
- **Rationale**: Permite que o administrador selecione o tipo de sacramento de um catálogo controlado (Batismo, Primeira Eucaristia, Crisma) e inclua dados extras (data, igreja, localização). A expansão futura de tipos é simplificada.
- **Alternatives considered**: JSON array na tabela `users` — rejeitado por dificultar consultas e manutenção.

### Decision 4: Funções via tabela pivô existente (ministry_roles + users)
- **Chosen**: Criar tabela pivô `ministry_role_user` conectando `users` com `ministry_roles` (N:N).
- **Rationale**: A entidade `ministry_roles` já existe no sistema. Criar um relacionamento N:N com usuários é a forma mais idiomática no Lucid ORM.
- **Alternatives considered**: Array de IDs no JSON — rejeitado por dificultar queries e indexação.

### Decision 5: Abas com salvamento global
- **Chosen**: O formulário usará abas (TabView) com validação global acionada no submit, similar ao cadastro de Igrejas. Não haverá salvamento incremental por aba.
- **Rationale**: Simplifica a implementação e evita estados parciais inconsistentes. O usuário preenche todas as abas e submete uma única vez.
- **Alternatives considered**: Salvamento incremental por aba (PUT parcial) — rejeitado por adicionar complexidade desnecessária para a primeira versão.

### Decision 6: Perfil reutiliza sistema de permissões existente
- **Chosen**: O campo `profileId` já existe na tabela `users`. A restrição de edição será feita via Bouncer com uma permissão específica (ex: `users:changeProfile`).
- **Rationale**: O sistema já utiliza AdonisJS Bouncer com RBAC. Não é necessário criar um novo mecanismo de permissões.
