@echo off

set drawIn=%~1
@REM 此文件所在的根目录
set srcRoot=E:\\git_project\\work_pro_tools\\splitEffectJson
@REM 要拆图的目录
set source=E:\\git_project\\work_pro_tools\\splitEffectJson\\effect_source
@REM 拆图输出目录
set output=E:\\git_project\\work_pro_tools\\splitEffectJson\\output

node %srcRoot%\src\splitAnim.js %drawIn% %source% %output%
pause