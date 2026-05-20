.PHONY: up down migrate seed fresh logs

up:
	docker compose up -d

down:
	docker compose down

migrate:
	docker compose exec app node ace migration:run

seed:
	docker compose exec app node ace db:seed --files database/seeders/database_seeder.ts

fresh:
	docker compose exec app node ace migration:fresh
	docker compose exec app node ace db:seed

logs:
	docker compose logs -f app
