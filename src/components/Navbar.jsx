import { useState, useEffect } from 'preact/hooks'
import { CREATOR } from '../data/creatorConfig'
import logoImg from '../assets/logo.png'
import '../styles/Navbar.css'

export function Navbar({
  activeTab,
  onNavigate,
  theme,
  onToggleTheme,
  soundEnabled,
  onToggleSound,
  onOpenBookModal,
}) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'work', label: 'Work' },
    { id: 'showreel', label: 'Showreel' },
    { id: 'contact', label: 'Contact' },
  ]

  const handleNavClick = (id) => {
    onNavigate(id)
    setMobileMenuOpen(false)
  }

  return (
    <header class={`site-header ${scrolled ? 'scrolled' : ''}`}>
      <div class="nav-container">
        {/* Brand Logo */}
        <div
          class="brand-logo"
          onClick={() => handleNavClick('home')}
          data-cursor="hover"
          data-cursor-label="HOME"
          role="button"
          tabIndex={0}
          aria-label="Akhil Home"
        >
          <div class="brand-logo-frame">
            <img src={logoImg} alt="Akhil Logo" class="brand-logo-img" />
          </div>
          <span class="brand-text">AKHIL</span>
        </div>

        {/* Desktop Nav Links */}
        <nav aria-label="Main Navigation">
          <ul class="nav-menu">
            {navItems.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  class={`nav-link ${activeTab === item.id ? 'active' : ''}`}
                  onClick={() => handleNavClick(item.id)}
                  data-cursor="hover"
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Action Controls */}
        <div class="nav-actions">
          {/* Sound FX Toggle */}
          <button
            type="button"
            class="icon-btn"
            onClick={onToggleSound}
            title={soundEnabled ? 'Mute micro-sounds' : 'Enable micro-sounds'}
            aria-label="Toggle sound effects"
            data-cursor="hover"
          >
            <div class={`sound-bars ${!soundEnabled ? 'muted' : ''}`}>
              <div class="sound-bar" />
              <div class="sound-bar" />
              <div class="sound-bar" />
              <div class="sound-bar" />
            </div>
          </button>

          {/* Dark / Light Mode Toggle */}
          <button
            type="button"
            class="icon-btn"
            onClick={onToggleTheme}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle theme"
            data-cursor="hover"
          >
            {theme === 'dark' ? (
              // Sun Icon
              <svg viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="5" />
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            ) : (
              // Moon Icon
              <svg viewBox="0 0 24 24">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </button>

          {/* Book Now Button (Wireframe match) */}
          <button
            type="button"
            class="btn-book-now"
            onClick={onOpenBookModal}
            data-cursor="hover"
            data-cursor-label="BOOK"
          >
            BOOK NOW
          </button>

          {/* Mobile Hamburger Toggle */}
          <button
            type="button"
            class={`hamburger-btn ${mobileMenuOpen ? 'open' : ''}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            <span class="hamburger-line" />
            <span class="hamburger-line" />
            <span class="hamburger-line" />
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <div class={`mobile-drawer ${mobileMenuOpen ? 'open' : ''}`}>
        <ul class="mobile-nav-list">
          {navItems.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                class={`mobile-nav-link ${activeTab === item.id ? 'active' : ''}`}
                onClick={() => handleNavClick(item.id)}
              >
                <span>{item.label}</span>
                <span class="arrow">→</span>
              </button>
            </li>
          ))}
        </ul>

        <div class="mobile-footer-actions">
          <button
            type="button"
            class="btn-gold-fill"
            onClick={() => {
              setMobileMenuOpen(false)
              onOpenBookModal()
            }}
          >
            BOOK NOW
          </button>
          <div class="mobile-meta-row">
            <span style={{ fontSize: '12px', opacity: 0.6 }}>Direct Inquiries: {CREATOR.contactEmail}</span>
          </div>
        </div>
      </div>
    </header>
  )
}
