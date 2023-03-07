main: start-offline

start-offline:
	@echo "[INFO] Starting Offline Server"
	@NODE_ENV=development \
	serverless offline

deploy:
	@echo "[INFO] Deploying serverless project"
	@NODE_ENV=production \
	serverless deploy

start-database:
	@echo "[INFO] Starting database"
	@brew services start mongodb-community@6.0

stop-database:
	@echo "[INFO] Stopping database"
	@brew services stop mongodb-community@6.0

list-services:
	@echo "[INFO] Listing services"
	@brew services list
