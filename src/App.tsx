import React, { useState, useRef, useEffect, useCallback } from 'react';
import { MenuBar } from './components/MenuBar';
import { VideoPlayer } from './components/VideoPlayer';
import { ControlsBar } from './components/ControlsBar';
import { EffectsModal } from './components/EffectsModal';
import { MediaInfoModal } from './components/MediaInfoModal';
import { PlaylistModal } from './components/PlaylistModal';
import { WindowsPackageModal } from './components/WindowsPackageModal';
import { WindowsInstallModal } from './components/WindowsInstallModal';
import { usePWAInstall } from './hooks/usePWAInstall';
import { SAMPLE_PLAYLIST } from './data/sampleMedia';
import { PlaylistItem, VideoFilterSettings, EqualizerBand, AspectRatioMode, LoopMode } from './types/media';
import { EQ_FREQUENCIES, EQ_LABELS, globalAudioEngine } from './utils/audioEqualizer';

export default function App() {
  // Playlist & Current Track
  const [playlist, setPlaylist] = useState<PlaylistItem[]>(SAMPLE_PLAYLIST);
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(0);
  const currentTrack = playlist[currentTrackIndex] || null;

  // Playback State
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(154); // matches 00:02:34 in screenshot
  const [duration, setDuration] = useState<number>(768);       // matches 00:12:48 in screenshot
  const [volume, setVolume] = useState<number>(100);          // matches 100% in screenshot
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [playbackRate, setPlaybackRate] = useState<number>(1.0);
  const [loopMode, setLoopMode] = useState<LoopMode>('off');
  const [isShuffle, setIsShuffle] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isPiP, setIsPiP] = useState<boolean>(false);
  const [aspectRatio, setAspectRatio] = useState<AspectRatioMode>('auto');

  // Delays and Subtitles
  const [audioDelay, setAudioDelay] = useState<number>(0);
  const [subtitleDelay, setSubtitleDelay] = useState<number>(0);
  const [selectedSubtitleId, setSelectedSubtitleId] = useState<string | null>('sub-en');

  // Video Filters
  const [videoFilters, setVideoFilters] = useState<VideoFilterSettings>({
    brightness: 100,
    contrast: 100,
    saturation: 100,
    hue: 0,
    gamma: 1.0,
    invert: false,
    blur: 0,
    grayscale: false,
    sepia: false,
  });

  // Equalizer Bands & Preamp
  const [preampGain, setPreampGain] = useState<number>(0);
  const [equalizerBands, setEqualizerBands] = useState<EqualizerBand[]>(() =>
    EQ_FREQUENCIES.map((freq, idx) => ({
      frequency: freq,
      label: EQ_LABELS[idx],
      gain: 0,
    }))
  );

  // OSD Message
  const [osdMessage, setOsdMessage] = useState<string | null>(null);
  const osdTimerRef = useRef<number | null>(null);

  const showOsd = (msg: string) => {
    setOsdMessage(msg);
    if (osdTimerRef.current) clearTimeout(osdTimerRef.current);
    osdTimerRef.current = window.setTimeout(() => setOsdMessage(null), 2000);
  };

  // Modals
  const [isEffectsOpen, setIsEffectsOpen] = useState(false);
  const [isMediaInfoOpen, setIsMediaInfoOpen] = useState(false);
  const [isPlaylistOpen, setIsPlaylistOpen] = useState(false);
  const [isWindowsPackageOpen, setIsWindowsPackageOpen] = useState(false);
  const [isWindowsInstallOpen, setIsWindowsInstallOpen] = useState(false);

  // Web to Windows PWA installation hook
  const { isInstalled, isInstallable, install } = usePWAInstall();

  // Refs
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const appContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize Web Audio API on first user interaction
  const initAudio = () => {
    if (videoRef.current) {
      globalAudioEngine.init(videoRef.current);
      globalAudioEngine.resume();
    }
  };

  // Play / Pause Toggle
  const togglePlay = () => {
    initAudio();
    setIsPlaying((prev) => !prev);
  };

  const handleStop = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    setCurrentTime(0);
    showOsd('Stopped');
  };

  const handleSeek = (time: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
    setCurrentTime(time);
  };

  const handleSeekRelative = (seconds: number) => {
    if (!videoRef.current) return;
    const target = Math.max(0, Math.min(duration, videoRef.current.currentTime + seconds));
    handleSeek(target);
    showOsd(seconds > 0 ? `+${seconds}s` : `${seconds}s`);
  };

  const handleVolumeChange = (vol: number) => {
    setVolume(vol);
    if (isMuted && vol > 0) setIsMuted(false);
    initAudio();
    globalAudioEngine.setVolumeBoost(vol);
    showOsd(`Volume: ${vol}%`);
  };

  const handleToggleMute = () => {
    setIsMuted((prev) => {
      const next = !prev;
      showOsd(next ? 'Mute' : `Volume: ${volume}%`);
      return next;
    });
  };

  const handleToggleLoop = () => {
    setLoopMode((prev) => {
      const next = prev === 'off' ? 'all' : prev === 'all' ? 'one' : 'off';
      showOsd(`Repeat: ${next.toUpperCase()}`);
      return next;
    });
  };

  const handleToggleShuffle = () => {
    setIsShuffle((prev) => {
      const next = !prev;
      showOsd(`Shuffle: ${next ? 'ON' : 'OFF'}`);
      return next;
    });
  };

  const handlePrev = () => {
    if (playlist.length === 0) return;
    if (isShuffle) {
      const randIdx = Math.floor(Math.random() * playlist.length);
      setCurrentTrackIndex(randIdx);
    } else {
      setCurrentTrackIndex((prev) => (prev > 0 ? prev - 1 : playlist.length - 1));
    }
    setIsPlaying(true);
  };

  const handleNext = () => {
    if (playlist.length === 0) return;
    if (isShuffle) {
      const randIdx = Math.floor(Math.random() * playlist.length);
      setCurrentTrackIndex(randIdx);
    } else {
      setCurrentTrackIndex((prev) => (prev < playlist.length - 1 ? prev + 1 : 0));
    }
    setIsPlaying(true);
  };

  const handleEnded = () => {
    if (loopMode === 'one') {
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.play();
      }
    } else if (loopMode === 'all' || currentTrackIndex < playlist.length - 1) {
      handleNext();
    } else {
      setIsPlaying(false);
    }
  };

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      appContainerRef.current?.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const handleTogglePiP = async () => {
    if (!videoRef.current) return;
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
        setIsPiP(false);
      } else {
        await videoRef.current.requestPictureInPicture();
        setIsPiP(true);
      }
    } catch (e) {
      console.warn('PiP not supported or failed', e);
    }
  };

  const handleTakeSnapshot = () => {
    if (!videoRef.current) return;
    try {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth || 1920;
      canvas.height = videoRef.current.videoHeight || 1080;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = `NovaSnapshot_${Date.now()}.png`;
        link.click();
        showOsd('Snapshot Saved (PNG)');
      }
    } catch {
      showOsd('Snapshot (Demo protected)');
    }
  };

  const handleStepFrame = () => {
    if (!videoRef.current) return;
    videoRef.current.pause();
    setIsPlaying(false);
    videoRef.current.currentTime += 1 / 30; // 30fps step
    showOsd('Step 1 Frame (+0.033s)');
  };

  const handleSetSpeed = (rate: number) => {
    setPlaybackRate(rate);
    showOsd(`Speed: ${rate}x`);
  };

  // Add Local Files
  const handleAddFiles = useCallback((files: FileList) => {
    const newItems: PlaylistItem[] = Array.from(files).map((file) => {
      const url = URL.createObjectURL(file);
      const ext = file.name.split('.').pop() || 'mp4';
      return {
        id: `local-${Date.now()}-${file.name}`,
        title: file.name,
        artist: 'Local Computer File',
        duration: 0,
        src: url,
        type: file.type.startsWith('audio') ? 'audio' : 'video',
        format: ext.toUpperCase(),
        resolution: 'Local High-Def',
        fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        isLocal: true,
      };
    });

    setPlaylist((prev) => [...prev, ...newItems]);
    if (newItems.length > 0) {
      setCurrentTrackIndex(playlist.length); // switch to first newly added file
      setIsPlaying(true);
      showOsd(`Loaded ${newItems.length} file(s)`);
    }
  }, [playlist.length]);

  const handleAddStreamUrl = (title: string, url: string) => {
    const streamItem: PlaylistItem = {
      id: `stream-${Date.now()}`,
      title: title || 'Network Stream',
      artist: 'Online / HLS / RTSP Stream',
      duration: 3600,
      src: url,
      type: 'video',
      format: 'STREAM',
      resolution: 'Adaptive Bitrate',
    };
    setPlaylist((prev) => [...prev, streamItem]);
    setCurrentTrackIndex(playlist.length);
    setIsPlaying(true);
    showOsd(`Stream Loaded: ${title}`);
  };

  // Equalizer updates
  const handleUpdateBand = (index: number, gain: number) => {
    setEqualizerBands((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], gain };
      return next;
    });
    globalAudioEngine.setBandGain(index, gain);
  };

  const handleUpdatePreamp = (gain: number) => {
    setPreampGain(gain);
    globalAudioEngine.setPreampGain(gain);
  };

  // Keyboard Shortcuts Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if typing in an input
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement).tagName)) {
        return;
      }

      switch (e.key) {
        case ' ':
        case 'k':
        case 'K':
          e.preventDefault();
          togglePlay();
          break;
        case 'ArrowRight':
          e.preventDefault();
          handleSeekRelative(e.shiftKey ? 1 : e.ctrlKey ? 30 : 5);
          break;
        case 'ArrowLeft':
          e.preventDefault();
          handleSeekRelative(e.shiftKey ? -1 : e.ctrlKey ? -30 : -5);
          break;
        case 'ArrowUp':
          e.preventDefault();
          handleVolumeChange(Math.min(150, volume + 5));
          break;
        case 'ArrowDown':
          e.preventDefault();
          handleVolumeChange(Math.max(0, volume - 5));
          break;
        case 'm':
        case 'M':
          handleToggleMute();
          break;
        case 'f':
        case 'F':
        case 'F11':
          e.preventDefault();
          handleToggleFullscreen();
          break;
        case 's':
        case 'S':
          if (e.shiftKey) {
            e.preventDefault();
            handleTakeSnapshot();
          } else {
            handleStop();
          }
          break;
        case 'e':
        case 'E':
          handleStepFrame();
          break;
        case 'p':
        case 'P':
          if (e.ctrlKey) {
            e.preventDefault();
            setIsEffectsOpen(true);
          } else {
            handlePrev();
          }
          break;
        case 'n':
        case 'N':
          if (e.ctrlKey) {
            e.preventDefault();
            setIsPlaylistOpen(true);
          } else {
            handleNext();
          }
          break;
        case 'o':
        case 'O':
          if (e.ctrlKey) {
            e.preventDefault();
            fileInputRef.current?.click();
          }
          break;
        case 'i':
        case 'I':
          if (e.ctrlKey) {
            e.preventDefault();
            setIsMediaInfoOpen(true);
          }
          break;
        case 'l':
        case 'L':
          if (e.ctrlKey) {
            e.preventDefault();
            setIsPlaylistOpen(true);
          }
          break;
        case 'Escape':
          setIsEffectsOpen(false);
          setIsMediaInfoOpen(false);
          setIsPlaylistOpen(false);
          setIsWindowsPackageOpen(false);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  return (
    <div
      ref={appContainerRef}
      className="w-screen h-screen bg-[#070b13] flex flex-col font-sans select-none overflow-hidden text-slate-200"
    >
      {/* Hidden File Picker */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="video/*,audio/*"
        onChange={(e) => e.target.files && handleAddFiles(e.target.files)}
        className="hidden"
      />

      {/* VLC Menu Bar is now the top-most bar */}
      <MenuBar
        onOpenFile={() => fileInputRef.current?.click()}
        onOpenFolder={() => fileInputRef.current?.click()}
        onOpenStream={() => setIsPlaylistOpen(true)}
        onSavePlaylist={() => setIsPlaylistOpen(true)}
        onPlayPause={togglePlay}
        onStop={handleStop}
        onSeekRelative={handleSeekRelative}
        onSetSpeed={handleSetSpeed}
        onOpenEqualizer={() => setIsEffectsOpen(true)}
        onOpenMediaInfo={() => setIsMediaInfoOpen(true)}
        onOpenPlaylist={() => setIsPlaylistOpen(true)}
        onOpenWindowsPackage={() => setIsWindowsPackageOpen(true)}
        onOpenWindowsInstall={() => setIsWindowsInstallOpen(true)}
        onTakeSnapshot={handleTakeSnapshot}
        onToggleFullscreen={handleToggleFullscreen}
        onMuteToggle={handleToggleMute}
        onStepFrame={handleStepFrame}
        currentSpeed={playbackRate}
      />

      {/* 3. Main Video Canvas Viewport */}
      <VideoPlayer
        currentTrack={currentTrack}
        isPlaying={isPlaying}
        volume={volume}
        isMuted={isMuted}
        playbackRate={playbackRate}
        videoFilters={videoFilters}
        aspectRatio={aspectRatio}
        audioDelay={audioDelay}
        subtitleDelay={subtitleDelay}
        selectedSubtitleId={selectedSubtitleId}
        onTimeUpdate={(c, d) => {
          setCurrentTime(c);
          if (d > 0 && Math.abs(duration - d) > 1) {
            setDuration(d);
          }
        }}
        onEnded={handleEnded}
        onTogglePlay={togglePlay}
        onToggleFullscreen={handleToggleFullscreen}
        onOpenFileDrop={handleAddFiles}
        onTakeSnapshot={handleTakeSnapshot}
        osdMessage={osdMessage}
        videoRef={videoRef}
      />

      {/* 4. Playback Controls Bottom Dock (Pixel-matched to user screenshot) */}
      <ControlsBar
        isPlaying={isPlaying}
        currentTime={currentTime}
        duration={duration}
        volume={volume}
        isMuted={isMuted}
        loopMode={loopMode}
        isShuffle={isShuffle}
        isFullscreen={isFullscreen}
        isPiP={isPiP}
        onPlayPause={togglePlay}
        onStop={handleStop}
        onPrev={handlePrev}
        onNext={handleNext}
        onSeek={handleSeek}
        onVolumeChange={handleVolumeChange}
        onToggleMute={handleToggleMute}
        onToggleLoop={handleToggleLoop}
        onToggleShuffle={handleToggleShuffle}
        onToggleFullscreen={handleToggleFullscreen}
        onTogglePiP={handleTogglePiP}
        onOpenAudioMenu={() => setIsEffectsOpen(true)}
        onOpenSubtitlesMenu={() => {
          setSelectedSubtitleId(selectedSubtitleId ? null : 'sub-en');
          showOsd(selectedSubtitleId ? 'Subtitles Disabled' : 'English [CC] Enabled');
        }}
        onOpenSettings={() => setIsEffectsOpen(true)}
      />

      {/* Supporting Modals */}
      <EffectsModal
        isOpen={isEffectsOpen}
        onClose={() => setIsEffectsOpen(false)}
        videoFilters={videoFilters}
        onUpdateFilters={setVideoFilters}
        audioDelay={audioDelay}
        onUpdateAudioDelay={setAudioDelay}
        subtitleDelay={subtitleDelay}
        onUpdateSubtitleDelay={setSubtitleDelay}
        equalizerBands={equalizerBands}
        onUpdateBand={handleUpdateBand}
        preampGain={preampGain}
        onUpdatePreamp={handleUpdatePreamp}
      />

      <MediaInfoModal
        isOpen={isMediaInfoOpen}
        onClose={() => setIsMediaInfoOpen(false)}
        currentTrack={currentTrack}
      />

      <PlaylistModal
        isOpen={isPlaylistOpen}
        onClose={() => setIsPlaylistOpen(false)}
        playlist={playlist}
        currentTrackId={currentTrack?.id || null}
        onSelectTrack={(track) => {
          const idx = playlist.findIndex((t) => t.id === track.id);
          if (idx !== -1) {
            setCurrentTrackIndex(idx);
            setIsPlaying(true);
          }
        }}
        onAddFiles={handleAddFiles}
        onAddStreamUrl={handleAddStreamUrl}
        onClearPlaylist={() => setPlaylist([])}
      />

      <WindowsPackageModal
        isOpen={isWindowsPackageOpen}
        onClose={() => setIsWindowsPackageOpen(false)}
      />

      <WindowsInstallModal
        isOpen={isWindowsInstallOpen}
        onClose={() => setIsWindowsInstallOpen(false)}
      />
    </div>
  );
}
