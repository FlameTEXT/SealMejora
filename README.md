# 海豹骰 JS 扩展模板


### 介绍

一个简单易用的项目模板。

* esbuild 打包

* ts-jest 测试

## 安装

使用 git 克隆或者 下载 本项目

安装依赖 

```
npm i
```

## 如何使用

构建单文件

```
npm run build
```

由于没有办法动态调试 测试就变得极为重要

```
npm run test 
```

### 多个扩展

新建扩展项目

```
npm run new <name>
```

不使用 new 命令开始，构建时以  `src/index.ts` 为入口文件开始构建，以 `config.mjs` 为构建时配置文件
 
使用 new 命令开始，则以 `src/name/index.ts` 为入口文件构建，`src/name/config.mjs` 为构建时配置文件

其他

```
npm run build name
npm run test name
```


### 开发指南

看这里，这边有大量的例子，以及海豹用户写的插件：

https://github.com/sealdice/javascript
