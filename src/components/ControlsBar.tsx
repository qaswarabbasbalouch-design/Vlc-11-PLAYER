import React, { useState, useRef } from 'react';
import {
  SkipBack,
  SkipForward,
  Square,
  Repeat,
  Shuffle,
  Volume2,
  Volume1,
  VolumeX,
  Settings,
  Maximize2,
  Minimize2,
  PictureInPicture,
  Play,
  Pause,
  ChevronDown,
} from 'lucide-react';
import { formatTime, formatTimeRemaining } from '../utils/formatTime';
import { LoopMode } from '../types/media';

interface ControlsBarProps {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number; // 0 to 200
  isMuted: boolean;
  loopMode: LoopMode;
  isShuffle: boolean;
  isFullscreen: boolean;
  isPiP: boolean;
  onPlayPause: () => void;
  onStop: () => void;
  onPrev: () => void;
  onNext: () => void;
  onSeek: (time: number) => void;
  onVolumeChange: (vol: number) => void;
  onToggleMute: () => void;
  onToggleLoop: () => void;
  onToggleShuffle: () => void;
  onToggleFullscreen: () => void;
  onTogglePiP: () => void;
  onOpenAudioMenu: () => void;
  onOpenSubtitlesMenu: () => void;
  onOpenSettings: () => void;
}

