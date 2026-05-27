@echo off
setlocal EnableExtensions
cd /d "%~dp0"

set "MAVEN_VERSION=3.9.9"
set "TOOLS_DIR=%CD%\.tools"
set "MAVEN_HOME=%TOOLS_DIR%\apache-maven-%MAVEN_VERSION%"
set "MAVEN_ZIP=%TOOLS_DIR%\maven.zip"
set "MAVEN_URL=https://repo.maven.apache.org/maven2/org/apache/maven/apache-maven/%MAVEN_VERSION%/apache-maven-%MAVEN_VERSION%-bin.zip"

echo.
echo Step 1/3: Checking Java...

java -version >nul 2>&1
if errorlevel 1 goto :no_java
goto :java_ok

:no_java
echo ERROR: Java is not installed or not on PATH.
echo Install Java 8 or newer, then reopen Command Prompt.
exit /b 1

:java_ok
echo Java found.

if exist "%MAVEN_HOME%\bin\mvn.cmd" goto :maven_ready

echo.
echo Step 2/3: Downloading Apache Maven %MAVEN_VERSION% - first run only...
if not exist "%TOOLS_DIR%" mkdir "%TOOLS_DIR%"

powershell -NoProfile -ExecutionPolicy Bypass -Command "$ErrorActionPreference='Stop'; Invoke-WebRequest -Uri '%MAVEN_URL%' -OutFile '%MAVEN_ZIP%'; Expand-Archive -Path '%MAVEN_ZIP%' -DestinationPath '%TOOLS_DIR%' -Force;"
if errorlevel 1 goto :maven_fail
goto :maven_ready

:maven_fail
echo ERROR: Failed to download or extract Maven.
exit /b 1

:maven_ready
echo.
echo Step 3/3: Building backend...
call "%MAVEN_HOME%\bin\mvn.cmd" -DskipTests clean package
if errorlevel 1 goto :build_fail

echo.
echo BUILD SUCCESS.
echo Starting Spring Boot on http://127.0.0.1:8080
echo Press Ctrl+C to stop.
echo.
call "%MAVEN_HOME%\bin\mvn.cmd" spring-boot:run
goto :end

:build_fail
echo.
echo BUILD FAILED. See errors above.
exit /b 1

:end
endlocal
