# Windows 打包问题解决方案

## 问题描述

在 Windows 系统上运行 `make win64` 命令时会遇到以下错误：

```
'ELECTRON_MIRROR' 不是内部或外部命令，也不是可运行的程序
或批处理文件。
make: *** [win64] 错误 1
```

## 问题原因

Makefile 中使用的环境变量设置语法（`ELECTRON_MIRROR=xxx command`）是 Linux/Mac 的语法，在 Windows 的 PowerShell 或 CMD 中不支持。

## 解决方案

本项目提供了三种 Windows 平台的打包方法：

### 方法 1：批处理文件（最简单）⭐⭐⭐

直接双击运行 `build-win64.bat` 文件，一键完成所有操作。

**优点**：
- ✅ 最简单，无需输入命令
- ✅ 自动检查环境
- ✅ 显示详细进度

**使用方法**：
```
直接双击 build-win64.bat
```

---

### 方法 2：npm 脚本（推荐）⭐⭐

使用 npm 或 pnpm 运行打包脚本。

**优点**：
- ✅ 跨平台兼容
- ✅ 开发者友好
- ✅ 可以单独执行各个步骤

**使用方法**：
```bash
# 步骤 1: 编译前端代码
pnpm run build

# 步骤 2: 打包应用
pnpm run build:win64
```

---

### 方法 3：Make 命令（需要特殊环境）

在特定环境下使用原生 Makefile。

**可用环境**：
- Git Bash
- WSL (Windows Subsystem for Linux)
- Cygwin

**使用方法**：
```bash
# 在 Git Bash 或 WSL 中运行
make build
make win64
```

## 技术细节

### build-win64.js 脚本

这个 Node.js 脚本解决了 Windows 环境变量设置的问题：

1. **正确设置环境变量**：使用 Node.js 的 `child_process.execSync` 方法，通过 `env` 参数设置环境变量
2. **跨平台兼容**：使用 Node.js 的 `path` 和 `fs` 模块处理路径和文件操作
3. **详细的进度提示**：显示每个步骤的执行状态
4. **错误处理**：检查关键目录和文件的存在性

### 关键代码

```javascript
// 在 Windows 上正确设置环境变量
const env = {
  ...process.env,
  ELECTRON_MIRROR: 'https://npmmirror.com/mirrors/electron/'
};

execSync('node node_modules/electron-packager/cli.js ...', {
  env: env,           // 传递环境变量
  stdio: 'inherit'    // 显示实时输出
});
```

### 打包流程

```
┌─────────────────────┐
│  1. 检查 dist 目录   │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  2. 打包 Electron    │
│  - 使用国内镜像      │
│  - 设置环境变量      │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  3. 复制自定义资源   │
│  - 复制 custom 目录  │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  4. 创建 zip 压缩包  │
│  - 生成最终安装包    │
└─────────────────────┘
```

## 文件说明

| 文件名 | 说明 |
|--------|------|
| `build-win64.js` | Node.js 打包脚本，解决 Windows 环境变量问题 |
| `build-win64.bat` | Windows 批处理文件，一键打包工具 |
| `BUILD-WIN64-CN.md` | 详细的打包指南文档 |
| `Makefile` | 原生 Make 配置（需要 Linux/Mac 或 Git Bash） |

## 常见问题

### Q1: 为什么不修改 Makefile？

A: Makefile 需要保持与 Linux/Mac 的兼容性，因此提供了 Windows 专用的解决方案。

### Q2: 三种方法的打包结果有区别吗？

A: 没有区别，三种方法生成的应用程序完全相同。

### Q3: 推荐使用哪种方法？

A: 
- 普通用户：使用批处理文件（`build-win64.bat`）
- 开发者：使用 npm 脚本（`pnpm run build:win64`）
- 熟悉 Linux 的用户：在 Git Bash 中使用 make 命令

## 相关文档

- [详细打包指南](BUILD-WIN64-CN.md)
- [开发环境搭建](README-CN.md)
- [自定义配置](custom/Readme.md)

---

**创建日期**：2025-11-14  
**适用版本**：v1.19.0+

