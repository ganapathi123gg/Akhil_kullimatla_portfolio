import { useEffect, useState, useRef } from 'preact/hooks'
import '../styles/CinematicTransition.css'

/**
 * Determine the cinematic motion signature based on route transition pair
 */
export function getTransitionClassPair(fromRoute, toRoute) {
  if (!fromRoute || fromRoute === toRoute) {
    return { exitClass: 'trans-exit-default', enterClass: 'trans-enter-default' }
  }

  // 1. Home -> About (Camera Push / Depth Transition)
  if (fromRoute === 'home' && toRoute === 'about') {
    return { exitClass: 'trans-exit-depth-push', enterClass: 'trans-enter-depth-push' }
  }

  // 2. About -> Work (Cinematic Film-Strip Movement)
  if (fromRoute === 'about' && toRoute === 'work') {
    return { exitClass: 'trans-exit-film-strip', enterClass: 'trans-enter-film-strip' }
  }

  // 3. Work -> About (Reverse Film-Strip)
  if (fromRoute === 'work' && toRoute === 'about') {
    return { exitClass: 'trans-exit-film-reverse', enterClass: 'trans-enter-film-reverse' }
  }

  // 4. Work -> Showreel (Stage Aperture Reveal)
  if (fromRoute === 'work' && toRoute === 'showreel') {
    return { exitClass: 'trans-exit-stage-reveal', enterClass: 'trans-enter-stage-reveal' }
  }

  // 5. Showreel -> Work (Return to Collection)
  if (fromRoute === 'showreel' && toRoute === 'work') {
    return { exitClass: 'trans-exit-film-reverse', enterClass: 'trans-enter-film-strip' }
  }

  // 6. Any Page -> Contact (Curtain / Center Reveal)
  if (toRoute === 'contact') {
    return { exitClass: 'trans-exit-curtain', enterClass: 'trans-enter-curtain' }
  }

  // 7. Any Page -> Home (Cinematic Zoom-Out Stage Reset)
  if (toRoute === 'home') {
    return { exitClass: 'trans-exit-zoom-reset', enterClass: 'trans-enter-zoom-reset' }
  }

  // Default fallback
  return { exitClass: 'trans-exit-default', enterClass: 'trans-enter-default' }
}

/**
 * CinematicTransitionWrapper
 * Coordinates cinematic exit, transition veil overlay, scroll reset, and staggered entrance
 */
export function CinematicTransitionWrapper({
  currentRoute,
  previousRoute,
  isTransitioning,
  transitionPhase, // 'idle' | 'exiting' | 'entering'
  children,
}) {
  const { exitClass, enterClass } = getTransitionClassPair(previousRoute, currentRoute)

  let animationClass = ''
  if (transitionPhase === 'exiting') {
    animationClass = exitClass
  } else if (transitionPhase === 'entering') {
    animationClass = enterClass
  }

  return (
    <div class="cinematic-stage">
      {/* Cinematic Transition Veil Overlay with Letterbox Mattes and Golden Scanner */}
      <div
        class={`cinematic-veil-overlay ${isTransitioning ? 'active' : ''}`}
        aria-hidden="true"
      >
        <div class="cinematic-matte-bar" />
        <div class="cinematic-shimmer-sweep" />
        <div class="cinematic-matte-bar" />
      </div>

      {/* Main Scene Container */}
      <div
        class={`cinematic-scene ${animationClass} ${
          isTransitioning ? 'is-animating' : ''
        } ${transitionPhase === 'entering' ? 'is-entering' : ''}`}
        key={currentRoute}
      >
        {children}
      </div>
    </div>
  )
}
