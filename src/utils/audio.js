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

  playTransitionSound(type) {
    if (!this.enabled) return
    try {
      this.init()
      if (!this.audioCtx) return

      const now = this.audioCtx.currentTime

      if (type === 'smoke') {
        // Soft atmospheric whoosh with low filter
        const osc = this.audioCtx.createOscillator()
        const filter = this.audioCtx.createBiquadFilter()
        const gain = this.audioCtx.createGain()

        osc.type = 'triangle'
        osc.frequency.setValueAtTime(140, now)
        osc.frequency.exponentialRampToValueAtTime(60, now + 0.45)

        filter.type = 'lowpass'
        filter.frequency.setValueAtTime(350, now)
        filter.frequency.exponentialRampToValueAtTime(120, now + 0.45)

        gain.gain.setValueAtTime(0.06, now)
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45)

        osc.connect(filter)
        filter.connect(gain)
        gain.connect(this.audioCtx.destination)

        osc.start(now)
        osc.stop(now + 0.45)
      } else if (type === 'slats' || type === 'lens-iris') {
        // Multi-column staggered velvet acoustic click/glide
        [0, 0.03, 0.06, 0.09, 0.12].forEach((delay, i) => {
          const osc = this.audioCtx.createOscillator()
          const gain = this.audioCtx.createGain()
          osc.type = 'sine'
          osc.frequency.setValueAtTime(900 - i * 80, now + delay)
          osc.frequency.exponentialRampToValueAtTime(320, now + delay + 0.03)
          gain.gain.setValueAtTime(0.025, now + delay)
          gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.03)
          osc.connect(gain)
          gain.connect(this.audioCtx.destination)
          osc.start(now + delay)
          osc.stop(now + delay + 0.03)
        })
      } else if (type === 'blade' || type === 'film-strip') {
        // Kinetic metallic blade slice whoosh with crisp high edge
        const osc = this.audioCtx.createOscillator()
        const filter = this.audioCtx.createBiquadFilter()
        const gain = this.audioCtx.createGain()
        osc.type = 'sawtooth'
        osc.frequency.setValueAtTime(1400, now)
        osc.frequency.exponentialRampToValueAtTime(180, now + 0.22)
        filter.type = 'bandpass'
        filter.frequency.setValueAtTime(1200, now)
        filter.Q.setValueAtTime(3, now)
        gain.gain.setValueAtTime(0.04, now)
        gain.gain.exponentialRampToValueAtTime(0.0005, now + 0.22)
        osc.connect(filter)
        filter.connect(gain)
        gain.connect(this.audioCtx.destination)
        osc.start(now)
        osc.stop(now + 0.22)
      } else if (type === 'letterbox' || type === 'projector-beam') {
        // Deep anamorphic cinema horizon resonance
        const freqs = [380, 570, 760]
        freqs.forEach((freq, i) => {
          const osc = this.audioCtx.createOscillator()
          const gain = this.audioCtx.createGain()
          osc.type = 'sine'
          osc.frequency.setValueAtTime(freq, now + i * 0.02)
          osc.frequency.exponentialRampToValueAtTime(freq * 0.75, now + i * 0.02 + 0.38)
          gain.gain.setValueAtTime(0.03, now + i * 0.02)
          gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.02 + 0.38)
          osc.connect(gain)
          gain.connect(this.audioCtx.destination)
          osc.start(now + i * 0.02)
          osc.stop(now + i * 0.02 + 0.38)
        })
      } else if (type === 'split' || type === 'golden-portal') {
        // Luxury split velvet gate & golden harmonic chord
        const freqs = [440, 554.37, 659.25, 880]
        freqs.forEach((freq, i) => {
          const osc = this.audioCtx.createOscillator()
          const gain = this.audioCtx.createGain()
          osc.type = 'triangle'
          osc.frequency.setValueAtTime(freq, now + i * 0.04)
          gain.gain.setValueAtTime(0.03, now + i * 0.04)
          gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.04 + 0.45)
          osc.connect(gain)
          gain.connect(this.audioCtx.destination)
          osc.start(now + i * 0.04)
          osc.stop(now + i * 0.04 + 0.45)
        })
      } else {
        this.playTick()
      }
    } catch (e) {
      // Ignore audio policy issues
    }
  }
}

export const soundManager = new SoundManager()
