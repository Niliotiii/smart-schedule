# Data Model: Project Foundation

Nenhuma entidade específica do negócio (ex: usuários, escalas, disponibilidades) é modelada nesta fase de fundação de infraestrutura. O modelo foca apenas na viabilização da arquitetura de conexão ao banco.

## Banco de Dados

- **Tipo**: Relacional
- **SGBD**: PostgreSQL 16+

Nesta etapa, o objetivo é garantir que o AdonisJS consiga se conectar à base via pool de conexões (via pacote Lucide/Adonis ORM). A estrutura inicial conterá apenas a estrutura padrão que o framework e o driver exigem para operar e controlar o versionamento do schema (tabela de histórico de migrations).
