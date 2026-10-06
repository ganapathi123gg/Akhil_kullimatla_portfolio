import { useState } from 'preact/hooks'
import { PROJECTS } from '../data/projects'
import { ProjectCard } from './work/ProjectCard'
import { ImageLightbox } from './ImageLightbox'
import { getYoutubeEmbedUrl } from '../utils/mediaUtils'
import '../styles/WorkSection.css'

export function WorkSection({ onSelectVideo }) {
  const [activeCategory, setActiveCategory] = useState('ALL')
  const [activeMediaId, setActiveMediaId] = useState(null)
  const [lightboxIndex, setLightboxIndex] = useState(null)

  const categories = ['ALL', 'SHORT FILMS', 'REELS', 'YOUTUBE', 'MODELING']

  // Modeling items pool for lightbox navigation
  const modelingItems = PROJECTS.filter((p) => p.type === 'image' || p.category === 'Modeling')

  const filteredProjects = PROJECTS.filter((item) => {
    if (activeCategory === 'ALL') return true
    if (activeCategory === 'SHORT FILMS') return item.category === 'Short Film' || item.category === 'Short Films' || item.categories?.includes('Short Film')
    if (activeCategory === 'REELS') return item.category === 'Reels' || item.categories?.includes('Reels')
    if (activeCategory === 'YOUTUBE') return item.category === 'YouTube' || item.categories?.includes('YouTube')
    if (activeCategory === 'MODELING') return item.category === 'Modeling' || item.categories?.includes('Modeling')
    return true
  })

  const featured = PROJECTS.find((p) => p.featured) || PROJECTS[0]
  const isFeaturedPlaying = activeMediaId === `featured-${featured?.id}`
  const featuredEmbedUrl = featured?.youtubeUrl ? getYoutubeEmbedUrl(featured.youtubeUrl) : null

  // Ensure only one video/embed is active on the page at a time
  const handleActivateMedia = (projectId) => {
    setActiveMediaId(projectId)
  }

  const handleStopMedia = () => {
    setActiveMediaId(null)
  }

  const handleOpenLightbox = (project) => {
    const idx = modelingItems.findIndex((item) => item.id === project.id)
    setLightboxIndex(idx !== -1 ? idx : 0)
  }

  const handleCloseLightbox = () => {
    setLightboxIndex(null)
  }

  const handlePrevLightbox = () => {
    setLightboxIndex((prev) => (prev > 0 ? prev - 1 : modelingItems.length - 1))
  }

  const handleNextLightbox = () => {
    setLightboxIndex((prev) => (prev < modelingItems.length - 1 ? prev + 1 : 0))
  }

  const handleCategoryChange = (cat) => {
    setActiveCategory(cat)
    // When switching categories, reset active inline players to avoid hidden playback
    setActiveMediaId(null)
  }

  const handleOpenAllWorks = () => {
    window.dispatchEvent(new CustomEvent('open-video-archive', { detail: { category: 'All' } }))
    const el = document.getElementById('watch-more-deck') || document.getElementById('showreel')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section class="work-section" id="work" aria-label="Portfolio Work Section">
      <div class="container">
        {/* Header */}
        <div class="work-header">
          <div class="section-tag">PORTFOLIO</div>
          <h2 class="hero-title" style={{ fontSize: 'clamp(36px, 4.5vw, 64px)', marginBottom: '14px' }}>
            Selected <span class="hero-highlight">Works.</span>
          </h2>
          <p class="about-p" style={{ maxWidth: '640px' }}>
            Short films, reels, YouTube productions, and high-fashion editorial campaigns — a body of work built to move people.
          </p>
        </div>

        {/* Filter Tabs */}
        <div class="filter-tabs-row" role="tablist" aria-label="Portfolio Categories">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              class={`filter-pill-btn ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => handleCategoryChange(cat)}
              role="tab"
              aria-selected={activeCategory === cat}
              data-cursor="hover"
            >
              {cat}
            </button>
          ))}

          {/* Direct Link to Complete Video Archive */}
          <button
            type="button"
            class="filter-pill-btn view-all-works-pill"
            onClick={handleOpenAllWorks}
            data-cursor="hover"
            title="View All My Works in Complete Video Archive"
          >
            <span>VIEW ALL MY WORKS ↗</span>
          </button>
        </div>

        {/* Featured Film Box (Matches Work.png) */}
        {featured && (activeCategory === 'ALL' || activeCategory === 'SHORT FILMS' || (activeCategory === 'YOUTUBE' && (featured.category === 'YouTube' || featured.categories?.includes('YouTube')))) && (
          <div class="featured-film-box" id={`video-${featured.id}`}>
            <div class="featured-film-media">
              {isFeaturedPlaying && featuredEmbedUrl ? (
                <div class="inline-player-wrapper ratio-16-9">
                  <iframe
                    class="official-youtube-iframe"
                    src={featuredEmbedUrl}
                    title={featured.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                  <button
                    type="button"
                    class="player-close-btn"
                    onClick={handleStopMedia}
                    aria-label={`Close ${featured.title} player`}
                    data-cursor="hover"
                  >
                    <span>✕ BACK TO POSTER</span>
                  </button>
                </div>
              ) : (
                <div
                  class="featured-poster-container"
                  onClick={() => handleActivateMedia(`featured-${featured.id}`)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      handleActivateMedia(`featured-${featured.id}`)
                    }
                  }}
                  aria-label={`Play ${featured.title}`}
                  data-cursor="play"
                  data-cursor-label="PLAY"
                >
                  <img
                    src={featured.thumbnail || featured.cover}
                    alt={featured.title}
                    class="featured-film-img"
                    loading="lazy"
                  />
                  {featured.duration && (
                    <span class="featured-duration-badge">{featured.duration}</span>
                  )}
                  <div class="center-play-button">
                    <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                  </div>
                </div>
              )}
            </div>

            <div class="featured-film-info">
              <span class="featured-subtitle">FEATURED SHORT FILM</span>
              <h3 class="featured-title">{featured.title}</h3>
              <p class="featured-desc">{featured.description}</p>

              {featured.tags && (
                <div class="featured-meta-tags">
                  {featured.tags.map((tag, i) => (
                    <span class="meta-tag" key={i}>{tag}</span>
                  ))}
                </div>
              )}

              <button
                type="button"
                class="btn-gold-fill"
                style={{ alignSelf: 'flex-start' }}
                onClick={() => {
                  if (isFeaturedPlaying) {
                    handleStopMedia()
                  } else {
                    handleActivateMedia(`featured-${featured.id}`)
                  }
                }}
                data-cursor="hover"
                aria-label={isFeaturedPlaying ? 'Stop playback' : `Watch ${featured.title}`}
              >
                <span>▷</span>
                <span>{isFeaturedPlaying ? 'BACK TO POSTER' : 'WATCH FILM'}</span>
              </button>

              {featured.role && (
                <span class="featured-author-role">{featured.role}</span>
              )}
            </div>
          </div>
        )}

        {/* Recent Work Grid */}
        <h3 class="recent-work-heading">Recent Work</h3>
        <div class="work-cards-grid">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              activeMediaId={activeMediaId}
              onActivateMedia={handleActivateMedia}
              onStopMedia={handleStopMedia}
              onOpenLightbox={handleOpenLightbox}
            />
          ))}
        </div>

        {/* View All Works CTA Banner (Matching portfolio luxury aesthetic) */}
        <div class="work-view-all-cta-wrap">
          <div class="work-view-all-cta-card">
            <div class="work-view-all-cta-text">
              <span class="section-tag" style={{ marginBottom: '8px' }}>COMPLETE COLLECTION</span>
              <h3 class="journey-title" style={{ fontSize: '28px', marginBottom: '8px' }}>
                Explore The Complete Video Archive
              </h3>
              <p class="about-p" style={{ maxWidth: '640px', marginBottom: '0', fontSize: '15px' }}>
                Access all short films, YouTube productions, comedy sketches, music videos, reviews, trailers, teasers, and modeling projects in one comprehensive library.
              </p>
            </div>
            <button
              type="button"
              class="btn-gold-fill work-view-all-btn"
              onClick={handleOpenAllWorks}
              data-cursor="hover"
              aria-label="View all my works in complete video archive"
            >
              <span style={{ fontSize: '15px' }}>▦</span>
              <span>VIEW ALL MY WORKS</span>
              <span style={{ fontSize: '14px', opacity: 0.9 }}>→</span>
            </button>
          </div>
        </div>

        {/* Fullscreen Image Lightbox for Modeling Photography */}
        {lightboxIndex !== null && (
          <ImageLightbox
            images={modelingItems}
            currentIndex={lightboxIndex}
            onClose={handleCloseLightbox}
            onPrev={handlePrevLightbox}
            onNext={handleNextLightbox}
          />
        )}
      </div>
    </section>
  )
}
