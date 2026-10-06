import { useEffect, useRef, useState } from 'preact/hooks'
import '../styles/VideoModal.css'

export function VideoModal({ video, onClose }) {
  const [isPlaying, setIsPlaying] = useState(true)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isMuted, setIsMuted] = useState(false)
  const videoRef = useRef(null)
  const containerRef = useRef(null)

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === ' ' && videoRef.current && e.target.tagName !== 'BUTTON') {
        e.preventDefault()
        togglePlay()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'

    // Scroll modal container to top on open
    if (containerRef.current) {
      containerRef.current.scrollTop = 0
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [onClose])

  if (!video) return null

  const isMp4 = video.videoType === 'mp4' || !video.youtubeId
  const videoSrc = video.videoUrl || (video.youtubeId ? null : video.videoUrl)
  const isReel = video.isReel

  const togglePlay = () => {
    if (!videoRef.current) return
    if (videoRef.current.paused) {
      videoRef.current.play()
      setIsPlaying(true)
    } else {
      videoRef.current.pause()
      setIsPlaying(false)
    }
  }

  const toggleMute = () => {
    if (!videoRef.current) return
    videoRef.current.muted = !videoRef.current.muted
    setIsMuted(videoRef.current.muted)
  }

  const handleTimeUpdate = () => {
    if (!videoRef.current) return
    setCurrentTime(videoRef.current.currentTime)
    setDuration(videoRef.current.duration || 0)
  }

  const handleScrub = (e) => {
    if (!videoRef.current || !duration) return
    const rect = e.currentTarget.getBoundingClientRect()
    const pos = (e.clientX - rect.left) / rect.width
    videoRef.current.currentTime = pos * duration
  }

  const toggleFullscreen = () => {
    if (!videoRef.current) return
    if (!document.fullscreenElement) {
      videoRef.current.requestFullscreen?.()
    } else {
      document.exitFullscreen?.()
    }
  }

  const formatTime = (secs) => {
    if (isNaN(secs)) return '00:00'
    const m = Math.floor(secs / 60)
    const s = Math.floor(secs % 60)
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0

  return (
    <div
      class="video-modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
      role="dialog"
      aria-modal="true"
      aria-label={video.title || 'Video Player Lightbox'}
    >
      <div class="video-modal-container" ref={containerRef}>
        {/* Sticky Top Header with Back Navigation & Close Button */}
        <div class="video-modal-sticky-header">
          <button
            type="button"
            class="modal-back-btn"
            onClick={onClose}
            aria-label="Back to projects"
          >
            <span class="back-arrow">←</span>
            <span>BACK TO PROJECTS</span>
          </button>

          <span class="modal-header-meta">
            {video.category || 'CINEMA SHOWCASE'}
          </span>

          <button
            type="button"
            class="modal-close-btn-sticky"
            onClick={onClose}
            aria-label="Close modal"
          >
            <span>✕ CLOSE</span>
          </button>
        </div>

        {/* Video Player or High-Res Image View */}
        <div class={`video-player-wrapper ${isReel ? 'is-reel-aspect' : ''}`}>
          {video.type === 'image' || video.category === 'Modeling' || video.category === 'MODEL' ? (
            <div
              class="video-modal-image-showcase"
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                background: '#050505',
                minHeight: '420px',
                maxHeight: '74vh',
                padding: '24px',
              }}
            >
              <img
                src={video.cover || video.thumbnail || video.image}
                alt={video.title}
                style={{
                  maxHeight: '70vh',
                  maxWidth: '100%',
                  objectFit: 'contain',
                  borderRadius: '4px',
                  boxShadow: '0 15px 50px rgba(0,0,0,0.85)',
                  border: '1px solid rgba(212, 175, 55, 0.3)',
                }}
              />
            </div>
          ) : isMp4 && videoSrc ? (
            <>
              <video
                ref={videoRef}
                class="video-element"
                src={videoSrc}
                autoPlay
                playsInline
                controls={false}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleTimeUpdate}
                onEnded={() => setIsPlaying(false)}
                onClick={togglePlay}
              />
              <div class="video-custom-controls">
                <div class="timeline-scrubber-wrap" onClick={handleScrub}>
                  <div
                    class="timeline-progress-bar"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <div class="controls-row">
                  <div class="controls-left">
                    <button type="button" class="ctrl-btn" onClick={togglePlay} aria-label={isPlaying ? 'Pause' : 'Play'}>
                      {isPlaying ? (
                        <svg viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                      ) : (
                        <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                      )}
                    </button>
                    <button type="button" class="ctrl-btn" onClick={toggleMute} aria-label={isMuted ? 'Unmute' : 'Mute'}>
                      {isMuted ? (
                        <svg viewBox="0 0 24 24"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>
                      ) : (
                        <svg viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>
                      )}
                    </button>
                    <span class="timecode-display">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </span>
                  </div>
                  <div class="controls-right">
                    <button type="button" class="ctrl-btn" onClick={toggleFullscreen} aria-label="Fullscreen">
                      <svg viewBox="0 0 24 24"><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/></svg>
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <iframe
              class="video-iframe"
              src={`https://www.youtube-nocookie.com/embed/${video.youtubeId || (video.youtubeUrl ? video.youtubeUrl.match(/(?:watch\?v=|youtu\.be\/)([\w-]{11})/)?.[1] : null) || 'dQw4w9WgXcQ'}?autoplay=1&rel=0&modestbranding=1`}
              title={video.title || 'YouTube video'}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          )}
        </div>

        {/* Video Info Details */}
        <div class="video-modal-info">
          <div class="video-modal-meta">
            <span class="video-modal-badge">{video.category || 'FEATURED FILM'} • {video.year || '2026'}</span>
            <h3 class="video-modal-title">{video.title}</h3>
            <p class="video-modal-desc">{video.description}</p>
          </div>
          <div class="video-modal-extra">
            <div>
              <div style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{video.role || 'DIRECTOR / DOP'}</div>
              {video.duration && <div>{video.duration} MINS</div>}
            </div>

            {/* Back button at the bottom as well */}
            <button
              type="button"
              class="bottom-return-btn"
              onClick={onClose}
            >
              <span>← BACK TO PREVIOUS SPOT</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
