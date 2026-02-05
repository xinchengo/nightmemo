class AudioService {
  private audioContext: AudioContext | null = null;
  private synth: SpeechSynthesis = window.speechSynthesis;

  private initContext() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
  }

  // --- Oscillator Based Sounds ---

  private playTone(frequency: number, type: OscillatorType, duration: number, volume: number = 0.1) {
    this.initContext();
    if (!this.audioContext) return;

    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
    
    gain.gain.setValueAtTime(volume, this.audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

    osc.connect(gain);
    gain.connect(this.audioContext.destination);

    osc.start();
    osc.stop(this.audioContext.currentTime + duration);
  }

  public playTypeSound() {
    // Soft click/blip
    this.playTone(600, 'sine', 0.05, 0.05);
  }

  public playBackspaceBufferSound() {
    // Higher pitch, quick
    this.playTone(400, 'triangle', 0.1, 0.1);
  }

  public playBackspaceTokenSound() {
    // Lower pitch, longer - indicating "erasure" of a block
    this.playTone(200, 'sawtooth', 0.15, 0.1);
  }

  public playConfirmPinyinSound() {
    // Ascending chord-like sequence (simulated)
    this.playTone(800, 'sine', 0.1, 0.1);
    setTimeout(() => this.playTone(1200, 'sine', 0.1, 0.1), 50);
  }

  public playConfirmEnglishSound() {
    // Distinct from Pinyin, maybe flat or different waveform
    this.playTone(600, 'square', 0.1, 0.05);
    setTimeout(() => this.playTone(600, 'square', 0.1, 0.05), 80);
  }

  public playErrorSound() {
    // Low buzz
    this.playTone(150, 'sawtooth', 0.3, 0.2);
  }

  // --- TTS ---

  public speak(text: string, lang: 'zh-CN' | 'en-US' = 'zh-CN') {
    if (this.synth.speaking) {
      this.synth.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;

    // Explicitly find and set voice if available
    // This is critical because setting .lang alone is often ignored by browsers 
    // if the previously used voice (e.g. en-US from startup) is still active.
    const voices = this.synth.getVoices();
    if (voices.length > 0) {
      // Simple lookup: Exact match or Prefix match (zh-CN matching zh_CN or zh)
      const targetVoice = voices.find(v => v.lang === lang) || 
                          voices.find(v => v.lang.replace('_', '-').startsWith(lang.split('-')[0]));
      
      if (targetVoice) {
        utterance.voice = targetVoice;
      }
    }

    utterance.rate = 1.0;
    this.synth.speak(utterance);
  }
}

export const audioService = new AudioService();
