import { useState } from 'preact/hooks'

export function ModelingProject({ project, onOpenLightbox }) {
  const [imgError, setImgError] = useState(false)
  const imageSrc = project.image || project.thumbnail || project.cover

  const handleClick = (e) => {
    e.stopPropagation()
    onOpenLightbox(project)
  }

  return (
    <div
      class="work-card modeling-project-card tall-card"
      id={`project-${project.id}`}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          handleClick(e)
        }
      }}
      aria-label={`View ${project.title} editorial portrait`}
      data-cursor="hover"
      data-cursor-label="VIEW"
    >
      <div class="work-card-media modeling-media">
        <img
          src={imgError ? 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop' : imageSrc}
          alt={`${project.title} - Editorial Modeling`}
          class="work-card-img modeling-img"
          loading="lazy"
          onError={() => setImgError(true)}
        />
        <div class="modeling-gold-frame" />
        <div class="work-card-gradient modeling-gradient" />
      </div>

      <div class="modeling-view-badge">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
          <line x1="11" y1="8" x2="11" y2="14" />
          <line x1="8" y1="11" x2="14" y2="11" />
        </svg>
      </div>

      <div class="work-card-content modeling-content">
        <div class="modeling-gold-line" />
        <span class="work-card-category">MODELING • {project.year || '2026'}</span>
        <h4 class="work-card-title">{project.title}</h4>
        {project.description && (
          <p class="work-card-desc">{project.description}</p>
        )}
      </div>
    </div>
  )
}
