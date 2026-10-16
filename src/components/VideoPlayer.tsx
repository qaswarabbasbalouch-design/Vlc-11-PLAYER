import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Play } from 'lucide-react';
import { PlaylistItem, VideoFilterSettings, AspectRatioMode } from '../types/media';

interface VideoPlayerProps {
  currentTrack: PlaylistItem | null;
  isPlaying: boolean;
  volume: number;
  isMuted: boolean;
  playbackRate: number;
  videoFilters: VideoFilterSettings;
  aspectRatio: AspectRatioMode;
  audioDelay: number;
  subtitleDelay: number;
  selectedSubtitleId: string | null;
  onTimeUpdate: (current: number, duration: number) => void;
  onEnded: () => void;
  onTogglePlay: () => void;
  onToggleFullscreen: () => void;
  onOpenFileDrop: (files: FileList) => void;
  onTakeSnapshot: () => void;
  osdMessage: string | null;
  videoRef: React.RefObject<HTMLVideoElement | null>;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  currentTrack,
  isPlaying,
  volume,
  isMuted,
  playbackRate,
  videoFilters,
  aspectRatio,
  audioDelay,
  subtitleDelay,
  selectedSubtitleId,
  onTimeUpdate,
  onEnded,
  onTogglePlay,
  onToggleFullscreen,
  onOpenFileDrop,
  onTakeSnapshot,
  osdMessage,
  videoRef,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [contextMenuPos, setContextMenuPos] = useState<{ x: number; y: number } | null>(null);
  const [currentSubtitleText, setCurrentSubtitleText] = useState<string>('');
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync volume & playback rate to video element
  useEffect(() => {
    if (videoRef.current) {
      // Direct volume (0.0 to 1.0 for standard, audio booster handles >100%)
      videoRef.current.volume = Math.min(1.0, Math.max(0, volume / 100));
      videoRef.current.muted = isMuted;
      videoRef.current.playbackRate = playbackRate;
    }
  }, [volume, isMuted, playbackRate, videoRef]);

