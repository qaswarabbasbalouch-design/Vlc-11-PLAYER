import { PlaylistItem } from '../types/media';

export const SAMPLE_PLAYLIST: PlaylistItem[] = [
  {
    id: 'sample-city-skyline',
    title: 'Manhattan Skyline Sunset — Ultra HD 4K',
    artist: 'Nova Media Studio',
    duration: 768, // 12:48
    src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    type: 'video',
    format: 'MP4',
    resolution: '3840 x 2160 (4K UHD)',
    codec: 'H.264 / AVC (High Profile)',
    fileSize: '1.42 GB',
    thumbnail: 'https://images.unsplash.com/photo-1534430480872-3498386e7856?auto=format&fit=crop&w=640&q=80',
    subtitles: [
      { id: 'sub-en', label: 'English [CC]', language: 'en', default: true },
      { id: 'sub-es', label: 'Spanish (Español)', language: 'es' },
      { id: 'sub-fr', label: 'French (Français)', language: 'fr' },
    ]
  },
  {
    id: 'sample-tears-of-steel',
    title: 'Tears of Steel — Sci-Fi VFX Showcase (4K)',
    artist: 'Blender Foundation',
    duration: 734, // 12:14
    src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    type: 'video',
    format: 'MKV',
    resolution: '3840 x 1714 (Cinema 4K)',
    codec: 'HEVC / H.265 (Main 10)',
    fileSize: '2.18 GB',
    thumbnail: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=640&q=80',
    subtitles: [
      { id: 'sub-en', label: 'English [Original Audio]', language: 'en', default: true },
      { id: 'sub-de', label: 'German (Deutsch)', language: 'de' },
      { id: 'sub-ja', label: 'Japanese (日本語)', language: 'ja' },
    ]
  },
  {
    id: 'sample-big-buck-bunny',
    title: 'Big Buck Bunny — Open Animation 60FPS',
    artist: 'Blender Open Source Project',
    duration: 596, // 09:56
    src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    type: 'video',
    format: 'MP4',
    resolution: '1920 x 1080 (1080p 60fps)',
    codec: 'H.264 / AVC',
    fileSize: '780 MB',
    thumbnail: 'https://images.unsplash.com/photo-1535083783855-76ae62b2914e?auto=format&fit=crop&w=640&q=80',
    subtitles: [
      { id: 'sub-en', label: 'English [Narrative]', language: 'en' },
    ]
  },
  {
    id: 'sample-cyberpunk-drive',
    title: 'Neo-Tokyo Cyberpunk Night Drive — 60FPS HDR',
    artist: 'SynthWave Odyssey',
    duration: 480, // 08:00
    src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
    type: 'video',
    format: 'WEBM',
    resolution: '2560 x 1440 (2K QHD)',
    codec: 'VP9 / Vorbis',
    fileSize: '950 MB',
    thumbnail: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=640&q=80',
  },
  {
    id: 'sample-coastal-waves',
    title: 'Pacific Coast Ocean Swell — Binaural Audio 4K',
    artist: 'Nature Soundscapes',
    duration: 620, // 10:20
    src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    type: 'video',
    format: 'MOV',
    resolution: '3840 x 2160 (4K UHD)',
    codec: 'AV1 / Opus 5.1 Surround',
    fileSize: '1.85 GB',
    thumbnail: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=640&q=80',
  }
];

export const EQUALIZER_PRESETS: Record<string, number[]> = {
  'Flat': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  'Rock': [5, 3.5, 2, -1, -2, 1, 3, 4, 5, 5.5],
  'Pop': [-1.5, 1, 3.5, 4.5, 3, 0, -1, -1.5, 2, 3],
  'Bass Boost': [8, 6.5, 5, 2.5, 0, 0, 0, 0, 0, 0],
  'Jazz': [3.5, 2.5, 1, 2, -1.5, -1.5, 0, 1.5, 3, 3.5],
  'Classical': [4.5, 3.5, 2.5, 2, -1.5, -1.5, 0, 2, 3, 3.5],
  'Techno / Dance': [6, 5, 2, 0, -2, 2, 4, 5, 4.5, 0],
  'Vocal Clarity': [-3, -2, -1, 1, 3.5, 4, 4, 2, 0, -2],
  'Full Treble': [-6, -4, -2, 0, 2, 4, 6, 8, 9, 10],
};
