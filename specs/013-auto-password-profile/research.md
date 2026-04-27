# Research: Senha Automática e Perfil do Usuário

**Date**: 2026-04-24

## Decisiones e Justificativas

### Gerador de senha automática
**Decision**: Usar `crypto.randomBytes` do Node.js para gerar uma senha aleatória de 16 bytes (128 bits), convertida para base64, garantindo alta entropia.

**Rationale**: O Node.js `crypto` é nativo, não requer dependências externas, e gera números aleatórios criptograficamente seguros. Base64 produz uma string de ~22 caracteres contendo letras maiúsculas, minúsculas, números e alguns caracteres especiais (+, /). Como a senha é hashada pelo AdonisJS `withAuthFinder`, seu conteúdo exato não importa além da entropia.

**Alternatives considered**:
- Biblioteca `generate-password` (npm): requer instalação extra; não necessária para gerador simples.
- `Math.random()` baseado em timestamp: INSEGURO — nunca usar para senhas.
- Gerador customizado de caracteres: mais código para manter; entropia menor que `randomBytes`.

### Invalidação de sessão após mudança de senha
**Decision**: Invalidar a sessão atual e redirecionar para a tela de login (FR-013).

**Rationale**: A pessoa que alterou a senha precisa provar que conhece a nova senha imediatamente. Isso previne que um atacante com acesso ao navegador continue usando a sessão antiga após a vítima mudar a senha. Padrão recomendado (OWASP).

**Alternatives considered**:
- Manter sessão ativa: melhor UX porém menos seguro. Rejeitado por priorizar segurança.
- Invalidar apenas outras sessões: complexo (requer gestão de múltiplas sessões por usuário, fora do escopo).

### Estrutura do dropdown de usuário
**Decision**: Usar componente `Menu` do PrimeVue como dropdown ao clicar no nome do usuário no AppTopbar.

**Rationale**: O projeto já usa PrimeVue (v4.5) como biblioteca de componentes UI. O componente `Menu` (overlay menu) é nativo do PrimeVue, acessível e consistente com o design system existente. Não requer instalação de novas dependências.

**Alternatives considered**:
- Dropdown custom HTML/CSS: mais trabalho para manter acessibilidade e responsividade.
- `primevue/dropdown`: destinado a formulários/inputs, não a menus de navegação.

### Acesso à página de perfil
**Decision**: Criar novo controller `AccountController` com rotas dedicadas (`GET /account/profile`, `PUT /account/profile`, `PUT /account/password`).

**Rationale**: Separa claramente o perfil "próprio" (acessível por qualquer usuário logado) do perfil "gerenciado pelo administrador" (`/users/:id`, que faz parte do CRUD de usuários com autorização de bouncer). Isso evita confusão de permissões e simplifica o middleware.

**Alternatives considered**:
- Reutilizar `UsersController`: exigiria lógica condicional complexa no bouncer para distinguir "meu perfil" vs "perfis de outros".
- Adicionar ação no `ProfileController` (API v1): o controller já existe para a API, não para Inertia.
