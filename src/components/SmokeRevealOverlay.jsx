import { useState, useEffect, useRef } from 'preact/hooks'
import { soundManager } from '../utils/audio'
import '../styles/SmokeReveal.css'

/**
 * SmokeRevealOverlay
 * Renders an immersive, volumetric cinematic gold & dark smoke reveal.
 * Used on initial website launch and whenever navigating to the Home scene.
 */
export function SmokeRevealOverlay({
  isActive,
  isInitial = false,
  onComplete,
}) {
  const [phase, setPhase] = useState(isActive ? 'billowing' : 'cleared')
  const timer1Ref = useRef(null)
  const timer2Ref = useRef(null)

  useEffect(() => {
    if (!isActive) {
      setPhase('cleared')
      return
    }

    setPhase('billowing')

    // Timing profile: Initial page opening has a majestic cinematic intro,
    // subsequent in-page navigations are snappier.
    const holdDuration = isInitial ? 800 : 200
    const dissipateDuration = isInitial ? 1000 : 750

    if (timer1Ref.current) clearTimeout(timer1Ref.current)
    if (timer2Ref.current) clearTimeout(timer2Ref.current)

    // Advance to dissipating phase
    timer1Ref.current = setTimeout(() => {
      setPhase('dissipating')

      // Complete and clear
      timer2Ref.current = setTimeout(() => {
        setPhase('cleared')
        if (onComplete) onComplete()
      }, dissipateDuration)
    }, holdDuration)

    return () => {
      if (timer1Ref.current) clearTimeout(timer1Ref.current)
      if (timer2Ref.current) clearTimeout(timer2Ref.current)
    }
  }, [isActive, isInitial])

  // Allow clicking anywhere to immediately expedite smoke dissipation
  const handleExpedite = () => {
    if (phase === 'billowing') {
      if (timer1Ref.current) clearTimeout(timer1Ref.current)
      if (timer2Ref.current) clearTimeout(timer2Ref.current)
      setPhase('dissipating')
      timer2Ref.current = setTimeout(() => {
        setPhase('cleared')
        if (onComplete) onComplete()
      }, 700)
    }
  }

  if (phase === 'cleared') {
    return null
  }

  return (
    <div
      class={`smoke-reveal-stage phase-${phase} ${isInitial && phase === 'billowing' ? 'clickable-skip' : ''}`}
      onClick={handleExpedite}
      aria-hidden="true"
    >
      {/* Deep Atmosphere Base */}
      <div class="smoke-ambient-backdrop" />

      {/* Central Volumetric Golden Spotlight */}
      <div class="smoke-golden-spotlight" />

      {/* Multi-layered Organic Smoke Plumes */}
      <div class="smoke-cloud-layer">
        <div class="smoke-plume plume-1" />
        <div class="smoke-plume plume-2" />
        <div class="smoke-plume plume-3" />
        <div class="smoke-plume plume-4" />
        <div class="smoke-plume plume-gold-center" />
      </div>

      {/* Floating Golden Micro-Embers */}
      <div class="smoke-embers-container">
        {[...Array(16)].map((_, i) => (
          <span key={i} class={`smoke-ember ember-${i + 1}`} />
        ))}
      </div>

      {/* Central Director Branding in Smoke */}
      <div class="smoke-branding-container">
        <div class="smoke-brand-crest">
          <span class="smoke-brand-symbol">◈</span>
          <h1 class="smoke-brand-title">AKHIL</h1>
          <div class="smoke-brand-divider">
            <span class="divider-line" />
            <span class="divider-dot">◆</span>
            <span class="divider-line" />
          </div>
          <p class="smoke-brand-subtitle">DIRECTOR · VISUAL STORYTELLER</p>
          {isInitial && phase === 'billowing' && (
            <span class="smoke-hint-text">CLICK TO ENTER</span>
          )}
        </div>
      </div>
    </div>
  )
}

