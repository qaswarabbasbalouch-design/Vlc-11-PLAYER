import React from 'react';
import { X, Monitor, Download, CheckCircle2, Laptop, ArrowRight } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface WindowsInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WindowsInstallModal: React.FC<WindowsInstallModalProps> = ({ isOpen, onClose }) => {
  const { isInstallable, isInstalled, install } = usePWAInstall();

  if (!isOpen) return null;

  const handleInstallClick = async () => {
    if (isInstallable) {
      const success = await install();
      if (success) {
        onClose();
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-xs flex items-center justify-center z-50 p-4 select-none">
      <div className="bg-[#0b111e] border border-[#1e2e4a] rounded-xl shadow-2xl w-full max-w-xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="h-12 bg-[#080d16] border-b border-[#1b2a42] px-5 flex items-center justify-between text-slate-200">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded bg-blue-600 flex items-center justify-center shadow-md shadow-blue-600/30">
              <Monitor className="w-3.5 h-3.5 text-white" />
            </div>
            <div>
              <span className="text-xs font-semibold text-white tracking-wide">
                Install Nova Media Player to Windows
              </span>
              <span className="block text-[10px] text-slate-400">
                Web to Windows 11 Standalone Desktop Application
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800/60 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 text-slate-300 text-xs overflow-y-auto max-h-[75vh]">
          {isInstalled ? (
            <div className="bg-emerald-950/40 border border-emerald-700/50 rounded-lg p-4 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-emerald-300 text-sm">Already Installed as Windows App!</h4>
                <p className="text-[11px] text-emerald-200/80 mt-1">
                  Nova Media Player is currently running as an installed standalone Windows desktop app. It has its own taskbar icon and launches directly from your Start Menu.
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Direct 1-Click Install Button if supported */}
              {isInstallable && (
                <div className="bg-blue-950/40 border border-blue-700/60 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div>
                    <h4 className="font-semibold text-white text-sm">1-Click Install to Windows</h4>
                    <p className="text-[11px] text-blue-200/80 mt-0.5">
                      Install directly to your Windows 11 Taskbar, Start Menu, and Desktop.
                    </p>
                  </div>
                  <button
                    onClick={handleInstallClick}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg shadow-lg shadow-blue-600/30 transition-all cursor-pointer whitespace-nowrap text-xs"
                  >
                    <Download className="w-4 h-4" />
                    <span>Install to Windows Now</span>
                  </button>
                </div>
              )}

              {/* Step-by-Step Browser Instructions */}
              <div className="space-y-3">
                <h4 className="font-semibold text-slate-200 text-xs uppercase tracking-wider flex items-center gap-2">
                  <Laptop className="w-4 h-4 text-blue-400" />
                  <span>How to Install from Your Browser to Windows:</span>
                </h4>

                {/* Option 1: Microsoft Edge */}
                <div className="bg-[#111a2d] border border-[#1e2d48] rounded-lg p-3.5 space-y-2">
                  <div className="flex items-center justify-between font-semibold text-slate-100">
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                      Option A: Microsoft Edge (Recommended on Windows 11)
                    </span>
                    <span className="text-[10px] bg-blue-950 text-blue-300 px-1.5 py-0.5 rounded border border-blue-800/40">
                      Edge
                    </span>
                  </div>
                  <ol className="list-decimal list-inside space-y-1 text-[11px] text-slate-300 pl-1 leading-relaxed">
                    <li>Look at the top-right of Edge's address bar for the <strong className="text-white">App Available (⊞)</strong> icon, or click the <strong className="text-white">...</strong> menu in Edge.</li>
                    <li>Select <strong className="text-blue-300">Apps</strong> <ArrowRight className="w-2.5 h-2.5 inline" /> <strong className="text-white">Install Nova Media Player</strong>.</li>
                    <li>Check <strong className="text-white">"Pin to taskbar"</strong> and <strong className="text-white">"Pin to Start"</strong>.</li>
                  </ol>
                </div>

                {/* Option 2: Google Chrome / Brave */}
                <div className="bg-[#111a2d] border border-[#1e2d48] rounded-lg p-3.5 space-y-2">
                  <div className="flex items-center justify-between font-semibold text-slate-100">
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      Option B: Google Chrome / Brave Browser
                    </span>
                    <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded">
                      Chrome / Brave
                    </span>
                  </div>
                  <ol className="list-decimal list-inside space-y-1 text-[11px] text-slate-300 pl-1 leading-relaxed">
                    <li>Click the <strong className="text-white">Install icon (⊕)</strong> on the right side of Chrome's address bar.</li>
                    <li>Or click the three dots (<strong className="text-white">⋮</strong>) <ArrowRight className="w-2.5 h-2.5 inline" /> <strong className="text-white">Save and share</strong> <ArrowRight className="w-2.5 h-2.5 inline" /> <strong className="text-blue-300">Install Nova Media Player</strong>.</li>
                    <li>Click <strong className="text-blue-400 font-semibold">Install</strong> in the confirmation box.</li>
                  </ol>
                </div>
              </div>

              {/* What you get when installed */}
              <div className="bg-[#0e1627] border border-[#1a2942] rounded-lg p-3.5">
                <h5 className="font-semibold text-slate-200 text-xs mb-2">Installed App Features on Windows 11:</h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                    <span>Borderless standalone window (no URL bar)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                    <span>Pins to Windows Taskbar &amp; Start Menu</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                    <span>Plays local videos offline without internet</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                    <span>Hardware-accelerated video decoding</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="h-11 bg-[#080d16] border-t border-[#1b2a42] px-5 flex items-center justify-between text-xs">
          <span className="text-[11px] text-slate-500">
            Progressive Web App (PWA) • Windows 11 Certified
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#152136] hover:bg-[#1e2d48] text-slate-200 rounded font-medium cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
