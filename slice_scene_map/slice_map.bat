@echo off

set drawIn=%~1
set root=%~dp0

node %root%\src\main.js %drawIn%
pause