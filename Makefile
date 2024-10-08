.PHONY: install-deps
install-deps:
	npm install

.PHONY: create-env-from-template
create-env-from-template:
	cp .env.template .env

.PHONY: local-setup
local-setup: install-deps create-env-from-template

.PHONY: run-app
run-app:
	@echo "Starting the frontend app..."
	@export $(shell cat .env | xargs) && npm run dev

.PHONY: run-tests
run-tests:
	@echo "Running tests..."
	npm run test

.PHONY: run-lint
run-lint:
	@echo "Running linter..."
	npm run lint

.PHONY: run-checks
run-checks: run-lint run-tests
