@echo off
REM Windows x64 一键打包脚本
REM 这个批处理文件方便 Windows 用户一键完成编译和打包

echo ========================================
echo OSS Browser Win64 一键打包工具
echo ========================================
echo.

REM 检查 Node.js 是否安装
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [错误] 未找到 Node.js，请先安装 Node.js
    pause
    exit /b 1
)

echo [1/2] 编译前端代码...
echo.
call pnpm run build
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [错误] 编译失败，请检查错误信息
    pause
    exit /b 1
)

echo.
echo [2/2] 打包 Win64 应用...
echo.
call pnpm run build:win64
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [错误] 打包失败，请检查错误信息
    pause
    exit /b 1
)

echo.
echo ========================================
echo 打包完成！
echo ========================================
echo.
echo 可执行文件位置: build\oss-browser-win32-x64\oss-browser.exe
echo 压缩包位置: releases\1.19.0\oss-browser-win32-x64.zip
echo.
pause

