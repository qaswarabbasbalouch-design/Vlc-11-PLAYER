import React, { useState, useEffect, useRef } from 'react';
import { X, Sliders, Eye, Clock, RotateCcw } from 'lucide-react';
import { VideoFilterSettings, EqualizerBand } from '../types/media';
import { EQ_FREQUENCIES, EQ_LABELS, globalAudioEngine } from '../utils/audioEqualizer';
import { EQUALIZER_PRESETS } from '../data/sampleMedia';

interface EffectsModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoFilters: VideoFilterSettings;
  onUpdateFilters: (filters: VideoFilterSettings) => void;
  audioDelay: number;
  onUpdateAudioDelay: (delay: number) => void;
  subtitleDelay: number;
  onUpdateSubtitleDelay: (delay: number) => void;
  equalizerBands: EqualizerBand[];
  onUpdateBand: (index: number, gain: number) => void;
  preampGain: number;
  onUpdatePreamp: (gain: number) => void;
}

export const EffectsModal: React.FC<EffectsModalProps> = ({
  isOpen,
  onClose,
  videoFilters,
  onUpdateFilters,
  audioDelay,
  onUpdateAudioDelay,
  subtitleDelay,
  onUpdateSubtitleDelay,
  equalizerBands,
  onUpdateBand,
  preampGain,
  onUpdatePreamp,
}) => {
  const [activeTab, setActiveTab] = useState<'audio' | 'video' | 'sync'>('audio');
  const [selectedPreset, setSelectedPreset] = useState<string>('Flat');
  const [eqEnabled, setEqEnabled] = useState<boolean>(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Audio spectrum visualizer animation
  useEffect(() => {
    if (!isOpen || activeTab !== 'audio') return;

    let animId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dataArray = new Uint8Array(32);

    const renderSpectrum = () => {
      globalAudioEngine.getFrequencyData(dataArray);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const barWidth = (canvas.width / 32) * 2;
      let x = 0;

      for (let i = 0; i < 16; i++) {
        const val = dataArray[i * 2] || (Math.random() * 20); // Fallback subtle wave
        const barHeight = (val / 255) * canvas.height;

        const grad = ctx.createLinearGradient(0, canvas.height, 0, 0);
        grad.addColorStop(0, '#2563eb');
        grad.addColorStop(1, '#60a5fa');

        ctx.fillStyle = grad;
        ctx.fillRect(x, canvas.height - barHeight, barWidth - 2, barHeight);
        x += barWidth;
      }

      animId = requestAnimationFrame(renderSpectrum);
    };

    renderSpectrum();
    return () => cancelAnimationFrame(animId);
  }, [isOpen, activeTab]);

  if (!isOpen) return null;

  const handlePresetChange = (presetName: string) => {
    setSelectedPreset(presetName);
    const preset = EQUALIZER_PRESETS[presetName];
    if (preset) {
      preset.forEach((gain, idx) => {
        onUpdateBand(idx, gain);
      });
    }
  };

  const resetVideoFilters = () => {
    onUpdateFilters({
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
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 select-none">
      <div className="bg-[#0e1626] border border-[#1e2e4a] rounded-lg shadow-2xl w-full max-w-xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="h-10 bg-[#090f1a] border-b border-[#1b2940] px-4 flex items-center justify-between text-slate-200">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-blue-400" />
            <span className="text-xs font-semibold tracking-wide">Adjustments and Effects</span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800/60 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#1b2940] bg-[#0c1322] px-3 pt-2 gap-1">
          <button
            onClick={() => setActiveTab('audio')}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-t-md transition-colors cursor-pointer ${
              activeTab === 'audio'
                ? 'bg-[#152035] text-blue-400 border-t-2 border-blue-500'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Audio Effects</span>
          </button>
          <button
            onClick={() => setActiveTab('video')}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-t-md transition-colors cursor-pointer ${
              activeTab === 'video'
                ? 'bg-[#152035] text-blue-400 border-t-2 border-blue-500'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Video Effects</span>
          </button>
          <button
            onClick={() => setActiveTab('sync')}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-t-md transition-colors cursor-pointer ${
              activeTab === 'sync'
                ? 'bg-[#152035] text-blue-400 border-t-2 border-blue-500'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Synchronization</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-5 overflow-y-auto max-h-[70vh]">
          {/* 1. AUDIO EFFECTS TAB: 10-BAND GRAPHIC EQUALIZER */}
          {activeTab === 'audio' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-xs font-medium text-slate-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={eqEnabled}
                    onChange={(e) => setEqEnabled(e.target.checked)}
                    className="rounded accent-blue-500"
                  />
                  <span>Enable 10-Band Graphic Equalizer</span>
                </label>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">Preset:</span>
                  <select
                    value={selectedPreset}
                    onChange={(e) => handlePresetChange(e.target.value)}
                    className="bg-[#141e30] border border-[#23334e] text-slate-200 text-xs rounded px-2.5 py-1 focus:outline-none focus:border-blue-500 cursor-pointer"
                  >
                    {Object.keys(EQUALIZER_PRESETS).map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Spectrum Visualizer */}
              <div className="bg-[#080d17] p-2.5 rounded-lg border border-[#1b283f] flex items-center justify-between">
                <div className="text-[11px] text-slate-400">
                  <span className="text-blue-400 font-mono">DSP Engine</span>: 10-Band Biquad Filter Chain + Preamp
                </div>
                <canvas ref={canvasRef} width={120} height={24} className="rounded" />
              </div>

              {/* Preamp Slider */}
              <div className="bg-[#111a2d] p-3 rounded-lg border border-[#1d2a44] flex items-center justify-between">
                <span className="text-xs font-medium text-slate-300">Preamp</span>
                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-mono text-slate-400">-20 dB</span>
                  <input
                    type="range"
                    min="-20"
                    max="20"
                    step="0.5"
                    value={preampGain}
                    onChange={(e) => onUpdatePreamp(Number(e.target.value))}
                    className="w-48 accent-blue-500 h-1 cursor-pointer"
                  />
                  <span className="text-[11px] font-mono text-slate-400">+20 dB</span>
                  <span className="text-xs font-mono text-blue-400 w-12 text-right">
                    {preampGain > 0 ? `+${preampGain}` : preampGain} dB
                  </span>
                </div>
              </div>

              {/* 10 Vertical Equalizer Faders */}
              <div className="grid grid-cols-10 gap-1 bg-[#0b111e] p-3.5 rounded-lg border border-[#18253b]">
                {EQ_FREQUENCIES.map((freq, idx) => {
                  const band = equalizerBands[idx] || { gain: 0 };
                  return (
                    <div key={freq} className="flex flex-col items-center gap-2">
                      <span className="text-[10px] font-mono text-blue-400">
                        {band.gain > 0 ? `+${Math.round(band.gain)}` : Math.round(band.gain)}
                      </span>
                      {/* Vertical Slider */}
                      <input
                        type="range"
                        min="-20"
                        max="20"
                        step="0.5"
                        value={band.gain}
                        onChange={(e) => onUpdateBand(idx, Number(e.target.value))}
                        disabled={!eqEnabled}
                        className="h-28 w-2 accent-blue-500 cursor-pointer"
                        style={{ WebkitAppearance: 'slider-vertical' } as React.CSSProperties}
                      />
                      <span className="text-[9px] font-mono text-slate-400">
                        {EQ_LABELS[idx]}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 2. VIDEO EFFECTS TAB */}
          {activeTab === 'video' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-slate-300">Color &amp; Geometry Adjustments</span>
                <button
                  onClick={resetVideoFilters}
                  className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-700/60 px-2.5 py-1 rounded cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset All</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Brightness */}
                <div className="bg-[#111a2d] p-3 rounded border border-[#1d2b45] space-y-1.5">
                  <div className="flex justify-between text-xs text-slate-300">
                    <span>Brightness</span>
                    <span className="font-mono text-blue-400">{videoFilters.brightness}%</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="180"
                    value={videoFilters.brightness}
                    onChange={(e) => onUpdateFilters({ ...videoFilters, brightness: Number(e.target.value) })}
                    className="w-full accent-blue-500 h-1 cursor-pointer"
                  />
                </div>

                {/* Contrast */}
                <div className="bg-[#111a2d] p-3 rounded border border-[#1d2b45] space-y-1.5">
                  <div className="flex justify-between text-xs text-slate-300">
                    <span>Contrast</span>
                    <span className="font-mono text-blue-400">{videoFilters.contrast}%</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="200"
                    value={videoFilters.contrast}
                    onChange={(e) => onUpdateFilters({ ...videoFilters, contrast: Number(e.target.value) })}
                    className="w-full accent-blue-500 h-1 cursor-pointer"
                  />
                </div>

                {/* Saturation */}
                <div className="bg-[#111a2d] p-3 rounded border border-[#1d2b45] space-y-1.5">
                  <div className="flex justify-between text-xs text-slate-300">
                    <span>Saturation</span>
                    <span className="font-mono text-blue-400">{videoFilters.saturation}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={videoFilters.saturation}
                    onChange={(e) => onUpdateFilters({ ...videoFilters, saturation: Number(e.target.value) })}
                    className="w-full accent-blue-500 h-1 cursor-pointer"
                  />
                </div>

                {/* Hue */}
                <div className="bg-[#111a2d] p-3 rounded border border-[#1d2b45] space-y-1.5">
                  <div className="flex justify-between text-xs text-slate-300">
                    <span>Hue Rotation</span>
                    <span className="font-mono text-blue-400">{videoFilters.hue}°</span>
                  </div>
                  <input
                    type="range"
                    min="-180"
                    max="180"
                    value={videoFilters.hue}
                    onChange={(e) => onUpdateFilters({ ...videoFilters, hue: Number(e.target.value) })}
                    className="w-full accent-blue-500 h-1 cursor-pointer"
                  />
                </div>
              </div>

              {/* Checkbox Toggles */}
              <div className="flex flex-wrap gap-4 pt-2">
                <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={videoFilters.invert}
                    onChange={(e) => onUpdateFilters({ ...videoFilters, invert: e.target.checked })}
                    className="accent-blue-500 rounded"
                  />
                  <span>Invert Colors</span>
                </label>

                <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={videoFilters.grayscale}
                    onChange={(e) => onUpdateFilters({ ...videoFilters, grayscale: e.target.checked })}
                    className="accent-blue-500 rounded"
                  />
                  <span>Grayscale</span>
                </label>

                <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={videoFilters.sepia}
                    onChange={(e) => onUpdateFilters({ ...videoFilters, sepia: e.target.checked })}
                    className="accent-blue-500 rounded"
                  />
                  <span>Sepia Cinema</span>
                </label>
              </div>
            </div>
          )}

          {/* 3. SYNCHRONIZATION TAB */}
          {activeTab === 'sync' && (
            <div className="space-y-5">
              {/* Audio / Video Sync */}
              <div className="bg-[#111a2d] p-4 rounded-lg border border-[#1e2c45] space-y-3">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="text-xs font-semibold text-slate-200">Audio Track Synchronization</h4>
                    <p className="text-[11px] text-slate-400">Advance or delay audio relative to video stream</p>
                  </div>
                  <span className="text-xs font-mono text-blue-400 font-bold">
                    {audioDelay > 0 ? `+${audioDelay} ms` : `${audioDelay} ms`}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onUpdateAudioDelay(audioDelay - 50)}
                    className="px-2.5 py-1 bg-slate-800 text-slate-200 rounded text-xs hover:bg-slate-700 cursor-pointer"
                  >
                    -50 ms
                  </button>
                  <input
                    type="range"
                    min="-2000"
                    max="2000"
                    step="50"
                    value={audioDelay}
                    onChange={(e) => onUpdateAudioDelay(Number(e.target.value))}
                    className="flex-1 accent-blue-500 h-1 cursor-pointer"
                  />
                  <button
                    onClick={() => onUpdateAudioDelay(audioDelay + 50)}
                    className="px-2.5 py-1 bg-slate-800 text-slate-200 rounded text-xs hover:bg-slate-700 cursor-pointer"
                  >
                    +50 ms
                  </button>
                </div>
              </div>

              {/* Subtitles Sync */}
              <div className="bg-[#111a2d] p-4 rounded-lg border border-[#1e2c45] space-y-3">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="text-xs font-semibold text-slate-200">Subtitle Synchronization</h4>
                    <p className="text-[11px] text-slate-400">Synchronize subtitle timing with dialogue</p>
                  </div>
                  <span className="text-xs font-mono text-blue-400 font-bold">
                    {subtitleDelay > 0 ? `+${subtitleDelay} ms` : `${subtitleDelay} ms`}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onUpdateSubtitleDelay(subtitleDelay - 50)}
                    className="px-2.5 py-1 bg-slate-800 text-slate-200 rounded text-xs hover:bg-slate-700 cursor-pointer"
                  >
                    -50 ms
                  </button>
                  <input
                    type="range"
                    min="-5000"
                    max="5000"
                    step="50"
                    value={subtitleDelay}
                    onChange={(e) => onUpdateSubtitleDelay(Number(e.target.value))}
                    className="flex-1 accent-blue-500 h-1 cursor-pointer"
                  />
                  <button
                    onClick={() => onUpdateSubtitleDelay(subtitleDelay + 50)}
                    className="px-2.5 py-1 bg-slate-800 text-slate-200 rounded text-xs hover:bg-slate-700 cursor-pointer"
                  >
                    +50 ms
                  </button>
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
