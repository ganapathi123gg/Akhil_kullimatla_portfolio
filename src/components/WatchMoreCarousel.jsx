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

  // View All Modal State
  const [isViewAllOpen, setIsViewAllOpen] = useState(false)
  const [viewAllScope, setViewAllScope] = useState('All') // 'All' | 'Shortfilms' | 'Youtube' | etc.
  const [searchQuery, setSearchQuery] = useState('')

  // Listen for global open archive event (e.g. from Work page "VIEW ALL MY WORKS")
  useEffect(() => {
    const handleOpenArchive = (e) => {
      setIsViewAllOpen(true)
      if (e?.detail?.category) {
        setViewAllScope(e.detail.category)
      }
    }
    window.addEventListener('open-video-archive', handleOpenArchive)

    // Deep link support (#archive or #complete-archive)
    if (
      window.location.hash === '#archive' ||
      window.location.hash === '#complete-archive' ||
      window.location.hash === '#all-videos'
    ) {
      setIsViewAllOpen(true)
    }

    return () => window.removeEventListener('open-video-archive', handleOpenArchive)
  }, [])

  // 1st Row: Auto-rotate from left to right (smooth lazy sliding window motion)
  useEffect(() => {
    if (isHovered1 || row1Items.length <= 1 || isViewAllOpen) return
    const interval = setInterval(() => {
      setRow1Index((prev) => (prev + 1) % row1Items.length)
    }, 4400)
    return () => clearInterval(interval)
  }, [isHovered1, row1Items.length, isViewAllOpen])

  // 2nd Row: Auto-rotate in reverse direction with organic offset cadence
  useEffect(() => {
    if (isHovered2 || row2Items.length <= 1 || isViewAllOpen) return
    const interval = setInterval(() => {
      setRow2Index((prev) => (prev - 1 + row2Items.length) % row2Items.length)
    }, 4800)
    return () => clearInterval(interval)
  }, [isHovered2, row2Items.length, isViewAllOpen])

  // ESC key to close View All modal
  useEffect(() => {
    if (!isViewAllOpen) return
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsViewAllOpen(false)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isViewAllOpen])

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

  // Open & Close View All
  const handleOpenViewAll = (scope = 'All') => {
    setViewAllScope(scope)
    setSearchQuery('')
    setIsViewAllOpen(true)
  }

  const handleCloseViewAll = () => {
    setIsViewAllOpen(false)
    setSearchQuery('')
  }

  // Check if an item belongs to a target category section
  const matchesSection = (item, targetSec) => {
    if (!targetSec || targetSec.toLowerCase() === 'all') return true
    const norm = (s) => (s || '').toLowerCase().replace(/[\s-_]+/g, '')
    const t = norm(targetSec)
    const itemCats = (item.categories || [item.category]).map(norm)

    if (itemCats.includes(t)) return true
    if (t === 'shortfilms' && (itemCats.includes('shortfilm') || norm(item.category) === 'shortfilm')) return true
    if (t === 'youtube' && (item.type === 'youtube' || item.youtubeId || item.youtubeUrl || item.categories?.includes('Youtube'))) return true
    if (t === 'reels' && (itemCats.includes('reel') || item.isReel)) return true
    if (t === 'comedy' && itemCats.includes('comedy')) return true
    if (t === 'songs' && (itemCats.includes('song') || itemCats.includes('coversong') || itemCats.includes('musicvideo'))) return true
    if (t === 'vlog' && itemCats.includes('vlog')) return true
    if (t === 'moviereviews' && (itemCats.includes('review') || itemCats.includes('reaction'))) return true
    if (t === 'trailer' && itemCats.includes('trailer')) return true
    if (t === 'teaser' && (itemCats.includes('teaser') || itemCats.includes('glimpse') || norm(item.category) === 'glimpse')) return true
    if (t === 'model' && (itemCats.includes('model') || itemCats.includes('modeling') || item.type === 'image')) return true
    return false
  }

  // Calculate count for each section tab
  const getCategoryCount = (sec) => {
    if (sec === 'All') return allArchiveItems.length
    return allArchiveItems.filter((item) => matchesSection(item, sec)).length
  }

  // Get filtered items for View All
  const getViewAllItems = () => {
    let list = allArchiveItems
    if (viewAllScope !== 'All') {
      list = list.filter((item) => matchesSection(item, viewAllScope))
    }

    if (!searchQuery.trim()) return list
    const q = searchQuery.toLowerCase().trim()
    return list.filter(
      (v) =>
        v.title?.toLowerCase().includes(q) ||
        v.category?.toLowerCase().includes(q) ||
        v.categories?.some((c) => c.toLowerCase().includes(q)) ||
        v.tags?.some((t) => t.toLowerCase().includes(q))
    )
  }

  // Jump to specific video in the rotating deck
  const handleJumpToVideo = (item) => {
    if (item.rowNumber === 1 && typeof item.rowIndex === 'number') {
      setRow1Index(item.rowIndex)
    } else if (item.rowNumber === 2 && typeof item.rowIndex === 'number') {
      setRow2Index(item.rowIndex)
    }
    handleCloseViewAll()
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

  // Render a Card for the Archive / All Videos Library
  const renderArchiveFeaturedCard = (v) => {
    const isImage = v.type === 'image' || v.category === 'MODEL' || v.category === 'Modeling'
    const category = v.primaryCategory || v.category || (isImage ? 'MODEL' : 'SHORT FILM')
    const isReel = v.isReel || category.toUpperCase().includes('REEL')

    let actionLabel = 'WATCH FILM'
    if (isImage) actionLabel = 'VIEW EDITORIAL'
    else if (isReel) actionLabel = 'WATCH REEL'
    else if (category.includes('SONG')) actionLabel = 'PLAY SONG'
    else if (category.includes('TRAILER')) actionLabel = 'WATCH TRAILER'
    else if (category.includes('TEASER') || category.includes('GLIMPSE')) actionLabel = 'WATCH TEASER'
    else if (category.includes('VLOG')) actionLabel = 'WATCH VLOG'
    else if (category.includes('REVIEW') || category.includes('REACTION')) actionLabel = 'WATCH REVIEW'

    const desc =
      v.description ||
      `A cinematic Telugu ${category.toLowerCase()} written & directed by Kullimetla Akhil. Turning every frame into an emotional narrative.`

    return (
      <div
        key={`archive-${v.id || v.youtubeId || v.title}`}
        class="deck-archive-featured-box"
      >
        {/* Left Side: 16:9 Media Box */}
        <div
          class="deck-archive-media"
          onClick={() => {
            onSelectVideo?.(v)
            handleCloseViewAll()
          }}
          data-cursor={isImage ? 'hover' : 'play'}
          role="button"
          tabIndex={0}
          aria-label={`Open ${v.title}`}
        >
          <img
            src={v.cover || v.thumbnail || v.image}
            alt={v.title}
            class="deck-archive-img"
            loading="lazy"
          />
          <div class="deck-archive-media-overlay" />

          {/* Central Round Gold Play / View Button */}
          <div class="deck-archive-play-btn">
            {isImage ? (
              <span style={{ fontSize: '18px', color: '#080808', fontWeight: 800 }}>◈</span>
            ) : (
              <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
            )}
          </div>

          {/* Duration Badge */}
          {v.duration && (
            <span class="deck-archive-duration">{v.duration}</span>
          )}

          {/* Primary Category Badge */}
          <span class="deck-archive-row-badge">{category.toUpperCase()}</span>
        </div>

        {/* Right Side: Information Column */}
        <div class="deck-archive-info">
          <span class="deck-archive-kicker">
            <span class="kicker-highlight">{category.toUpperCase()}</span>
          </span>
          <h4 class="deck-archive-title">{v.title}</h4>
          <p class="deck-archive-desc">{desc}</p>

          <div class="deck-archive-meta-tags">
            {v.categories?.map((cat) => (
              <span class="meta-tag" key={cat}>{cat.toUpperCase()}</span>
            ))}
            {v.year && <span class="meta-tag">{v.year}</span>}
          </div>

          <div class="deck-archive-actions">
            <button
              type="button"
              class="btn-gold-fill deck-archive-watch-btn"
              onClick={() => {
                onSelectVideo?.(v)
                handleCloseViewAll()
              }}
              aria-label={`Open ${v.title}`}
            >
              <span class="deck-archive-play-symbol">{isImage ? '◈' : '▷'}</span>
              <span>{actionLabel}</span>
            </button>
          </div>

          <span class="deck-archive-credits">{v.role || 'Written & Directed by Akhil'}</span>
        </div>
      </div>
    )
  }

  // Display sections for 'All' tab in the archive
  const displaySections = [
    { key: 'Shortfilms', badge: 'SHORT FILMS', title: 'SHORT FILMS & NARRATIVES', hint: 'Original scripted Telugu cinematic short films' },
    { key: 'Reels', badge: 'REELS', title: 'CINEMATIC REELS & COMBAT EDITS', hint: 'High-energy visual edits, action & performance reels' },
    { key: 'Comedy', badge: 'COMEDY', title: 'COMEDY & ENTERTAINMENT', hint: 'Relatable Telugu comedy sketches & viral humor' },
    { key: 'Songs', badge: 'SONGS', title: 'SONGS & MUSIC VIDEOS', hint: 'Official covers and soundtrack visual presentations' },
    { key: 'Vlog', badge: 'VLOGS', title: 'VLOGS & REAL-LIFE MOMENTS', hint: 'Lifestyle, food reviews & on-set crew moments' },
    { key: 'Movie Reviews', badge: 'REVIEWS', title: 'MOVIE REVIEWS & FIRST-DAY TALKS', hint: 'In-depth film analyses, trailer reactions & public reviews' },
    { key: 'Trailer', badge: 'TRAILERS', title: 'OFFICIAL TRAILERS', hint: 'Full-length theatrical-style trailers' },
    { key: 'teaser', badge: 'TEASERS', title: 'TEASERS & GLIMPSES', hint: 'Atmospheric teasers, first looks & mood glimpses' },
    { key: 'Model', badge: 'MODELING', title: 'EDITORIAL CAMPAIGNS & MODELING', hint: 'High-fashion editorial campaigns & portrait studies' },
  ]

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

      {/* ========================================================
          VIEW ALL VIDEOS MODAL ARCHIVE (Complete Video Archive)
          ======================================================== */}
      {isViewAllOpen && (
        <div class="deck-viewall-overlay" onClick={handleCloseViewAll}>
          <div class="deck-viewall-modal" onClick={(e) => e.stopPropagation()}>
            <div class="deck-viewall-header">
              <div class="deck-viewall-header-info">
                <span class="section-tag">COMPLETE VIDEO ARCHIVE</span>
                <h3 class="deck-viewall-title">
                  All Videos Library <span class="deck-viewall-count">({allArchiveItems.length})</span>
                </h3>
                <p class="deck-viewall-subtitle">
                  Browse, search, and stream Kullimetla Akhil's complete repertoire of short films, YouTube productions, reels, comedy sketches, songs, reviews, trailers, teasers, and modeling campaigns.
                </p>
              </div>

              <button
                type="button"
                class="deck-viewall-close-btn"
                onClick={handleCloseViewAll}
                aria-label="Close All Videos"
                data-cursor="hover"
              >
                <span>✕ CLOSE ARCHIVE</span>
              </button>
            </div>

            {/* Filter Tabs & Search Bar */}
            <div class="deck-viewall-controls-bar">
              <div class="deck-viewall-tabs">
                {ARCHIVE_SECTIONS.map((sec) => (
                  <button
                    key={sec}
                    type="button"
                    class={`deck-viewall-tab ${viewAllScope === sec ? 'active' : ''}`}
                    onClick={() => setViewAllScope(sec)}
                    data-cursor="hover"
                  >
                    {sec.toUpperCase()} ({getCategoryCount(sec)})
                  </button>
                ))}
              </div>

              <div class="deck-viewall-search-wrap">
                <span class="deck-search-icon">🔍</span>
                <input
                  type="text"
                  class="deck-viewall-search-input"
                  placeholder={`Search ${allArchiveItems.length} works by title, section, or tag...`}
                  value={searchQuery}
                  onInput={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button
                    type="button"
                    class="deck-search-clear-btn"
                    onClick={() => setSearchQuery('')}
                    aria-label="Clear search"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* Archive Body: Categorized Sections or Filtered Grid */}
            <div class="deck-archive-scroll-container">
              {searchQuery.trim() ? (
                <div class="deck-archive-grid">
                  {getViewAllItems().length === 0 ? (
                    <div class="deck-viewall-empty">
                      <p>No works found matching "{searchQuery}"</p>
                      <button
                        type="button"
                        class="btn-gold-fill"
                        onClick={() => setSearchQuery('')}
                      >
                        Clear Filter
                      </button>
                    </div>
                  ) : (
                    getViewAllItems().map((v) => renderArchiveFeaturedCard(v))
                  )}
                </div>
              ) : viewAllScope === 'All' ? (
                <div class="deck-archive-sections">
                  {displaySections.map((sec) => {
                    const secItems = allArchiveItems.filter((item) => matchesSection(item, sec.key))
                    if (secItems.length === 0) return null
                    return (
                      <div class="deck-archive-row-section" key={sec.key}>
                        <div class="deck-archive-section-header">
                          <div class="deck-archive-section-title-wrap">
                            <span class="deck-archive-section-pill">{sec.badge}</span>
                            <h4 class="deck-archive-section-title">{sec.title}</h4>
                            <span class="deck-archive-section-count">({secItems.length} {secItems.length === 1 ? 'Work' : 'Works'})</span>
                          </div>
                          <span class="deck-archive-section-hint">{sec.hint}</span>
                        </div>

                        <div class="deck-archive-grid">
                          {secItems.map((v) => renderArchiveFeaturedCard(v))}
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div class="deck-archive-sections">
                  <div class="deck-archive-row-section">
                    <div class="deck-archive-section-header">
                      <div class="deck-archive-section-title-wrap">
                        <span class="deck-archive-section-pill">{viewAllScope.toUpperCase()}</span>
                        <h4 class="deck-archive-section-title">{viewAllScope.toUpperCase()} COLLECTION</h4>
                        <span class="deck-archive-section-count">({getViewAllItems().length} {getViewAllItems().length === 1 ? 'Work' : 'Works'})</span>
                      </div>
                      <span class="deck-archive-section-hint">Showing all projects in {viewAllScope}</span>
                    </div>

                    <div class="deck-archive-grid">
                      {getViewAllItems().map((v) => renderArchiveFeaturedCard(v))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
