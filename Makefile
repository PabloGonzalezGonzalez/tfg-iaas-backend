.DEFAULT_GOAL := check

init:
	@echo "Initialising the project"
	@yarn install

start:
	@echo "Starting project"
	@yarn dev

check: --pre_check test build
	@echo "Checking project"

clean:
	@echo "Cleaning..."
	@yarn clean

test:
	@echo "Testing..."
	@yarn test-ci

build:
	@echo "Building..."
	@yarn build

--pre_check:
	@yarn clean
	@yarn install
	@yarn lint
	@yarn tsc --project tsconfig.json
