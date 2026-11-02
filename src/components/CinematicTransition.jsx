import '../styles/CinematicTransition.css'

/**
 * Editorial Transition Badge
 * Minimalist luxury typography displayed at the apex of the screen wipe,
 * inspired by modern 2026 Awwwards & Pinterest design references.
 */
function EditorialBadge({ number, tag, title, icon = '◆' }) {
  return (
    <div class="trans-editorial-badge" aria-hidden="true">
      <div class="trans-badge-monogram">{icon}</div>
      <div class="trans-badge-eyebrow">
        <span class="trans-badge-num">{number}</span>
        <span class="trans-badge-divider">//</span>
        <span class="trans-badge-tag">{tag}</span>
      </div>
      <div class="trans-badge-title">{title}</div>
      <div class="trans-badge-line">
        <div class="trans-badge-line-fill" />
      </div>
    </div>
  )
}

/**
 * 1. Staggered Multi-Column Velvet Slats Transition
 * Inspired by Pinterest Pin 1 & 2: Editorial Web Layout & Parallax Wipe
 * Target: About (and navigating to About)
 */
function StaggeredSlatsTransition({ active }) {
  if (!active) return null
  return (
    <div class="trans-stage-slats" aria-hidden="true">
      <div class="slat-curtain slat-col-1">
        <div class="slat-gold-hem" />
        <div class="slat-texture-mesh" />
      </div>
      <div class="slat-curtain slat-col-2">
        <div class="slat-gold-hem" />
        <div class="slat-texture-mesh" />
      </div>
      <div class="slat-curtain slat-col-3">
        <div class="slat-gold-hem" />
        <div class="slat-texture-mesh" />
      </div>
      <div class="slat-curtain slat-col-4">
        <div class="slat-gold-hem" />
        <div class="slat-texture-mesh" />
      </div>
      <div class="slat-curtain slat-col-5">
        <div class="slat-gold-hem" />
        <div class="slat-texture-mesh" />
      </div>
      <EditorialBadge
        number="01"
        tag="DIRECTOR & STORYTELLER"
        title="ABOUT AKHIL"
        icon="◆"
      />
    </div>
  )
}

/**
 * 2. Diagonal Kinetic Blade & Parallax Slice Wipe
 * Inspired by Pinterest Pin 3 & 4: Creative Photo Gallery & Travel Slider Kinetic Slice
 * Target: Work (and navigating to Work)
 */
function DiagonalBladeTransition({ active }) {
  if (!active) return null
  return (
    <div class="trans-stage-blade" aria-hidden="true">
      {/* Ambient background blur flare */}
      <div class="blade-flare-ambient" />
      {/* Secondary translucent amber trailing blade */}
      <div class="blade-runner blade-trail" />
      {/* Master titanium onyx blade */}
      <div class="blade-runner blade-master">
        <div class="blade-light-streak" />
      </div>
      <EditorialBadge
        number="02"
        tag="CURATED REPERTOIRE"
        title="SELECTED WORKS"
        icon="▶"
      />
    </div>
  )
}

/**
 * 3. Anamorphic Cinema Letterbox Horizon Wipe
 * Inspired by Pinterest Pin 5: Smart Home / Cinema Minimalist Screen Transition
 * Target: Showreel (and navigating to Showreel)
 */
function CinemaLetterboxTransition({ active }) {
  if (!active) return null
  return (
    <div class="trans-stage-letterbox" aria-hidden="true">
      {/* Top 2.39:1 Cinema Matte Bar */}
      <div class="letterbox-curtain curtain-top">
        <div class="letterbox-gold-rim" />
      </div>
      {/* Anamorphic Cyan-Gold Horizon Optical Flare */}
      <div class="letterbox-anamorphic-core">
        <div class="letterbox-flare-streak" />
        <div class="letterbox-flare-halo" />
      </div>
      {/* Bottom 2.39:1 Cinema Matte Bar */}
      <div class="letterbox-curtain curtain-bottom">
        <div class="letterbox-gold-rim" />
      </div>
      <EditorialBadge
        number="03"
        tag="4K CINEMATIC CUT"
        title="MASTER SHOWREEL"
        icon="✦"
      />
    </div>
  )
}

/**
 * 4. Architectural Luxury Dual-Gate Split Reveal
 * Inspired by Pinterest Pin 6: Real Estate & Architectural Studio UI Transition
 * Target: Contact (and navigating to Contact)
 */
function SplitCurtainTransition({ active }) {
  if (!active) return null
  return (
    <div class="trans-stage-split" aria-hidden="true">
      {/* Left Monolithic Architectural Wing */}
      <div class="split-wing wing-left">
        <div class="wing-gold-border" />
        <div class="wing-inner-glow" />
      </div>
      {/* Vertical Center Laser Lock */}
      <div class="split-center-laser-line" />
      {/* Right Monolithic Architectural Wing */}
      <div class="split-wing wing-right">
        <div class="wing-gold-border" />
        <div class="wing-inner-glow" />
      </div>
      <EditorialBadge
        number="04"
        tag="DIRECTOR COLLABORATION"
        title="GET IN TOUCH"
        icon="✉"
      />
    </div>
  )
}

/**
 * Determine the motion signature class pair for section content
 */
export function getTransitionClassPair(fromRoute, toRoute) {
  if (toRoute === 'home') {
    return { exitClass: 'trans-exit-smoke', enterClass: 'trans-enter-smoke' }
  }
  if (toRoute === 'about') {
    return { exitClass: 'trans-exit-slats', enterClass: 'trans-enter-slats' }
  }
  if (toRoute === 'work') {
    return { exitClass: 'trans-exit-blade', enterClass: 'trans-enter-blade' }
  }
  if (toRoute === 'showreel') {
    return { exitClass: 'trans-exit-letterbox', enterClass: 'trans-enter-letterbox' }
  }
  if (toRoute === 'contact') {
    return { exitClass: 'trans-exit-split', enterClass: 'trans-enter-split' }
  }
  return { exitClass: 'trans-exit-default', enterClass: 'trans-enter-default' }
}

/**
 * CinematicTransitionWrapper
 * Coordinates the 4 refined, Pinterest-inspired luxury transition wipes
 * while wrapping the continuous portfolio sections.
 */
export function CinematicTransitionWrapper({
  isTransitioning,
  transitionType = 'slats',
  targetRoute = 'about',
  children,
}) {
  return (
    <div class="cinematic-stage">
      {/* 1. To About: Staggered Multi-Column Velvet Slats (Pin 1 & 2) */}
      <StaggeredSlatsTransition
        active={isTransitioning && transitionType === 'slats'}
      />

      {/* 2. To Work: Diagonal Kinetic Blade & Parallax Slice (Pin 3 & 4) */}
      <DiagonalBladeTransition
        active={isTransitioning && transitionType === 'blade'}
      />

      {/* 3. To Showreel: Anamorphic Cinema Letterbox Horizon Wipe (Pin 5) */}
      <CinemaLetterboxTransition
        active={isTransitioning && transitionType === 'letterbox'}
      />

      {/* 4. To Contact: Dual Golden Split Curtain Reveal (Pin 6) */}
      <SplitCurtainTransition
        active={isTransitioning && transitionType === 'split'}
      />

      {/* Main Continuous Stage Container */}
      <div class="cinematic-continuous-container">{children}</div>
    </div>
  )
}
