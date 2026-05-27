@echo off
setlocal EnableExtensions
cd /d "%~dp0"

set "MAVEN_VERSION=3.9.9"
set "TOOLS_DIR=%CD%\.tools"
set "MAVEN_HOME=%TOOLS_DIR%\apache-maven-%MAVEN_VERSION%"
set "MAVEN_ZIP=%TOOLS_DIR%\maven.zip"
set "MAVEN_URL=https://repo.maven.apache.org/maven2/org/apache/maven/apache-maven/%MAVEN_VERSION%/apache-maven-%MAVEN_VERSION%-bin.zip"

java -version >nul 2>&1
if errorlevel 1 goto :no_java
goto :java_ok

:no_java
echo ERROR: Java is not installed or not on PATH.
exit /b 1

:java_ok
if exist "%MAVEN_HOME%\bin\mvn.cmd" goto :maven_ready

if not exist "%TOOLS_DIR%" mkdir "%TOOLS_DIR%"
powershell -NoProfile -ExecutionPolicy Bypass -Command "$ErrorActionPreference='Stop'; Invoke-WebRequest -Uri '%MAVEN_URL%' -OutFile '%MAVEN_ZIP%'; Expand-Archive -Path '%MAVEN_ZIP%' -DestinationPath '%TOOLS_DIR%' -Force;"
if errorlevel 1 exit /b 1

:maven_ready
call "%MAVEN_HOME%\bin\mvn.cmd" -DskipTests clean package
exit /b %ERRORLEVEL%
