# Constituição Smart-Schedule

## Princípios Fundamentais

### I. Desenvolvimento Primeiro-Esquema
Toda funcionalidade deve começar com uma especificação formal no diretório `.spec/`. Nenhum código de implementação deve ser gerado antes que o Plano e as Tarefas sejam aprovados pelo arquiteto.

### II. Permissões Desacopladas (A Regra do Perfil)
O modelo `Profile` é estritamente reservado para ACL (Lista de Controle de Acesso) e Permissões. Sob nenhuma circunstância atributos específicos de serviço (ex., papéis de voluntário, status de disponibilidade, ou preferências eclesiásticas) devem ser adicionados a este modelo. Todos os dados de serviço devem residir em modelos específicos de domínio.

### III. Padrão MVC com AdonisJS
O backend deve seguir estritamente o padrão MVC do AdonisJS. A lógica de negócio deve ser encapsulada em Serviços ou Ações, mantendo Controladores finos e Modelos focados em estrutura de dados e relacionamentos.

### IV. Web Design Responsivo
A UI deve ser construída com Vue.js e TailwindCSS focando em uma **experiência web totalmente responsiva**. O aplicativo deve ser altamente utilizável em monitores desktop para tarefas administrativas enquanto fornece uma experiência contínua e adaptada para navegadores móveis para autoatendimento de voluntários.

### V. Lógica de Disponibilidade e Dependência
O sistema deve reforçar que disponibilidade é um pré-requisito para escala. Se existir uma regra de dependência entre dois voluntários (ex., irmãos pareados), a lógica de agendamento deve tratar sua disponibilidade como uma unidade vinculada para garantir que sejam servidos juntos ou não servidos.

## Restrições Técnicas

### Stack Tecnológica
- **Backend:** AdonisJS (TypeScript)
- **Frontend:** Vue.js 3 + TailwindCSS
- **Banco de Dados:** PostgreSQL (com Lucid ORM)
- **Ambiente:** Serviços orquestrados por Docker

### Portões de Qualidade
- Todas as mudanças no banco de dados devem ser acompanhadas por uma Migration do AdonisJS.
- Todos os novos endpoints de API devem incluir um Validador do AdonisJS para garantir integridade dos dados.
- Lógica crítica, como o algoritmo de escala para acólitos e leitores, requer testes unitários dedicados.

## Fluxo de Desenvolvimento

### Implementação Passo a Passo
1. **Especificar:** Definir as regras de negócio e contratos de dados para voluntariado e escala.
2. **Planejar:** A IA propõe mudanças de arquivos e arquitetura baseada nos padrões do AdonisJS.
3. **Executar:** Implementação incremental focando em uma tarefa por vez.
4. **Verificar:** Validação contra a especificação original e responsividade da UI.

## Governança
Esta Constituição substitui todas as sugestões genéricas de IA. Qualquer proposta pela IA que sugira adicionar campos de negócio ao modelo `Profile` deve ser rejeitada imediatamente. Complexidade deve ser justificada, priorizando as necessidades específicas de gestão de serviço eclesiástico.

**Versão**: 1.3.0 | **Ratificada**: 2026-04-17 | **Última Emenda**: 2026-04-17