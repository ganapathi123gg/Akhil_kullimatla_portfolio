import { useState, useRef } from 'preact/hooks'

export function AwardModernCard({ award, index, onInspect }) {
  const cardRef = useRef(null)
  const [transformStyle, setTransformStyle] = useState('')
  const [spotlightPos, setSpotlightPos] = useState({ x: 50, y: 50 })

  const handleMouseMove = (e) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2

    // Max 7 degrees tilt for an ultra-smooth, premium 3D feel
    const rotateX = ((y - centerY) / centerY) * -6.5
    const rotateY = ((x - centerX) / centerX) * 6.5

    setTransformStyle(
      `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-6px) scale3d(1.02, 1.02, 1.02)`
    )
    setSpotlightPos({
      x: ((x / rect.width) * 100).toFixed(1),
      y: ((y / rect.height) * 100).toFixed(1),
    })
  }

  const handleMouseLeave = () => {
    setTransformStyle('perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px) scale3d(1, 1, 1)')
  }

  return (
    <article
      ref={cardRef}
      class="award-modern-card"
      style={{ transform: transformStyle }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      data-cursor="hover"
    >
      {/* Dynamic Cursor Spotlight Reflection */}
      <div
        class="award-card-spotlight"
        style={{
          background: `radial-gradient(circle 280px at ${spotlightPos.x}% ${spotlightPos.y}%, rgba(212, 175, 55, 0.18), transparent 70%)`,
        }}
      />

      {/* Top Header: Category Pill & Index */}
      <div class="award-card-header">
        <span class="award-category-pill">
          <span class="award-icon-emoji">{award.icon}</span>
          <span>{award.badge || award.category || 'HONOUR'}</span>
        </span>
        <span class="award-card-index">№ 0{index + 1}</span>
      </div>

      {/* High-End Trophy / Certificate Visual Stage */}
      <div
        class="award-media-stage"
        onClick={() => onInspect(index)}
        role="button"
        tabIndex={0}
        aria-label={`View award details for ${award.title}`}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onInspect(index)
          }
        }}
      >
        <img
          src={award.image}
          alt={award.title}
          class="award-media-img"
          loading="lazy"
        />
        <div class="award-media-gradient" />
        
        {/* Project Film Badge */}
        {award.film && (
          <span class="award-film-tag">{award.film}</span>
        )}

        {/* Hover Quick Inspect Pill */}
        <div class="award-inspect-badge">
          <span>Inspect Trophy</span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </div>
      </div>

      {/* Award Information Body */}
      <div class="award-card-body">
        <h4 class="award-title-main">{award.title}</h4>
        
        <p class="award-festival-sub">
          <span>{award.subtitle || award.festival}</span>
        </p>

        {award.description && (
          <p class="award-desc-text">{award.description}</p>
        )}

        {/* Director / Accreditations Box */}
        {award.role && (
          <div class="award-credits-box">
            <span>{award.role}</span>
          </div>
        )}
      </div>

      {/* Card Footer */}
      <div class="award-card-footer">
        <div class="award-verified-tag">
          <span class="award-verified-icon">✦</span>
          <span>{award.verified || 'Verified Laureate'}</span>
        </div>

        <button
          class="award-inspect-link-btn"
          onClick={() => onInspect(index)}
          aria-label={`Inspect ${award.title}`}
        >
          <span>View High-Res</span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
            <line x1="7" y1="17" x2="17" y2="7" />
            <polyline points="7 7 17 7 17 17" />
          </svg>
        </button>
      </div>

      {/* Corner Filigree Luxury Accents */}
      <div class="award-corner-tl" />
      <div class="award-corner-br" />
    </article>
  )
}
