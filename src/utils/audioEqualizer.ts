export const EQ_FREQUENCIES = [32, 64, 125, 250, 500, 1000, 2000, 4000, 8000, 16000];
export const EQ_LABELS = ['32Hz', '64Hz', '125Hz', '250Hz', '500Hz', '1kHz', '2kHz', '4kHz', '8kHz', '16kHz'];

export class AudioEngine {
  private audioCtx: AudioContext | null = null;
  private sourceNode: MediaElementAudioSourceNode | null = null;
  private filters: BiquadFilterNode[] = [];
  private preampGainNode: GainNode | null = null;
  private boosterGainNode: GainNode | null = null;
  private analyserNode: AnalyserNode | null = null;
  private isInitialized = false;

  public init(mediaElement: HTMLMediaElement) {
    if (this.isInitialized) return;

    try {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtxClass) return;

      this.audioCtx = new AudioCtxClass();
      this.sourceNode = this.audioCtx.createMediaElementSource(mediaElement);
      this.preampGainNode = this.audioCtx.createGain();
      this.boosterGainNode = this.audioCtx.createGain();
      this.analyserNode = this.audioCtx.createAnalyser();
      this.analyserNode.fftSize = 64;

      // Create 10 band filters
      this.filters = EQ_FREQUENCIES.map((freq, index) => {
        const filter = this.audioCtx!.createBiquadFilter();
        if (index === 0) {
          filter.type = 'lowshelf';
        } else if (index === EQ_FREQUENCIES.length - 1) {
          filter.type = 'highshelf';
        } else {
          filter.type = 'peaking';
          filter.Q.value = 1.4;
        }
        filter.frequency.value = freq;
        filter.gain.value = 0;
        return filter;
      });

      // Connect: Source -> Preamp -> Filter[0] -> Filter[1] ... -> Booster -> Analyser -> Destination
      let currentNode: AudioNode = this.sourceNode;
      currentNode.connect(this.preampGainNode);
      currentNode = this.preampGainNode;

      for (const filter of this.filters) {
        currentNode.connect(filter);
        currentNode = filter;
      }

      currentNode.connect(this.boosterGainNode);
      this.boosterGainNode.connect(this.analyserNode);
      this.analyserNode.connect(this.audioCtx.destination);

      this.isInitialized = true;
    } catch {
      // AudioContext might fail if user hasn't interacted or cross-origin restrictions
      console.warn('AudioContext initialization deferred until user interaction');
    }
  }

  public resume() {
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  public setBandGain(index: number, gainDb: number) {
    if (this.filters[index] && this.audioCtx) {
      this.filters[index].gain.setTargetAtTime(gainDb, this.audioCtx.currentTime, 0.05);
    }
  }

  public setPreampGain(gainDb: number) {
    if (this.preampGainNode && this.audioCtx) {
      // Convert dB to linear gain: 10^(dB/20)
      const linear = Math.pow(10, gainDb / 20);
      this.preampGainNode.gain.setTargetAtTime(linear, this.audioCtx.currentTime, 0.05);
    }
  }

  public setVolumeBoost(percentage: number) {
    // 100% = normal (1.0). 125% = 1.25. 200% = 2.0 (VLC maximum boost)
    if (this.boosterGainNode && this.audioCtx) {
      const factor = Math.max(0, percentage / 100);
      this.boosterGainNode.gain.setTargetAtTime(factor, this.audioCtx.currentTime, 0.05);
    }
  }

  public getFrequencyData(array: Uint8Array<ArrayBuffer>): void {
    if (this.analyserNode) {
      this.analyserNode.getByteFrequencyData(array);
    }
  }
}

export const globalAudioEngine = new AudioEngine();
