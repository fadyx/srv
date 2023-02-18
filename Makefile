# to run a target with 'make' only.
# .DEFAULT_GOAL := default_target

API_VERSION := $(shell npm pkg get version --silent --prefix ./apps/api | tr -d '"')

.DEFAULT:
	@echo "Invalid Makefile target."
	@echo "Use 'make help' for available targets."


.PHONY: help
help:
	@cat makefile.help.txt


.PHONY: compose_up_api_dev
compose_up_api_dev:
	@echo 'Composing api for development up...'
	COMPOSE_PROJECT_NAME=srv docker compose --file apps.api.dev.docker-compose.yml up -d --build


.PHONY: compose_down_api_dev
compose_down_api_dev:
	@echo 'Composing api for development down...'
	COMPOSE_PROJECT_NAME=srv docker compose --file apps.api.dev.docker-compose.yml down

.PHONY: rebuild_image_api_dev
rebuild_api_dev_image:
	@echo 'Rebuilding the api for development image...'
	@echo 'Version $(API_VERSION)...'
	COMPOSE_PROJECT_NAME=srv docker compose --file apps.api.dev.docker-compose.yml up -d --no-deps --build api

.PHONY: shell_api_dev
bash_api_dev:
	@echo 'Running a bash session inside the api container...'
	 docker compose --file ./apps.api.dev.docker-compose.yml exec api bash

.PHONY: build_image_api_prod
build_image_api_prod:
	@echo 'Building the api image...'
	@echo 'Version $(API_VERSION)...'
	docker build --file ./apps.api.prod.dockerfile --build-arg VERSION="$(API_VERSION)" --tag api:$(API_VERSION) .

.PHONY: docker_stats
docker_stats:
	@echo 'Displaying docker statistics...'
	docker stats

.PHONY: commit
commit:
	@echo 'Makeing a new git commit...'
	yarn cz

.PHONY: purge_dry
purge_dry:
	@echo 'Purging node_modules in dry mode...'
	find . -name 'node_modules' -type d -prune

.PHONY: purge_execute
purge_execute:
	@echo 'Purging node_modules in execution mode...'
	find . -name 'node_modules' -type d -prune -exec rm -rf '{}' +

.PHONY: update_dependencies_dry
update_dependencies_dry:
	@echo 'Updating npm dependencies in dry mode...'
	yarn npm-check-updates --configFileName ncurc.json --deep


.PHONY: update_dependencies_execution
update_dependencies_execution:
	@echo 'Updating npm dependencies in execution mode...'
	yarn npm-check-updates --configFileName ncurc.json  --deep -u -i
