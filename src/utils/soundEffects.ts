// Procedural Web Audio API Sound Effects (Zero External Assets Required)
class SoundFXManager {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  constructor() {
    // Check localStorage for mute preference
    const saved = localStorage.getItem('campus_signal_muted');
    if (saved !== null) {
      this.isMuted = saved === 'true';
    }
  }

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    localStorage.setItem('campus_signal_muted', String(this.isMuted));
    if (!this.isMuted) {
      this.playBeep(660, 0.08);
    }
    return this.isMuted;
  }

  // Generic tone generator
  private playBeep(freq: number, duration: number, type: OscillatorType = 'sine', gainVal = 0.1) {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch {
      // Audio autoplay policy catch
    }
  }

  // 1. Futuristic Radar Ping (5G Macro Beacon Pulse)
  public playRadarPing() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(440, this.ctx.currentTime + 0.35);

      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.35);
    } catch {}
  }

  // 2. 5G Massive MIMO Beam Lock (Harmonic Dual Chord)
  public playBeamLock() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      [523.25, 659.25, 783.99].forEach((freq, idx) => {
        setTimeout(() => {
          this.playBeep(freq, 0.18, 'triangle', 0.06);
        }, idx * 60);
      });
    } catch {}
  }

  // 3. Speed Test Acceleration Sweep (Dynamic pitch)
  public playSpeedSweep(progress: number) {
    if (this.isMuted) return;
    const minFreq = 300;
    const maxFreq = 1400;
    const freq = minFreq + (maxFreq - minFreq) * Math.max(0, Math.min(1, progress));
    this.playBeep(freq, 0.05, 'sine', 0.04);
  }

  // 4. Test Completion Triumph Fanfare (C-Major Triad Arpeggio)
  public playFanfare() {
    if (this.isMuted) return;
    try {
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, i) => {
        setTimeout(() => {
          this.playBeep(freq, i === notes.length - 1 ? 0.45 : 0.14, 'sine', 0.09);
        }, i * 90);
      });
    } catch {}
  }

  // 5. Wayfinder Turn / Step Navigation Chime
  public playNavChime() {
    if (this.isMuted) return;
    this.playBeep(784, 0.08, 'sine', 0.07);
    setTimeout(() => {
      this.playBeep(1046, 0.16, 'sine', 0.07);
    }, 70);
  }

  // 6. UI Button Click / Toggle
  public playClick() {
    if (this.isMuted) return;
    this.playBeep(1200, 0.02, 'sine', 0.03);
  }
}

export const soundFX = new SoundFXManager();
