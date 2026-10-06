import { useState, useEffect } from 'preact/hooks'
import { CREATOR } from '../data/creatorConfig'
import { AwardModernCard } from './AwardModernCard'
import '../styles/AwardsCards.css'

export function AwardsShowcase({ customAwards }) {
  const allAwards = customAwards || CREATOR.awards || []
  const [activeFilter, setActiveFilter] = useState('all')
  const [inspectIndex, setInspectIndex] = useState(null)

  // Filter categories
  const filteredAwards = allAwards.filter((award) => {
    if (activeFilter === 'all') return true
    return award.filterType === activeFilter
  })

  // Keyboard navigation for Lightbox Modal
  useEffect(() => {
    if (inspectIndex === null) return

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setInspectIndex(null)
      if (e.key === 'ArrowLeft') handlePrev()
      if (e.key === 'ArrowRight') handleNext()
    }

    window.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [inspectIndex, filteredAwards])

  const handlePrev = () => {
    setInspectIndex((prev) => (prev > 0 ? prev - 1 : filteredAwards.length - 1))
  }

  const handleNext = () => {
    setInspectIndex((prev) => (prev < filteredAwards.length - 1 ? prev + 1 : 0))
  }

  const trophyCount = allAwards.filter((a) => a.filterType === 'trophy').length
  const letterCount = allAwards.filter((a) => a.filterType === 'letter').length
  const recognitionCount = allAwards.filter((a) => a.filterType === 'recognition').length

  const currentModalAward = inspectIndex !== null ? filteredAwards[inspectIndex] : null

  return (
    <div class="awards-modern-container">
      {/* Category Filter Pills */}
      <div class="awards-filter-bar">
        <button
          class={`awards-filter-pill ${activeFilter === 'all' ? 'active' : ''}`}
          onClick={() => setActiveFilter('all')}
        >
          <span>All Recognitions</span>
          <span class="awards-filter-count">{allAwards.length}</span>
        </button>

        <button
          class={`awards-filter-pill ${activeFilter === 'trophy' ? 'active' : ''}`}
          onClick={() => setActiveFilter('trophy')}
        >
          <span>🏆 Official Trophies</span>
          <span class="awards-filter-count">{trophyCount}</span>
        </button>

        <button
          class={`awards-filter-pill ${activeFilter === 'letter' ? 'active' : ''}`}
          onClick={() => setActiveFilter('letter')}
        >
          <span>📜 Selection Letters</span>
          <span class="awards-filter-count">{letterCount}</span>
        </button>

        <button
          class={`awards-filter-pill ${activeFilter === 'recognition' ? 'active' : ''}`}
          onClick={() => setActiveFilter('recognition')}
        >
          <span>🌐 Digital & Press</span>
          <span class="awards-filter-count">{recognitionCount}</span>
        </button>
      </div>

      {/* 3D Modern Grid of Cards */}
      <div class="awards-modern-grid">
        {filteredAwards.map((award, idx) => (
          <AwardModernCard
            key={award.id || idx}
            award={award}
            index={idx}
            onInspect={(cardIdx) => setInspectIndex(cardIdx)}
          />
        ))}
      </div>

      {/* Full-Screen Cinema Award Lightbox Modal */}
      {currentModalAward && (
        <div class="award-modal-backdrop" onClick={() => setInspectIndex(null)}>
          <div
            class="award-modal-content"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            {/* Close Button */}
            <button
              class="award-modal-close-btn"
              onClick={() => setInspectIndex(null)}
              aria-label="Close Award Viewer"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            {/* Media Pane */}
            <div class="award-modal-media-pane">
              <img
                src={currentModalAward.image}
                alt={currentModalAward.title}
                class="award-modal-img"
              />
            </div>

            {/* Information Pane */}
            <div class="award-modal-info-pane">
              <div class="award-card-header" style={{ marginBottom: '14px' }}>
                <span class="award-category-pill">
                  <span class="award-icon-emoji">{currentModalAward.icon}</span>
                  <span>{currentModalAward.badge}</span>
                </span>
                <span class="award-card-index">№ 0{inspectIndex + 1} / 0{filteredAwards.length}</span>
              </div>

              <h3 class="award-title-main" style={{ fontSize: '24px', marginBottom: '8px' }}>
                {currentModalAward.title}
              </h3>

              <p class="award-festival-sub" style={{ fontSize: '13px', marginBottom: '16px' }}>
                {currentModalAward.subtitle || currentModalAward.festival}
              </p>

              {currentModalAward.film && (
                <div style={{ marginBottom: '14px' }}>
                  <span class="award-film-tag" style={{ position: 'static' }}>
                    Project: {currentModalAward.film}
                  </span>
                </div>
              )}

              <p class="award-desc-text" style={{ fontSize: '14px', lineHeight: '1.65', marginBottom: '18px' }}>
                {currentModalAward.description}
              </p>

              {currentModalAward.role && (
                <div class="award-credits-box" style={{ marginBottom: '22px' }}>
                  <span>{currentModalAward.role}</span>
                </div>
              )}

              <div class="award-verified-tag" style={{ marginBottom: '20px' }}>
                <span class="award-verified-icon">✦</span>
                <span>{currentModalAward.verified} • {currentModalAward.stats}</span>
              </div>

              {/* Navigation Arrows */}
              <div class="award-modal-nav">
                <button class="award-modal-nav-btn" onClick={handlePrev}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                  <span>Previous</span>
                </button>

                <button class="award-modal-nav-btn" onClick={handleNext}>
                  <span>Next</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
