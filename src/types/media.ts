export interface PlaylistItem {
  id: string;
  title: string;
  artist?: string;
  duration: number; // in seconds
  src: string;
  type: 'video' | 'audio';
  format: string; // mp4, mkv, webm, avi, etc.
  resolution?: string; // 4K, 1080p, 720p
  thumbnail?: string;
  fileSize?: string;
  codec?: string;
  isLocal?: boolean;
  subtitles?: SubtitleTrack[];
}

export interface SubtitleTrack {
  id: string;
  label: string;
  language: string;
  src?: string; // URL or blob
  content?: string; // WebVTT or SRT text
  default?: boolean;
}

export interface AudioTrackInfo {
  id: string;
  label: string;
  language: string;
  channels: number; // 2 (Stereo), 6 (5.1)
  bitrate?: string;
}

export interface VideoFilterSettings {
  brightness: number; // 0 - 200, default 100
  contrast: number;   // 0 - 200, default 100
  saturation: number; // 0 - 200, default 100
  hue: number;        // -180 to 180, default 0
  gamma: number;      // 0.5 to 2.5, default 1.0
  invert: boolean;
  blur: number;       // 0 to 10px, default 0
  grayscale: boolean;
  sepia: boolean;
}

export interface EqualizerBand {
  frequency: number;
  label: string;
  gain: number; // -20dB to +20dB
}

export type AspectRatioMode = 'auto' | '16:9' | '4:3' | '21:9' | 'fill' | 'original';

export type LoopMode = 'off' | 'all' | 'one';
