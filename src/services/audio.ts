import { formatTTSContent, type TTSPayload } from './ttsFormatter';

class AudioService {
  private audioContext: AudioContext | null = null;
  private synth: SpeechSynthesis = window.speechSynthesis;
  private selectedVoice: SpeechSynthesisVoice | null = null;

  private initContext() {
    if (!this.audioContext) {
      const AudioContextCtor =
        window.AudioContext ||
        (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextCtor) return;
      this.audioContext = new AudioContextCtor();
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

  public getVoices(): SpeechSynthesisVoice[] {
    return this.synth.getVoices();
  }

  public setVoice(voiceURI: string) {
    const voices = this.getVoices();
    const voice = voices.find(v => v.voiceURI === voiceURI);
    if (voice) {
      this.selectedVoice = voice;
    }
  }

  public format(payload: TTSPayload): string {
    const voiceURI = this.selectedVoice ? this.selectedVoice.voiceURI : '';
    return formatTTSContent(payload, voiceURI);
  }

  public speak(payload: string | TTSPayload, lang: 'zh-CN' | 'en-US' = 'zh-CN') {
    if (this.synth.speaking) {
      this.synth.cancel();
    }

    const voiceURI = this.selectedVoice ? this.selectedVoice.voiceURI : '';
    const textToSpeak = formatTTSContent(payload, voiceURI);

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = lang;
    utterance.rate = 1.0;
    
    if (this.selectedVoice) {
      utterance.voice = this.selectedVoice;
    }

    this.synth.speak(utterance);
  }
}

export const audioService = new AudioService();
