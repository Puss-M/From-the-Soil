@echo off
echo ============================================
echo Git安装状态检查
echo ============================================
echo.

echo 1. 检查Git命令是否在PATH中:
where git >nul 2>&1
if %errorlevel% equ 0 (
    echo ? Git命令可用
    git --version
) else (
    echo ? Git命令不可用
)

echo.
echo 2. 检查常见的Git安装位置:
if exist "C:\Program Files\Git\bin\git.exe" (
    echo ? Git安装在: C:\Program Files\Git\bin\
) else (
    echo ? 未找到: C:\Program Files\Git\bin\git.exe
)

if exist "C:\Program Files (x86)\Git\bin\git.exe" (
    echo ? Git安装在: C:\Program Files (x86)\Git\bin\
) else (
    echo ? 未找到: C:\Program Files (x86)\Git\bin\git.exe
)

if exist "%USERPROFILE%\AppData\Local\Programs\Git\bin\git.exe" (
    echo ? Git安装在: %USERPROFILE%\AppData\Local\Programs\Git\bin\
) else (
    echo ? 未找到: %USERPROFILE%\AppData\Local\Programs\Git\bin\git.exe
)

echo.
echo 3. 当前Git仓库状态:
if exist ".git" (
    echo ? 当前目录是Git仓库
    echo   远程仓库: https://github.com/Puss-M/From-the-Soil.git
) else (
    echo ? 当前目录不是Git仓库
)

echo.
echo 4. 当前分支:
if exist ".git\HEAD" (
    type .git\HEAD
)

echo.
echo ============================================
echo 建议:
echo 如果Git未安装，请从 https://git-scm.com/download/win 下载安装
echo 安装时请确保勾选"Add Git to PATH"选项
echo ============================================
echo.
pause