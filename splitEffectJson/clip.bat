@echo off

set drawIn=%~1
set root=%~dp0

node %root%\src\clip.js %drawIn%
pause
