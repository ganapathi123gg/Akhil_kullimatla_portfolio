import { useEffect, useRef } from 'preact/hooks'
import '../styles/TrophyDetailsPage.css'

export function TrophyDetailsPage({
  award,
  allAwards = [],
  onClose,
  onSelectAward,
  onExploreVideo,
}) {
  const containerRef = useRef(null)

  if (!award) return null

  // Find index of current award
  const currentIndex = allAwards.findIndex(
    (a) => (a.id && a.id === award.id) || a.title === award.title
  )
  const safeIndex = currentIndex !== -1 ? currentIndex : 0
  const totalCount = allAwards.length || 1

  const handlePrev = () => {
    if (allAwards.length <= 1) return
    const prevIdx = safeIndex > 0 ? safeIndex - 1 : allAwards.length - 1
    onSelectAward && onSelectAward(allAwards[prevIdx])
  }

  const handleNext = () => {
    if (allAwards.length <= 1) return
    const nextIdx = safeIndex < allAwards.length - 1 ? safeIndex + 1 : 0
    onSelectAward && onSelectAward(allAwards[nextIdx])
  }

  // Keyboard navigation & body scroll lock
  useEffect(() => {
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose && onClose()
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        handlePrev()
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        handleNext()
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    if (containerRef.current) {
      containerRef.current.focus()
    }

    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [safeIndex, allAwards])

  // Extract producer & director credits cleanly
  const roleText = award.role || 'Director: Ugesh Kullimetla | Producer: Ramu Kullimetla'
  const roleParts = roleText.split('|').map((s) => s.trim())

  return (
    <div
      ref={containerRef}
      class="trophy-details-page-root"
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      aria-label={`Trophy Inspection: ${award.title}`}
    >
      {/* Background Volumetric Lighting */}
      <div class="trophy-ambient-spotlight" />
      <div class="trophy-ambient-grid" />

      {/* Sticky Top Header Navigation */}
      <header class="trophy-page-header">
        <div class="trophy-header-inner">
          {/* Back to Awards Button */}
          <button
            type="button"
            class="trophy-back-action-btn"
            onClick={onClose}
            aria-label="Back to Awards and Recognition Section"
            data-cursor="hover"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            <span class="trophy-back-btn-text">BACK TO AWARDS</span>
          </button>

          {/* Breadcrumb Navigation */}
          <nav class="trophy-breadcrumb" aria-label="Breadcrumb">
            <span class="breadcrumb-item">ABOUT</span>
            <span class="breadcrumb-sep">/</span>
            <span class="breadcrumb-item">AWARDS & RECOGNITION</span>
            <span class="breadcrumb-sep">/</span>
            <span class="breadcrumb-item active">TROPHY INSPECTION</span>
          </nav>

          {/* Header Controls: Counter + Close X */}
          <div class="trophy-header-controls">
            <span class="trophy-index-counter">
              № 0{safeIndex + 1} OF 0{totalCount}
            </span>
            <button
              type="button"
              class="trophy-close-x-btn"
              onClick={onClose}
              aria-label="Close Trophy Inspection View"
              data-cursor="hover"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Main Showcase Grid (Zero empty space, immediate display) */}
      <main class="trophy-page-main">
        <div class="trophy-showcase-grid">
          {/* Left Column: Museum Pedestal Visual Showcase */}
          <section class="trophy-stage-column" aria-label="Award Visual Stage">
            <div class="trophy-pedestal-card">
              {/* Outer Golden Geometric Corner Accents */}
              <div class="trophy-corner-filigree top-left" />
              <div class="trophy-corner-filigree bottom-right" />

              {/* Offset Gold Border Accent */}
              <div class="trophy-frame-accent" />

              {/* Top Media Tags */}
              <div class="trophy-stage-badges">
                <span class="trophy-stage-category-pill">
                  <span class="pill-icon">{award.icon || '🏆'}</span>
                  <span>{award.badge || award.category || 'OFFICIAL LAUREL'}</span>
                </span>
                {award.year && (
                  <span class="trophy-stage-year-pill">{award.year}</span>
                )}
              </div>

              {/* High-Resolution Media Container with Crisp Aspect Ratio */}
              <div class="trophy-media-container" data-cursor="hover">
                <div class="trophy-media-inner">
                  <img
                    src={award.image}
                    alt={award.title}
                    class="trophy-highres-img"
                    loading="eager"
                  />
                  {/* Subtle Cinematic Shimmer Sheen */}
                  <div class="trophy-shimmer-sheen" />
                </div>

                {/* Honoured Film Tag Badge */}
                {award.film && (
                  <div class="trophy-project-pill">
                    <span class="pill-spark">●</span>
                    <span>{award.film}</span>
                  </div>
                )}
              </div>

              {/* Carousel Switcher Controls inside Pedestal */}
              {allAwards.length > 1 && (
                <div class="trophy-stage-nav-bar">
                  <button
                    type="button"
                    class="stage-nav-btn prev-btn"
                    onClick={handlePrev}
                    aria-label="View Previous Award"
                    data-cursor="hover"
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4">
                      <polyline points="15 18 9 12 15 6" />
                    </svg>
                    <span>PREV</span>
                  </button>

                  {/* Interactive Pagination Indicator Dots */}
                  <div class="stage-nav-dots" role="tablist" aria-label="Awards Switcher">
                    {allAwards.map((a, idx) => (
                      <button
                        key={a.id || idx}
                        type="button"
                        role="tab"
                        aria-selected={idx === safeIndex}
                        aria-label={`Jump to award 0${idx + 1}: ${a.title}`}
                        class={`stage-nav-dot ${idx === safeIndex ? 'active' : ''}`}
                        onClick={() => onSelectAward && onSelectAward(allAwards[idx])}
                        data-cursor="hover"
                      />
                    ))}
                  </div>

                  <button
                    type="button"
                    class="stage-nav-btn next-btn"
                    onClick={handleNext}
                    aria-label="View Next Award"
                    data-cursor="hover"
                  >
                    <span>NEXT</span>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </button>
                </div>
              )}
            </div>

            {/* Keyboard Navigation Helper Pill */}
            <div class="trophy-keyboard-hint" aria-hidden="true">
              <span>Use</span>
              <kbd class="key-cap">←</kbd>
              <kbd class="key-cap">→</kbd>
              <span>keys to browse awards</span>
              <span class="hint-sep">•</span>
              <kbd class="key-cap">ESC</kbd>
              <span>to close</span>
            </div>
          </section>

          {/* Right Column: Acclaim, Citation & Accreditations */}
          <section class="trophy-info-column" aria-label="Award Citation and Accreditations">
            {/* Category Subhead */}
            <div class="trophy-kicker-row">
              <span class="trophy-kicker-text">
                {award.category ? award.category.toUpperCase() : 'HONOUR & RECOGNITION'}
              </span>
              <span class="kicker-sep">/</span>
              <span class="trophy-edition-tag">JURY EDITION 2026</span>
            </div>

            {/* Main Award Title */}
            <h1 class="trophy-headline-title">{award.title}</h1>

            {/* Festival / Organization Subtitle */}
            <h2 class="trophy-festival-subtitle">
              {award.subtitle || award.festival}
            </h2>

            {/* Structured Directorial & Production Credits Box */}
            <div class="trophy-credits-card">
              <div class="credits-header">
                <span class="credits-tag">OFFICIAL ACCREDITATION</span>
                {award.film && (
                  <span class="credits-film-chip">{award.film}</span>
                )}
              </div>

              <div class="credits-list">
                {roleParts.map((part, pIdx) => {
                  const [label, val] = part.includes(':') ? part.split(':') : ['', part]
                  return (
                    <div class="credit-row" key={pIdx}>
                      {label && <span class="credit-label">{label.trim().toUpperCase()}:</span>}
                      <span class={`credit-val ${pIdx === 0 ? 'highlight-gold' : ''}`}>
                        {(val || label).trim()}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Official Citation & Acclaim Card */}
            <div class="trophy-citation-box">
              <div class="citation-watermark" aria-hidden="true">“</div>
              <div class="citation-tag">OFFICIAL JURY CITATION & ACCLAIM</div>
              <p class="trophy-citation-text">{award.description}</p>
            </div>

            {/* Verification Laurel & Authenticity Badges */}
            <div class="trophy-verification-card">
              <div class="verification-badge">
                <span class="laurel-icon">✦</span>
                <span class="laurel-title">{award.verified || 'Official Jury Award'}</span>
                <span class="laurel-dot">•</span>
                <span class="laurel-stats">{award.stats || 'Winner Laurel Trophy'}</span>
              </div>
              <div class="verification-seal-note">
                Festingo Independent Film Network · Verified Authenticity
              </div>
            </div>

            {/* Bottom Primary Actions */}
            <div class="trophy-action-toolbar">
              <button
                type="button"
                class="btn-gold-fill trophy-primary-return-btn"
                onClick={onClose}
                data-cursor="hover"
              >
                <span>← BACK TO AWARDS</span>
              </button>

              {award.film && onExploreVideo && (
                <button
                  type="button"
                  class="btn-gold-outline trophy-secondary-video-btn"
                  onClick={() => onExploreVideo(award.film)}
                  data-cursor="hover"
                >
                  <span class="video-play-symbol">▷</span>
                  <span>WATCH PROJECT STREAM</span>
                </button>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
