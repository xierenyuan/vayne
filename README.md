<p align="center"><a href="https://github.com/xierenyuan/vayne/" target="_blank"><img src="./lib/config/vn.png"></a></p>
<h3 align="center">vayne</h3>
<p align="center">
  薇恩 基于 vue-cli 的 webpack 通用封装,  更易简单的开始你的项目
</p>

[![npm (scoped)](https://img.shields.io/npm/v/vayne.svg)](https://www.npmjs.com/package/vayne)
[![node](https://img.shields.io/node/v/vayne.svg)](https://nodejs.org/en/)

## 使用

```shell
npm i vayne -g
yarn add vayne -D --registry=https://registry.npm.taobao.org
```

## 使用须知
> 因为node-sass 安装过慢 所以在当前项目移除依赖 需在使用项目根路径手动安装 见

```shell
# npm 安装
SASS_BINARY_SITE=http://npm.taobao.org/mirrors/node-sass npm install node-sass -D

# yarn 指向淘宝镜像
yarn config set registry https://registry.npm.taobao.org -g

# yarn node-sass 安装
yarn config set sass_binary_site http://cdn.npm.taobao.org/dist/node-sass -g
```


## server

```shell
# 指定端口号
vayne server --prot=2000
```
## build
``` shell
vayne build
# View the bundle analyzer report after build finishes
vayne build -R
```

## .vaynerc 配置
> 详见  __examples__  默认配置见 __lib/utils/vayne.config.js__ 等有时间了在维护文档.

## include
>  需要编译的文件 同loader 的 include

## template
> 模板入口 默认是 src/index.tpl

## plugins
> 加载插件