  // Sync play/pause state
  useEffect(() => {
    if (!videoRef.current) return;
    if (isPlaying) {
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Auto-play was prevented by browser, wait for user click
        });
      }
    } else {
      videoRef.current.pause();
    }
  }, [isPlaying, currentTrack, videoRef]);

  // Simulated / loaded subtitle cues for demo videos
  useEffect(() => {
    if (!selectedSubtitleId || selectedSubtitleId === 'none') {
      setCurrentSubtitleText('');
      return;
    }

    const interval = setInterval(() => {
      if (!videoRef.current) return;
      const t = videoRef.current.currentTime + (subtitleDelay / 1000);

      // Demo subtitle generator based on playback timing
      if (currentTrack?.id === 'sample-city-skyline') {
        if (t >= 2 && t < 7) {
          setCurrentSubtitleText(selectedSubtitleId === 'sub-es' ? 'El horizonte de Manhattan al atardecer, grabado en 4K UHD.' : 'The Manhattan skyline at sunset, captured in breathtaking 4K UHD.');
        } else if (t >= 8 && t < 15) {
          setCurrentSubtitleText(selectedSubtitleId === 'sub-es' ? 'Decodificación acelerada por hardware D3D11VA activa a 60 fotogramas por segundo.' : 'Hardware-accelerated Direct3D11VA decoding active at 60 frames per second.');
        } else if (t >= 16 && t < 22) {
          setCurrentSubtitleText(selectedSubtitleId === 'sub-es' ? 'Soporte completo para contenedores MKV, MP4, AVI y códecs HEVC/AV1.' : 'Full container support for MKV, MP4, AVI and modern HEVC/AV1 codecs.');
        } else {
          setCurrentSubtitleText('');
        }
      } else if (currentTrack?.id === 'sample-tears-of-steel') {
        if (t >= 1 && t < 6) {
          setCurrentSubtitleText('Tears of Steel — Open VFX Showcase in high dynamic range.');
        } else if (t >= 7 && t < 12) {
          setCurrentSubtitleText('Cinema 4K (3840x1714) 10-bit HEVC stream processing.');
        } else {
          setCurrentSubtitleText('');
        }
      } else {
        setCurrentSubtitleText('');
      }
    }, 200);

    return () => clearInterval(interval);
  }, [selectedSubtitleId, subtitleDelay, currentTrack, videoRef]);

  // Drag and drop handlers
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onOpenFileDrop(e.dataTransfer.files);
    }
  }, [onOpenFileDrop]);

  // Context Menu
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenuPos({ x: e.clientX, y: e.clientY });
  };

  useEffect(() => {
    const handleCloseMenu = () => setContextMenuPos(null);
    window.addEventListener('click', handleCloseMenu);
    return () => window.removeEventListener('click', handleCloseMenu);
  }, []);

  // Compute CSS filter string
  const cssFilters = [
    `brightness(${videoFilters.brightness}%)`,
    `contrast(${videoFilters.contrast}%)`,
    `saturate(${videoFilters.saturation}%)`,
    `hue-rotate(${videoFilters.hue}deg)`,
    videoFilters.invert ? 'invert(100%)' : '',
    videoFilters.grayscale ? 'grayscale(100%)' : '',
    videoFilters.sepia ? 'sepia(80%)' : '',
    videoFilters.blur > 0 ? `blur(${videoFilters.blur}px)` : '',
  ].filter(Boolean).join(' ');

  // Aspect ratio class
  const getAspectRatioStyle = (): React.CSSProperties => {
    switch (aspectRatio) {
      case '16:9':
        return { aspectRatio: '16 / 9', objectFit: 'cover' };
      case '4:3':
        return { aspectRatio: '4 / 3', objectFit: 'cover' };
      case '21:9':
        return { aspectRatio: '21 / 9', objectFit: 'cover' };
      case 'fill':
        return { width: '100%', height: '100%', objectFit: 'fill' };
      case 'original':
      case 'auto':
      default:
        return { width: '100%', height: '100%', objectFit: 'contain' };
    }
  };

  return (
    <div
      ref={containerRef}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onContextMenu={handleContextMenu}
      className="relative flex-1 bg-black flex items-center justify-center overflow-hidden select-none group"
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        src={currentTrack?.src}
        onTimeUpdate={() => {
          if (videoRef.current) {
            onTimeUpdate(videoRef.current.currentTime, videoRef.current.duration || currentTrack?.duration || 0);
          }
        }}
        onEnded={onEnded}
        onClick={onTogglePlay}
        onDoubleClick={onToggleFullscreen}
        style={{
          ...getAspectRatioStyle(),
          filter: cssFilters || undefined,
        }}
        className="cursor-pointer transition-all duration-150"
        playsInline
      />

      {/* Central Amber Play Button Overlay (Matching the user screenshot!) */}
      {!isPlaying && (
        <button
          onClick={onTogglePlay}
          className="absolute w-20 h-20 rounded-full bg-amber-500 hover:bg-amber-400 active:scale-95 text-white flex items-center justify-center shadow-2xl shadow-amber-500/50 transition-all z-20 cursor-pointer"
          title="Play (Space)"
        >
          <Play className="w-10 h-10 fill-current ml-1" />
        </button>
      )}

      {/* Subtitles Overlay */}
      {currentSubtitleText && (
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 max-w-2xl px-4 py-1.5 bg-black/75 rounded text-white text-base sm:text-lg font-medium text-center shadow-lg pointer-events-none z-20 transition-opacity">
          {currentSubtitleText}
        </div>
      )}

      {/* OSD (On-Screen Display) Notification in Top Right */}
      {osdMessage && (
        <div className="absolute top-4 right-5 bg-black/80 backdrop-blur-md border border-slate-700/60 text-slate-100 text-xs font-semibold px-3.5 py-1.5 rounded-md shadow-xl pointer-events-none z-30 transition-all">
          {osdMessage}
        </div>
      )}

      {/* Drag & Drop Visual Indicator */}
      {isDragOver && (
        <div className="absolute inset-0 bg-blue-950/80 border-2 border-dashed border-blue-400 flex flex-col items-center justify-center z-30">
          <div className="w-16 h-16 rounded-full bg-blue-600/30 flex items-center justify-center mb-3">
            <Play className="w-8 h-8 text-blue-300" />
          </div>
          <p className="text-lg font-semibold text-white">Drop video or audio file to play</p>
          <p className="text-xs text-blue-300 mt-1">Supports MP4, MKV, AVI, MOV, WMV, WebM, FLAC, MP3</p>
        </div>
      )}

      {/* Right-Click VLC Context Menu */}
      {contextMenuPos && (
        <div
          style={{ top: contextMenuPos.y, left: contextMenuPos.x }}
          className="fixed bg-[#0c1322] border border-[#202f4a] rounded-lg shadow-2xl py-1 w-56 text-xs text-slate-200 z-50 divide-y divide-slate-800"
        >
          <div className="py-1">
            <button
              onClick={onTogglePlay}
              className="w-full text-left px-3.5 py-1.5 hover:bg-blue-600 hover:text-white cursor-pointer"
            >
              {isPlaying ? 'Pause' : 'Play'}
            </button>
            <button
              onClick={onToggleFullscreen}
              className="w-full text-left px-3.5 py-1.5 hover:bg-blue-600 hover:text-white cursor-pointer"
            >
              Toggle Fullscreen (F)
            </button>
            <button
              onClick={onTakeSnapshot}
              className="w-full text-left px-3.5 py-1.5 hover:bg-blue-600 hover:text-white cursor-pointer"
            >
              Take Snapshot Frame (Shift+S)
            </button>
          </div>
          <div className="py-1">
            <div className="px-3.5 py-1 text-[10px] text-slate-400 uppercase font-semibold">Codec &amp; Hardware</div>
            <div className="px-3.5 py-1 text-slate-300 flex items-center justify-between">
              <span>Decoder</span>
              <span className="text-emerald-400 font-mono">D3D11VA (HW)</span>
            </div>
            <div className="px-3.5 py-1 text-slate-300 flex items-center justify-between">
              <span>Resolution</span>
              <span className="font-mono">{currentTrack?.resolution || '4K UHD'}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
