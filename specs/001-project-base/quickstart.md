# Quickstart: Project Foundation

## Requisitos

- [Docker](https://docs.docker.com/get-docker/) instalado e rodando.
- [Docker Compose](https://docs.docker.com/compose/install/) instalado.
- (Opcional, mas recomendado) Node.js local se desejar utilizar a CLI do AdonisJS (Ace) fora do container para scaffolding rápido.

## Iniciando o Ambiente

1. Clone este repositório.
2. Execute o comando de inicialização com docker compose na raiz:
   ```bash
   docker compose up -d --build
   ```
3. A aplicação estará disponível em `http://localhost:3333`.
4. O banco de dados PostgreSQL estará acessível internamente pelos containers, mas caso queira acessá-lo por um cliente de banco (DBeaver, DataGrip, etc.), ele estará exposto na porta configurada (ex: `5432`).

### Comandos Comuns (Via Container)

- **Parar o ambiente**: `docker compose down`
- **Rodar migrations**: `docker compose exec app node ace migration:run`
- **Ver logs**: `docker compose logs -f app`
