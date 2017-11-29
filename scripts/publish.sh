# go to latest master
git config user.name 谢仁洪
git config user.email xierenyuan@qq.com

git checkout master
git pull origin master

# 之后指定开发分支 可以合一下开发分支

#!/usr/bin/env sh
set -e
echo "Enter release version: "
read VERSION

read -p "Releasing $VERSION - are you sure? (y/n) " -n 1 -r

if [[ $REPLY =~ ^[Yy]$ ]]
then
  echo "\nReleasing $VERSION ..."

  TAG_NAME="v$VERSION"

  # remove 掉已经使用的 tag
  git tag -d $TAG_NAME || true
  git push origin :$TAG_NAME || true

  # 检查代码风格
  npm run lint

  # commit 
  echo "LOG 当前目录: $PWD"
  # see https://docs.npmjs.com/cli/version
  npm version --allow-same-version $VERSION --message "[release] $VERSION"

  git status
  git add -A
  git commit -m "[build] $VERSION"

  # publish
  git push origin master

  # tag
  git tag $TAG_NAME
  git push origin --tags

  npm publish

  echo "发布成功: npm version $VERSION git tag: $TAG_NAME "
fi