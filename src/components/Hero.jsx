import { useRef, useState } from 'preact/hooks'
import { CREATOR } from '../data/creatorConfig'
import heroPortraitImg from '../assets/img_3.png'
import '../styles/Hero.css'

export function Hero({ onExploreWork, onCollaborate }) {
  const cardRef = useRef(null)
  const [tiltStyle, setTiltStyle] = useState({
    transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg)',
  })

  // 3D Card Tilt Effect on mouse move
  const handleMouseMove = (e) => {
    const card = cardRef.current
    if (!card) return
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2

    const rotateX = -(y / (rect.height / 2)) * 8
    const rotateY = (x / (rect.width / 2)) * 8

    setTiltStyle({
      transform: `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`,
    })
  }

  const handleMouseLeave = () => {
    setTiltStyle({
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
    })
  }

  const handleScrollDown = () => {
    const nextElem = document.getElementById('about') || document.querySelector('.stats-bar-section')
    if (nextElem) {
      nextElem.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section class="hero-section" id="hero">
      <div class="hero-ambient-glow" />

      <div class="hero-container">
        {/* Left Column: Heading & CTAs */}
        <div class="hero-content">
          <div class="hero-tag">
            {CREATOR.tagline}
          </div>

          <h1 class="hero-title">
            {CREATOR.heroHeading}{' '}
            <span class="hero-highlight">{CREATOR.heroHighlight}</span>
          </h1>

          <p class="hero-description">
            {CREATOR.heroDescription}
          </p>

          <div class="hero-btn-group">
            <button
              type="button"
              class="btn-gold-fill"
              onClick={onExploreWork}
              data-cursor="hover"
              data-cursor-label="WORKS"
            >
              <span>→</span>
              <span>VIEW MY WORK</span>
            </button>

            <button
              type="button"
              class="btn-gold-outline"
              onClick={onCollaborate}
              data-cursor="hover"
              data-cursor-label="CONTACT"
            >
              <span>COLLABORATE</span>
            </button>
          </div>

          {/* Social Links Showcase */}
          <div class="hero-social-strip" aria-label="Official Social Channels">
            <span class="hero-social-label">OFFICIAL CHANNELS</span>
            <div class="hero-social-list">
              <a
                href={CREATOR.socials.youtube}
                target="_blank"
                rel="noopener noreferrer"
                class="hero-social-pill youtube"
                data-cursor="hover"
                data-cursor-label="YOUTUBE"
              >
                <div class="social-icon-box">
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </div>
                <div class="social-text-box">
                  <span class="social-platform">YOUTUBE</span>
                  <span class="social-handle">@ugeshcreator</span>
                </div>
                <span class="social-arrow-hint">↗</span>
              </a>

              <a
                href={CREATOR.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                class="hero-social-pill instagram"
                data-cursor="hover"
                data-cursor-label="INSTAGRAM"
              >
                <div class="social-icon-box">
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </div>
                <div class="social-text-box">
                  <span class="social-platform">INSTAGRAM</span>
                  <span class="social-handle">@_ugesshhh_</span>
                </div>
                <span class="social-arrow-hint">↗</span>
              </a>

              <a
                href={CREATOR.socials.snapchat}
                target="_blank"
                rel="noopener noreferrer"
                class="hero-social-pill snapchat"
                data-cursor="hover"
                data-cursor-label="SNAPCHAT"
              >
                <div class="social-icon-box">
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.001 2c-3.79 0-6.27 2.68-6.27 5.68 0 .82.19 1.83.54 2.62.15.34.05.51-.25.71-.58.38-1.57.85-1.93 1.5-.26.47-.07.94.49 1.14.77.27 1.87.16 2.53.07.25-.03.42.09.47.33.24 1.15.99 2.06 2.39 2.45.2.06.31.18.25.39-.24.78-1.52 1.34-2.83 1.55-.42.07-.63.29-.53.64.12.44.62.67 1.25.68 1.1.02 2.36-.36 3.49-.91.24-.12.45-.11.66 0 1.13.55 2.39.93 3.49.91.63-.01 1.13-.24 1.25-.68.1-.35-.11-.57-.53-.64-1.31-.21-2.59-.77-2.83-1.55-.06-.21.05-.33.25-.39 1.4-.39 2.15-1.3 2.39-2.45.05-.24.22-.36.47-.33.66.09 1.76.2 2.53-.07.56-.2.75-.67.49-1.14-.36-.65-1.35-1.12-1.93-1.5-.3-.2-.4-.37-.25-.71.35-.79.54-1.8.54-2.62 0-3-2.48-5.68-6.27-5.68z"/>
                  </svg>
                </div>
                <div class="social-text-box">
                  <span class="social-platform">SNAPCHAT</span>
                  <span class="social-handle">@ugessshhh</span>
                </div>
                <span class="social-arrow-hint">↗</span>
              </a>
            </div>
          </div>

          <div
            class="scroll-indicator-wrap hero-scroll-desktop"
            onClick={handleScrollDown}
            data-cursor="hover"
            role="button"
            tabIndex={0}
          >
            <span class="scroll-arrow">⌄</span>
            <span>SCROLL</span>
            <span class="scroll-divider" />
          </div>
        </div>

        {/* Right Column: Hero Portrait Frame */}
        <div class="hero-visual-wrapper">
          <div
            class="hero-frame-card"
            ref={cardRef}
            style={tiltStyle}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            {/* Gold offset accent border frame (thickness 4px) */}
            <div class="hero-frame-accent" />

            <div class="hero-image-container">
              <img
                src={heroPortraitImg}
                alt="Akhil - Content Creator, YouTuber, Model & Director"
                class="hero-portrait-img"
                loading="eager"
              />

              {/* Moving light sheen / lens sweep inside image */}
              <div class="hero-image-light-sweep" aria-hidden="true" />

              {/* Drifting warm spotlight / caustic glow inside image */}
              <div class="hero-image-spotlight" aria-hidden="true" />

              {/* Cinematic film vignette edge depth */}
              <div class="hero-image-vignette" aria-hidden="true" />
            </div>

            {/* 12 Awards floating badge from Home.png */}
            <div class="hero-awards-badge" data-cursor="hover" data-cursor-label="AWARDS">
              {CREATOR.heroBadge}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
