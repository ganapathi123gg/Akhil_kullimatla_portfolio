// Synthesized micro-sound effects using Web Audio API for luxury tactile feedback
// Zero external audio files required, completely reliable and instant

class SoundManager {
  constructor() {
    this.audioCtx = null
    this.enabled = true
  }

  init() {
    if (!this.audioCtx && typeof window !== 'undefined') {
      const AudioContext = window.AudioContext || window.webkitAudioContext
      if (AudioContext) {
        this.audioCtx = new AudioContext()
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume()
    }
  }

  toggle() {
    this.enabled = !this.enabled
    if (this.enabled) {
      this.playTick()
    }
    return this.enabled
  }

  playTick() {
    if (!this.enabled) return
    try {
      this.init()
      if (!this.audioCtx) return

      const osc = this.audioCtx.createOscillator()
      const gain = this.audioCtx.createGain()

      osc.type = 'sine'
      osc.frequency.setValueAtTime(1200, this.audioCtx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(400, this.audioCtx.currentTime + 0.03)

      gain.gain.setValueAtTime(0.04, this.audioCtx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.03)

      osc.connect(gain)
      gain.connect(this.audioCtx.destination)

      osc.start()
      osc.stop(this.audioCtx.currentTime + 0.03)
    } catch (e) {
      // Ignore audio autoplay restrictions
    }
  }

  playPop() {
    if (!this.enabled) return
    try {
      this.init()
      if (!this.audioCtx) return

      const osc = this.audioCtx.createOscillator()
      const gain = this.audioCtx.createGain()

      osc.type = 'triangle'
      osc.frequency.setValueAtTime(600, this.audioCtx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(150, this.audioCtx.currentTime + 0.06)

      gain.gain.setValueAtTime(0.06, this.audioCtx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.06)

      osc.connect(gain)
      gain.connect(this.audioCtx.destination)

      osc.start()
      osc.stop(this.audioCtx.currentTime + 0.06)
    } catch (e) {
      // Ignore
    }
  }

  playChime() {
    if (!this.enabled) return
    try {
      this.init()
      if (!this.audioCtx) return

      const now = this.audioCtx.currentTime
      const notes = [523.25, 659.25, 783.99] // C5, E5, G5 chord

      notes.forEach((freq, i) => {
        const osc = this.audioCtx.createOscillator()
        const gain = this.audioCtx.createGain()

        osc.type = 'sine'
        osc.frequency.setValueAtTime(freq, now + i * 0.04)

        gain.gain.setValueAtTime(0.03, now + i * 0.04)
        gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.04 + 0.25)

        osc.connect(gain)
        gain.connect(this.audioCtx.destination)

        osc.start(now + i * 0.04)
        osc.stop(now + i * 0.04 + 0.25)
      })
    } catch (e) {
      // Ignore
    }
  }
}

export const soundManager = new SoundManager()
