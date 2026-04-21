# Research & Technical Decisions: Auth, RBAC & Dashboard

## Decisions

### 1. Framework de UI e Ícones: Tailwind CSS + Lucide/Heroicons SVG

- **Decision**: O frontend utilizará o framework Tailwind CSS (via Vite, que já vem integrado ao AdonisJS) para estilização, em conjunto com ícones SVG inline (como Heroicons ou Lucide) inseridos através de componentes Edge.
- **Rationale**: Tailwind CSS permite a criação rápida do layout responsivo exigido (menu lateral fixo no desktop, escondido/hamburguer no mobile) sem a necessidade de escrever CSS customizado extenso. A adoção de SVG via componentes Edge (`@component`) mantém o código limpo, evita carregamento de bibliotecas pesadas de fontes de ícones e cumpre o requisito de exibir ações apenas através de ícones (sem texto).
- **Alternatives Considered**: Bootstrap CSS (descartado por ter visual muito padrão/ultrapassado e maior fricção com componentes Edge modernos); Bibliotecas de componentes baseadas em JS (Vue/React UI libraries) - descartadas porque o sistema baseia-se em SSR (Edge) para a renderização, sem framework JS reativo na camada visual principal inicialmente.

### 2. Controle de Acesso (RBAC) via Bouncer/Middleware

- **Decision**: O controle de ações será validado tanto na renderização da View (escondendo botões) quanto na rota (Bouncer Middleware).
- **Rationale**: A segurança em profundidade requer que, mesmo que o usuário tente acessar a URL de edição diretamente (ex: `/users/1/edit`), o backend bloqueie a requisição.
- **Alternatives Considered**: Fazer a verificação manual em cada controller. Descartado em favor da integração nativa e abstrações limpas que o Bouncer do AdonisJS permite.
