# Windows x64 打包指南

本文档介绍如何在 Windows 系统上打包 OSS Browser 的 Win64 版本。

## 📋 前置要求

1. **Node.js**：已安装 Node.js（推荐 v8.x，当前使用 v23.x 也可以）
2. **包管理器**：pnpm（或 npm/yarn）
3. **依赖安装完成**：已运行 `pnpm install`

## 🚀 快速开始

### 方法一：使用批处理文件（最简单）⭐⭐⭐

双击运行 `build-win64.bat` 文件，一键完成编译和打包！

```batch
# 直接双击运行
build-win64.bat
```

这个批处理文件会自动完成所有步骤，无需手动输入命令。

---

### 方法二：使用 npm 脚本（推荐）⭐⭐

这是最常用的方法，适合开发者使用。

```bash
# 步骤1: 编译前端代码到 dist 目录
pnpm run build

# 步骤2: 打包 Windows x64 应用
pnpm run build:win64
```

**完成后你会得到：**
- 📁 可执行程序目录：`./build/oss-browser-win32-x64/`
- 📦 压缩包：`./releases/1.19.0/oss-browser-win32-x64.zip`

直接运行：`./build/oss-browser-win32-x64/oss-browser.exe`

---

### 方法三：使用 Make 命令

如果你熟悉 Make 工具，可以使用原生的 Makefile。

#### 1. 安装 make.exe

下载并解压 `tools/make-x64.zip`，将 `make.exe` 复制到 `C:\Windows\` 目录。

#### 2. 运行打包命令

```bash
# 编译前端代码
make build

# 打包 win64
make win64
```

---

## 📦 打包产物说明

打包完成后，会生成以下目录结构：

```
build/
└── oss-browser-win32-x64/          # 应用程序目录
    ├── oss-browser.exe             # 主程序
    ├── resources/                  # 资源文件
    │   ├── app.asar                # 打包的应用代码
    │   └── custom/                 # 自定义图标等
    ├── locales/                    # 语言文件
    └── ...其他 Electron 运行时文件

releases/
└── 1.19.0/
    └── oss-browser-win32-x64.zip   # 最终发布包
```

---

## 🔧 自定义配置

### 修改版本号

编辑 `package.json` 中的 `version` 字段：

```json
{
  "version": "1.19.0"  // 修改这里
}
```

### 自定义图标和名称

修改 `custom/` 目录下的文件：
- `icon.ico` - Windows 图标
- `icon.icns` - Mac 图标
- `icon.png` - Linux 图标

详细说明请参考：[custom/Readme.md](custom/Readme.md)

---

## ⚠️ 常见问题

### 1. make win64 报错："ELECTRON_MIRROR 不是内部或外部命令"

**问题原因**：Makefile 使用的是 Linux/Mac 的环境变量设置语法，在 Windows 的 PowerShell 或 CMD 中不兼容。

**解决方案**：使用 npm 脚本代替 make 命令：

```bash
# 方案一：使用 pnpm（推荐）
pnpm run build        # 编译前端代码
pnpm run build:win64  # 打包 win64

# 方案二：使用 npm
npm run build
npm run build:win64
```

`build:win64` 脚本会自动设置环境变量并完成打包。

### 2. 找不到 gulp 命令

**解决方案**：确保已经运行 `pnpm install` 安装了所有依赖。

### 3. electron-packager 下载慢

**解决方案**：`build-win64.js` 已配置使用国内镜像：
```
ELECTRON_MIRROR=https://npmmirror.com/mirrors/electron/
```

### 4. Node.js 版本警告

项目要求 Node.js 8.2.1，但使用更高版本（如 v23.x）通常也能正常工作。如果遇到兼容性问题，建议使用 nvm 切换到 Node.js 8.x。

### 5. 缺少 archiver 模块

**解决方案**：运行以下命令安装：
```bash
pnpm install
```

### 6. 打包后无法运行

**检查项**：
- 确保 `dist` 目录存在且包含完整的编译文件
- 检查 `custom/icon.ico` 文件是否存在
- 查看控制台错误信息

### 7. 仍想使用 make 命令怎么办？

如果你坚持使用 make 命令，需要修改 Makefile 以适配 Windows：

**方法 1**：安装 Git Bash，在 Git Bash 中运行 make 命令（推荐）

**方法 2**：使用 WSL (Windows Subsystem for Linux)

**方法 3**：创建 Windows 批处理文件（见下方示例）

---

## 📝 打包流程详解

`pnpm run build:win64` 执行的步骤：

1. **检查 dist 目录**：确保前端代码已编译
2. **使用 electron-packager**：将 dist 目录打包成 Electron 应用
   - 平台：Windows (win32)
   - 架构：x64
   - 使用 asar 打包提高加载速度
   - 排除 .node 文件以保持原生模块可用
3. **复制自定义资源**：将 custom/ 目录复制到应用中
4. **压缩打包**：生成最终的 zip 文件

---

## 🔗 相关文档

- [开发环境搭建](README-CN.md#4-开发环境搭建)
- [自定义 Build](custom/Readme.md)
- [调试指南](debug.md)

---

## 💡 提示

- 首次打包会下载 Electron 运行时，可能需要较长时间
- 建议在打包前运行 `pnpm run lint` 检查代码质量
- 打包完成后建议测试应用的所有功能

---

**祝打包顺利！** 🎉

