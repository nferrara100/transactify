SHELL=/bin/bash

USERNAME = nferraradev
HOST = 35.212.171.103
PROJECT_DIR = /var/www/expensify/

SSH_HOST = ssh $(USERNAME)@$(HOST)

all: run

# Run the application locally
run:
	php -S localhost:8000 -c php.ini

# Run the application locally without connecting to the live Expensify API
run-sample:
	export local_api=sample; php -S localhost:8000 -c php.ini

# Deploy the application to the server
# Without Git: find . -type f
deploy:
	rsync -avz --delete --files-from <(git ls-files) . $(USERNAME)@$(HOST):$(PROJECT_DIR)

# Update the server's Apache configuration
configure:
	scp expensify.conf $(USERNAME)@$(HOST):/etc/apache2/sites-available/expensify.conf
	$(SSH_HOST) "sudo service apache2 restart"

# Connect to the server via SSH
ssh:
	$(SSH_HOST)

# Wipe application files from the server so they can be deployed fresh
purge:
	$(SSH_HOST) "rm -rf $(PROJECT_DIR) && mkdir $(PROJECT_DIR)"

# Display the most recent errors from the server
errors:
	$(SSH_HOST) "tail /var/log/apache2/error.log"
