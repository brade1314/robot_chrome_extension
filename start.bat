@echo off

setlocal
title "chrome������Զ����ſγ̲��"
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
::echo.
::echo "==> 2����F12��console�����ӡ {"name":"autoplay","action":"pong"} ���������ɹ�"
echo.
echo "| -> 2����¼��վ���򿪿γ̲���ҳ�棬ˢ��"
echo.
echo "| -> 3���Ҽ��������ͼ�꣬-> ѡ�����ת��ҳ�������� "
echo.
echo "| -> ��ע�⣺Ҳ���Բ�ʹ�ô�bat���ֱ�ӵ��롿"
echo.
echo "|-----������ò��裬����-----|"
echo.

pause