# to run a target with 'make' only.
# .DEFAULT_GOAL := default_target

API_VERSION := $(shell npm pkg get version --silent --prefix ./apps/api | tr -d '"')

.DEFAULT:
	@echo "Invalid Makefile target."
	@echo "Use 'make help' for available targets."


.PHONY: help
help:
	@cat makefile.help.txt


.PHONY: compose_up_api
compose_up_api:
	@echo 'Composing api up...'
	COMPOSE_PROJECT_NAME=srv docker compose --file apps.api.dev.docker-compose.yml --env-file .env up -d --build


.PHONY: compose_down_api
compose_down_api:
	@echo 'Composing api down...'
	COMPOSE_PROJECT_NAME=srv docker compose --file apps.api.dev.docker-compose.yml down

.PHONY: build_image_api
build_image_api:
	@echo 'Building the api image...'
	@echo 'Version $(API_VERSION)...'
	docker build --file ./apps.api.prod.dockerfile --build-arg VERSION="$(API_VERSION)" --tag api:$(API_VERSION) .
