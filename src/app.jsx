import { useState, useEffect } from 'preact/hooks'
import { CREATOR } from './data/creatorConfig'
import { soundManager } from './utils/audio'
import { CustomCursor } from './components/CustomCursor'
import { Navbar } from './components/Navbar'
import { Hero } from './components/Hero'
import { StatsCounter } from './components/StatsCounter'
import { RoleMarquee, BrandMarquee } from './components/BrandMarquee'
import { QuoteBanner } from './components/QuoteBanner'
import { AboutSection } from './components/AboutSection'
import { WorkSection } from './components/WorkSection'
import { ShowreelSection } from './components/ShowreelSection'
import { ContactSection } from './components/ContactSection'
import { Footer } from './components/Footer'
import { VideoModal } from './components/VideoModal'
import { BookModal } from './components/BookModal'

import signatureBannerImg from './assets/signature_baner_updated.png'
import directorNoteBg from './assets/baner_img.png'
import theLastFrameImg from './assets/the-last-frame.jpg'

import './styles/App.css'

export function App() {
  const [activeTab, setActiveTab] = useState('home')
  const [theme, setTheme] = useState('dark')
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [selectedVideo, setSelectedVideo] = useState(null)
  const [lastClickedVideoId, setLastClickedVideoId] = useState(null)
  const [isBookModalOpen, setIsBookModalOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState('')

  // Manage Theme Attribute on <html>
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  // Track active section on scroll with IntersectionObserver
  useEffect(() => {
    const sectionIds = ['home', 'about', 'work', 'showreel', 'contact']
    const observers = []

    sectionIds.forEach((id) => {
      const el = document.getElementById(id)
      if (!el) return

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveTab(id)
          }
        },
        { rootMargin: '-40% 0px -40% 0px' }
      )
      observer.observe(el)
      observers.push(observer)
    })

    return () => {
      observers.forEach((obs) => obs.disconnect())
    }
  }, [])

  // Show a quick toast notification
  const triggerToast = (msg) => {
    setToastMessage(msg)
    soundManager.playPop()
    setTimeout(() => {
      setToastMessage('')
    }, 3500)
  }

  // Smooth navigation handler
  const handleNavigate = (targetId) => {
    soundManager.playTick()
    setActiveTab(targetId)

    const el = document.getElementById(targetId)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
      if (window.history.pushState) {
        window.history.pushState(null, '', `#${targetId}`)
      }
    } else if (targetId === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleToggleTheme = () => {
    soundManager.playPop()
    const nextTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(nextTheme)
    triggerToast(nextTheme === 'dark' ? 'Onyx Dark Mode' : 'Champagne Light Mode')
  }

  const handleToggleSound = () => {
    const newState = soundManager.toggle()
    setSoundEnabled(newState)
    triggerToast(newState ? 'Sound Effects Enabled' : 'Sound Effects Muted')
  }

  const handleSelectVideo = (video) => {
    soundManager.playChime()
    setLastClickedVideoId(video.id)
    setSelectedVideo(video)
  }

  const handleCloseVideo = () => {
    const returnId = lastClickedVideoId
    setSelectedVideo(null)
    soundManager.playPop()
    if (returnId) {
      setTimeout(() => {
        const el = document.getElementById(`video-${returnId}`)
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
      }, 80)
    }
  }

  const handleOpenBookModal = () => {
    soundManager.playTick()
    setIsBookModalOpen(true)
  }

  return (
    <div class="app-wrapper">
      {/* Film grain atmospheric overlay */}
      <div class="film-grain-overlay" />

      {/* Trailing precision magnetic cursor */}
      <CustomCursor />

      {/* Sticky Navigation matching Nav.png */}
      <Navbar
        activeTab={activeTab}
        onNavigate={handleNavigate}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        onOpenBookModal={handleOpenBookModal}
      />

      <main class="main-content">
        {/* HERO SECTION matching Home.png */}
        <div id="home" class="section-anchor">
          <Hero
            onExploreWork={() => handleNavigate('work')}
            onCollaborate={() => handleNavigate('contact')}
          />
        </div>

        {/* STATS BAR (120K+ Subscribers, 40+ Films & Reels, 5M+ Views, 12 Awards) */}
        <StatsCounter />

        {/* SIGNATURE VISUAL BANNER matching Home.png */}
        <QuoteBanner
          tag="SIGNATURE VISUAL"
          quote={CREATOR.signatureStatement}
          author={CREATOR.signatureSub}
          bgImage={signatureBannerImg}
          variant="signature-visual-banner"
        />

        {/* ROLE TICKER MARQUEE matching Home.png (DIRECTOR · YOUTUBER · MODEL · EDITOR · STORYTELLER) */}
        <RoleMarquee roles={CREATOR.tickerRoles} />

        {/* ABOUT SECTION matching About.png */}
        <div id="about" class="section-anchor">
          <AboutSection />
        </div>

        {/* DIRECTOR'S NOTE BANNER matching About.png */}
        <QuoteBanner
          tag="DIRECTOR'S NOTE"
          quote={CREATOR.directorNote}
          author={`${CREATOR.name} — DIRECTOR / EDITOR / MODEL`}
          bgImage={directorNoteBg}
          variant="directors-note-banner"
        />

        {/* SELECTED WORKS SECTION matching Work.png */}
        <div id="work" class="section-anchor">
          <WorkSection onSelectVideo={handleSelectVideo} />
        </div>

        {/* SHOWREEL SECTION matching Showreel.png */}
        <div id="showreel" class="section-anchor">
          <ShowreelSection onSelectVideo={handleSelectVideo} />
        </div>

        {/* BRAND SPONSORS MARQUEE matching Work.png (LUMEN, NOIR, VANTA, ARCLIGHT, etc.) */}
        <BrandMarquee brands={CREATOR.brands} />

        {/* CONTACT & FAQS SECTION matching Contact.png */}
        <div id="contact" class="section-anchor">
          <ContactSection />
        </div>
      </main>

      {/* FOOTER matching all wireframes */}
      <Footer onNavigate={handleNavigate} />

      {/* Video Lightbox Cinema Modal */}
      {selectedVideo && (
        <VideoModal
          video={selectedVideo}
          onClose={handleCloseVideo}
        />
      )}

      {/* Book Consultation Modal */}
      <BookModal
        isOpen={isBookModalOpen}
        onClose={() => setIsBookModalOpen(false)}
      />

      {/* Toast Feedback */}
      {toastMessage && (
        <div class="toast-notification" role="status">
          <span class="toast-icon">◆</span>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  )
}
