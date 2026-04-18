# Especificação de Funcionalidade: Fundação e Base de Identidade (Monolito)

**Feature Branch**: project-foundation
**Criada**: 2026-04-18
**Status**: Rascunho Atualizado
**Entrada**: "Inicialize um projeto full-stack com AdonisJS (Kit Vue Monolito) e Docker, estabelecendo a arquitetura de Usuário e Perfil."

## 1. Cenários de Usuário e Testes

### História de Usuário 1 - Configuração de Ambiente Unificado (Prioridade: P1)
Como desenvolvedor, eu quero um ambiente containerizado que execute o monólito AdonisJS + Vue para que eu possa desenvolver o frontend e o backend no mesmo ciclo de vida.

**Por que essa prioridade**: Essencial para garantir que o SSR (Server-Side Rendering) e o Vite funcionem corretamente dentro do container desde o início, evitando problemas de configuração de portas e manifestos.

**Teste Independente**: Executar `docker-compose up` e acessar a porta `3333`. O sistema deve renderizar a página Vue via Inertia.js sem erros.

**Cenários de Aceitação**:
1. **Dado** o comando `npm create adonisjs@latest [nome] -- --kit=vue`, **Quando** o projeto for gerado, **Então** a estrutura deve ser de um monolito (pastas `app/` para backend e `inertia/` para frontend).
2. **Dada** a execução no Docker, **Quando** o serviço estiver pronto, **Então** a conexão com o PostgreSQL deve estar ativa e as migrações passíveis de execução.

---

## 2. Casos Limite
- **Hot Module Replacement (HMR)**: O `docker-compose.yml` deve expor as portas do Vite (geralmente 5173) para permitir o live reload do Vue.
- **Persistência de Dados**: O volume do PostgreSQL deve ser mapeado para garantir que os dados de usuários e perfis não se percam ao reiniciar os containers.

---

## 3. Requisitos

### Requisitos Funcionais
- **FR-001**: O sistema DEVE utilizar **AdonisJS v6** com o starter kit **Inertia/Vue**.
- **FR-002**: O sistema DEVE utilizar o comando oficial de scaffold para garantir a integração correta do SSR.
- **FR-003**: O sistema DEVE fornecer um `docker-compose.yml` com serviços para a Aplicação (Node/Adonis) e Banco de Dados (PostgreSQL).
- **FR-004**: O sistema DEVE configurar o **TailwindCSS** integrado ao Vite para estilização do frontend.
- **FR-005**: O sistema DEVE ser **Totalmente Responsivo**, com foco em compatibilidade mobile para componentes de interface.

---

## 4. Critérios de Sucesso
- **SC-001**: O ambiente deve subir com um único comando `docker-compose up`.
- **SC-002**: A renderização de páginas Vue deve ser feita através de Controllers do AdonisJS usando `inertia.render()`.

---

## 5. Suposições
- O projeto segue o padrão de Monorepo/Monolito simplificado do AdonisJS v6.
- O desenvolvedor possui Docker e Node.js 20+ instalados.
- A autenticação inicial será baseada em Sessão (Session Guard), nativa do AdonisJS.