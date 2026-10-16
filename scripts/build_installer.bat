@echo off
echo ===============================================================
echo   NOVA MEDIA PLAYER - WINDOWS 11 STANDALONE BUILD SCRIPT
echo ===============================================================
echo.

where dotnet >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo [ERROR] .NET 8 SDK not found! Please install .NET 8 SDK from:
    echo         https://dotnet.microsoft.com/download/dotnet/8.0
    pause
    exit /b 1
)

echo [1/3] Restoring NuGet dependencies and building Release (win-x64)...
cd ..\NovaMediaPlayer
dotnet restore -r win-x64
if %ERRORLEVEL% neq 0 (
    echo [ERROR] NuGet restore failed.
    pause
    exit /b 1
)

echo [2/3] Publishing self-contained single executable...
dotnet publish -c Release -r win-x64 --self-contained true -p:PublishSingleFile=true -p:IncludeNativeLibrariesForSelfExtract=true
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Dotnet publish failed.
    pause
    exit /b 1
)

echo.
echo [3/3] Compiling Inno Setup Windows Installer...
set ISCC="C:\Program Files (x86)\Inno Setup 6\ISCC.exe"
if exist %ISCC% (
    cd ..\InnoSetup
    %ISCC% NovaMediaPlayer_Setup.iss
    echo.
    echo ===============================================================
    echo   BUILD SUCCESS! 
    echo   Output Installer: InnoSetup\Output\Setup_NovaMediaPlayer_x64.exe
    echo ===============================================================
) else (
    echo [INFO] Inno Setup compiler not found at default path.
    echo        Stand-alone portable executable is ready in:
    echo        NovaMediaPlayer\bin\Release\net8.0-windows10.0.22621.0\win-x64\publish\NovaMediaPlayer.exe
)

pause
