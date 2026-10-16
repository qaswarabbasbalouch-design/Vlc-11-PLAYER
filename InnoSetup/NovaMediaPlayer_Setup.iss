; Inno Setup Compiler Script for Nova Media Player Windows 11
; Generates standalone Setup_NovaMediaPlayer_x64.exe

#define MyAppName "Nova Media Player"
#define MyAppVersion "1.0.0"
#define MyAppPublisher "Nova Multimedia Labs"
#define MyAppURL "https://github.com/nova-player/nova-media-player"
#define MyAppExeName "NovaMediaPlayer.exe"

[Setup]
AppId={{5E2A91D3-78BF-4D7F-85D3-A122C092F264}
AppName={#MyAppName}
AppVersion={#MyAppVersion}
AppPublisher={#MyAppPublisher}
AppPublisherURL={#MyAppURL}
AppSupportURL={#MyAppURL}
AppUpdatesURL={#MyAppURL}
DefaultDirName={autopf}\\{#MyAppName}
DefaultGroupName={#MyAppName}
AllowNoIcons=yes
OutputDir=Output
OutputBaseFilename=Setup_NovaMediaPlayer_x64
Compression=lzma2/ultra64
SolidCompression=yes
WizardStyle=modern
ArchitecturesInstallIn64BitMode=x64
PrivilegesRequired=lowest
UninstallDisplayIcon={app}\\{#MyAppExeName}

[Languages]
Name: "english"; MessagesFile: "compiler:Default.isl"

[Tasks]
Name: "desktopicon"; Description: "{cm:CreateDesktopIcon}"; GroupDescription: "{cm:AdditionalIcons}"; Flags: unchecked
Name: "associate_video"; Description: "Associate with common video formats (MP4, MKV, AVI, WebM)"; GroupDescription: "File Associations:"

[Files]
Source: "..\\NovaMediaPlayer\\bin\\Release\\net8.0-windows10.0.22621.0\\win-x64\\publish\\*"; DestDir: "{app}"; Flags: ignoreversion recursesubdirs createallsubdirs

[Icons]
Name: "{group}\\{#MyAppName}"; Filename: "{app}\\{#MyAppExeName}"
Name: "{group}\\{cm:UninstallProgram,{#MyAppName}}"; Filename: "{uninstallexe}"
Name: "{autodesktop}\\{#MyAppName}"; Filename: "{app}\\{#MyAppExeName}"; Tasks: desktopicon

[Registry]
Root: HKCU; Subkey: "Software\\Classes\\.mp4\\OpenWithProgids"; ValueType: string; ValueName: "NovaMediaPlayer.AssocFile.mp4"; ValueData: ""; Flags: uninsdeletevalue; Tasks: associate_video
Root: HKCU; Subkey: "Software\\Classes\\.mkv\\OpenWithProgids"; ValueType: string; ValueName: "NovaMediaPlayer.AssocFile.mkv"; ValueData: ""; Flags: uninsdeletevalue; Tasks: associate_video
Root: HKCU; Subkey: "Software\\Classes\\.webm\\OpenWithProgids"; ValueType: string; ValueName: "NovaMediaPlayer.AssocFile.webm"; ValueData: ""; Flags: uninsdeletevalue; Tasks: associate_video

[Run]
Filename: "{app}\\{#MyAppExeName}"; Description: "{cm:LaunchProgram,{#StringChange(MyAppName, '&', '&&')}}"; Flags: nowait postinstall skipifsilent
