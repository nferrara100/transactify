SHELL=/bin/bash

USERNAME = nferraradev
HOST = 35.212.171.103
PROJECT_DIR = /var/www/expensify/

all: run

run:
	php -S localhost:8000 -c php.ini

deploy:
	rsync -avz --delete --files-from <(git ls-files) . $(USERNAME)@$(HOST):$(PROJECT_DIR)

purge:
	ssh $(USERNAME)@$(HOST) "rm -rf $(PROJECT_DIR) && mkdir $(PROJECT_DIR)"