export const ControlsBar: React.FC<ControlsBarProps> = ({
  isPlaying,
  currentTime,
  duration,
  volume,
  isMuted,
  loopMode,
  isShuffle,
  isFullscreen,
  isPiP,
  onPlayPause,
  onStop,
  onPrev,
  onNext,
  onSeek,
  onVolumeChange,
  onToggleMute,
  onToggleLoop,
  onToggleShuffle,
  onToggleFullscreen,
  onTogglePiP,
  onOpenAudioMenu,
  onOpenSubtitlesMenu,
  onOpenSettings,
}) => {
  const [showRemaining, setShowRemaining] = useState(false);
  const [hoverSeekTime, setHoverSeekTime] = useState<number | null>(null);
  const [hoverSeekPos, setHoverSeekPos] = useState<number>(0);
  const seekTrackRef = useRef<HTMLDivElement>(null);

  const progressPercent = duration > 0 ? Math.min(100, Math.max(0, (currentTime / duration) * 100)) : 0;

  const handleSeekMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!seekTrackRef.current || duration <= 0) return;
    const rect = seekTrackRef.current.getBoundingClientRect();
    const clickX = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
    const newRatio = clickX / rect.width;
    onSeek(newRatio * duration);
  };

  const handleSeekMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!seekTrackRef.current || duration <= 0) return;
    const rect = seekTrackRef.current.getBoundingClientRect();
    const mouseX = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
    setHoverSeekPos(mouseX);
    setHoverSeekTime((mouseX / rect.width) * duration);
  };

  const handleSeekMouseLeave = () => {
    setHoverSeekTime(null);
  };

  const effectiveVolume = isMuted ? 0 : volume;

  const getVolumeIcon = () => {
    if (isMuted || volume === 0) return <VolumeX className="w-4 h-4 text-slate-400" />;
    if (volume < 50) return <Volume1 className="w-4 h-4 text-slate-300" />;
    return <Volume2 className="w-4 h-4 text-slate-300" />;
  };

  return (
    <div className="bg-[#0b101b] border-t border-[#162033] px-3.5 pt-1.5 pb-2.5 select-none transition-opacity duration-300">
      {/* 1. Seek Bar Row: [00:02:34]  ====O====== [00:12:48] */}
      <div className="flex items-center gap-3 h-6 mb-1">
        {/* Current Time Display */}
        <span className="text-[11px] font-mono tracking-tight text-slate-400 w-16 text-left">
          {formatTime(currentTime)}
        </span>

        {/* Seek Track */}
        <div
          ref={seekTrackRef}
          onClick={handleSeekMouseDown}
          onMouseMove={handleSeekMouseMove}
          onMouseLeave={handleSeekMouseLeave}
          className="relative flex-1 h-5 flex items-center cursor-pointer group"
        >
          {/* Background Track */}
          <div className="w-full h-1 bg-[#1e293b] rounded-full overflow-hidden group-hover:h-1.5 transition-all">
            {/* Played Blue Progress Bar */}
            <div
              className="h-full bg-blue-500 rounded-full relative"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Draggable Glowing Blue Thumb */}
          <div
            className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-blue-500 border-2 border-slate-900 rounded-full shadow-md shadow-blue-500/50 pointer-events-none transition-transform group-hover:scale-110"
            style={{ left: `calc(${progressPercent}% - 7px)` }}
          />

          {/* Hover Timestamp Preview Tooltip */}
          {hoverSeekTime !== null && (
            <div
              className="absolute -top-7 -translate-x-1/2 bg-[#020617] text-white text-[10px] font-mono px-1.5 py-0.5 rounded border border-slate-700 pointer-events-none shadow-lg z-30"
              style={{ left: `${hoverSeekPos}px` }}
            >
              {formatTime(hoverSeekTime)}
            </div>
          )}
        </div>

        {/* Duration / Remaining Toggle */}
        <button
          onClick={() => setShowRemaining(!showRemaining)}
          className="text-[11px] font-mono tracking-tight text-slate-400 hover:text-slate-200 w-16 text-right cursor-pointer"
          title="Click to toggle remaining time"
        >
          {showRemaining ? formatTimeRemaining(currentTime, duration) : formatTime(duration)}
        </button>
      </div>

      {/* 2. Control Buttons Row */}
      <div className="flex items-center justify-between mt-0.5">
        {/* Left Side: Playback Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Previous Track */}
          <button
            onClick={onPrev}
            className="w-8 h-8 flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-800/60 rounded-md transition-colors cursor-pointer"
            title="Previous (P)"
          >
            <SkipBack className="w-4 h-4 fill-current" />
          </button>

          {/* Main Blue Play / Pause Circle (Matching user screenshot) */}
          <button
            onClick={onPlayPause}
            className="w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white flex items-center justify-center shadow-lg shadow-blue-600/30 transition-transform active:scale-95 cursor-pointer mx-1"
            title={isPlaying ? "Pause (Space)" : "Play (Space)"}
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 fill-current" />
            ) : (
              <Play className="w-5 h-5 fill-current ml-0.5" />
            )}
          </button>

          {/* Next Track */}
          <button
            onClick={onNext}
            className="w-8 h-8 flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-800/60 rounded-md transition-colors cursor-pointer"
            title="Next (N)"
          >
            <SkipForward className="w-4 h-4 fill-current" />
          </button>

          {/* Stop */}
          <button
            onClick={onStop}
            className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 rounded-md transition-colors cursor-pointer ml-1"
            title="Stop (S)"
          >
            <Square className="w-3.5 h-3.5 fill-current" />
          </button>

          {/* Loop Mode */}
          <button
            onClick={onToggleLoop}
            className={`w-8 h-8 flex items-center justify-center rounded-md transition-colors cursor-pointer relative ${
              loopMode !== 'off' ? 'text-blue-400 bg-blue-950/40' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
            title={`Loop Mode: ${loopMode.toUpperCase()}`}
          >
            <Repeat className="w-4 h-4" />
            {loopMode === 'one' && (
              <span className="absolute text-[8px] font-bold bottom-1 right-1 leading-none text-blue-300">1</span>
            )}
          </button>

          {/* Shuffle */}
          <button
            onClick={onToggleShuffle}
            className={`w-8 h-8 flex items-center justify-center rounded-md transition-colors cursor-pointer ${
              isShuffle ? 'text-blue-400 bg-blue-950/40' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
            title="Shuffle Playlist"
          >
            <Shuffle className="w-4 h-4" />
          </button>
        </div>

        {/* Right Side: Volume, Audio Dropdown, Subtitles Dropdown, Settings, PiP, Fullscreen */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* Volume Icon + Slider + Percentage */}
          <div className="flex items-center gap-2 mr-2">
            <button
              onClick={onToggleMute}
              className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 rounded transition-colors cursor-pointer"
              title={isMuted ? "Unmute (M)" : "Mute (M)"}
            >
              {getVolumeIcon()}
            </button>

            {/* Volume Track */}
            <div className="w-16 sm:w-20 relative flex items-center h-4">
              <input
                type="range"
                min="0"
                max="150"
                value={effectiveVolume}
                onChange={(e) => onVolumeChange(Number(e.target.value))}
                className="w-full h-1 bg-[#1e293b] accent-blue-500 rounded-lg cursor-pointer"
                title={`Volume: ${effectiveVolume}% (Booster up to 150%)`}
              />
            </div>

            <span className="text-[11px] font-mono text-slate-400 w-9 text-right">
              {isMuted ? '0%' : `${volume}%`}
            </span>
          </div>

          {/* Audio Dropdown Button */}
          <button
            onClick={onOpenAudioMenu}
            className="hidden sm:flex items-center gap-1.5 bg-[#121927] hover:bg-[#1a253a] border border-[#233148] text-slate-200 hover:text-white text-xs px-2.5 py-1 rounded-md transition-colors cursor-pointer font-medium"
          >
            <span>Audio</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {/* Subtitles Dropdown Button */}
          <button
            onClick={onOpenSubtitlesMenu}
            className="hidden sm:flex items-center gap-1.5 bg-[#121927] hover:bg-[#1a253a] border border-[#233148] text-slate-200 hover:text-white text-xs px-2.5 py-1 rounded-md transition-colors cursor-pointer font-medium"
          >
            <span>Subtitles</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {/* Settings Gear */}
          <button
            onClick={onOpenSettings}
            className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 rounded-md transition-colors cursor-pointer"
            title="Adjustments, Filters & Equalizer (Ctrl+E)"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* Picture in Picture */}
          <button
            onClick={onTogglePiP}
            className={`w-8 h-8 flex items-center justify-center rounded-md transition-colors cursor-pointer ${
              isPiP ? 'text-blue-400 bg-blue-950/40' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
            title="Picture in Picture"
          >
            <PictureInPicture className="w-4 h-4" />
          </button>

          {/* Fullscreen */}
          <button
            onClick={onToggleFullscreen}
            className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 rounded-md transition-colors cursor-pointer"
            title="Toggle Fullscreen (F / F11)"
          >
            {isFullscreen ? (
              <Minimize2 className="w-4 h-4" />
            ) : (
              <Maximize2 className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
