@echo off
echo ============================================
echo 推送 feature/new-feature 分支到远程仓库
echo ============================================
echo.
echo 使用自定义Git路径：E:\学啊啊啊啊啊啊学\git\Git\bin\git.exe
echo.

REM 设置Git路径
set GIT_PATH="E:\学啊啊啊啊啊啊学\git\Git\bin\git.exe"

REM 检查Git是否可用
if not exist %GIT_PATH% (
    echo 错误：未找到Git可执行文件
    echo 路径：%GIT_PATH%
    echo 请检查Git安装位置
    pause
    exit /b 1
)

REM 检查当前分支
echo 当前分支：
%GIT_PATH% branch --show-current

echo.
echo 推送分支到远程仓库...
%GIT_PATH% push -u origin feature/new-feature

if %errorlevel% equ 0 (
    echo.
    echo ? 分支推送成功！
    echo 远程分支：origin/feature/new-feature
    echo.
    echo 您可以在GitHub上查看：
    echo https://github.com/Puss-M/From-the-Soil/branches
) else (
    echo.
    echo ? 分支推送失败
    echo 可能的原因：
    echo 1. 网络连接问题
    echo 2. GitHub权限问题
    echo 3. 分支已存在
)

echo.
pause
