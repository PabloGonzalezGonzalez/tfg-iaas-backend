.DEFAULT_GOAL := check

init:
	@echo "Initialising the project"
# 	@nvm install 16.14.2
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

# nvm:
# 	@echo "Nvm use..."
# 	@~/.nvm/nvm.sh use

--pre_check:
	@yarn clean
	@yarn install
	@yarn lint
	@yarn tsc --project tsconfig.json
