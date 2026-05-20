# Feature Specification: Gerar Nova Senha para Usuário

**Feature Branch**: `021-user-reset-password`
**Created**: 2026-05-20
**Status**: Draft
**Input**: User description: "Preciso que na listagem de usuários na coluna de ações tenha um botão para gerar uma nova senha automatica para o usuário. Essa nova senha deve ser exibida em um modal que ao ser fechado não é possível abrir novamente, só gerando nova senha. Deve conter uma permissão específica para essa ação"

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Administrador gera nova senha para um usuário (Priority: P1)

O administrador acessa a listagem de usuários, localiza o botão de gerar senha na coluna de ações de um usuário específico, clica no botão e visualiza a nova senha gerada em um modal. Ao fechar o modal, a senha não pode ser recuperada — apenas gerando uma nova.

**Why this priority**: É a funcionalidade principal descrita; sem ela não há valor entregue.

**Independent Test**: Pode ser testado acessando a listagem de usuários com um perfil que tenha a permissão de resetar senha, clicando no botão de ação e verificando se o modal aparece com a nova senha.

**Acceptance Scenarios**:

1. **Given** que o administrador está na listagem de usuários e possui permissão para resetar senha, **When** ele clica no botão "Gerar Nova Senha" na linha de um usuário, **Then** o sistema gera uma nova senha aleatória, persiste no banco e exibe em um modal.
2. **Given** que o modal com a nova senha está aberto, **When** o administrador fecha o modal, **Then** a senha não pode mais ser visualizada — é necessário gerar uma nova senha para vê-la novamente.
3. **Given** que o administrador fecha o modal sem copiar a senha, **When** ele tenta reabrir o modal do mesmo usuário, **Then** o sistema não exibe a senha anterior, apenas permite gerar uma nova.

---

### User Story 2 - Administrador sem permissão não vê o botão (Priority: P2)

Um administrador que não possui a permissão específica para resetar senhas não consegue visualizar nem acionar o botão de gerar nova senha.

**Why this priority**: Segurança e controle de acesso são parte fundamental do requisito.

**Independent Test**: Pode ser testado com um perfil que não tenha a permissão de resetar senha — o botão não deve aparecer na coluna de ações.

**Acceptance Scenarios**:

1. **Given** que o administrador não possui a permissão `users.reset_password`, **When** ele acessa a listagem de usuários, **Then** o botão "Gerar Nova Senha" não deve estar visível na coluna de ações.

---

### User Story 3 - Senha gerada é funcional para login (Priority: P2)

Após a geração da nova senha, o usuário alvo consegue realizar login normalmente com a nova senha gerada.

**Why this priority**: Garante que a funcionalidade não apenas gera, mas também persiste corretamente a senha.

**Independent Test**: Pode ser testado gerando uma senha para um usuário e, em seguida, fazendo logout e login com a nova senha.

**Acceptance Scenarios**:

1. **Given** que uma nova senha foi gerada para o usuário, **When** o usuário tenta fazer login com a nova senha, **Then** o login deve ser realizado com sucesso.
2. **Given** que uma nova senha foi gerada para o usuário, **When** o usuário tenta fazer login com a senha antiga, **Then** o login deve ser rejeitado.

### Edge Cases

- O que acontece se o administrador tentar gerar uma senha para si mesmo? Deve funcionar normalmente.
- O que acontece se o usuário alvo for deletado/desativado? O sistema deve exibir uma mensagem de erro apropriada.
- O que acontece se houver uma falha de rede durante a geração? O sistema deve notificar o administrador que a operação falhou e a senha antiga permanece válida.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: O sistema DEVE exibir um botão "Gerar Nova Senha" na coluna de ações da listagem de usuários para administradores com a permissão adequada.
- **FR-002**: O sistema DEVE gerar uma senha aleatória segura (mínimo 24 caracteres alfanuméricos) ao clicar no botão.
- **FR-003**: O sistema DEVE persistir a nova senha hashada no banco de dados imediatamente após a geração.
- **FR-004**: O sistema DEVE exibir a senha gerada em texto claro em um modal após a persistência bem-sucedida.
- **FR-005**: O modal DEVE conter um aviso claro para o administrador copiar a senha antes de fechar, pois não será possível visualizá-la novamente.
- **FR-006**: O sistema NÃO DEVE permitir reabrir o modal para visualizar a mesma senha — apenas gerando uma nova.
- **FR-007**: O sistema DEVE incluir uma permissão específica chamada `users.reset_password` (módulo `users`, ação `reset_password`) que controla quem pode usar esta funcionalidade.
- **FR-008**: O sistema DEVE notificar o administrador em caso de erro na geração/persistência da senha, mantendo a senha anterior intacta.

### Key Entities

- **User**: Entidade existente que terá a senha alterada. A senha é hashada e armazenada no banco.
- **Permission**: Nova permissão `users.reset_password` seguindo o padrão existente de módulo/ação.
- **Generated Password Log** (opcional): Se implementado, registro da ação de geração de senha para auditoria (quem gerou, para qual usuário, quando).

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Administradores com permissão conseguem gerar uma nova senha em até 2 cliques a partir da listagem de usuários.
- **SC-002**: A senha gerada tem no mínimo 24 caracteres com entropia suficiente para uso seguro.
- **SC-003**: A senha gerada é imediatamente funcional para login (100% das tentativas de login com a nova senha devem ser bem-sucedidas).
- **SC-004**: 100% das tentativas de reabrir o modal sem gerar nova senha não exibem a senha anterior.
- **SC-005**: Administradores sem a permissão `users.reset_password` não veem o botão em nenhum cenário.

## Assumptions

- O sistema já possui uma listagem de usuários funcional com coluna de ações.
- O sistema já possui um sistema de permissões baseado em módulo/ação.
- A geração de senha segue o padrão já existente no código (`randomBytes(18).toString('base64').substring(0, 24)`).
- A notificação ao administrador será feita via toast/sessão seguindo o padrão já utilizado no sistema.
- O modal será implementado com PrimeVue (Dialog) seguindo o padrão do projeto.
