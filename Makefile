SHELL=/bin/bash

USERNAME = nferraradev
HOST = 35.212.171.103
PROJECT_DIR = /var/www/expensify/

SSH_HOST = ssh $(USERNAME)@$(HOST)

all: run

run:
	php -S localhost:8000 -c php.ini

deploy:
	rsync -avz --delete --files-from <(git ls-files) . $(USERNAME)@$(HOST):$(PROJECT_DIR)

ssh:
	$(SSH_HOST)

purge:
	$(SSH_HOST) "rm -rf $(PROJECT_DIR) && mkdir $(PROJECT_DIR)"

errors:
	$(SSH_HOST) "tail /var/log/apache2/error.log"
