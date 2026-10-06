import { useState } from 'preact/hooks'
import { CREATOR } from '../data/creatorConfig'
import { PROJECTS } from '../data/projects'
import { ProjectCard } from '../components/work/ProjectCard'
import { ImageLightbox } from '../components/ImageLightbox'
import { AwardsShowcase } from '../components/AwardsShowcase'
import { getYoutubeEmbedUrl } from '../utils/mediaUtils'

export function WorkPage({ onOpenVideo, setCursorState }) {
  const [activeCategory, setActiveCategory] = useState('ALL')
  const [activeMediaId, setActiveMediaId] = useState(null)
  const [lightboxIndex, setLightboxIndex] = useState(null)

  const categories = ['ALL', 'SHORT FILMS', 'REELS', 'YOUTUBE', 'MODELING']

  // Modeling items pool for lightbox
  const modelingItems = PROJECTS.filter((p) => p.type === 'image' || p.category === 'Modeling')

  const filteredProjects = PROJECTS.filter((item) => {
    if (activeCategory === 'ALL') return true
    if (activeCategory === 'SHORT FILMS') return item.category === 'Short Film' || item.category === 'Short Films' || item.categories?.includes('Short Film')
    if (activeCategory === 'REELS') return item.category === 'Reels' || item.categories?.includes('Reels')
    if (activeCategory === 'YOUTUBE') return item.category === 'YouTube' || item.categories?.includes('YouTube')
    if (activeCategory === 'MODELING') return item.category === 'Modeling' || item.categories?.includes('Modeling')
    return true
  })

  const featuredFilm = PROJECTS.find((p) => p.featured) || PROJECTS[0]
  const isFeaturedPlaying = activeMediaId === `featured-${featuredFilm?.id}`
  const featuredEmbedUrl = featuredFilm?.youtubeUrl ? getYoutubeEmbedUrl(featuredFilm.youtubeUrl) : null

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
    <div class="page-view work-page page-transition">
      <div class="container">
        {/* Header */}
        <header class="page-header">
          <span class="section-tag">PORTFOLIO</span>
          <h1 class="page-title">
            Selected <span class="shimmer-text">Works.</span>
          </h1>
          <p class="page-subtitle">
            Short films, reels, YouTube productions, and high-fashion editorial campaigns — a body of work built to move people.
          </p>

          {/* Filter Pills */}
          <div class="filter-tabs-row" role="tablist" aria-label="Portfolio Categories">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                class={`filter-tab-btn ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => handleCategoryChange(cat)}
                onMouseEnter={() => setCursorState?.({ type: 'pointer' })}
                onMouseLeave={() => setCursorState?.(null)}
                role="tab"
                aria-selected={activeCategory === cat}
              >
                {cat}
              </button>
            ))}

            {/* Direct action to Complete Video Archive */}
            <button
              type="button"
              class="filter-tab-btn view-all-works-pill"
              onClick={handleOpenAllWorks}
              onMouseEnter={() => setCursorState?.({ type: 'pointer' })}
              onMouseLeave={() => setCursorState?.(null)}
              title="View All My Works in Complete Video Archive"
            >
              <span>VIEW ALL MY WORKS ↗</span>
            </button>
          </div>
        </header>

        {/* Featured Hero Project */}
        {(activeCategory === 'ALL' || activeCategory === 'SHORT FILMS' || (activeCategory === 'YOUTUBE' && (featuredFilm.category === 'YouTube' || featuredFilm.categories?.includes('YouTube')))) && featuredFilm && (
          <section class="featured-project-section">
            <div class="featured-project-card">
              {/* Left Video Media Thumbnail or Player */}
              <div class="featured-media-box">
                {isFeaturedPlaying && featuredEmbedUrl ? (
                  <div class="inline-player-wrapper ratio-16-9">
                    <iframe
                      class="official-youtube-iframe"
                      src={featuredEmbedUrl}
                      title={featuredFilm.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                    <button
                      type="button"
                      class="player-close-btn"
                      onClick={handleStopMedia}
                      aria-label={`Close ${featuredFilm.title} player`}
                    >
                      <span>✕ BACK TO POSTER</span>
                    </button>
                  </div>
                ) : (
                  <div
                    class="featured-poster-container"
                    onClick={() => handleActivateMedia(`featured-${featuredFilm.id}`)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        handleActivateMedia(`featured-${featuredFilm.id}`)
                      }
                    }}
                    onMouseEnter={() => setCursorState?.({ type: 'play' })}
                    onMouseLeave={() => setCursorState?.(null)}
                    aria-label={`Play ${featuredFilm.title}`}
                  >
                    <img src={featuredFilm.thumbnail || featuredFilm.cover} alt={featuredFilm.title} class="featured-img" />
                    <div class="featured-play-badge">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <polygon points="5 3 19 12 5 21 5 3" />
                      </svg>
                    </div>
                    {featuredFilm.duration && (
                      <div class="featured-timecode">{featuredFilm.duration}</div>
                    )}
                  </div>
                )}
              </div>

              {/* Right Content */}
              <div class="featured-info-col">
                <span class="featured-kicker">FEATURED SHORT FILM</span>
                <h2 class="featured-title">{featuredFilm.title}</h2>
                <p class="featured-desc">{featuredFilm.description}</p>

                {featuredFilm.tags && (
                  <div class="featured-meta-pills">
                    {featuredFilm.tags.map((tag) => (
                      <span key={tag} class="meta-tag">{tag}</span>
                    ))}
                  </div>
                )}

                <button
                  type="button"
                  class="btn-gold-fill featured-watch-btn"
                  onClick={() => {
                    if (isFeaturedPlaying) {
                      handleStopMedia()
                    } else {
                      handleActivateMedia(`featured-${featuredFilm.id}`)
                    }
                  }}
                  onMouseEnter={() => setCursorState?.({ type: 'pointer' })}
                  onMouseLeave={() => setCursorState?.(null)}
                  aria-label={isFeaturedPlaying ? 'Stop playback' : `Watch ${featuredFilm.title}`}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                  <span>{isFeaturedPlaying ? 'BACK TO POSTER' : 'WATCH FILM'}</span>
                </button>

                {featuredFilm.role && (
                  <div class="featured-credits">{featuredFilm.role}</div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Gallery Grid */}
        <section class="recent-work-section">
          <h2 class="recent-work-heading">Recent Work</h2>

          <div class="projects-masonry-grid">
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
        </section>

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

        {/* Recognition for Creative Vision & Direction */}
        <section class="honours-section">
          <span class="section-tag">AWARDS & RECOGNITION</span>
          <h2 class="honours-heading awards-creative-heading">Recognition for <span class="awards-heading-highlight">Creative Vision & Direction</span></h2>

          <AwardsShowcase />
        </section>

        {/* Trusted By Brands Ticker */}
        <section class="brands-section">
          <div class="brands-header-label">TRUSTED BY CREATORS & BRANDS</div>
          <div class="brands-row">
            {CREATOR.brands.map((brand) => (
              <div key={brand} class="brand-item">
                {brand}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
