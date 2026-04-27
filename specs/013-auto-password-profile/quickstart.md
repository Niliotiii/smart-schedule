# Quick Start: Senha Automática e Perfil do Usuário

## Contexto

Esta feature altera o fluxo de criação de usuários (removendo a necessidade do administrador definir uma senha) e adiciona uma página de perfil pessoal acessível via dropdown no topo direito da interface.

## Como testar localmente

### 1. Criar um usuário com senha automática

1. Faça login como administrador.
2. Navegue para **Usuários > Novo**.
3. Preencha os dados obrigatórios (nome, e-mail, tipo de usuário, etc.).
4. **Observe**: os campos "Senha" e "Confirmação de Senha" **não** aparecem mais no formulário.
5. Clique em "Salvar".
6. O usuário deve ser criado com sucesso. Nenhuma senha é exibida na resposta.

### 2. Acessar a página de perfil

1. Logue como o usuário recém-criado (a senha deve ser fornecida separadamente pelo administrador — nota: entrega da senha inicial está fora do escopo desta feature).
2. Clique no **nome do usuário** exibido no topo superior direito da tela.
3. Um dropdown (Menu) deve aparecer com as opções: **"Perfil"** e **"Sair"**.
4. Clique em **"Perfil"**.
5. Você será redirecionado para `/account/profile`.

### 3. Alterar a senha

1. Na página de perfil, clique na aba **"Alterar Senha"**.
2. Preencha os campos:
   - Senha atual
   - Nova senha
   - Confirmação da nova senha
3. Clique em **"Salvar"**.
4. Se a senha atual estiver correta e as senhas conferem:
   - Você será deslogado.
   - Redirecionado para `/login` com a mensagem: "Senha alterada com sucesso. Faça login novamente."
5. Faça login com a nova senha.

## Edge cases para validar

| Cenário | Resultado esperado |
|---------|-------------------|
| Senha atual incorreta | Mensagem de erro: "Senha atual incorreta" |
| Nova senha e confirmação diferentes | Mensagem de erro: "As senhas não conferem" |
| Nova senha com menos de 8 caracteres | Mensagem de erro sobre requisito mínimo |
| Tentar acessar `/account/profile` sem login | Redirecionamento para `/login` |
| Administrador editar o próprio perfil via `/account/profile` | Funciona normalmente; acessível apenas ao próprio usuário |

## Comandos úteis

```bash
# Levantar o servidor
npm run dev

# Rodar os testes
node ace test

# Lint
npm run lint
```
