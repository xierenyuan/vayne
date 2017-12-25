publish:
	cd ./packages/vayne-cli; \
	npm run build
	cd ../../
	lerna publish --npm-tag=next --force-publish=* --exact --skip-temp-tag
	rm -rf packages/vayne-cli/lib
test:
	yarn install
	cd ./packages/vayne-cli; \
	yarn install
	cd ../../
	yarn run test