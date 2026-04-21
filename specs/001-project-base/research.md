# Research & Technical Decisions: Project Foundation

## Decisions

### 1. Framework: AdonisJS v6

- **Rationale**: Requisito explícito da constituição para atuar como monolito. Ele fornece um ambiente robusto, tipado e completo para APIs e aplicações Web, integrando-se nativamente ao ambiente Node.js moderno.
- **Alternatives Considered**: Nenhuma (restrição de negócio/constituição).

### 2. Banco de Dados: PostgreSQL

- **Rationale**: Banco de dados relacional sólido e exigido na especificação da feature. Ideal para o modelo relacional e separação lógica (ex: schemas por paróquia/pastoral no futuro, se necessário).
- **Alternatives Considered**: MySQL, SQLite (descartados por exigência da especificação).

### 3. Orquestração Local: Docker Compose

- **Rationale**: Fornece um ambiente idêntico entre os desenvolvedores. Facilita o onboarding garantindo que Node, PostgreSQL e dependências rodem de forma consistente.
- **Alternatives Considered**: Instalação local nativa (descartado pelo risco de conflitos de versões no "works on my machine").
