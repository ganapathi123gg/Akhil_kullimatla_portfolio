import { CREATOR } from '../data/creatorConfig'
import '../styles/Footer.css'

export function Footer({ onNavigate }) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer class="site-footer">
      <div class="container">
        <div class="footer-main-grid">
          {/* Brand */}
          <div class="footer-brand-col">
            <div
              class="brand-logo"
              onClick={() => onNavigate('home')}
              data-cursor="hover"
              role="button"
              tabIndex={0}
            >
              <div class="brand-cube" />
              <span class="brand-text">AKHIL</span>
            </div>
            <p class="footer-tagline">
              Cinematic stories, directed with intent. Short films, scroll-stopping reels, YouTube productions and luxury fashion editorial campaigns.
            </p>
          </div>

          {/* Explore Links */}
          <div>
            <div class="footer-col-title">EXPLORE</div>
            <ul class="footer-links-list">
              <li>
                <button type="button" class="footer-link-btn" onClick={() => onNavigate('home')} data-cursor="hover">Home</button>
              </li>
              <li>
                <button type="button" class="footer-link-btn" onClick={() => onNavigate('about')} data-cursor="hover">About</button>
              </li>
              <li>
                <button type="button" class="footer-link-btn" onClick={() => onNavigate('work')} data-cursor="hover">Work</button>
              </li>
              <li>
                <button type="button" class="footer-link-btn" onClick={() => onNavigate('showreel')} data-cursor="hover">Showreel</button>
              </li>
              <li>
                <button type="button" class="footer-link-btn" onClick={() => onNavigate('contact')} data-cursor="hover">Contact</button>
              </li>
            </ul>
          </div>

          {/* Follow & Connect */}
          <div class="footer-social-col">
            <div class="footer-col-title">FOLLOW & CONNECT</div>
            <div class="footer-social-grid">
              <a
                href={CREATOR.socials.youtube}
                target="_blank"
                rel="noopener noreferrer"
                class="hero-social-pill youtube"
                data-cursor="hover"
                data-cursor-label="YOUTUBE"
              >
                <div class="social-icon-box">
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </div>
                <div class="social-text-box">
                  <span class="social-platform">YOUTUBE</span>
                  <span class="social-handle">@ugeshcreator</span>
                </div>
                <span class="social-arrow-hint">↗</span>
              </a>

              <a
                href={CREATOR.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                class="hero-social-pill instagram"
                data-cursor="hover"
                data-cursor-label="INSTAGRAM"
              >
                <div class="social-icon-box">
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </div>
                <div class="social-text-box">
                  <span class="social-platform">INSTAGRAM</span>
                  <span class="social-handle">@_ugesshhh_</span>
                </div>
                <span class="social-arrow-hint">↗</span>
              </a>

              <a
                href={CREATOR.socials.snapchat}
                target="_blank"
                rel="noopener noreferrer"
                class="hero-social-pill snapchat"
                data-cursor="hover"
                data-cursor-label="SNAPCHAT"
              >
                <div class="social-icon-box">
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.001 2c-3.79 0-6.27 2.68-6.27 5.68 0 .82.19 1.83.54 2.62.15.34.05.51-.25.71-.58.38-1.57.85-1.93 1.5-.26.47-.07.94.49 1.14.77.27 1.87.16 2.53.07.25-.03.42.09.47.33.24 1.15.99 2.06 2.39 2.45.2.06.31.18.25.39-.24.78-1.52 1.34-2.83 1.55-.42.07-.63.29-.53.64.12.44.62.67 1.25.68 1.1.02 2.36-.36 3.49-.91.24-.12.45-.11.66 0 1.13.55 2.39.93 3.49.91.63-.01 1.13-.24 1.25-.68.1-.35-.11-.57-.53-.64-1.31-.21-2.59-.77-2.83-1.55-.06-.21.05-.33.25-.39 1.4-.39 2.15-1.3 2.39-2.45.05-.24.22-.36.47-.33.66.09 1.76.2 2.53-.07.56-.2.75-.67.49-1.14-.36-.65-1.35-1.12-1.93-1.5-.3-.2-.4-.37-.25-.71.35-.79.54-1.8.54-2.62 0-3-2.48-5.68-6.27-5.68z"/>
                  </svg>
                </div>
                <div class="social-text-box">
                  <span class="social-platform">SNAPCHAT</span>
                  <span class="social-handle">@ugessshhh</span>
                </div>
                <span class="social-arrow-hint">↗</span>
              </a>

              <a
                href={`mailto:${CREATOR.contactEmail}`}
                class="hero-social-pill email"
                data-cursor="hover"
                data-cursor-label="EMAIL"
              >
                <div class="social-icon-box">
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </div>
                <div class="social-text-box">
                  <span class="social-platform">EMAIL</span>
                  <span class="social-handle">{CREATOR.contactEmail}</span>
                </div>
                <span class="social-arrow-hint">↗</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom row */}
        <div class="footer-bottom-row">
          <div>2026 {CREATOR.name} — All Rights Reserved</div>
          <button type="button" class="back-to-top-btn" onClick={scrollToTop} data-cursor="hover">
            <span>BACK TO TOP</span>
            <span>↑</span>
          </button>
        </div>
      </div>
    </footer>
  )
}
