@echo off

setlocal
title "chrome������ٶ�����ֱ�����ز��"
mode con cols=100 lines=30
color 0A

echo.
echo "|-----������ò��裬��ʼ-----|"
echo.
echo "| ->> ��ȷ�ϵ����Ѱ�װchrome���������������ѹر�"
echo.
echo "| ->> ��ǰĿ¼��:" %~dp0%

echo.
start chrome --load-extension=%~dp0% --no-first-run
echo "| -> 1������������������Ͻ�����в��ͼ����װ�ɹ�"

echo.
echo "| -> 2���򿪰ٶ����̣��������һ��[��������]��ť����ʾ������ʹ��"
echo.
echo "| -> ��ע�⣺Ҳ���Բ�ʹ�ô�bat���ֱ�ӵ��롿"
echo.
echo "|-----������ò��裬����-----|"
echo.

pause