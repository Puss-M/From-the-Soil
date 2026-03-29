# From the Soil

本项目是一个基于 Next.js 的中国传统民居展示网站，仓库里包含主站代码、部分静态展示页和配套素材。

如果你只是队友协作，请重点看下面这份 Git 傻瓜指南。不要硬记原理，照着步骤做就行。

## 项目启动

第一次运行：

```bash
npm install
```

平时开发：

```bash
npm run dev
```

打开浏览器访问：

```text
http://localhost:3000
```

## 目录说明

- `src/`：主项目代码
- `public/`：图片、模型、静态页面等资源
- `docs/`：项目文档

## Git 傻瓜指南

这部分是给不熟悉 Git 的队友准备的。

请记住这一条：

**不要直接在 `main` 分支上改代码并提交。每个人都在自己的分支上改。**

### 0. 第一次拿到项目

如果你电脑里还没有这个项目：

```bash
git clone 仓库地址
cd From-the-Soil-main
npm install
```

如果你已经有这个项目，跳过这一步。

### 1. 每次开始写代码前

先进入项目目录：

```bash
cd From-the-Soil-main
```

切回主分支并拉最新代码：

```bash
git checkout main
git pull origin main
```

然后新建一个自己的分支。

分支名字直接照这个格式改：

```bash
git checkout -b 你的名字/功能名
```

例如：

```bash
git checkout -b xiaoming/map-page
```

### 2. 开始开发

启动项目：

```bash
npm run dev
```

然后正常修改代码。

### 3. 改完以后提交

先看看你改了什么：

```bash
git status
```

把改动加入提交：

```bash
git add .
```

提交：

```bash
git commit -m "写一句你做了什么"
```

例如：

```bash
git commit -m "修改首页标题和配图"
```

### 4. 提交到远程仓库

第一次推送自己这个分支时：

```bash
git push -u origin 你的分支名
```

例如：

```bash
git push -u origin xiaoming/map-page
```

以后同一个分支继续推送：

```bash
git push
```

### 5. 提交完之后怎么告诉队友

你把自己的分支推上去以后：

- 如果你们有人负责统一合并，就把分支名发给他
- 如果你会用 GitHub，就自己发起 Pull Request

## 最常用流程

如果你只想看最短版本，每次照着下面做：

```bash
cd From-the-Soil-main
git checkout main
git pull origin main
git checkout -b 你的名字/这次任务
npm run dev
```

改完后：

```bash
git add .
git commit -m "这次修改内容"
git push -u origin 你的名字/这次任务
```

## 绝对不要做的事

- 不要直接在 `main` 分支上改完就 `push`
- 不要别人刚发你仓库，你什么都不拉最新就直接开始写
- 不要看到一堆红字就乱输命令
- 不要随便用 `git reset --hard`
- 不要随便删除队友的文件

## 如果提示有冲突

如果你在 `git pull`、`git push` 或合并时看到冲突提示，不要自己乱处理，直接在群里说：

```text
我这里 Git 冲突了，先别动，我发截图。
```

然后把下面两条命令的结果截图发出来：

```bash
git status
git branch
```

## 如果只是想同步最新代码

如果你今天不打算写代码，只想拿最新版本：

```bash
cd From-the-Soil-main
git checkout main
git pull origin main
```

## 如果你已经在自己分支上做过很多次修改

下次继续做同一个功能，不需要新建分支，直接：

```bash
git checkout 你的分支名
git pull
```

然后继续改，改完后：

```bash
git add .
git commit -m "继续修改"
git push
```

## 这个项目常用命令

启动开发环境：

```bash
npm run dev
```

打包：

```bash
npm run build
```

代码检查：

```bash
npm run lint
```

## 建议

如果你对 Git 完全不熟，至少记住下面两句话：

1. 开始前先 `git pull origin main`
2. 提交时不要往 `main` 直接推，推到你自己的分支

照这个 README 做，基本就不会出大问题。
