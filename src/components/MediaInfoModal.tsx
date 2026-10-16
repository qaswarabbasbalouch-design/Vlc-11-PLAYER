import React, { useState } from 'react';
import { X, Info, Layers, BarChart2, Cpu } from 'lucide-react';
import { PlaylistItem } from '../types/media';

interface MediaInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTrack: PlaylistItem | null;
}

export const MediaInfoModal: React.FC<MediaInfoModalProps> = ({ isOpen, onClose, currentTrack }) => {
  const [activeTab, setActiveTab] = useState<'general' | 'codec' | 'stats'>('codec');

  if (!isOpen || !currentTrack) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 select-none">
      <div className="bg-[#0e1626] border border-[#1e2e4a] rounded-lg shadow-2xl w-full max-w-xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="h-10 bg-[#090f1a] border-b border-[#1b2940] px-4 flex items-center justify-between text-slate-200">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-blue-400" />
            <span className="text-xs font-semibold tracking-wide">Current Media Information &amp; Codec</span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800/60 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#1b2940] bg-[#0c1322] px-3 pt-2 gap-1 text-xs">
          <button
            onClick={() => setActiveTab('codec')}
            className={`flex items-center gap-2 px-3.5 py-1.5 font-medium rounded-t-md transition-colors cursor-pointer ${
              activeTab === 'codec'
                ? 'bg-[#152035] text-blue-400 border-t-2 border-blue-500'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Codec Details</span>
          </button>
          <button
            onClick={() => setActiveTab('general')}
            className={`flex items-center gap-2 px-3.5 py-1.5 font-medium rounded-t-md transition-colors cursor-pointer ${
              activeTab === 'general'
                ? 'bg-[#152035] text-blue-400 border-t-2 border-blue-500'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Info className="w-3.5 h-3.5" />
            <span>General</span>
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`flex items-center gap-2 px-3.5 py-1.5 font-medium rounded-t-md transition-colors cursor-pointer ${
              activeTab === 'stats'
                ? 'bg-[#152035] text-blue-400 border-t-2 border-blue-500'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5" />
            <span>Statistics</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-5 text-xs text-slate-300 max-h-[65vh] overflow-y-auto space-y-4">
          {/* 1. CODEC DETAILS */}
          {activeTab === 'codec' && (
            <div className="space-y-3">
              {/* Stream 0: Video */}
              <div className="bg-[#111a2d] border border-[#1e2d48] rounded-lg p-3.5">
                <div className="flex items-center justify-between font-semibold text-slate-100 mb-2">
                  <span className="flex items-center gap-1.5 text-blue-400">
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                    Stream 0 [Video Track]
                  </span>
                  <span className="font-mono text-[11px] bg-blue-950 text-blue-300 px-2 py-0.5 rounded border border-blue-800/40">
                    {currentTrack.format.toUpperCase()}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-y-1.5 text-[11px]">
                  <div className="text-slate-400">Codec:</div>
                  <div className="font-mono text-slate-200">{currentTrack.codec || 'H.264 / MPEG-4 AVC'}</div>

                  <div className="text-slate-400">Resolution:</div>
                  <div className="font-mono text-slate-200">{currentTrack.resolution || '3840 x 2160 (4K UHD)'}</div>

                  <div className="text-slate-400">Frame Rate:</div>
                  <div className="font-mono text-slate-200">60.000000 fps</div>

                  <div className="text-slate-400">Decoded Format:</div>
                  <div className="font-mono text-slate-200">Planar 4:2:0 YUV 10-bit</div>

                  <div className="text-slate-400">Color Primaries:</div>
                  <div className="font-mono text-slate-200">ITU-R BT.709 / Rec.2020</div>

                  <div className="text-slate-400">Hardware Acceleration:</div>
                  <div className="font-mono text-emerald-400 font-semibold flex items-center gap-1">
                    <Cpu className="w-3 h-3" />
                    <span>D3D11VA (Direct3D 11 Video Acceleration) Active</span>
                  </div>
                </div>
              </div>

              {/* Stream 1: Audio */}
              <div className="bg-[#111a2d] border border-[#1e2d48] rounded-lg p-3.5">
                <div className="flex items-center justify-between font-semibold text-slate-100 mb-2">
                  <span className="flex items-center gap-1.5 text-blue-400">
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                    Stream 1 [Audio Track]
                  </span>
                  <span className="font-mono text-[11px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
                    AAC-LC
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-y-1.5 text-[11px]">
                  <div className="text-slate-400">Codec:</div>
                  <div className="font-mono text-slate-200">MPEG AAC Audio (mp4a)</div>

                  <div className="text-slate-400">Channels:</div>
                  <div className="font-mono text-slate-200">Stereo (Left / Right)</div>

                  <div className="text-slate-400">Sample Rate:</div>
                  <div className="font-mono text-slate-200">48000 Hz</div>

                  <div className="text-slate-400">Bits per sample:</div>
                  <div className="font-mono text-slate-200">32-bit Float</div>

                  <div className="text-slate-400">Bitrate:</div>
                  <div className="font-mono text-slate-200">320 kbps VBR</div>
                </div>
              </div>

              {/* Stream 2: Subtitle */}
              <div className="bg-[#111a2d] border border-[#1e2d48] rounded-lg p-3.5">
                <div className="flex items-center justify-between font-semibold text-slate-100 mb-1">
                  <span className="flex items-center gap-1.5 text-blue-400">
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                    Stream 2 [Subtitle Track]
                  </span>
                  <span className="font-mono text-[11px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
                    SubRip (SRT/VTT)
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-y-1.5 text-[11px]">
                  <div className="text-slate-400">Languages:</div>
                  <div className="font-mono text-slate-200">English, Spanish, French</div>
                </div>
              </div>
            </div>
          )}

          {/* 2. GENERAL TAB */}
          {activeTab === 'general' && (
            <div className="space-y-3">
              <div className="bg-[#111a2d] border border-[#1e2d48] rounded-lg p-4 space-y-2.5">
                <div>
                  <span className="text-slate-400 block text-[11px]">File Title:</span>
                  <span className="font-semibold text-slate-100 text-sm">{currentTrack.title}</span>
                </div>

                <div>
                  <span className="text-slate-400 block text-[11px]">Location / Source URI:</span>
                  <span className="font-mono text-slate-300 text-[11px] break-all">{currentTrack.src}</span>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Container:</span>
                    <span className="font-mono text-slate-200">{currentTrack.format.toUpperCase()} Container</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Estimated File Size:</span>
                    <span className="font-mono text-slate-200">{currentTrack.fileSize || '1.2 GB'}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 3. STATISTICS TAB */}
          {activeTab === 'stats' && (
            <div className="space-y-3">
              <div className="bg-[#111a2d] border border-[#1e2d48] rounded-lg p-3.5 space-y-2">
                <h4 className="font-semibold text-slate-200 mb-1">Playback Buffer &amp; Demuxer Stats</h4>
                <div className="grid grid-cols-2 gap-y-1.5 text-[11px]">
                  <div className="text-slate-400">Read Bytes:</div>
                  <div className="font-mono text-slate-200">482,912 KiB</div>
                  <div className="text-slate-400">Input Bitrate:</div>
                  <div className="font-mono text-blue-400">24,510 kb/s</div>
                  <div className="text-slate-400">Demuxed Video:</div>
                  <div className="font-mono text-slate-200">460,110 KiB</div>
                  <div className="text-slate-400">Decoded Video Frames:</div>
                  <div className="font-mono text-emerald-400">18,432 frames</div>
                  <div className="text-slate-400">Dropped Video Frames:</div>
                  <div className="font-mono text-emerald-400">0 (0.00%)</div>
                  <div className="text-slate-400">Audio Buffers Rendered:</div>
                  <div className="font-mono text-slate-200">14,320</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="h-11 bg-[#090f1a] border-t border-[#1b2940] px-4 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-medium transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
