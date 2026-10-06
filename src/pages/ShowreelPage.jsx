import { useState, useRef } from 'preact/hooks'
import { SHOWREEL_DATA, WATCH_MORE_VIDEOS, BTS_GALLERY, TESTIMONIALS } from '../data/creatorConfig'
import signatureBanner from '../assets/signature_baner_updated.png'
import { WatchMoreCarousel } from '../components/WatchMoreCarousel'
import { TestimonialCard } from '../components/TestimonialCard'

export function ShowreelPage({ onOpenVideo, onSelectImage, setCursorState }) {
  const [isPlayingMain, setIsPlayingMain] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentTime, setCurrentTime] = useState('00:00')
  const mainVideoRef = useRef(null)

  const handleMainPlayToggle = () => {
    if (!mainVideoRef.current) return
    if (isPlayingMain) {
      mainVideoRef.current.pause()
      setIsPlayingMain(false)
    } else {
      mainVideoRef.current.play()
      setIsPlayingMain(true)
    }
  }

  const handleTimeUpdate = () => {
    if (!mainVideoRef.current) return
    const current = mainVideoRef.current.currentTime
    const duration = mainVideoRef.current.duration || 168
    setProgress((current / duration) * 100)

    const mins = Math.floor(current / 60).toString().padStart(2, '0')
    const secs = Math.floor(current % 60).toString().padStart(2, '0')
    setCurrentTime(`${mins}:${secs}`)
  }

  const handleScrubberClick = (e) => {
    if (!mainVideoRef.current) return
    const rect = e.currentTarget.getBoundingClientRect()
    const pos = (e.clientX - rect.left) / rect.width
    const duration = mainVideoRef.current.duration || 168
    mainVideoRef.current.currentTime = pos * duration
  }

  return (
    <div class="page-view showreel-page page-transition">
      <div class="container">
        {/* Main Showreel Player */}
        <section class="main-showreel-section">
          <div class="showreel-header-row">
            <div>
              <span class="section-tag">SHOWREEL {SHOWREEL_DATA.year}</span>
              <h1 class="showreel-main-title">{SHOWREEL_DATA.title}</h1>
            </div>
            <div class="showreel-duration-badge">{SHOWREEL_DATA.duration}</div>
          </div>

          <div
            class="showreel-cinema-frame"
            onMouseEnter={() => setCursorState?.({ type: 'play' })}
            onMouseLeave={() => setCursorState?.(null)}
          >
            <video
              ref={mainVideoRef}
              src={SHOWREEL_DATA.videoUrl}
              poster={signatureBanner}
              onTimeUpdate={handleTimeUpdate}
              onEnded={() => setIsPlayingMain(false)}
              playsInline
              class="showreel-video"
              onClick={handleMainPlayToggle}
            />

            {/* Centered Play Button (when paused) */}
            {!isPlayingMain && (
              <div class="showreel-play-overlay" onClick={handleMainPlayToggle}>
                <div class="showreel-play-button">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                </div>
              </div>
            )}

            {/* Scrubber Progress Bar */}
            <div class="showreel-controls-bar">
              <span class="time-label">{currentTime}</span>
              <div class="scrubber-track" onClick={handleScrubberClick}>
                <div class="scrubber-fill" style={{ width: `${progress}%` }} />
              </div>
              <span class="time-label">{SHOWREEL_DATA.duration}</span>
            </div>
          </div>
        </section>

        {/* Showreel Description & Specs */}
        <section class="showreel-description-section">
          <div class="desc-grid">
            <div class="desc-text-col">
              <span class="section-tag">SHOWREEL DESCRIPTION</span>
              <h2 class="desc-title">{SHOWREEL_DATA.heading}</h2>
              <p class="desc-para">{SHOWREEL_DATA.description}</p>
            </div>

            <div class="specs-col">
              <div class="spec-box">
                <div class="spec-number shimmer-text">{SHOWREEL_DATA.duration}</div>
                <div class="spec-label">DURATION</div>
              </div>
              <div class="spec-box">
                <div class="spec-number shimmer-text">{SHOWREEL_DATA.projectsCount}</div>
                <div class="spec-label">PROJECTS</div>
              </div>
              <div class="spec-box">
                <div class="spec-number shimmer-text">{SHOWREEL_DATA.format}</div>
                <div class="spec-label">FORMAT</div>
              </div>
            </div>
          </div>
        </section>

        {/* Video Library: Watch More */}
        <section class="watch-more-section">
          <span class="section-tag">VIDEO LIBRARY</span>
          <h2 class="watch-more-heading">Watch More</h2>

          <WatchMoreCarousel
            videos={WATCH_MORE_VIDEOS}
            onSelectVideo={onOpenVideo}
          />
        </section>

        {/* Behind The Scenes: On Set With The Director */}
        <section class="bts-section">
          <span class="section-tag">BEHIND THE SCENES</span>
          <h2 class="bts-heading">On Set With The Director</h2>

          <div class="bts-marquee-wrapper">
            <div class="bts-marquee-track scroll-left">
              <div class="bts-marquee-group">
                {BTS_GALLERY.map((bts, index) => (
                  <div
                    key={`sp1-${bts.id || index}`}
                    class="bts-card"
                    onClick={() => {
                      if (bts.type === 'video' && onOpenVideo) {
                        onOpenVideo({
                          id: bts.id,
                          title: bts.title,
                          category: 'BEHIND THE SCENES',
                          videoType: 'mp4',
                          videoUrl: bts.videoUrl,
                          duration: 'BTS',
                        })
                      } else if (onSelectImage) {
                        onSelectImage(bts, index, BTS_GALLERY)
                      }
                    }}
                    onMouseEnter={() => setCursorState?.({ type: bts.type === 'video' ? 'play' : 'view' })}
                    onMouseLeave={() => setCursorState?.(null)}
                  >
                    {bts.type === 'video' ? (
                      <div class="bts-video-wrap">
                        <video
                          src={bts.videoUrl}
                          autoPlay
                          loop
                          muted
                          playsInline
                          class="bts-img bts-video"
                        />
                        <div class="bts-play-badge">
                          <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z" fill="currentColor"/></svg>
                        </div>
                      </div>
                    ) : (
                      <img src={bts.image} alt={bts.title} class="bts-img" loading="lazy" />
                    )}
                    <div class="bts-card-overlay">
                      <span class="bts-pill">{bts.label}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div class="bts-marquee-group" aria-hidden="true">
                {BTS_GALLERY.map((bts, index) => (
                  <div
                    key={`sp2-${bts.id || index}`}
                    class="bts-card"
                    onClick={() => {
                      if (bts.type === 'video' && onOpenVideo) {
                        onOpenVideo({
                          id: bts.id,
                          title: bts.title,
                          category: 'BEHIND THE SCENES',
                          videoType: 'mp4',
                          videoUrl: bts.videoUrl,
                          duration: 'BTS',
                        })
                      } else if (onSelectImage) {
                        onSelectImage(bts, index, BTS_GALLERY)
                      }
                    }}
                    onMouseEnter={() => setCursorState?.({ type: bts.type === 'video' ? 'play' : 'view' })}
                    onMouseLeave={() => setCursorState?.(null)}
                  >
                    {bts.type === 'video' ? (
                      <div class="bts-video-wrap">
                        <video
                          src={bts.videoUrl}
                          autoPlay
                          loop
                          muted
                          playsInline
                          class="bts-img bts-video"
                        />
                        <div class="bts-play-badge">
                          <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z" fill="currentColor"/></svg>
                        </div>
                      </div>
                    ) : (
                      <img src={bts.image} alt={bts.title} class="bts-img" loading="lazy" />
                    )}
                    <div class="bts-card-overlay">
                      <span class="bts-pill">{bts.label}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Client Stories: Kind Words */}
        <section class="testimonials-section">
          <span class="section-tag">CLIENT STORIES</span>
          <h2 class="testimonials-heading">Kind Words</h2>

          <div class="testimonials-grid">
            {TESTIMONIALS.map((t) => (
              <TestimonialCard key={t.id} testimonial={t} />
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
