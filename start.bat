@echo off

setlocal
title "chrome浏览器百度网盘直接下载插件"
mode con cols=100 lines=30
color 0A

echo.
echo "|-----插件配置步骤，开始-----|"
echo.
echo "| ->> 请确认电脑已安装chrome浏览器，并浏览器已关闭"
echo.
echo "| ->> 当前目录是:" %~dp0%
echo.
echo "| ->> 如果浏览器已经打开，会关闭后重新打开，并加载插件；未打开则打开浏览器同时加载插件"
for /f "tokens=2 skip=3 delims= " %%i in ('tasklist /fi "imagename eq chrome.exe" /fi "STATUS eq running" ') do (TASKKILL /f /pid %%i)

echo.
start chrome --load-extension=%~dp0% --no-first-run
echo "| -> 1、浏览器已启动，右上角如果有插件图标则安装成功"

echo.
echo "| -> 2、打开百度网盘，如果多了一个[下载助手]按钮，表示能正常使用"
echo.
echo "| -> 【注意：也可以不使用此bat命令，直接导入】"
echo.
echo "|-----插件配置步骤，结束-----|"
echo.

pause