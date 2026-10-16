import { useState, useEffect, useRef } from 'preact/hooks'
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
import { CinematicTransitionWrapper } from './components/CinematicTransition'

import signatureBannerImg from './assets/signature_baner_updated.png'
import directorNoteBg from './assets/baner_img.png'

import './styles/App.css'

const VALID_ROUTES = ['home', 'about', 'work', 'showreel', 'contact']

function getInitialRoute() {
  if (typeof window !== 'undefined' && window.location.hash) {
    const hash = window.location.hash.replace('#', '').toLowerCase()
    if (VALID_ROUTES.includes(hash)) {
      return hash
    }
  }
  return 'home'
}

export function App() {
  const [currentRoute, setCurrentRoute] = useState(getInitialRoute)
  const [previousRoute, setPreviousRoute] = useState(null)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [transitionPhase, setTransitionPhase] = useState('idle') // 'idle' | 'exiting' | 'entering'

  const [theme, setTheme] = useState('dark')
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [selectedVideo, setSelectedVideo] = useState(null)
  const [lastClickedVideoId, setLastClickedVideoId] = useState(null)
  const [isBookModalOpen, setIsBookModalOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState('')

  const exitTimerRef = useRef(null)
  const enterTimerRef = useRef(null)

  // Manage Theme Attribute on <html>
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  // Centralized Cinematic Navigation Handler
  const handleNavigate = (targetId, updateHistory = true) => {
    const validTarget = VALID_ROUTES.includes(targetId) ? targetId : 'home'

    // If navigating to current route, smooth scroll to top
    if (validTarget === currentRoute && !isTransitioning) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    // Cancel any ongoing transition timers for rapid clicks
    if (exitTimerRef.current) clearTimeout(exitTimerRef.current)
    if (enterTimerRef.current) clearTimeout(enterTimerRef.current)

    soundManager.playTick()
    setPreviousRoute(currentRoute)
    setIsTransitioning(true)
    setTransitionPhase('exiting')

    if (updateHistory && window.history && window.history.pushState) {
      window.history.pushState(null, '', `#${validTarget}`)
    }

    // Snappy timings: mobile is even faster for low latency
    const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768
    const exitDuration = isMobile ? 180 : 250
    const enterDuration = isMobile ? 480 : 620

    exitTimerRef.current = setTimeout(() => {
      // Switch active scene at transition apex
      setCurrentRoute(validTarget)
      window.scrollTo(0, 0) // Reset scroll position to top
      setTransitionPhase('entering')

      enterTimerRef.current = setTimeout(() => {
        setTransitionPhase('idle')
        setIsTransitioning(false)
      }, enterDuration)
    }, exitDuration)
  }

  // Handle browser back/forward buttons (popstate) and hash changes
  useEffect(() => {
    const handleLocationChange = () => {
      const target = getInitialRoute()
      if (target !== currentRoute) {
        handleNavigate(target, false)
      }
    }

    window.addEventListener('popstate', handleLocationChange)
    window.addEventListener('hashchange', handleLocationChange)
    return () => {
      window.removeEventListener('popstate', handleLocationChange)
      window.removeEventListener('hashchange', handleLocationChange)
      if (exitTimerRef.current) clearTimeout(exitTimerRef.current)
      if (enterTimerRef.current) clearTimeout(enterTimerRef.current)
    }
  }, [currentRoute, isTransitioning])

  // Show a quick toast notification
  const triggerToast = (msg) => {
    setToastMessage(msg)
    soundManager.playPop()
    setTimeout(() => {
      setToastMessage('')
    }, 3500)
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
        activeTab={currentRoute}
        onNavigate={(id) => handleNavigate(id, true)}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        onOpenBookModal={handleOpenBookModal}
      />

      <main class="main-content">
        <CinematicTransitionWrapper
          currentRoute={currentRoute}
          previousRoute={previousRoute}
          isTransitioning={isTransitioning}
          transitionPhase={transitionPhase}
        >
          {/* HOME SCENE */}
          {currentRoute === 'home' && (
            <div id="home" class="scene-stage">
              <Hero
                onExploreWork={() => handleNavigate('work')}
                onCollaborate={() => handleNavigate('contact')}
              />
              <StatsCounter />
              <QuoteBanner
                tag="SIGNATURE VISUAL"
                quote={CREATOR.signatureStatement}
                author={CREATOR.signatureSub}
                bgImage={signatureBannerImg}
                variant="signature-visual-banner"
              />
              <RoleMarquee roles={CREATOR.tickerRoles} />
            </div>
          )}

          {/* ABOUT SCENE */}
          {currentRoute === 'about' && (
            <div id="about" class="scene-stage">
              <AboutSection />
              <QuoteBanner
                tag="DIRECTOR'S NOTE"
                quote={CREATOR.directorNote}
                author={`${CREATOR.name} — DIRECTOR / EDITOR / MODEL`}
                bgImage={directorNoteBg}
                variant="directors-note-banner"
              />
            </div>
          )}

          {/* WORK SCENE */}
          {currentRoute === 'work' && (
            <div id="work" class="scene-stage">
              <WorkSection onSelectVideo={handleSelectVideo} />
              <BrandMarquee brands={CREATOR.brands} />
            </div>
          )}

          {/* SHOWREEL SCENE */}
          {currentRoute === 'showreel' && (
            <div id="showreel" class="scene-stage">
              <ShowreelSection onSelectVideo={handleSelectVideo} />
            </div>
          )}

          {/* CONTACT SCENE */}
          {currentRoute === 'contact' && (
            <div id="contact" class="scene-stage">
              <ContactSection />
            </div>
          )}
        </CinematicTransitionWrapper>
      </main>

      {/* FOOTER matching all wireframes */}
      <Footer onNavigate={(id) => handleNavigate(id, true)} />

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
