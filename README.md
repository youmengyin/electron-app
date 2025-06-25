
# 🚀 Electron + Vite + Drizzle ORM + Better-SQLite3

一个基于 **Electron + Vite + Drizzle ORM + Better-SQLite3** 的现代化桌面应用模板。

## ✨ 项目特点

- **Drizzle ORM** 现代化、轻量级 ORM 方案
- **Vue 3** 作为 UI 业务层（可自行替换）
- **Electron v35.1.5** + **Node.js v20.11.1**
- **Better-SQLite3** 高效、同步的 SQLite 数据库库

---

## 📂 目录结构

```bash
📦 项目根目录
├── assets                 # 静态资源（包含打包后的APP图标）
├── electron               # Electron 相关代码
│   ├── main               # 主进程代码
│   │   ├── auto-update    # electron-updater 自动更新相关代码
│   │   ├── db             # 数据库相关代码
│   │   ├── router         # 路由（提供访问数据库的接口）
│   │   ├── utils.ts       # 工具函数
│   │   ├── dbServicesInit.ts  # 数据库初始化逻辑
│   │   ├── index.ts       # 主进程入口文件
│   ├── preload            # 预加载目录
├── migrations             # 数据库升级相关文件
├── public                 # Vue 资源目录
├── src                    # Vue 代码目录
├── drizzle.config.ts       # Drizzle ORM 迁移配置文件
├── electron-builder.json   # Electron 打包配置
├── vite.config.tsn        # vite 打包配置
```

---

## ⚙️ 环境配置

1. **Node.js** 使用 `v20.11.1`
2. **Visual Studio 2022**（需安装 **桌面端开发 C++** 组件）
3. **Python 3.7**
4. **环境变量配置**

   ```sh
   npm config edit
   ```

   添加以下内容：

   ```ini
   registry=https://registry.npmmirror.com/
   electron_mirror=https://npmmirror.com/mirrors/electron/
   electron_builder_binaries_mirror=https://npmmirror.com/mirrors/electron-builder-binaries/
   home=https://npmmirror.com
   msvs_version=2022
   python=python
   ```

5. **全局安装 `node-gyp`**

   ```sh
   npm install -g node-gyp
   ```

---

## 🚀 启动项目

```sh
pnpm install                  # 安装依赖
pnpm rebuild                  # 重新编译本地依赖
pnpm run syncSchema           # 先同步开发数据库 Schema
pnpm run rebuild-lite         # 同步后，需要再次适配 Electron 原生模块，可选指定模块名 如：better-sqlite3
pnpm run dev                  # 启动项目 首次启动需先执行 npm run syncSchema
pnpm run build                # 构建项目 此处会先生成数据库升级文件
```

---

## 🔨 开发指南

### **📌 本地数据库同步**

- **修改数据库 Schema结构，快速同步本地数据库结构 执行**：

  ```sh
  npm run syncSchema

  此命令仅可快速同步数据库结构字段，但不生成升级文件，build时会先生成升级文件
  ```

  ```sh
  npm run syncSchema-old  （此原方式废弃，速度慢）

  该命令包含以下三步： 
  1. `npm rebuild` - 重新编译 `better-sqlite3` 适配本地 Node.js 版本
  2. `npx drizzle-kit push` - 将 `schema` 直接同步到本地数据库
  3. `npx electron-rebuild -f -w better-sqlite3` - 重新编译 `better-sqlite3` 适配 Electron 版本
  ```
