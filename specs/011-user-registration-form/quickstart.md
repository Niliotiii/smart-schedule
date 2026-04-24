# Quickstart: Cadastro Completo de Usuários

## Como Executar este Feature

### 1. Migrações

Execute as novas migrações na ordem correta:

```bash
node ace migration:run
```

As migrações devem ser:
1. Expandir tabela `users` (novos campos pessoais)
2. Criar tabela `sacrament_types` + seed inicial
3. Criar tabela `sacraments`
4. Criar tabela `ministry_role_user` (pivot N:N)

### 2. Seeders

Execute os seeders para popular dados iniciais:

```bash
node ace db:seed
```

O seeder deve popular `sacrament_types` com: Batismo, Primeira Eucaristia, Crisma.

### 3. Iniciar Servidor de Desenvolvimento

```bash
npm run dev
```

### 4. Rotas Disponíveis

| Método | Rota | Ação |
|--------|------|------|
| GET | `/users` | Lista de usuários |
| GET | `/users/create` | Novo usuário (formulário com abas) |
| POST | `/users` | Criar usuário |
| GET | `/users/:id` | Detalhes do usuário |
| GET | `/users/:id/edit` | Editar usuário (formulário com abas) |
| PUT | `/users/:id` | Atualizar usuário |
| DELETE | `/users/:id` | Excluir usuário (soft-delete) |

### 5. Componente Principal

- **Vue**: `resources/js/Pages/Users/Form.vue`
- **Controller**: `app/controllers/users_controller.ts`
- **Validators**: `app/validators/user.ts`

### 6. Testes

```bash
# Unit tests
node ace test unit

# Functional tests
node ace test functional
```

### 7. Checklist Visual

- Abas: Informações Gerais | Endereço | Sacramentos | Funções
- Campos obrigatórios marcados com (*)
- Seletor de Perfil desabilitado se usuário não tiver `users:editProfile`
- Formatação automática de CEP e telefones
- Estados/cidades filtrados dinamicamente conforme país/seleção
