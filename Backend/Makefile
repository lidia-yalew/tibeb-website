include .env
export

# ==================================================================================== #
# HELPERS
# ==================================================================================== #

## help: print this help message
.PHONY: help
help:
	@echo 'Usage:'
	@sed -n 's/^##//p' ${MAKEFILE_LIST} | column -t -s ':' | sed -e 's/^/ /'

# ==================================================================================== #
# DEVELOPMENT
# ==================================================================================== #

## run: run the application
.PHONY: run
run:
	go run ./cmd/main.go

## build: build the application binary
.PHONY: build
build:
	go build -o bin/server ./cmd/main.go

## tidy: tidy and vendor dependencies
.PHONY: tidy
tidy:
	go mod tidy
	go mod vendor

# ==================================================================================== #
# DATABASE MIGRATIONS
# ==================================================================================== #

## migrate-create name=$1: create a new migration file
.PHONY: migrate-create
migrate-create:
	migrate create -ext sql -dir db/migration -seq $(name)

## migrate-up: apply all up migrations
.PHONY: migrate-up
migrate-up:
	migrate -path db/migration -database "$(DB_URL)" -verbose up

## migrate-down: roll back the last migration
.PHONY: migrate-down
migrate-down:
	migrate -path db/migration -database "$(DB_URL)" -verbose down

## migrate-force version=$1: force set migration version
.PHONY: migrate-force
migrate-force:
	migrate -path db/migration -database "$(DB_URL)" force $(version)

# ==================================================================================== #
# QUALITY CONTROL
# ==================================================================================== #

## test: run all unit and integration tests
.PHONY: test
test:
	go test -v ./test/...

## test-unit: run only unit tests
.PHONY: test-unit
test-unit:
	go test -v ./test/unit/...

## test-integration: run only integration tests
.PHONY: test-integration
test-integration:
	go test -v ./test/integration/...

.PHONY: help run build tidy migrate-create migrate-up migrate-down migrate-force test test-unit test-integration test/cover lint swagger create-admin

# ==================================================================================== #
# DOCUMENTATION
# ==================================================================================== #

## swagger: generate swagger docs
.PHONY: swagger
swagger:
	swag init -g cmd/main.go -o docs

.PHONY: help run build tidy migrate-create migrate-up migrate-down migrate-force test test/cover lint swagger


## create-admin: run CLI script to create first admin user
.PHONY: create-admin
create-admin:
	go run cmd/create-admin/main.go

.PHONY: help run build tidy migrate-create migrate-up migrate-down migrate-force test test/cover lint swagger create-admin
