lint:
	golangci-lint run -c ./golangci.yml ./...

build-frontend:
	npm --prefix=./ui ci && npm --prefix=./ui run build

test:
	go test ./... -v --cover

jstypes:
	go run ./plugins/jsvm/internal/types/types.go

test-report:
	go test ./... -v --cover -coverprofile=coverage.out
	go tool cover -html=coverage.out
