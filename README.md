# 海豹骰 JS 扩展模板

## 介绍

一个集成了 ava、esbuild、ts，用于在一个仓库里开发多个 JS 扩展，避免为了很简单的插件而特意建一个 Git 仓库。

## 安装

使用 git 克隆或者 下载 本项目

安装依赖：

```shell
pnpm i
```

## 如何使用

### 打包

```shell
pnpm build
```

### 测试

由于没有办法动态调试 测试就变得极为重要

```shell
pnpm test 
```

### 多扩展

同时开发多个扩展时要先新建一个文件夹。

```shell
pnpm  new <name>
```

不使用 new 命令开始，构建时以  `src/index.ts` 为入口文件开始构建，以 `config.mjs` 为构建时配置文件

使用 new 命令开始，则以 `src/name/index.ts` 为入口文件构建，`src/name/config.mjs` 为构建时配置文件

### 构建

```shell
pnpm build
pnpm build name // 编译指定扩展
```
