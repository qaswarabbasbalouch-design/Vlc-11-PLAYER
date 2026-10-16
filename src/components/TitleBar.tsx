import React from 'react';
import { Download, Monitor, CheckCircle2, AppWindow } from 'lucide-react';

interface TitleBarProps {
  currentTitle: string;
  onOpenWindowsPackage: () => void;
  onOpenWindowsInstall: () => void;
  isInstalled: boolean;
  isInstallable: boolean;
  onDirectInstall: () => void;
}

export const TitleBar: React.FC<TitleBarProps> = ({
  currentTitle,
  onOpenWindowsPackage,
  onOpenWindowsInstall,
  isInstalled,
  isInstallable,
  onDirectInstall,
}) => {
  const handleInstallClick = () => {
    if (isInstallable) {
      onDirectInstall();
    } else {
      onOpenWindowsInstall();
    }
  };

  return (
    <div className="h-9 bg-[#080c14] border-b border-[#161f30] flex items-center justify-between select-none px-3 text-slate-300 z-50">
      {/* Left: Brand Icon + App Name */}
      <div className="flex items-center gap-2.5 overflow-hidden">
        {/* Nova Player Logo: Blue rounded square with white play triangle */}
        <div className="w-5 h-5 rounded-[5px] bg-blue-600 flex items-center justify-center shadow-sm shadow-blue-500/20 shrink-0">
          <svg className="w-2.5 h-2.5 text-white ml-0.5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
        <span className="text-xs font-semibold tracking-wide text-slate-200 shrink-0">Nova Media Player</span>
        
        {currentTitle && (
          <span className="text-[11px] text-slate-400 truncate max-w-md hidden sm:inline">
            <span className="text-slate-600 mx-1.5">•</span>
            {currentTitle}
          </span>
        )}
      </div>

      {/* Right: Actions (No duplicate window caption buttons - Windows provides native controls) */}
      <div className="flex items-center h-full">
        {/* Web to Windows 11 PWA Install Button */}
        {isInstalled ? (
          <div className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 rounded px-2.5 py-0.5 mr-2">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Windows 11 App</span>
          </div>
        ) : (
          <button
            onClick={handleInstallClick}
            className="flex items-center gap-1.5 text-[11px] font-semibold text-white bg-blue-600 hover:bg-blue-500 active:bg-blue-700 shadow-sm shadow-blue-600/30 rounded px-2.5 py-1 mr-2 transition-all cursor-pointer"
            title="Install Nova Media Player directly from web to Windows 11 Desktop"
          >
            <AppWindow className="w-3.5 h-3.5" />
            <span>Install to Windows</span>
          </button>
        )}

        {/* Windows Desktop Exporter Trigger */}
        <button
          onClick={onOpenWindowsPackage}
          className="flex items-center gap-1.5 text-[11px] font-medium text-blue-400 hover:text-blue-300 bg-blue-950/40 hover:bg-blue-900/50 border border-blue-800/50 rounded px-2.5 py-1 transition-colors cursor-pointer"
          title="Export Standalone C# .NET 8 WPF Visual Studio Project & Inno Setup Installer"
        >
          <Monitor className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">C# .NET 8 Source</span>
          <Download className="w-3 h-3 text-blue-300" />
        </button>
      </div>
    </div>
  );
};
