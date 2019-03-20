@echo off

setlocal
title "chrome浏览器自动播放课程插件"
mode con cols=100 lines=30
color 0A

echo.
echo "|-----插件配置步骤，开始-----|"
echo.
echo "| ->> 请确认电脑已安装chrome浏览器，并浏览器已关闭"
echo.
echo "| ->> 当前目录是:" %~dp0%

echo.
start chrome --load-extension=%~dp0% --no-first-run
echo "| -> 1、浏览器已启动，右上角如果有插件图标则安装成功"
::echo.
::echo "==> 2、按F12，console如果打印 {"name":"autoplay","action":"pong"} 则插件启动成功"
echo.
echo "| -> 2、登录网站，打开课程播放页面，刷新"
echo.
echo "| -> 3、右键单击插件图标，-> 选项：在跳转的页面点击保存 "
echo.
echo "| -> 【注意：也可以不使用此bat命令，直接导入】"
echo.
echo "|-----插件配置步骤，结束-----|"
echo.

pause