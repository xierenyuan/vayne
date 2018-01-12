.PHONY: test
publish:
	cd ./packages/vayne-cli; \
	npm run build
	cd ../../
	# --npm-tag=next 发布bata 版本 测试后 移除 发布正式版本
	lerna publish --force-publish=* --exact --skip-temp-tag
	rm -rf packages/vayne-cli/lib

test:
	yarn install
	cd ./packages/vayne-cli; \
	yarn install
	cd ../../
	yarn run test