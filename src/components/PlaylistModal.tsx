import React, { useState } from 'react';
import { X, ListMusic, Plus, Download, Trash2, Search, Play, FileVideo, Globe } from 'lucide-react';
import { PlaylistItem } from '../types/media';
import { formatTime } from '../utils/formatTime';

interface PlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
  playlist: PlaylistItem[];
  currentTrackId: string | null;
  onSelectTrack: (track: PlaylistItem) => void;
  onAddFiles: (files: FileList) => void;
  onAddStreamUrl: (title: string, url: string) => void;
  onClearPlaylist: () => void;
}

export const PlaylistModal: React.FC<PlaylistModalProps> = ({
  isOpen,
  onClose,
  playlist,
  currentTrackId,
  onSelectTrack,
  onAddFiles,
  onAddStreamUrl,
  onClearPlaylist,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddUrl, setShowAddUrl] = useState(false);
  const [streamUrl, setStreamUrl] = useState('');
  const [streamTitle, setStreamTitle] = useState('');

  if (!isOpen) return null;

  const filteredPlaylist = playlist.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.artist && item.artist.toLowerCase().includes(searchQuery.toLowerCase())) ||
    item.format.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onAddFiles(e.target.files);
    }
  };

  const handleAddStream = (e: React.FormEvent) => {
    e.preventDefault();
    if (!streamUrl.trim()) return;
    onAddStreamUrl(streamTitle.trim() || 'Network Stream', streamUrl.trim());
    setStreamUrl('');
    setStreamTitle('');
    setShowAddUrl(false);
  };

  const exportM3U = () => {
    let m3uContent = '#EXTM3U\n';
    playlist.forEach((track) => {
      m3uContent += `#EXTINF:${Math.floor(track.duration)},${track.title}\n${track.src}\n`;
    });
    const blob = new Blob([m3uContent], { type: 'audio/x-mpegurl' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'nova_playlist.m3u';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 select-none">
      <div className="bg-[#0e1626] border border-[#1e2e4a] rounded-lg shadow-2xl w-full max-w-xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="h-10 bg-[#090f1a] border-b border-[#1b2940] px-4 flex items-center justify-between text-slate-200">
          <div className="flex items-center gap-2">
            <ListMusic className="w-4 h-4 text-blue-400" />
            <span className="text-xs font-semibold tracking-wide">Playlist &amp; Media Browser</span>
            <span className="text-[11px] text-slate-500 font-mono">({playlist.length} items)</span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800/60 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Toolbar & Search */}
        <div className="bg-[#0c1322] border-b border-[#1b2940] p-3 space-y-2">
          <div className="flex items-center justify-between gap-2">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Filter media by title, format..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#131d2e] border border-[#21314b] rounded pl-8 pr-3 py-1 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Action Buttons */}
            <label className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs px-2.5 py-1 rounded cursor-pointer transition-colors font-medium">
              <Plus className="w-3.5 h-3.5" />
              <span>Add File</span>
              <input type="file" multiple accept="video/*,audio/*" onChange={handleFileChange} className="hidden" />
            </label>

            <button
              onClick={() => setShowAddUrl(!showAddUrl)}
              className="flex items-center gap-1.5 bg-[#162135] hover:bg-[#1d2b45] text-slate-300 text-xs px-2.5 py-1 rounded border border-[#233553] cursor-pointer"
              title="Add Network Stream (HLS, MP4, RTSP)"
            >
              <Globe className="w-3.5 h-3.5 text-blue-400" />
              <span className="hidden sm:inline">Add URL</span>
            </button>
          </div>

          {/* Add URL Form Dropdown */}
          {showAddUrl && (
            <form onSubmit={handleAddStream} className="bg-[#121c2e] p-2.5 rounded border border-[#20314f] space-y-2">
              <input
                type="text"
                placeholder="Stream Title (optional)"
                value={streamTitle}
                onChange={(e) => setStreamTitle(e.target.value)}
                className="w-full bg-[#0a101b] border border-[#223554] rounded px-2.5 py-1 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
              />
              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="Stream URL (e.g. https://... or rtp://...)"
                  value={streamUrl}
                  onChange={(e) => setStreamUrl(e.target.value)}
                  required
                  className="flex-1 bg-[#0a101b] border border-[#223554] rounded px-2.5 py-1 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                />
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-3 py-1 rounded text-xs font-medium hover:bg-blue-500 cursor-pointer"
                >
                  Load
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Playlist Items */}
        <div className="p-3 overflow-y-auto flex-1 space-y-1.5 divide-y divide-slate-800/40">
          {filteredPlaylist.length === 0 ? (
            <div className="py-8 text-center text-slate-500 text-xs">
              No matching media items found.
            </div>
          ) : (
            filteredPlaylist.map((item, index) => {
              const isActive = item.id === currentTrackId;
              return (
                <div
                  key={item.id}
                  onClick={() => onSelectTrack(item)}
                  className={`flex items-center justify-between p-2 rounded-md transition-colors cursor-pointer group ${
                    isActive
                      ? 'bg-blue-950/50 border border-blue-800/50 text-white'
                      : 'hover:bg-[#121c2e] text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <span className="font-mono text-[11px] text-slate-500 w-5 text-right">
                      {index + 1}
                    </span>
                    <div className="w-8 h-8 rounded bg-[#162136] flex items-center justify-center shrink-0 border border-slate-700/50">
                      {isActive ? (
                        <Play className="w-4 h-4 text-blue-400 fill-current" />
                      ) : (
                        <FileVideo className="w-4 h-4 text-slate-400" />
                      )}
                    </div>
                    <div className="truncate">
                      <div className={`text-xs font-medium truncate ${isActive ? 'text-blue-300 font-semibold' : ''}`}>
                        {item.title}
                      </div>
                      <div className="text-[10px] text-slate-500 flex items-center gap-2">
                        <span>{item.artist || 'Local Media'}</span>
                        <span>•</span>
                        <span className="font-mono uppercase">{item.format}</span>
                        {item.resolution && (
                          <>
                            <span>•</span>
                            <span className="font-mono">{item.resolution}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <span className="text-[11px] font-mono text-slate-400 group-hover:text-slate-200 shrink-0 ml-3">
                    {formatTime(item.duration)}
                  </span>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="h-12 bg-[#090f1a] border-t border-[#1b2940] px-4 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={exportM3U}
              className="flex items-center gap-1.5 text-slate-400 hover:text-white bg-[#141d2e] hover:bg-slate-800 px-2.5 py-1 rounded border border-slate-700/50 cursor-pointer"
              title="Save as standard M3U Playlist file"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export M3U</span>
            </button>
            <button
              onClick={onClearPlaylist}
              className="flex items-center gap-1.5 text-slate-400 hover:text-red-400 bg-[#141d2e] hover:bg-red-950/40 px-2.5 py-1 rounded border border-slate-700/50 cursor-pointer"
              title="Clear all items from current playlist"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded font-medium transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
