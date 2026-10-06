import { useEffect } from 'preact/hooks'

export function ImageLightbox({ images, currentIndex, onClose, onPrev, onNext }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft' && onPrev) onPrev()
      if (e.key === 'ArrowRight' && onNext) onNext()
    }
    window.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'auto'
    }
  }, [onClose, onPrev, onNext])

  if (!images || currentIndex === null || currentIndex === undefined || !images[currentIndex]) {
    return null
  }

  const currentItem = images[currentIndex]
  const imageSrc = currentItem.img || currentItem.image || currentItem.cover || currentItem

  return (
    <div class="lightbox-backdrop" onClick={onClose}>
      <div class="lightbox-stage" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button class="lightbox-close-btn" onClick={onClose} aria-label="Close Lightbox">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Previous Button */}
        {images.length > 1 && (
          <button class="lightbox-nav-btn prev" onClick={onPrev} aria-label="Previous Image">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
        )}

        {/* Main Image View */}
        <div class="lightbox-media-container">
          <img src={imageSrc} alt={currentItem.title || 'Portfolio Image'} class="lightbox-img" />
          {(currentItem.title || currentItem.label) && (
            <div class="lightbox-caption">
              {currentItem.label && <span class="lightbox-tag">{currentItem.label}</span>}
              {currentItem.title && <h4 class="lightbox-title">{currentItem.title}</h4>}
            </div>
          )}
        </div>

        {/* Next Button */}
        {images.length > 1 && (
          <button class="lightbox-nav-btn next" onClick={onNext} aria-label="Next Image">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        )}

        {/* Index counter */}
        {images.length > 1 && (
          <div class="lightbox-counter">
            {currentIndex + 1} / {images.length}
          </div>
        )}
      </div>
    </div>
  )
}
