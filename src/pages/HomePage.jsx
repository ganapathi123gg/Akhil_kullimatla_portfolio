import { useEffect, useState, useRef } from 'preact/hooks'
import { CREATOR } from '../data/creatorConfig'
import heroPortrait from '../assets/img_3.png'
import signatureBanner from '../assets/signature_baner_updated.png'
import { MarqueeShowcase } from '../components/MarqueeShowcase'

export function HomePage({ setActivePage, setCursorState, onSelectImage, onOpenVideo }) {
  // 3D Tilt state for hero card
  const cardRef = useRef(null)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })

  const handleCardMouseMove = (e) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    const factor = 18
    setTilt({ x: -(y / rect.height) * factor, y: (x / rect.width) * factor })
  }

  const handleCardMouseLeave = () => {
    setTilt({ x: 0, y: 0 })
    setCursorState?.(null)
  }

  return (
    <div class="page-view home-page page-transition">
      {/* =========================================================================
          HERO SECTION (Matches Figma Home.png & Home Mobile.png)
          ========================================================================= */}
      <section class="hero-section">
        <div class="container hero-grid">
          {/* Left Hero Content */}
          <div class="hero-text-col">
            <div class="section-tag">{CREATOR.tagline}</div>

            <h1 class="hero-main-title">
              {CREATOR.heroHeading} <span class="shimmer-text">{CREATOR.heroHighlight}</span>
            </h1>

            <p class="hero-description">
              {CREATOR.heroDescription}
            </p>

            <div class="hero-cta-group">
              <button
                class="btn-gold-fill"
                onClick={() => setActivePage('work')}
                onMouseEnter={() => setCursorState?.({ type: 'pointer' })}
                onMouseLeave={() => setCursorState?.(null)}
              >
                <span>→ VIEW MY WORK</span>
              </button>

              <button
                class="btn-gold-outline"
                onClick={() => setActivePage('contact')}
                onMouseEnter={() => setCursorState?.({ type: 'pointer' })}
                onMouseLeave={() => setCursorState?.(null)}
              >
                <span>COLLABORATE</span>
              </button>
            </div>

            <div class="hero-scroll-indicator">
              <span class="scroll-arrow">⌄</span>
              <span class="scroll-label">SCROLL</span>
              <span class="scroll-divider">|</span>
            </div>
          </div>

          {/* Right Hero Visual Card */}
          <div class="hero-visual-col">
            <div
              ref={cardRef}
              class="hero-cinematic-card"
              style={{
                transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
              }}
              onMouseMove={handleCardMouseMove}
              onMouseLeave={handleCardMouseLeave}
              onMouseEnter={() => setCursorState?.({ type: 'view' })}
              onClick={() => onSelectImage({ img: heroPortrait, title: `${CREATOR.name} — Editorial Portrait` }, 0)}
            >
              {/* Outer decorative gold offset frame (thickness 4px stroke) */}
              <div class="card-gold-frame-accent" />

              {/* Portrait Image */}
              <img
                src={heroPortrait}
                alt={`${CREATOR.name} - Portrait`}
                class="hero-portrait-img"
              />

              {/* Film Grain & Cinematic Sweep Light */}
              <div class="card-film-sweep" />
              <div class="hero-image-spotlight" aria-hidden="true" />
              <div class="card-vignette-overlay" />

              {/* Floating 12 Awards Badge */}
              <div class="floating-awards-badge">
                <span class="badge-accent-line" />
                <span class="badge-text">{CREATOR.heroBadge}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          STATS COUNTER BAR (Matches Figma Home.png)
          ========================================================================= */}
      <section class="stats-bar-section">
        <div class="container">
          <div class="stats-grid">
            {CREATOR.stats.map((stat, i) => (
              <div key={i} class="stat-card">
                <div class="stat-number shimmer-text">{stat.value}</div>
                <div class="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SIGNATURE VISUAL STATEMENT (Matches Figma Home.png)
          ========================================================================= */}
      <section class="signature-visual-section">
        <div class="signature-bg-wrapper">
          <img src={signatureBanner} alt="Signature Visual Production" class="signature-bg-img" />
          <div class="signature-overlay-gradient" />
        </div>

        <div class="container signature-content">
          <span class="section-tag signature-tag">SIGNATURE VISUAL</span>
          <h2 class="signature-quote">"{CREATOR.signatureStatement}"</h2>
          <p class="signature-author">{CREATOR.signatureSub}</p>
          <button
            class="btn-gold-outline signature-btn"
            onClick={() => setActivePage('showreel')}
            onMouseEnter={() => setCursorState?.({ type: 'pointer' })}
            onMouseLeave={() => setCursorState?.(null)}
          >
            <span>WATCH SHOWREEL</span>
          </button>
        </div>
      </section>

      {/* =========================================================================
          ROLES TICKER (Matches Figma Home.png)
          ========================================================================= */}
      <section class="roles-ticker-section">
        <div class="ticker-header-label">MORE THAN A CREATOR</div>
        <div class="roles-ticker-track">
          <div class="roles-ticker-inner">
            {[...CREATOR.tickerRoles, ...CREATOR.tickerRoles].map((role, idx) => (
              <div key={idx} class="role-item">
                <span class="role-text">{role}</span>
                <span class="role-dot">▪</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          INTERACTIVE LOOKBOOK MARQUEE SHOWCASE
          ========================================================================= */}
      <MarqueeShowcase
        onSelectImage={onSelectImage}
        setCursorState={setCursorState}
      />
    </div>
  )
}
