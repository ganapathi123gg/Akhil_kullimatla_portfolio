import { useState, useEffect, useRef } from 'preact/hooks'
import { ARCHIVE_SECTIONS, getAllArchiveItems } from '../data/creatorConfig'
import '../styles/VideoLibraryPage.css'

export function VideoLibraryPage({
  isOpen,
  onClose,
  onSelectVideo,
  initialCategory = 'All',
}) {
  if (!isOpen) return null

  const rootRef = useRef(null)
  const allItems = getAllArchiveItems()

  const [activeCategory, setActiveCategory] = useState(initialCategory || 'All')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('default')
  const [selectedPhoto, setSelectedPhoto] = useState(null)

  // Sync category if initialCategory changes
  useEffect(() => {
    if (initialCategory) {
      setActiveCategory(initialCategory)
    }
  }, [initialCategory])

  // Lock body scroll and listen for Escape key
  useEffect(() => {
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (selectedPhoto) {
          setSelectedPhoto(null)
        } else {
          e.preventDefault()
          onClose && onClose()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    if (rootRef.current) rootRef.current.focus()

    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [selectedPhoto])

  // Match item against category section
  const matchesCategory = (item, targetSec) => {
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

  // Calculate count for each category pill
  const getCategoryCount = (sec) => {
    if (sec === 'All') return allItems.length
    return allItems.filter((item) => matchesCategory(item, sec)).length
  }

  // Filter and sort items
  const getFilteredItems = () => {
    let list = allItems
    if (activeCategory !== 'All') {
      list = list.filter((item) => matchesCategory(item, activeCategory))
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim()
      list = list.filter(
        (v) =>
          v.title?.toLowerCase().includes(q) ||
          v.category?.toLowerCase().includes(q) ||
          v.categories?.some((c) => c.toLowerCase().includes(q)) ||
          v.tags?.some((t) => t.toLowerCase().includes(q)) ||
          v.description?.toLowerCase().includes(q)
      )
    }

    if (sortBy === 'title') {
      return [...list].sort((a, b) => (a.title || '').localeCompare(b.title || ''))
    }
    if (sortBy === 'category') {
      return [...list].sort((a, b) => (a.category || '').localeCompare(b.category || ''))
    }
    if (sortBy === 'newest') {
      return [...list].sort((a, b) => (b.year || '0').localeCompare(a.year || '0'))
    }

    return list
  }

  const filteredItems = getFilteredItems()

  // Display sections for 'All' tab when no search query
  const displaySections = [
    { key: 'Shortfilms', badge: 'SHORT FILMS', title: 'SHORT FILMS & NARRATIVES', hint: 'Original scripted Telugu cinematic short films' },
    { key: 'Reels', badge: 'REELS', title: 'CINEMATIC REELS & ACTION EDITS', hint: 'High-energy visual edits, action choreography & performance reels' },
    { key: 'Comedy', badge: 'COMEDY', title: 'COMEDY & ENTERTAINMENT', hint: 'Relatable Telugu comedy sketches & viral humor' },
    { key: 'Songs', badge: 'SONGS', title: 'SONGS & MUSIC PRESENTATIONS', hint: 'Official covers and soundtrack visual presentations' },
    { key: 'Vlog', badge: 'VLOGS', title: 'VLOGS & REAL-LIFE MOMENTS', hint: 'Lifestyle, food reviews & on-set crew moments' },
    { key: 'Movie Reviews', badge: 'REVIEWS', title: 'MOVIE REVIEWS & FIRST-DAY TALKS', hint: 'In-depth film analyses, trailer reactions & public reviews' },
    { key: 'Trailer', badge: 'TRAILERS', title: 'OFFICIAL TRAILERS', hint: 'Full-length theatrical-style trailers' },
    { key: 'teaser', badge: 'TEASERS', title: 'TEASERS & GLIMPSES', hint: 'Atmospheric teasers, first looks & mood glimpses' },
    { key: 'Model', badge: 'MODELING', title: 'EDITORIAL CAMPAIGNS & MODELING', hint: 'High-fashion editorial campaigns & portrait studies' },
  ]

  const handleCardClick = (item) => {
    const isImage = item.type === 'image' || item.category === 'MODEL' || item.category === 'Modeling'
    if (isImage) {
      setSelectedPhoto(item)
    } else {
      onSelectVideo && onSelectVideo(item)
    }
  }

  // Render individual video / project card
  const renderItemCard = (v) => {
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
      <article
        key={`video-item-${v.id || v.youtubeId || v.title}`}
        class="vlib-project-card"
        onClick={() => handleCardClick(v)}
        data-cursor={isImage ? 'hover' : 'play'}
        data-cursor-label={isImage ? 'VIEW' : 'PLAY'}
      >
        {/* Media Thumbnail Container with Standard 16:9 Aspect Ratio */}
        <div class="vlib-card-media">
          <img
            src={v.cover || v.thumbnail || v.image}
            alt={v.title}
            class="vlib-card-img"
            loading="lazy"
          />
          <div class="vlib-media-overlay" />

          {/* Central Play Badge */}
          <div class="vlib-play-btn-circle" aria-hidden="true">
            {isImage ? (
              <span class="vlib-photo-icon">◈</span>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
            )}
          </div>

          {/* Duration Badge */}
          {v.duration && (
            <span class="vlib-duration-pill">{v.duration}</span>
          )}

          {/* Category Pill Tag on Media */}
          <span class="vlib-media-category-pill">{category.toUpperCase()}</span>
        </div>

        {/* Card Metadata & Body */}
        <div class="vlib-card-body">
          <div class="vlib-card-header-meta">
            <span class="vlib-card-kicker">{category.toUpperCase()}</span>
            {v.year && <span class="vlib-card-year">{v.year}</span>}
          </div>

          <h3 class="vlib-card-title">{v.title}</h3>
          <p class="vlib-card-desc">{desc}</p>

          {/* Meta Tags Row */}
          <div class="vlib-meta-tags-row">
            {v.categories?.slice(0, 3).map((cat) => (
              <span class="vlib-meta-tag" key={cat}>{cat.toUpperCase()}</span>
            ))}
            <span class="vlib-meta-tag">TELUGU</span>
          </div>

          {/* Card Footer Action */}
          <div class="vlib-card-footer">
            <button
              type="button"
              class="btn-gold-fill vlib-action-btn"
              onClick={(e) => {
                e.stopPropagation()
                handleCardClick(v)
              }}
              aria-label={`Open ${v.title}`}
              data-cursor={isImage ? 'hover' : 'play'}
              data-cursor-label={isImage ? 'VIEW' : 'PLAY'}
            >
              <span class="btn-icon">{isImage ? '◈' : '▷'}</span>
              <span>{actionLabel}</span>
            </button>

            <span class="vlib-credits-text">
              {v.role || 'Written & Directed by Akhil'}
            </span>
          </div>
        </div>
      </article>
    )
  }

  return (
    <div
      ref={rootRef}
      class="video-library-page-root"
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      aria-label="Complete Video Library"
    >
      {/* Background Ambience Layers */}
      <div class="vlib-backdrop-glow" />
      <div class="vlib-backdrop-grid" />

      {/* Sticky Top Header with Breadcrumbs & High-Visibility Close X Button */}
      <header class="vlib-sticky-header">
        <div class="vlib-header-inner">
          {/* Identity & Breadcrumb */}
          <div class="vlib-header-identity">
            <span class="vlib-author-name">UGESH KULLIMATLA</span>
            <span class="vlib-sep">/</span>
            <span class="vlib-crumb-title">COMPLETE WORKS ARCHIVE</span>
            <span class="vlib-total-badge">{allItems.length} WORKS</span>
          </div>

          {/* Clearly Visible X (Close) Button */}
          <button
            type="button"
            class="vlib-close-x-btn"
            onClick={onClose}
            aria-label="Close Video Library and Return to Previous Page"
            data-cursor="hover"
          >
            <span class="vlib-close-text">CLOSE</span>
            <div class="vlib-close-icon-box">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.4"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </div>
          </button>
        </div>
      </header>

      {/* Immediate Controls Toolbar (No large empty space, starts immediately) */}
      <div class="vlib-controls-bar">
        <div class="vlib-controls-inner">
          {/* Category Filter Pills Bar (Horizontally Scrollable) */}
          <div
            class="vlib-category-tabs"
            role="tablist"
            aria-label="Video Library Categories"
          >
            {ARCHIVE_SECTIONS.map((sec) => {
              const count = getCategoryCount(sec)
              const isActive = activeCategory === sec
              return (
                <button
                  key={sec}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  class={`vlib-category-tab ${isActive ? 'active' : ''}`}
                  onClick={() => setActiveCategory(sec)}
                  data-cursor="hover"
                >
                  <span class="tab-label">{sec.toUpperCase()}</span>
                  <span class="tab-count">{count}</span>
                </button>
              )
            })}
          </div>

          {/* Search Input & Sort Row */}
          <div class="vlib-search-sort-row">
            {/* Search Input */}
            <div class="vlib-search-box">
              <span class="vlib-search-icon" aria-hidden="true">🔍</span>
              <input
                type="text"
                class="vlib-search-input"
                placeholder={`Search ${allItems.length} works by title, genre, or keyword...`}
                value={searchQuery}
                onInput={(e) => setSearchQuery(e.target.value)}
                aria-label="Search video archive"
              />
              {searchQuery && (
                <button
                  type="button"
                  class="vlib-search-clear-btn"
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search query"
                  data-cursor="hover"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Sorting Dropdown & Status */}
            <div class="vlib-filter-controls">
              <div class="vlib-sort-wrapper">
                <span class="vlib-sort-label">SORT:</span>
                <select
                  class="vlib-sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  aria-label="Sort videos"
                  data-cursor="hover"
                >
                  <option value="default">Repertoire Order</option>
                  <option value="title">Title (A - Z)</option>
                  <option value="category">Category</option>
                  <option value="newest">Latest Release</option>
                </select>
              </div>

              <div class="vlib-results-counter">
                <span>{filteredItems.length} {filteredItems.length === 1 ? 'Project' : 'Projects'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Video Repertoire Content (Zero empty spaces) */}
      <main class="vlib-main-scroll-area">
        <div class="vlib-main-container">
          {/* Case 1: Search Query or specific category filter active */}
          {searchQuery.trim() || activeCategory !== 'All' ? (
            <div class="vlib-filtered-view">
              {filteredItems.length === 0 ? (
                <div class="vlib-empty-state">
                  <span class="empty-icon">🎬</span>
                  <h4 class="empty-title">No projects found</h4>
                  <p class="empty-desc">
                    No works matched your current filter "{searchQuery || activeCategory}".
                  </p>
                  <button
                    type="button"
                    class="btn-gold-fill"
                    onClick={() => {
                      setSearchQuery('')
                      setActiveCategory('All')
                    }}
                    data-cursor="hover"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                <div class="vlib-cards-grid">
                  {filteredItems.map((item) => renderItemCard(item))}
                </div>
              )}
            </div>
          ) : (
            /* Case 2: All Repertoire categorized by section */
            <div class="vlib-sections-stack">
              {displaySections.map((sec) => {
                const secItems = allItems.filter((item) => matchesCategory(item, sec.key))
                if (secItems.length === 0) return null

                return (
                  <section class="vlib-genre-section" key={sec.key}>
                    <div class="vlib-genre-header">
                      <div class="vlib-genre-title-wrap">
                        <span class="vlib-genre-badge">{sec.badge}</span>
                        <h2 class="vlib-genre-title">{sec.title}</h2>
                        <span class="vlib-genre-count">({secItems.length})</span>
                      </div>
                      <p class="vlib-genre-hint">{sec.hint}</p>
                    </div>

                    <div class="vlib-cards-grid">
                      {secItems.map((item) => renderItemCard(item))}
                    </div>
                  </section>
                )
              })}
            </div>
          )}
        </div>
      </main>

      {/* Photo Lightbox Modal for Editorial Modeling */}
      {selectedPhoto && (
        <div class="vlib-photo-lightbox" onClick={() => setSelectedPhoto(null)}>
          <div class="vlib-photo-content" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              class="vlib-photo-close-btn"
              onClick={() => setSelectedPhoto(null)}
              aria-label="Close Photo"
              data-cursor="hover"
            >
              ✕
            </button>
            <img
              src={selectedPhoto.cover || selectedPhoto.thumbnail || selectedPhoto.image}
              alt={selectedPhoto.title}
              class="vlib-photo-img"
            />
            <div class="vlib-photo-info">
              <h4>{selectedPhoto.title}</h4>
              <p>{selectedPhoto.description || 'High-fashion editorial portrait study'}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
