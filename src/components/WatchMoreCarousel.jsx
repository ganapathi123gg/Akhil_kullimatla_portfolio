import { useState, useEffect, useRef } from 'preact/hooks'
import { ARCHIVE_SECTIONS, getAllArchiveItems } from '../data/creatorConfig'
import '../styles/WatchMoreCarousel.css'

export function WatchMoreCarousel({ videos = [], onSelectVideo }) {
  // Equal distribution: even index to Row 1, odd index to Row 2
  const row1 = videos.filter((_, idx) => idx % 2 === 0)
  const row2 = videos.filter((_, idx) => idx % 2 === 1)

  // Fallbacks if one row is empty
  const row1Items = row1.length >= 3 ? row1 : (videos.length >= 3 ? videos : [...videos, ...videos, ...videos])
  const row2Items = row2.length >= 3 ? row2 : (videos.length >= 3 ? videos : [...videos, ...videos, ...videos])

  const [row1Index, setRow1Index] = useState(0)
  const [row2Index, setRow2Index] = useState(0)

  const [isHovered1, setIsHovered1] = useState(false)
  const [isHovered2, setIsHovered2] = useState(false)

  // Complete archive collection combining all videos from Work page + Watch More Library
  const allArchiveItems = getAllArchiveItems()

  // 1st Row: Auto-rotate from left to right (smooth lazy sliding window motion)
  useEffect(() => {
    if (isHovered1 || row1Items.length <= 1) return
    const interval = setInterval(() => {
      setRow1Index((prev) => (prev + 1) % row1Items.length)
    }, 4400)
    return () => clearInterval(interval)
  }, [isHovered1, row1Items.length])

  // 2nd Row: Auto-rotate in reverse direction with organic offset cadence
  useEffect(() => {
    if (isHovered2 || row2Items.length <= 1) return
    const interval = setInterval(() => {
      setRow2Index((prev) => (prev - 1 + row2Items.length) % row2Items.length)
    }, 4800)
    return () => clearInterval(interval)
  }, [isHovered2, row2Items.length])

  // Manual rotation handlers for Row 1
  const handlePrevRow1 = () => {
    setRow1Index((prev) => (prev - 1 + row1Items.length) % row1Items.length)
  }
  const handleNextRow1 = () => {
    setRow1Index((prev) => (prev + 1) % row1Items.length)
  }

  // Manual rotation handlers for Row 2
  const handlePrevRow2 = () => {
    setRow2Index((prev) => (prev - 1 + row2Items.length) % row2Items.length)
  }
  const handleNextRow2 = () => {
    setRow2Index((prev) => (prev + 1) % row2Items.length)
  }

  // Touch and Drag swipe refs for physical deck motion
  const dragStartX1 = useRef(null)
  const isDragging1 = useRef(false)
  const dragStartX2 = useRef(null)
  const isDragging2 = useRef(false)

  const handlePointerDown1 = (e) => {
    dragStartX1.current = e.touches ? e.touches[0].clientX : e.clientX
    isDragging1.current = true
  }

  const handlePointerUp1 = (e) => {
    if (!isDragging1.current || dragStartX1.current === null) return
    const endX = e.changedTouches ? e.changedTouches[0].clientX : e.clientX
    const diffX = dragStartX1.current - endX
    if (Math.abs(diffX) > 45) {
      if (diffX > 0) handleNextRow1()
      else handlePrevRow1()
    }
    isDragging1.current = false
    dragStartX1.current = null
  }

  const handlePointerDown2 = (e) => {
    dragStartX2.current = e.touches ? e.touches[0].clientX : e.clientX
    isDragging2.current = true
  }

  const handlePointerUp2 = (e) => {
    if (!isDragging2.current || dragStartX2.current === null) return
    const endX = e.changedTouches ? e.changedTouches[0].clientX : e.clientX
    const diffX = dragStartX2.current - endX
    if (Math.abs(diffX) > 45) {
      if (diffX > 0) handleNextRow2()
      else handlePrevRow2()
    }
    isDragging2.current = false
    dragStartX2.current = null
  }

  // Open View All Video Library (Dispatches global open-video-archive)
  const handleOpenViewAll = (scope = 'All') => {
    const category = scope === 'row1' ? 'Shortfilms' : (scope === 'row2' ? 'Youtube' : 'All')
    window.dispatchEvent(new CustomEvent('open-video-archive', { detail: { category } }))
  }

  // Get the 3 visible videos for a row (Left, Center, Right)
  const getVisibleTriplet = (items, currentIndex) => {
    const len = items.length
    if (len === 0) return []

    const leftIdx = (currentIndex - 1 + len) % len
    const centerIdx = currentIndex
    const rightIdx = (currentIndex + 1) % len

    return [
      { item: items[leftIdx], position: 'left', originalIndex: leftIdx },
      { item: items[centerIdx], position: 'center', originalIndex: centerIdx },
      { item: items[rightIdx], position: 'right', originalIndex: rightIdx },
    ]
  }

  const tripletRow1 = getVisibleTriplet(row1Items, row1Index)
  const tripletRow2 = getVisibleTriplet(row2Items, row2Index)

  const handleCardClick = (slot, rowNumber) => {
    if (slot.position === 'center') {
      onSelectVideo?.(slot.item)
    } else if (slot.position === 'left') {
      if (rowNumber === 1) handlePrevRow1()
      else handlePrevRow2()
    } else if (slot.position === 'right') {
      if (rowNumber === 1) handleNextRow1()
      else handleNextRow2()
    }
  }

  // Render a Work-Page-Style Featured Card
  const renderFeaturedCard = (slot, rowNumber) => {
    const video = slot.item
    const isCenter = slot.position === 'center'
    const category = video.category || 'SHORT FILM'
    const isReel = category.toUpperCase().includes('REEL')
    const actionLabel = isReel ? 'WATCH REEL' : 'WATCH FILM'
    const description =
      video.description ||
      `A cinematic Telugu ${category.toLowerCase()} written & directed by Kullimetla Akhil. Turning every frame into an emotional narrative.`

    return (
      <div
        key={`${slot.position}-${video.id || slot.originalIndex}`}
        class={`deck-3d-card is-${slot.position}`}
        onClick={() => handleCardClick(slot, rowNumber)}
        data-cursor={isCenter ? 'play' : 'hover'}
        data-cursor-label={isCenter ? 'PLAY' : 'ROTATE'}
        role="button"
        tabIndex={0}
        aria-label={isCenter ? `Play ${video.title}` : `Rotate to ${video.title}`}
      >
        {/* Left Side: Media Box with Space on Left, Top, and Bottom */}
        <div class="deck-card-media-box">
          <div class="deck-card-media-inner">
            <img
              src={video.cover || video.thumbnail}
              alt={video.title}
              class="deck-card-img"
              loading="lazy"
            />
            <div class="deck-card-gradient" />

            {/* Central Play Badge */}
            <div class="deck-play-badge">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
            </div>

            {/* Duration Badge */}
            {video.duration && (
              <div class="deck-card-timecode">{video.duration}</div>
            )}

            {/* Row Marker Tag */}
            <div class="deck-card-row-tag">ROW 0{rowNumber}</div>
          </div>
        </div>

        {/* Right Side: Information Column (Highlighted Category without FEATURED) */}
        <div class="deck-card-info-col">
          <span class="deck-card-kicker">
            <span class="kicker-highlight">{category.toUpperCase()}</span>
          </span>
          <h3 class="deck-card-title">{video.title}</h3>
          <p class="deck-card-desc">{description}</p>

          <div class="deck-card-meta-pills">
            <span class="deck-meta-pill">{category}</span>
            <span class="deck-meta-pill">YOUTUBE</span>
            <span class="deck-meta-pill">TELUGU</span>
            <span class="deck-meta-pill">4K UHD</span>
          </div>

          <div class="deck-card-footer-action">
            <button
              type="button"
              class="btn-gold-fill deck-watch-btn"
              onClick={(e) => {
                e.stopPropagation()
                onSelectVideo?.(video)
              }}
              aria-label={`Watch ${video.title}`}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
              <span>{actionLabel}</span>
            </button>
            <span class="deck-card-credits">Written & Directed by Akhil</span>
          </div>
        </div>

        {/* Subtle corner golden border accents */}
        <div class="deck-card-border-glow" />
      </div>
    )
  }

  return (
    <div class="watch-more-deck-container" id="watch-more-deck">
      {/* Master Action Bar: Status & View All Videos Button */}
      <div class="deck-master-action-bar">
        <div class="deck-master-status">
          <span class="deck-status-dot" />
          <span class="deck-status-text">COMPLETE VIDEO ARCHIVE · ALL WORKS LIBRARY</span>
        </div>
        <button
          type="button"
          class="deck-master-view-all-btn"
          onClick={() => handleOpenViewAll('All')}
          data-cursor="hover"
        >
          <span class="deck-btn-icon">▦</span>
          <span>VIEW ALL {allArchiveItems.length} WORKS</span>
          <span class="deck-master-btn-badge">CATALOGUE</span>
        </button>
      </div>

      {/* ========================================================
          ROW 1: ROTATES LEFT TO RIGHT (FORWARD)
          ======================================================== */}
      <div
        class="deck-row-wrapper"
        onMouseEnter={() => setIsHovered1(true)}
        onMouseLeave={() => setIsHovered1(false)}
      >
        <div class="deck-row-header">
          <div class="deck-row-meta">
            <span class="deck-row-pill">ROW 01</span>
            <span class="deck-row-label">CINEMATIC REELS & SHORTS</span>
          </div>

          <div class="deck-row-controls">
            <span class="deck-counter-badge">
              {String(row1Index + 1).padStart(2, '0')} / {String(row1Items.length).padStart(2, '0')}
            </span>
            <button
              type="button"
              class="deck-view-all-pill-btn"
              onClick={() => handleOpenViewAll('row1')}
              aria-label="View all Row 1 videos"
              data-cursor="hover"
            >
              <span>VIEW ALL ({row1Items.length})</span>
              <span class="pill-btn-icon">⊞</span>
            </button>
            <button
              type="button"
              class="deck-nav-btn deck-nav-prev"
              onClick={handlePrevRow1}
              aria-label="Previous Video in Row 1"
              data-cursor="hover"
            >
              <span>‹</span>
            </button>
            <button
              type="button"
              class="deck-nav-btn deck-nav-next"
              onClick={handleNextRow1}
              aria-label="Next Video in Row 1"
              data-cursor="hover"
            >
              <span>›</span>
            </button>
          </div>
        </div>

        {/* 3D Stage with 3 Visible Videos */}
        <div
          class="deck-stage-wrap"
          onTouchStart={handlePointerDown1}
          onTouchEnd={handlePointerUp1}
          onMouseDown={handlePointerDown1}
          onMouseUp={handlePointerUp1}
        >
          {/* Side Rotation Markers for Quick Click */}
          <button
            type="button"
            class="stage-edge-marker marker-left"
            onClick={handlePrevRow1}
            aria-label="Rotate Row 1 Left"
            data-cursor="hover"
          >
            <span>‹</span>
          </button>

          <div class="deck-3d-stage">
            {tripletRow1.map((slot) => renderFeaturedCard(slot, 1))}
          </div>

          <button
            type="button"
            class="stage-edge-marker marker-right"
            onClick={handleNextRow1}
            aria-label="Rotate Row 1 Right"
            data-cursor="hover"
          >
            <span>›</span>
          </button>
        </div>

        {/* Subtle Cinematic Progress Indicator */}
        <div class="deck-progress-track" aria-hidden="true">
          <div
            class="deck-progress-fill"
            style={{ width: `${((row1Index + 1) / row1Items.length) * 100}%` }}
          />
        </div>
      </div>

      {/* ========================================================
          ROW 2: ROTATES RIGHT TO LEFT (REVERSE)
          ======================================================== */}
      <div
        class="deck-row-wrapper deck-row-secondary"
        onMouseEnter={() => setIsHovered2(true)}
        onMouseLeave={() => setIsHovered2(false)}
      >
        <div class="deck-row-header">
          <div class="deck-row-meta">
            <span class="deck-row-pill">ROW 02</span>
            <span class="deck-row-label">PRODUCTIONS & TEASERS</span>
          </div>

          <div class="deck-row-controls">
            <span class="deck-counter-badge">
              {String(row2Index + 1).padStart(2, '0')} / {String(row2Items.length).padStart(2, '0')}
            </span>
            <button
              type="button"
              class="deck-view-all-pill-btn"
              onClick={() => handleOpenViewAll('row2')}
              aria-label="View all Row 2 videos"
              data-cursor="hover"
            >
              <span>VIEW ALL ({row2Items.length})</span>
              <span class="pill-btn-icon">⊞</span>
            </button>
            <button
              type="button"
              class="deck-nav-btn deck-nav-prev"
              onClick={handlePrevRow2}
              aria-label="Previous Video in Row 2"
              data-cursor="hover"
            >
              <span>‹</span>
            </button>
            <button
              type="button"
              class="deck-nav-btn deck-nav-next"
              onClick={handleNextRow2}
              aria-label="Next Video in Row 2"
              data-cursor="hover"
            >
              <span>›</span>
            </button>
          </div>
        </div>

        {/* 3D Stage with 3 Visible Videos */}
        <div
          class="deck-stage-wrap"
          onTouchStart={handlePointerDown2}
          onTouchEnd={handlePointerUp2}
          onMouseDown={handlePointerDown2}
          onMouseUp={handlePointerUp2}
        >
          {/* Side Rotation Markers for Quick Click */}
          <button
            type="button"
            class="stage-edge-marker marker-left"
            onClick={handlePrevRow2}
            aria-label="Rotate Row 2 Left"
            data-cursor="hover"
          >
            <span>‹</span>
          </button>

          <div class="deck-3d-stage">
            {tripletRow2.map((slot) => renderFeaturedCard(slot, 2))}
          </div>

          <button
            type="button"
            class="stage-edge-marker marker-right"
            onClick={handleNextRow2}
            aria-label="Rotate Row 2 Right"
            data-cursor="hover"
          >
            <span>›</span>
          </button>
        </div>

        {/* Subtle Cinematic Progress Indicator */}
        <div class="deck-progress-track" aria-hidden="true">
          <div
            class="deck-progress-fill"
            style={{ width: `${((row2Index + 1) / row2Items.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  )
}
