@echo off

@REM echo %cd%
@REM echo %~dp0

set Root=C:\Users\zhengpj\Desktop\testNodeV
@REM echo %Root%

@REM 拖入的全部文件集合
set FileRoot=%*
@REM echo %FileRoot%

%Root%/libs/node.exe %Root%/src/main.js %FileRoot%

pause