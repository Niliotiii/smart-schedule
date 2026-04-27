# Feature Specification: Senha Automática e Perfil do Usuário

**Feature Branch**: `013-auto-password-profile`  
**Created**: 2026-04-24  
**Status**: Draft  
**Input**: User description: "Implemente para que ao criar um usuário seja gerada uma senha automática e a função de alterar a senha seja acessível apenas apartir de uma página que irá abrir ao clicar em cima do nome de usuário no topo superior direito"

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Senha automática na criação de usuário (Priority: P1)

Como administrador, quero que ao criar um novo usuário no sistema, uma senha forte seja gerada automaticamente, para que eu não precise definir manualmente uma senha provisória nem me preocupar com a segurança da primeira senha.

**Why this priority**: Elimina o trabalho manual de definir senhas provisórias e reduz o risco de senhas fracas ou previsíveis sendo configuradas para novos usuários. É a base de todo o fluxo de autenticação.

**Independent Test**: Pode ser totalmente testado criando um novo usuário e verificando se uma senha foi gerada automaticamente e armazenada de forma segura, sem que o administrador tenha informado nenhum campo de senha.

**Acceptance Scenarios**:

1. **Given** que o administrador está no formulário de criação de usuário, **When** ele preenche os dados obrigatórios e salva, **Then** o sistema cria o usuário com uma senha automática segura e não expõe essa senha em nenhuma resposta.
2. **Given** que um usuário foi criado, **When** o administrador tenta visualizar o registro do usuário, **Then** a senha original não é exibida (nem em texto plano, nem como hash).
3. **Given** que um usuário foi criado com senha automática, **When** o usuário tenta fazer login com uma senha incorreta, **Then** o acesso é negado normalmente.

---

### User Story 2 - Perfil do usuário via nome no topo direito (Priority: P2)

Como usuário logado, quero clicar no meu nome exibido no topo superior direito da tela para ter acesso a uma página de perfil, onde posso atualizar minha senha e outras informações da conta.

**Why this priority**: Centraliza o acesso às configurações pessoais do usuário em um local padrão e intuitivo da interface, melhorando a experiência do usuário e a segurança da conta.

**Independent Test**: Pode ser testado clicando no nome do usuário no topo direito e verificando se uma página de perfil é carregada com funcionalidades de atualização.

**Acceptance Scenarios**:

1. **Given** que o usuário está logado em qualquer página do sistema, **When** ele clica no seu nome exibido no topo superior direito, **Then** um menu suspenso ou uma nova página é aberta com opções de perfil.
2. **Given** que o menu de perfil está aberto, **When** o usuário seleciona a opção "Perfil" ou similar, **Then** ele é redirecionado para a página de perfil onde pode editar dados pessoais.

---

### User Story 3 - Alteração de senha pelo próprio usuário (Priority: P3)

Como usuário logado, quero alterar minha senha a partir da página de perfil, para garantir a segurança da minha conta e personalizar minha credencial de acesso.

**Why this priority**: Permite que o usuário assuma o controle da sua própria segurança e não dependa de um administrador para redefinir senhas. Obrigatório quando a senha foi gerada automaticamente.

**Independent Test**: Pode ser testado acessando a página de perfil, preenchendo os campos de alteração de senha e verificando se o login com a nova senha funciona.

**Acceptance Scenarios**:

1. **Given** que o usuário está na página de perfil, **When** ele preenche a senha atual, a nova senha e a confirmação da nova senha corretamente, **Then** a senha é atualizada com sucesso e uma mensagem de confirmação é exibida.
2. **Given** que o usuário está na página de perfil, **When** ele digita a senha atual incorreta, **Then** o sistema exibe uma mensagem de erro e não altera a senha.
3. **Given** que o usuário está na página de perfil, **When** a nova senha e a confirmação não são idênticas, **Then** o sistema exibe uma mensagem de erro informando que as senhas não conferem.
4. **Given** que o usuário alterou sua senha com sucesso, **When** ele tenta fazer login com a nova senha, **Then** o acesso é concedido normalmente.

---

### Edge Cases

