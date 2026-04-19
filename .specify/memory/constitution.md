# Smart Schedule Constitution

## Core Principles

### I. Extensibilidade e Arquitetura Modular
O sistema DEVE ser projetado para suportar múltiplos contextos. Embora o foco inicial seja a escala de Acólitos, a arquitetura deve permitir a fácil adesão de outras pastorais e grupos da paróquia. Nenhuma regra de negócio deve ser rigidamente acoplada a um único ministério sem possibilidade de parametrização.

### II. Respeito à Disponibilidade e Capacidade
A geração de escalas DEVE priorizar a disponibilidade real e a capacidade técnica de cada voluntário. O sistema não deve permitir escalas conflitantes para a mesma pessoa no mesmo horário e deve alertar sobre sobrecargas, garantindo distribuições justas.

### III. Simplicidade e Usabilidade
Considerando que os usuários finais (coordenadores e voluntários) podem não ter grande familiaridade com ferramentas complexas, as interfaces DEVEM ser intuitivas, diretas e responsivas (mobile-first), facilitando o acesso rápido às escalas e a submissão de indisponibilidades.

### IV. Confiabilidade e Tolerância a Falhas
O sistema DEVE garantir que as escalas geradas e publicadas sejam mantidas consistentes. O algoritmo de escalonamento deve ser determinístico e lidar graciosamente com a falta de voluntários, sugerindo alternativas ou deixando claro o déficit.

### V. Segurança e Privacidade
Os dados pessoais dos voluntários (contatos, disponibilidades, restrições) DEVEM ser protegidos. Apenas usuários com permissões adequadas (ex: coordenadores da respectiva pastoral) podem visualizar informações sensíveis ou alterar escalas.

## Tecnologias e Arquitetura

O projeto utiliza a base já estabelecida no repositório:
- **Arquitetura**: Monolito construído com AdonisJS, englobando a lógica de negócio, autenticação e o algoritmo de geração de escalas.
- **Frontend**: Servido pelo próprio monolito (ex: via Edge ou Inertia), não exigindo necessariamente o uso de Vue.js, desde que forneça uma interface responsiva e amigável.
- **Modelagem de Dados**: Estrutura relacional flexível que suporta a separação lógica de diferentes pastorais, usuários (voluntários), eventos/missas e disponibilidades.

## Fluxo de Desenvolvimento

- **Modularidade**: Funcionalidades relacionadas à gestão de escalas devem ser construídas de forma isolada, facilitando testes automatizados.
- **Testes**: O algoritmo de escalonamento (match de disponibilidade vs necessidade) DEVE ser rigorosamente testado para garantir que não aloque pessoas indisponíveis ou além de sua capacidade.
- **Revisão**: O código deve ser revisado garantindo a premissa de que nenhuma string ou regra hardcoded limite o uso apenas para "Acólitos".

## Governance

A Constituição do Projeto atua como o guia supremo para decisões de arquitetura e produto. 
Qualquer mudança estrutural que restrinja o uso do sistema a apenas uma pastoral ou que altere a stack fundamental deve ser precedida de uma emenda a esta constituição.
Alterações devem ser propostas via Pull Request, justificando o impacto na visão de longo prazo do projeto.

**Version**: 1.0.0 | **Ratified**: 2026-04-19 | **Last Amended**: 2026-04-19