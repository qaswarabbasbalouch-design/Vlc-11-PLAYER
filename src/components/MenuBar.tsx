import React, { useState, useRef, useEffect } from 'react';

interface MenuBarProps {
  onOpenFile: () => void;
  onOpenFolder: () => void;
  onOpenStream: () => void;
  onSavePlaylist: () => void;
  onPlayPause: () => void;
  onStop: () => void;
  onSeekRelative: (seconds: number) => void;
  onSetSpeed: (speed: number) => void;
  onOpenEqualizer: () => void;
  onOpenMediaInfo: () => void;
  onOpenPlaylist: () => void;
  onOpenWindowsPackage: () => void;
  onOpenWindowsInstall: () => void;
  onTakeSnapshot: () => void;
  onToggleFullscreen: () => void;
  onMuteToggle: () => void;
  onStepFrame: () => void;
  currentSpeed: number;
}

export const MenuBar: React.FC<MenuBarProps> = ({
  onOpenFile,
  onOpenFolder,
  onOpenStream,
  onSavePlaylist,
  onPlayPause,
  onStop,
  onSeekRelative,
  onSetSpeed,
  onOpenEqualizer,
  onOpenMediaInfo,
  onOpenPlaylist,
  onOpenWindowsPackage,
  onOpenWindowsInstall,
  onTakeSnapshot,
  onToggleFullscreen,
  onMuteToggle,
  onStepFrame,
  currentSpeed,
}) => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const menuBarRef = useRef<HTMLDivElement>(null);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuBarRef.current && !menuBarRef.current.contains(e.target as Node)) {
        setActiveMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleMenu = (menuName: string) => {
    setActiveMenu(activeMenu === menuName ? null : menuName);
  };

  const handleMouseEnter = (menuName: string) => {
    if (activeMenu !== null) {
      setActiveMenu(menuName);
    }
  };

  const closeMenu = () => setActiveMenu(null);

  return (
    <div ref={menuBarRef} className="h-7 bg-[#0b101b] border-b border-[#141d2d] flex items-center px-2 text-xs select-none relative z-40">
      {/* 1. Media Menu */}
      <div className="relative">
        <button
          onClick={() => toggleMenu('media')}
          onMouseEnter={() => handleMouseEnter('media')}
          className={`px-2.5 py-1 rounded transition-colors text-slate-300 hover:text-white cursor-pointer ${
            activeMenu === 'media' ? 'bg-[#1e293b] text-white' : 'hover:bg-slate-800/60'
          }`}
        >
          Media
        </button>
        {activeMenu === 'media' && (
          <div className="absolute left-0 top-full mt-1 w-64 bg-[#0d1424] border border-[#1e293b] rounded-md shadow-2xl py-1 text-slate-200 text-xs z-50">
            <button
              onClick={() => { onOpenFile(); closeMenu(); }}
              className="w-full flex items-center justify-between px-3.5 py-1.5 hover:bg-blue-600 hover:text-white text-left cursor-pointer"
            >
              <span>Open File...</span>
              <span className="text-[10px] text-slate-400">Ctrl+O</span>
            </button>
            <button
              onClick={() => { onOpenFolder(); closeMenu(); }}
              className="w-full flex items-center justify-between px-3.5 py-1.5 hover:bg-blue-600 hover:text-white text-left cursor-pointer"
            >
              <span>Open Folder / Multi...</span>
              <span className="text-[10px] text-slate-400">Ctrl+F</span>
            </button>
            <button
              onClick={() => { onOpenStream(); closeMenu(); }}
              className="w-full flex items-center justify-between px-3.5 py-1.5 hover:bg-blue-600 hover:text-white text-left cursor-pointer"
            >
              <span>Open Network Stream...</span>
              <span className="text-[10px] text-slate-400">Ctrl+N</span>
            </button>
            <div className="h-px bg-slate-800 my-1"></div>
            <button
              onClick={() => { onSavePlaylist(); closeMenu(); }}
              className="w-full flex items-center justify-between px-3.5 py-1.5 hover:bg-blue-600 hover:text-white text-left cursor-pointer"
            >
              <span>Save Playlist to M3U...</span>
              <span className="text-[10px] text-slate-400">Ctrl+Y</span>
            </button>
            <div className="h-px bg-slate-800 my-1"></div>
            <button
              onClick={() => { onOpenWindowsInstall(); closeMenu(); }}
              className="w-full flex items-center justify-between px-3.5 py-1.5 bg-blue-600/20 text-blue-300 hover:bg-blue-600 hover:text-white text-left cursor-pointer font-semibold"
            >
              <span>Install to Windows (PWA)...</span>
              <span className="text-[10px] text-blue-300">Windows 11</span>
            </button>
            <button
              onClick={() => { onOpenWindowsPackage(); closeMenu(); }}
              className="w-full flex items-center justify-between px-3.5 py-1.5 bg-blue-950/40 text-blue-300 hover:bg-blue-600 hover:text-white text-left cursor-pointer font-medium"
            >
              <span>Export Windows Desktop (.EXE)...</span>
              <span className="text-[10px] text-blue-300">C# WPF</span>
            </button>
            <div className="h-px bg-slate-800 my-1"></div>
            <button
              onClick={() => { closeMenu(); }}
              className="w-full flex items-center justify-between px-3.5 py-1.5 hover:bg-blue-600 hover:text-white text-left cursor-pointer"
            >
              <span>Quit Nova Player</span>
              <span className="text-[10px] text-slate-400">Ctrl+Q</span>
            </button>
          </div>
        )}
      </div>

      {/* 2. Playback Menu */}
      <div className="relative">
        <button
          onClick={() => toggleMenu('playback')}
          onMouseEnter={() => handleMouseEnter('playback')}
          className={`px-2.5 py-1 rounded transition-colors text-slate-300 hover:text-white cursor-pointer ${
            activeMenu === 'playback' ? 'bg-[#1e293b] text-white' : 'hover:bg-slate-800/60'
          }`}
        >
          Playback
        </button>
        {activeMenu === 'playback' && (
          <div className="absolute left-0 top-full mt-1 w-56 bg-[#0d1424] border border-[#1e293b] rounded-md shadow-2xl py-1 text-slate-200 text-xs z-50">
            <button
              onClick={() => { onPlayPause(); closeMenu(); }}
              className="w-full flex items-center justify-between px-3.5 py-1.5 hover:bg-blue-600 hover:text-white text-left cursor-pointer"
            >
              <span>Play / Pause</span>
              <span className="text-[10px] text-slate-400">Space</span>
            </button>
            <button
              onClick={() => { onStop(); closeMenu(); }}
              className="w-full flex items-center justify-between px-3.5 py-1.5 hover:bg-blue-600 hover:text-white text-left cursor-pointer"
            >
              <span>Stop</span>
              <span className="text-[10px] text-slate-400">S</span>
            </button>
            <div className="h-px bg-slate-800 my-1"></div>
            <button
              onClick={() => { onSeekRelative(5); closeMenu(); }}
              className="w-full flex items-center justify-between px-3.5 py-1.5 hover:bg-blue-600 hover:text-white text-left cursor-pointer"
            >
              <span>Jump Forward 5s</span>
              <span className="text-[10px] text-slate-400">Right</span>
            </button>
            <button
              onClick={() => { onSeekRelative(-5); closeMenu(); }}
              className="w-full flex items-center justify-between px-3.5 py-1.5 hover:bg-blue-600 hover:text-white text-left cursor-pointer"
            >
              <span>Jump Backward 5s</span>
              <span className="text-[10px] text-slate-400">Left</span>
            </button>
            <button
              onClick={() => { onStepFrame(); closeMenu(); }}
              className="w-full flex items-center justify-between px-3.5 py-1.5 hover:bg-blue-600 hover:text-white text-left cursor-pointer"
            >
              <span>Step Next Frame</span>
              <span className="text-[10px] text-slate-400">E</span>
            </button>
            <div className="h-px bg-slate-800 my-1"></div>
            <div className="px-3.5 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Speed</div>
            {[0.5, 0.75, 1.0, 1.25, 1.5, 2.0].map((rate) => (
              <button
                key={rate}
                onClick={() => { onSetSpeed(rate); closeMenu(); }}
                className={`w-full flex items-center justify-between px-5 py-1 text-left cursor-pointer ${
                  currentSpeed === rate ? 'text-blue-400 font-semibold' : 'hover:bg-blue-600 hover:text-white'
                }`}
              >
                <span>{rate === 1.0 ? 'Normal (1.0x)' : `${rate}x`}</span>
                {currentSpeed === rate && <span>✓</span>}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 3. Audio Menu */}
      <div className="relative">
        <button
          onClick={() => toggleMenu('audio')}
          onMouseEnter={() => handleMouseEnter('audio')}
          className={`px-2.5 py-1 rounded transition-colors text-slate-300 hover:text-white cursor-pointer ${
            activeMenu === 'audio' ? 'bg-[#1e293b] text-white' : 'hover:bg-slate-800/60'
          }`}
        >
          Audio
        </button>
        {activeMenu === 'audio' && (
          <div className="absolute left-0 top-full mt-1 w-60 bg-[#0d1424] border border-[#1e293b] rounded-md shadow-2xl py-1 text-slate-200 text-xs z-50">
            <button
              onClick={() => { onOpenEqualizer(); closeMenu(); }}
              className="w-full flex items-center justify-between px-3.5 py-1.5 hover:bg-blue-600 hover:text-white text-left cursor-pointer"
            >
              <span>10-Band Graphic Equalizer...</span>
              <span className="text-[10px] text-slate-400">Ctrl+E</span>
            </button>
            <button
              onClick={() => { onMuteToggle(); closeMenu(); }}
              className="w-full flex items-center justify-between px-3.5 py-1.5 hover:bg-blue-600 hover:text-white text-left cursor-pointer"
            >
              <span>Mute / Unmute</span>
              <span className="text-[10px] text-slate-400">M</span>
            </button>
            <div className="h-px bg-slate-800 my-1"></div>
            <div className="px-3.5 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Audio Tracks</div>
            <div className="px-5 py-1 text-slate-300 flex items-center justify-between">
              <span>Track 1 [Default - Stereo 48kHz]</span>
              <span className="text-blue-400">✓</span>
            </div>
            <div className="px-5 py-1 text-slate-400 flex items-center justify-between">
              <span>Track 2 [Binaural / 5.1 Surround]</span>
            </div>
          </div>
        )}
      </div>

      {/* 4. Video Menu */}
      <div className="relative">
        <button
          onClick={() => toggleMenu('video')}
          onMouseEnter={() => handleMouseEnter('video')}
          className={`px-2.5 py-1 rounded transition-colors text-slate-300 hover:text-white cursor-pointer ${
            activeMenu === 'video' ? 'bg-[#1e293b] text-white' : 'hover:bg-slate-800/60'
          }`}
        >
          Video
        </button>
        {activeMenu === 'video' && (
          <div className="absolute left-0 top-full mt-1 w-60 bg-[#0d1424] border border-[#1e293b] rounded-md shadow-2xl py-1 text-slate-200 text-xs z-50">
            <button
              onClick={() => { onToggleFullscreen(); closeMenu(); }}
              className="w-full flex items-center justify-between px-3.5 py-1.5 hover:bg-blue-600 hover:text-white text-left cursor-pointer"
            >
              <span>Fullscreen</span>
              <span className="text-[10px] text-slate-400">F11 / F</span>
            </button>
            <button
              onClick={() => { onTakeSnapshot(); closeMenu(); }}
              className="w-full flex items-center justify-between px-3.5 py-1.5 hover:bg-blue-600 hover:text-white text-left cursor-pointer"
            >
              <span>Take Snapshot Frame</span>
              <span className="text-[10px] text-slate-400">Shift+S</span>
            </button>
            <div className="h-px bg-slate-800 my-1"></div>
            <button
              onClick={() => { onOpenEqualizer(); closeMenu(); }}
              className="w-full flex items-center justify-between px-3.5 py-1.5 hover:bg-blue-600 hover:text-white text-left cursor-pointer"
            >
              <span>Video Adjustments &amp; Filters...</span>
              <span className="text-[10px] text-slate-400">Ctrl+E</span>
            </button>
          </div>
        )}
      </div>

      {/* 5. Subtitles Menu */}
      <div className="relative">
        <button
          onClick={() => toggleMenu('subtitles')}
          onMouseEnter={() => handleMouseEnter('subtitles')}
          className={`px-2.5 py-1 rounded transition-colors text-slate-300 hover:text-white cursor-pointer ${
            activeMenu === 'subtitles' ? 'bg-[#1e293b] text-white' : 'hover:bg-slate-800/60'
          }`}
        >
          Subtitles
        </button>
        {activeMenu === 'subtitles' && (
          <div className="absolute left-0 top-full mt-1 w-56 bg-[#0d1424] border border-[#1e293b] rounded-md shadow-2xl py-1 text-slate-200 text-xs z-50">
            <button
              onClick={() => { onOpenFile(); closeMenu(); }}
              className="w-full flex items-center justify-between px-3.5 py-1.5 hover:bg-blue-600 hover:text-white text-left cursor-pointer"
            >
              <span>Add Subtitle File (.srt, .vtt)...</span>
            </button>
            <div className="h-px bg-slate-800 my-1"></div>
            <div className="px-3.5 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Sub Track</div>
            <div className="px-5 py-1 text-blue-400 font-semibold flex items-center justify-between">
              <span>English [CC]</span>
              <span>✓</span>
            </div>
            <div className="px-5 py-1 text-slate-400 flex items-center justify-between">
              <span>Spanish (Español)</span>
            </div>
            <div className="px-5 py-1 text-slate-400 flex items-center justify-between">
              <span>Disable Subtitles</span>
            </div>
          </div>
        )}
      </div>

      {/* 6. Tools Menu */}
      <div className="relative">
        <button
          onClick={() => toggleMenu('tools')}
          onMouseEnter={() => handleMouseEnter('tools')}
          className={`px-2.5 py-1 rounded transition-colors text-slate-300 hover:text-white cursor-pointer ${
            activeMenu === 'tools' ? 'bg-[#1e293b] text-white' : 'hover:bg-slate-800/60'
          }`}
        >
          Tools
        </button>
        {activeMenu === 'tools' && (
          <div className="absolute left-0 top-full mt-1 w-64 bg-[#0d1424] border border-[#1e293b] rounded-md shadow-2xl py-1 text-slate-200 text-xs z-50">
            <button
              onClick={() => { onOpenEqualizer(); closeMenu(); }}
              className="w-full flex items-center justify-between px-3.5 py-1.5 hover:bg-blue-600 hover:text-white text-left cursor-pointer"
            >
              <span>Effects &amp; Filters</span>
              <span className="text-[10px] text-slate-400">Ctrl+E</span>
            </button>
            <button
              onClick={() => { onOpenMediaInfo(); closeMenu(); }}
              className="w-full flex items-center justify-between px-3.5 py-1.5 hover:bg-blue-600 hover:text-white text-left cursor-pointer"
            >
              <span>Media Information / Codec</span>
              <span className="text-[10px] text-slate-400">Ctrl+I</span>
            </button>
            <div className="h-px bg-slate-800 my-1"></div>
            <div className="px-3.5 py-1.5 text-slate-300 flex items-center justify-between">
              <span>Hardware Acceleration</span>
              <span className="text-[10px] text-emerald-400 font-mono">D3D11 / Active</span>
            </div>
            <div className="h-px bg-slate-800 my-1"></div>
            <button
              onClick={() => { onOpenWindowsPackage(); closeMenu(); }}
              className="w-full flex items-center justify-between px-3.5 py-1.5 hover:bg-blue-600 hover:text-white text-left cursor-pointer"
            >
              <span>Windows 11 Setup Builder...</span>
            </button>
          </div>
        )}
      </div>

      {/* 7. View Menu */}
      <div className="relative">
        <button
          onClick={() => toggleMenu('view')}
          onMouseEnter={() => handleMouseEnter('view')}
          className={`px-2.5 py-1 rounded transition-colors text-slate-300 hover:text-white cursor-pointer ${
            activeMenu === 'view' ? 'bg-[#1e293b] text-white' : 'hover:bg-slate-800/60'
          }`}
        >
          View
        </button>
        {activeMenu === 'view' && (
          <div className="absolute left-0 top-full mt-1 w-56 bg-[#0d1424] border border-[#1e293b] rounded-md shadow-2xl py-1 text-slate-200 text-xs z-50">
            <button
              onClick={() => { onOpenPlaylist(); closeMenu(); }}
              className="w-full flex items-center justify-between px-3.5 py-1.5 hover:bg-blue-600 hover:text-white text-left cursor-pointer"
            >
              <span>Playlist Dock</span>
              <span className="text-[10px] text-slate-400">Ctrl+L</span>
            </button>
            <button
              onClick={() => { onToggleFullscreen(); closeMenu(); }}
              className="w-full flex items-center justify-between px-3.5 py-1.5 hover:bg-blue-600 hover:text-white text-left cursor-pointer"
            >
              <span>Fullscreen Mode</span>
              <span className="text-[10px] text-slate-400">F11</span>
            </button>
            <div className="h-px bg-slate-800 my-1"></div>
            <button
              onClick={() => { onOpenWindowsPackage(); closeMenu(); }}
              className="w-full flex items-center justify-between px-3.5 py-1.5 hover:bg-blue-600 hover:text-white text-left cursor-pointer"
            >
              <span>C# WPF Visual Studio Project</span>
            </button>
          </div>
        )}
      </div>

      {/* 8. Help Menu */}
      <div className="relative">
        <button
          onClick={() => toggleMenu('help')}
          onMouseEnter={() => handleMouseEnter('help')}
          className={`px-2.5 py-1 rounded transition-colors text-slate-300 hover:text-white cursor-pointer ${
            activeMenu === 'help' ? 'bg-[#1e293b] text-white' : 'hover:bg-slate-800/60'
          }`}
        >
          Help
        </button>
        {activeMenu === 'help' && (
          <div className="absolute left-0 top-full mt-1 w-60 bg-[#0d1424] border border-[#1e293b] rounded-md shadow-2xl py-1 text-slate-200 text-xs z-50">
            <button
              onClick={() => { onOpenWindowsInstall(); closeMenu(); }}
              className="w-full flex items-center justify-between px-3.5 py-1.5 hover:bg-blue-600 hover:text-white text-left cursor-pointer font-medium text-blue-300"
            >
              <span>Install to Windows (PWA)...</span>
            </button>
            <button
              onClick={() => { onOpenWindowsPackage(); closeMenu(); }}
              className="w-full flex items-center justify-between px-3.5 py-1.5 hover:bg-blue-600 hover:text-white text-left cursor-pointer"
            >
              <span>Export Windows Desktop (.EXE)...</span>
            </button>
            <div className="h-px bg-slate-800 my-1"></div>
            <button
              onClick={() => { onOpenMediaInfo(); closeMenu(); }}
              className="w-full flex items-center justify-between px-3.5 py-1.5 hover:bg-blue-600 hover:text-white text-left cursor-pointer"
            >
              <span>About Nova Media Player</span>
              <span className="text-[10px] text-slate-400">Ctrl+I</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
