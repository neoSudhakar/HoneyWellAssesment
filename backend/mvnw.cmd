@REM ----------------------------------------------------------------------------
@REM Maven Wrapper for Windows
@REM ----------------------------------------------------------------------------
@echo off
setlocal

set MVNW_REPOURL=https://repo.maven.apache.org/maven2
set WRAPPER_DIR=%~dp0.mvn\wrapper
set WRAPPER_JAR=%WRAPPER_DIR%\maven-wrapper.jar

if not exist "%WRAPPER_DIR%" (
  mkdir "%WRAPPER_DIR%" >nul 2>&1
)

if not exist "%WRAPPER_JAR%" (
  powershell -NoProfile -ExecutionPolicy Bypass -Command ^
    "$ErrorActionPreference='Stop';" ^
    "$wrapperUrl='%MVNW_REPOURL%/io/takari/maven-wrapper/0.5.6/maven-wrapper-0.5.6.jar';" ^
    "Invoke-WebRequest -Uri $wrapperUrl -OutFile '%WRAPPER_JAR%';"
  if errorlevel 1 (
    echo Failed to download Maven Wrapper JAR.
    exit /b 1
  )
)

set MAVEN_PROJECTBASEDIR=%~dp0

java -jar "%WRAPPER_JAR%" -Dmaven.multiModuleProjectDirectory="%MAVEN_PROJECTBASEDIR%" %*
exit /b %ERRORLEVEL%

