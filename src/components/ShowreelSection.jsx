import { SHOWREEL_DATA, WATCH_MORE_VIDEOS, BTS_GALLERY, TESTIMONIALS } from '../data/creatorConfig'
import signatureBannerImg from '../assets/signature_baner_updated.png'
import { WatchMoreCarousel } from './WatchMoreCarousel'
import { TestimonialCard } from './TestimonialCard'
import '../styles/ShowreelSection.css'

export function ShowreelSection({ onSelectVideo }) {
  const masterVideo = {
    id: 'master-showreel-2026',
    title: SHOWREEL_DATA.title,
    category: 'DIRECTOR SHOWREEL',
    description: SHOWREEL_DATA.description,
    duration: SHOWREEL_DATA.duration,
    videoType: 'mp4',
    videoUrl: SHOWREEL_DATA.videoUrl,
  }

  return (
    <section class="showreel-section" id="showreel">
      <div class="container">
        {/* Top Header & Timecode Badge */}
        <div class="showreel-hero-wrap">
          <div class="showreel-header-row">
            <div>
              <div class="section-tag">SHOWREEL 2026</div>
              <h2 class="hero-title" style={{ fontSize: 'clamp(36px, 4.5vw, 64px)', marginBottom: '0' }}>
                The <span class="hero-highlight">Director's Cut</span>
              </h2>
            </div>
            <div class="showreel-timecode-badge">{SHOWREEL_DATA.duration}</div>
          </div>

          {/* Master 4K Showreel Player Card */}
          <div
            id="video-master-showreel"
            class="master-player-card"
            onClick={() => onSelectVideo(masterVideo)}
            data-cursor="play"
            data-cursor-label="PLAY"
          >
            <img
              src={signatureBannerImg}
              alt="Director's Cut Showreel Thumbnail"
              class="master-player-video"
              loading="lazy"
            />

            <div class="master-play-circle">
              <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
            </div>

            <div class="master-timeline-preview">
              <span class="timeline-stamp">00:00</span>
              <div class="timeline-bar-fake">
                <div class="timeline-bar-progress" />
              </div>
              <span class="timeline-stamp">{SHOWREEL_DATA.duration}</span>
            </div>
          </div>

          {/* Description & Technical Metrics */}
          <div class="showreel-desc-metrics-grid">
            <div>
              <div class="section-tag">SHOWREEL DESCRIPTION</div>
              <h3 class="journey-title" style={{ fontSize: '32px' }}>{SHOWREEL_DATA.heading}</h3>
              <p class="about-p">{SHOWREEL_DATA.description}</p>
            </div>

            <div class="showreel-metrics-row">
              <div class="metric-box">
                <div class="metric-num">{SHOWREEL_DATA.duration}</div>
                <div class="metric-label">DURATION</div>
              </div>
              <div class="metric-box">
                <div class="metric-num">{SHOWREEL_DATA.projectsCount}</div>
                <div class="metric-label">PROJECTS</div>
              </div>
              <div class="metric-box">
                <div class="metric-num">{SHOWREEL_DATA.format}</div>
                <div class="metric-label">FORMAT</div>
              </div>
            </div>
          </div>
        </div>

        {/* Watch More (Video Library — 3D Coverflow Deck) */}
        <div class="watch-more-section">
          <div class="section-tag">VIDEO LIBRARY</div>
          <h3 class="journey-title">Watch More</h3>

          <WatchMoreCarousel
            videos={WATCH_MORE_VIDEOS}
            onSelectVideo={onSelectVideo}
          />
        </div>

      </div>

      {/* On Set With The Director (BTS Infinite Moving Showcase) */}
      <div class="bts-section">
        <div class="container">
          <div class="section-tag">BEHIND THE SCENES</div>
          <h3 class="journey-title">On Set With the Director</h3>
        </div>

        <div class="bts-marquee-wrapper">
          <div class="bts-marquee-track scroll-left">
            {/* Group 1 */}
            <div class="bts-marquee-group">
              {BTS_GALLERY.map((bts, idx) => (
                <div
                  class="bts-card"
                  key={`bts-1-${bts.id || idx}`}
                  data-cursor="hover"
                  data-cursor-label={bts.type === 'video' ? 'PLAY' : 'VIEW'}
                  onClick={() => {
                    if (bts.type === 'video' && onSelectVideo) {
                      onSelectVideo({
                        id: bts.id,
                        title: bts.title,
                        category: 'BEHIND THE SCENES',
                        videoType: 'mp4',
                        videoUrl: bts.videoUrl,
                        duration: 'BTS',
                      })
                    }
                  }}
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
                    <img
                      src={bts.image}
                      alt={bts.title}
                      class="bts-img"
                      loading="lazy"
                    />
                  )}
                  <div class="bts-label-tag">{bts.label}</div>
                  <div class="bts-title-tag">{bts.title}</div>
                </div>
              ))}
            </div>

            {/* Group 2 (Clone for infinite seamless loop) */}
            <div class="bts-marquee-group" aria-hidden="true">
              {BTS_GALLERY.map((bts, idx) => (
                <div
                  class="bts-card"
                  key={`bts-2-${bts.id || idx}`}
                  data-cursor="hover"
                  data-cursor-label={bts.type === 'video' ? 'PLAY' : 'VIEW'}
                  onClick={() => {
                    if (bts.type === 'video' && onSelectVideo) {
                      onSelectVideo({
                        id: bts.id,
                        title: bts.title,
                        category: 'BEHIND THE SCENES',
                        videoType: 'mp4',
                        videoUrl: bts.videoUrl,
                        duration: 'BTS',
                      })
                    }
                  }}
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
                    <img
                      src={bts.image}
                      alt={bts.title}
                      class="bts-img"
                      loading="lazy"
                    />
                  )}
                  <div class="bts-label-tag">{bts.label}</div>
                  <div class="bts-title-tag">{bts.title}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div class="container">

        {/* Client Stories / Testimonials */}
        <div class="testimonials-section">
          <div class="section-tag">CLIENT STORIES</div>
          <h3 class="journey-title">Kind Words</h3>

          <div class="testimonials-grid">
            {TESTIMONIALS.map((t) => (
              <TestimonialCard key={t.id} testimonial={t} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
