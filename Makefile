.PHONY: update_missions run deploy

PORT ?= 8080
DIR := ./app

update_missions:
	python3 $(DIR)/missions/update_index.py

run:
	make update_missions
	python3 -m http.server $(PORT) --directory $(DIR)

deploy_test:
	netlify deploy --dir $(DIR)

deploy_prod:
	netlify deploy --dir $(DIR) --prod



