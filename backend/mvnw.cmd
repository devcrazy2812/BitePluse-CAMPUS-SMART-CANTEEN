@echo off
setlocal
set "DIR=%~dp0"

set "IDEA_MAVEN=E:\IntelliJ IDEA Community Edition 2025.2.6.1\plugins\maven\lib\maven3\bin\mvn.cmd"
if exist "%IDEA_MAVEN%" (
    call "%IDEA_MAVEN%" %*
    exit /b %ERRORLEVEL%
)

where mvn >nul 2>nul
if %ERRORLEVEL% equ 0 (
    call mvn %*
    exit /b %ERRORLEVEL%
)

echo [ERROR] Maven not found. Please install Maven or run via IntelliJ IDEA.
exit /b 1