- O que acontece quando o administrador cria um usuário com senha automática e o e-mail de notificação falha? O usuário ainda deve ser capaz de fazer login?
- Como o sistema lida com a geração de senha automática caso o gerador de senhas falhe?
- O que acontece se um usuário tentar acessar a página de perfil de outro usuário?
- Como o sistema se comporta se um usuário tentar usar uma senha automática gerada como sua senha permanente?

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: O sistema DEVE gerar automaticamente uma senha segura quando um novo usuário é criado por um administrador, sem exigir que o administrário informe uma senha.
- **FR-002**: A senha gerada automaticamente DEVE ter no mínimo 12 caracteres e conter letras maiúsculas, minúsculas, números e caracteres especiais.
- **FR-003**: A senha DEVE ser armazenada usando hash criptográfico seguro, nunca em texto plano.
- **FR-004**: O sistema NÃO DEVE exibir a senha gerada automaticamente ao administrador após a criação do usuário.
- **FR-005**: O sistema DEVE exibir o nome do usuário logado no topo superior direito de todas as páginas autenticadas.
- **FR-006**: Ao clicar no nome do usuário logado no topo direito, o sistema DEVE apresentar um menu suspenso (dropdown) com opções incluindo "Perfil" ou similar.
- **FR-007**: A opção "Perfil" do dropdown DEVE redirecionar o usuário para uma página de perfil pessoal.
- **FR-008**: A página de perfil DEVE permitir ao usuário visualizar e editar seus dados pessoais (exceto campos restritos como ID e permissões).
- **FR-009**: A página de perfil DEVE conter uma seção dedicada para alteração de senha.
- **FR-010**: Para alterar a senha, o sistema DEVE exigir que o usuário informe a senha atual, a nova senha e a confirmação da nova senha.
- **FR-011**: A nova senha DEVE seguir as mesmas regras de complexidade da senha gerada automaticamente (mínimo 8 caracteres, incluindo letras maiúsculas, minúsculas, números e caracteres especiais).
- **FR-012**: O sistema DEVE exibir mensagens de validação em português para erros de senha, incluindo senha atual incorreta, senhas não conferem ou nova senha abaixo dos requisitos mínimos.
- **FR-013**: Após alterar a senha com sucesso, o sistema DEVE invalidar a sessão atual do usuário, deslogá-lo e redirecioná-lo para a tela de login com uma mensagem informativa.
- **FR-014**: O acesso à página de perfil e alteração de senha DEVE ser restrito ao próprio usuário, impedindo que um usuário altere a senha de outro usuário diretamente pela interface.
- **FR-015**: O formulário de criação de usuário pelo administrador NÃO DEVE mais exibir campos de senha e confirmação de senha.

### Key Entities

- **Usuário**: Representa um usuário do sistema com dados pessoais (nome, e-mail, telefone, etc.) e credenciais de acesso (senha armazenada como hash). Relaciona-se com Perfis, Endereços e Sacramentos.
- **Sessão**: Representa o estado autenticado do usuário no sistema. É renovada ou invalidada quando a senha é alterada.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Usuários criados por administradores possuem senha automática em 100% dos casos, sem necessidade de intervenção manual de senha.
- **SC-002**: 100% das senhas (automáticas ou definidas pelo usuário) são armazenadas como hash criptográfico, nunca em texto plano.
- **SC-003**: O usuário consegue acessar a página de perfil em no máximo 2 cliques a partir de qualquer página do sistema.
- **SC-004**: Em 98% dos casos, o usuário consegue alterar sua senha com sucesso na primeira tentativa, desde que siga as instruções exibidas na tela.
- **SC-005**: O tempo de resposta da página de perfil e da funcionalidade de alteração de senha é inferior a 2 segundos.
- **SC-006**: Nenhuma senha (automática ou atual) é exposta em respostas de APIs, logs ou interfaces do sistema.

## Assumptions

- O sistema já possui um mecanismo de hash de senha seguro (bcrypt/argon2) implementado via AdonisJS Auth.
- A interface do usuário é construída com Vue.js 3 + Inertia.js, de forma que novas rotas e componentes podem ser adicionados seguindo os padrões existentes.
- O nome do usuário logado já é exibido no topo do layout, sendo necessário apenas torná-lo clicável.
- A página de perfil será acessível apenas para o próprio usuário logado; administradores não podem editar senhas de outros usuários por esta interface.
- O usuário receberá a senha automática inicial por meio de notificação futura (e-mail ou similar), fora do escopo desta feature.
- A funcionalidade de "esqueci minha senha" já existe ou será tratada em outra feature e não será afetada por esta implementação.
