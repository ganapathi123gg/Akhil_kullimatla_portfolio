import { useState } from 'preact/hooks'
import { getInstagramEmbedUrl } from '../../utils/mediaUtils'

export function InstagramProject({ project, isActive, onActivate, onStop }) {
  const [imgError, setImgError] = useState(false)
  const embedUrl = getInstagramEmbedUrl(project.instagramUrl)

  const handleActivateClick = (e) => {
    e.stopPropagation()
    onActivate(project.id)
  }

  const handleStopClick = (e) => {
    e.stopPropagation()
    onStop()
  }

  return (
    <div
      class={`work-card instagram-project-card tall-card ${isActive ? 'is-active-player' : ''}`}
      id={`project-${project.id}`}
    >
      {isActive ? (
        <div class="inline-player-wrapper instagram-embed-wrapper">
          {embedUrl ? (
            <iframe
              class="official-instagram-iframe"
              src={embedUrl}
              title={project.title}
              allowTransparency="true"
              frameBorder="0"
              scrolling="no"
              allow="encrypted-media"
            />
          ) : (
            <div class="player-fallback-message">
              <p>Reel currently unavailable.</p>
            </div>
          )}

          <button
            type="button"
            class="player-close-btn"
            onClick={handleStopClick}
            aria-label={`Close ${project.title} reel`}
            data-cursor="hover"
          >
            <span>✕ BACK TO POSTER</span>
          </button>
        </div>
      ) : (
        <div
          class="work-card-media-wrapper"
          onClick={handleActivateClick}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              handleActivateClick(e)
            }
          }}
          aria-label={`Watch ${project.title}`}
          data-cursor="play"
          data-cursor-label="WATCH"
        >
          <div class="work-card-media">
            <img
              src={imgError ? 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1200&auto=format&fit=crop' : (project.thumbnail || project.cover)}
              alt={`${project.title} poster`}
              class="work-card-img"
              loading="lazy"
              onError={() => setImgError(true)}
            />
            <div class="work-card-gradient" />
          </div>

          <div class="reel-badge-top">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l6 4.5-6 4.5z"/>
            </svg>
            <span>REEL</span>
          </div>

          <div class="work-card-center-play">
            <div class="play-circle-gold">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>

          <div class="work-card-content">
            <span class="work-card-category">REELS • {project.year || '2026'}</span>
            <h4 class="work-card-title">{project.title}</h4>
            {project.description && (
              <p class="work-card-desc">{project.description}</p>
            )}
            <div class="reel-cta-action">
              <span>▷ WATCH REEL</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
