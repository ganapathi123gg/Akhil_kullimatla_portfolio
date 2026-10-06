import { useState } from 'preact/hooks'
import { getYoutubeEmbedUrl } from '../../utils/mediaUtils'

export function YouTubeProject({ project, isActive, onPlay, onStop }) {
  const [imgError, setImgError] = useState(false)
  const embedUrl = getYoutubeEmbedUrl(project.youtubeUrl)

  const handlePlayClick = (e) => {
    e.stopPropagation()
    onPlay(project.id)
  }

  const handleStopClick = (e) => {
    e.stopPropagation()
    onStop()
  }

  return (
    <div
      class={`work-card youtube-project-card ${isActive ? 'is-active-player' : ''}`}
      id={`project-${project.id}`}
    >
      {isActive ? (
        <div class="inline-player-wrapper ratio-16-9">
          {embedUrl ? (
            <iframe
              class="official-youtube-iframe"
              src={embedUrl}
              title={project.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          ) : (
            <div class="player-fallback-message">
              <p>Video currently unavailable.</p>
            </div>
          )}

          <button
            type="button"
            class="player-close-btn"
            onClick={handleStopClick}
            aria-label={`Close ${project.title} player`}
            data-cursor="hover"
          >
            <span>✕ BACK TO POSTER</span>
          </button>
        </div>
      ) : (
        <div
          class="work-card-media-wrapper"
          onClick={handlePlayClick}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              handlePlayClick(e)
            }
          }}
          aria-label={`Play ${project.title}`}
          data-cursor="play"
          data-cursor-label="PLAY"
        >
          <div class="work-card-media">
            <img
              src={imgError ? 'https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=1200&auto=format&fit=crop' : (project.thumbnail || project.cover)}
              alt={`${project.title} poster`}
              class="work-card-img"
              loading="lazy"
              onError={() => setImgError(true)}
            />
            <div class="work-card-gradient" />
          </div>

          {project.duration && (
            <span class="project-duration-tag">{project.duration}</span>
          )}

          <div class="work-card-center-play">
            <div class="play-circle-gold">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>

          <div class="work-card-content">
            <span class="work-card-category">{project.category || 'SHORT FILM'} • {project.year || '2026'}</span>
            <h4 class="work-card-title">{project.title}</h4>
            {project.description && (
              <p class="work-card-desc">{project.description}</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
