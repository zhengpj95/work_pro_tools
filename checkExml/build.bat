@echo off

set drawIn=%~1
set root=D:\project\y3

@REM echo %~dp0
node %~dp0\main.js %drawIn% %root%\eui_prj\resource\eui_skins

pause