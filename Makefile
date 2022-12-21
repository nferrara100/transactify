SHELL=/bin/bash

all: run

run:
	php -S localhost:8000 -c php.ini

USERNAME = nferraradev
HOST = 35.212.171.103
deploy:
	rsync -avz --delete --files-from <(git ls-files) . $(USERNAME)@$(HOST):/var/www/expensify/
