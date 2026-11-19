// Clean Web Audio API tactile game sound synthesizer (zero external audio dependencies)

class SoundEffectsManager {
  private ctx: AudioContext | null = null;
  private enabled = true;

  public setEnabled(value: boolean) {
    this.enabled = value;
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  private getContext(): AudioContext | null {
    if (!this.enabled || typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  private playTone(
    freq: number,
    duration: number,
    type: OscillatorType = 'sine',
    volume = 0.06,
    delay = 0
  ) {
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.exponentialRampToValueAtTime(volume, now + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + duration + 0.02);
  }

  public playSelect() {
    this.playTone(523.25, 0.09, 'triangle', 0.055, 0);
    this.playTone(659.25, 0.11, 'sine', 0.045, 0.04);
  }

  public playStageComplete() {
    this.playTone(523.25, 0.12, 'triangle', 0.05, 0);
    this.playTone(659.25, 0.12, 'triangle', 0.05, 0.08);
    this.playTone(783.99, 0.18, 'sine', 0.06, 0.16);
  }

  public playVictory() {
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((note, idx) => {
      this.playTone(note, idx === notes.length - 1 ? 0.35 : 0.14, 'triangle', 0.06, idx * 0.09);
    });
  }

  public playBack() {
    this.playTone(392.0, 0.09, 'sine', 0.04, 0);
  }
}

export const soundFX = new SoundEffectsManager();
