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
import {
  CinematicTransitionWrapper,
  getTransitionClassPair,
} from './components/CinematicTransition'
import { SmokeRevealOverlay } from './components/SmokeRevealOverlay'

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
  const [activeTab, setActiveTab] = useState(getInitialRoute)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [transitionTarget, setTransitionTarget] = useState(null)
  const [transitionType, setTransitionType] = useState('smoke')
  const [isInitialSmokeActive, setIsInitialSmokeActive] = useState(true)
  const [isHomeSmokeActive, setIsHomeSmokeActive] = useState(false)
  const [transitionPair, setTransitionPair] = useState({
    enterClass: '',
    exitClass: '',
  })
  const [inViewSections, setInViewSections] = useState({ home: true })

  const [theme, setTheme] = useState('dark')
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [selectedVideo, setSelectedVideo] = useState(null)
  const [lastClickedVideoId, setLastClickedVideoId] = useState(null)
  const [isBookModalOpen, setIsBookModalOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState('')

  const exitTimerRef = useRef(null)
  const isTransitioningRef = useRef(false)
  const activeTabRef = useRef(activeTab)
  const lastTransitionTimeRef = useRef(0)
  const scrollTransitionsReadyRef = useRef(false)

  // Keep activeTabRef synchronized
  useEffect(() => {
    activeTabRef.current = activeTab
  }, [activeTab])

  // Allow initial smoke animation to finish before enabling scroll-triggered transitions
  useEffect(() => {
    const timer = setTimeout(() => {
      scrollTransitionsReadyRef.current = true
    }, 400)
    return () => clearTimeout(timer)
  }, [])

  // Manage Theme Attribute on <html>
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  // Determine distinctive 2026 motion signature based on target destination
  const getTransitionTypeForTarget = (toRoute) => {
    if (toRoute === 'home') return 'smoke'
    if (toRoute === 'about') return 'slats'
    if (toRoute === 'work') return 'blade'
    if (toRoute === 'showreel') return 'letterbox'
    if (toRoute === 'contact') return 'split'
    return 'smoke'
  }

  // Centralized Cinematic Navigation Handler
  const handleNavigate = (targetId, updateHistory = true) => {
    const validTarget = VALID_ROUTES.includes(targetId) ? targetId : 'home'
    if (isTransitioningRef.current && validTarget === transitionTarget) return

    const transType = getTransitionTypeForTarget(validTarget)
    setTransitionType(transType)

    // Play tactile sound effect specific to this transition
    soundManager.playTransitionSound(transType)

    const pair = getTransitionClassPair(activeTabRef.current, validTarget)
    setTransitionPair(pair)
    setTransitionTarget(validTarget)
    setIsTransitioning(true)
    isTransitioningRef.current = true
    lastTransitionTimeRef.current = Date.now()

    // Immediately update active tab references so subsequent gestures recognize the new location
    activeTabRef.current = validTarget
    setActiveTab(validTarget)

    // Trigger full smoke effect on Home scene activation
    if (validTarget === 'home') {
      setIsHomeSmokeActive(true)
    }

    if (updateHistory && window.history && window.history.pushState) {
      window.history.pushState(null, '', `#${validTarget}`)
    }

    // Coordinate scroll at the apex of the luxury transition veil (when screen is fully masked)
    const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768
    const scrollTiming = isMobile ? 260 : 300
    const duration = isMobile ? 680 : 760

    setTimeout(() => {
      if (validTarget === 'home') {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      } else {
        const el = document.getElementById(validTarget)
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }
    }, scrollTiming)

    if (exitTimerRef.current) clearTimeout(exitTimerRef.current)

    exitTimerRef.current = setTimeout(() => {
      setIsTransitioning(false)
      setTransitionTarget(null)
      isTransitioningRef.current = false
    }, duration)
  }

  // Scroll Spy & Default Page-to-Page Scrolling Navigation Transitions
  useEffect(() => {
    const sectionIds = ['home', 'about', 'work', 'showreel', 'contact']
    const observers = []

    sectionIds.forEach((id) => {
      const el = document.getElementById(id)
      if (!el) return

      // 1. Trigger staggered scroll reveal once section enters viewport
      const viewObserver = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setInViewSections((prev) => (prev[id] ? prev : { ...prev, [id]: true }))
          }
        },
        { threshold: 0.05 }
      )
      viewObserver.observe(el)
      observers.push(viewObserver)
    })

    // 2. Mouse Wheel Navigation: Natural smooth scrolling with page-to-page transitions
    let wheelAcc = 0
    let wheelTimer = null

    const handleWheel = (e) => {
      if (!scrollTransitionsReadyRef.current) return
      if (isTransitioningRef.current) return
      if (Date.now() - lastTransitionTimeRef.current < 750) return

      wheelAcc += e.deltaY

      if (wheelTimer) clearTimeout(wheelTimer)
      wheelTimer = setTimeout(() => {
        wheelAcc = 0
      }, 180)

      const currentIndex = sectionIds.indexOf(activeTabRef.current)
      if (currentIndex === -1) return

      // Scroll Down -> Smooth transition to next section
      if (wheelAcc > 45 && currentIndex < sectionIds.length - 1) {
        wheelAcc = 0
        const nextTarget = sectionIds[currentIndex + 1]
        handleNavigate(nextTarget, true)
      }
      // Scroll Up -> Smooth transition to previous section
      else if (wheelAcc < -45 && currentIndex > 0) {
        wheelAcc = 0
        const prevTarget = sectionIds[currentIndex - 1]
        handleNavigate(prevTarget, true)
      }
    }

    // 3. Scrollbar Drag & Viewport Synchronizer (updates activeTab as user scrolls)
    let scrollSyncTimer = null
    const handleScrollSync = () => {
      if (isTransitioningRef.current) return
      if (scrollSyncTimer) clearTimeout(scrollSyncTimer)
      scrollSyncTimer = setTimeout(() => {
        if (isTransitioningRef.current) return
        const midPoint = window.innerHeight * 0.45

        for (let i = 0; i < sectionIds.length; i++) {
          const id = sectionIds[i]
          const el = document.getElementById(id)
          if (!el) continue
          const rect = el.getBoundingClientRect()
          if (rect.top <= midPoint && rect.bottom >= midPoint) {
            if (activeTabRef.current !== id) {
              activeTabRef.current = id
              setActiveTab(id)
              if (window.history && window.history.replaceState) {
                window.history.replaceState(null, '', `#${id}`)
              }
            }
            break
          }
        }
      }, 100)
    }

    // 4. Mobile Touch Swipe Navigation
    let touchStartY = 0
    let touchStartX = 0

    const handleTouchStart = (e) => {
      if (e.touches && e.touches[0]) {
        touchStartY = e.touches[0].clientY
        touchStartX = e.touches[0].clientX
      }
    }

    const handleTouchEnd = (e) => {
      if (!scrollTransitionsReadyRef.current) return
      const now = Date.now()
      if (isTransitioningRef.current || now - lastTransitionTimeRef.current < 750) return
      if (!e.changedTouches || !e.changedTouches[0]) return

      const deltaY = touchStartY - e.changedTouches[0].clientY
      const deltaX = Math.abs(touchStartX - e.changedTouches[0].clientX)
      if (Math.abs(deltaY) < deltaX) return

      const currentIndex = sectionIds.indexOf(activeTabRef.current)
      if (currentIndex === -1) return

      // Swipe Up -> Transition to Next Page
      if (deltaY > 35 && currentIndex < sectionIds.length - 1) {
        const nextTarget = sectionIds[currentIndex + 1]
        handleNavigate(nextTarget, true)
      }
      // Swipe Down -> Transition to Previous Page
      else if (deltaY < -35 && currentIndex > 0) {
        const prevTarget = sectionIds[currentIndex - 1]
        handleNavigate(prevTarget, true)
      }
    }

    // 5. Keyboard Navigation (Arrow keys / PageUp / PageDown / Space)
    const handleKeyDown = (e) => {
      if (!scrollTransitionsReadyRef.current) return
      const activeTag = document.activeElement ? document.activeElement.tagName.toLowerCase() : ''
      if (activeTag === 'input' || activeTag === 'textarea' || activeTag === 'select') return

      const now = Date.now()
      if (isTransitioningRef.current || now - lastTransitionTimeRef.current < 750) return

      const currentIndex = sectionIds.indexOf(activeTabRef.current)
      if (currentIndex === -1) return

      if (e.key === 'ArrowDown' || e.key === 'PageDown' || (e.key === ' ' && !e.shiftKey)) {
        if (currentIndex < sectionIds.length - 1) {
          e.preventDefault()
          const nextTarget = sectionIds[currentIndex + 1]
          handleNavigate(nextTarget, true)
        }
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp' || (e.key === ' ' && e.shiftKey)) {
        if (currentIndex > 0) {
          e.preventDefault()
          const prevTarget = sectionIds[currentIndex - 1]
          handleNavigate(prevTarget, true)
        }
      }
    }

    window.addEventListener('wheel', handleWheel, { passive: true })
    window.addEventListener('scroll', handleScrollSync, { passive: true })
    window.addEventListener('touchstart', handleTouchStart, { passive: true })
    window.addEventListener('touchend', handleTouchEnd, { passive: true })
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      observers.forEach((obs) => obs.disconnect())
      window.removeEventListener('wheel', handleWheel)
      window.removeEventListener('scroll', handleScrollSync)
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchend', handleTouchEnd)
      window.removeEventListener('keydown', handleKeyDown)
      if (wheelTimer) clearTimeout(wheelTimer)
      if (scrollSyncTimer) clearTimeout(scrollSyncTimer)
    }
  }, [])

  // Initial Hash Navigation on page load
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash) {
      const hash = window.location.hash.replace('#', '').toLowerCase()
      if (VALID_ROUTES.includes(hash) && hash !== 'home') {
        setActiveTab(hash)
        setTimeout(() => {
          const el = document.getElementById(hash)
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' })
          }
        }, 150)
      } else {
        window.scrollTo({ top: 0, behavior: 'auto' })
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'auto' })
    }
  }, [])

  // Handle browser back/forward buttons (popstate) and hash changes
  useEffect(() => {
    const handleLocationChange = () => {
      const target = getInitialRoute()
      if (target !== activeTab) {
        handleNavigate(target, false)
      }
    }

    window.addEventListener('popstate', handleLocationChange)
    window.addEventListener('hashchange', handleLocationChange)
    return () => {
      window.removeEventListener('popstate', handleLocationChange)
      window.removeEventListener('hashchange', handleLocationChange)
      if (exitTimerRef.current) clearTimeout(exitTimerRef.current)
    }
  }, [activeTab])

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
      {/* 1. Initial Page Load Volumetric Gold Smoke & Mist Reveal */}
      {isInitialSmokeActive && (
        <SmokeRevealOverlay
          isActive={isInitialSmokeActive}
          isInitial={true}
          onComplete={() => setIsInitialSmokeActive(false)}
        />
      )}

      {/* 2. On-Demand Smoke Reveal when navigating to Home */}
      {isHomeSmokeActive && (
        <SmokeRevealOverlay
          isActive={isHomeSmokeActive}
          isInitial={false}
          onComplete={() => setIsHomeSmokeActive(false)}
        />
      )}

      {/* Film grain atmospheric overlay */}
      <div class="film-grain-overlay" />

      {/* Trailing precision magnetic cursor */}
      <CustomCursor />

      {/* Sticky Navigation matching Nav.png */}
      <Navbar
        activeTab={activeTab}
        onNavigate={(id) => handleNavigate(id, true)}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        onOpenBookModal={handleOpenBookModal}
      />

      <main class="main-content">
        <CinematicTransitionWrapper
          isTransitioning={isTransitioning}
          transitionType={transitionType}
          targetRoute={transitionTarget || activeTab}
        >
          {/* 1. HOME SECTION matching Home.png */}
          <div
            id="home"
            class={`section-anchor cinematic-section ${
              activeTab === 'home' ? 'is-active' : ''
            } ${transitionTarget === 'home' ? transitionPair.enterClass : ''} ${
              inViewSections.home ? 'is-in-view' : ''
            }`}
          >
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

          {/* 2. ABOUT SECTION matching About.png */}
          <div
            id="about"
            class={`section-anchor cinematic-section ${
              activeTab === 'about' ? 'is-active' : ''
            } ${transitionTarget === 'about' ? transitionPair.enterClass : ''} ${
              inViewSections.about ? 'is-in-view' : ''
            }`}
          >
            <AboutSection />
            <QuoteBanner
              tag="DIRECTOR'S NOTE"
              quote={CREATOR.directorNote}
              author={`${CREATOR.name} — DIRECTOR / EDITOR / MODEL`}
              bgImage={directorNoteBg}
              variant="directors-note-banner"
            />
          </div>

          {/* 3. WORK SECTION matching Work.png */}
          <div
            id="work"
            class={`section-anchor cinematic-section ${
              activeTab === 'work' ? 'is-active' : ''
            } ${transitionTarget === 'work' ? transitionPair.enterClass : ''} ${
              inViewSections.work ? 'is-in-view' : ''
            }`}
          >
            <WorkSection onSelectVideo={handleSelectVideo} />
          </div>

          {/* 4. SHOWREEL SECTION matching Showreel.png */}
          <div
            id="showreel"
            class={`section-anchor cinematic-section ${
              activeTab === 'showreel' ? 'is-active' : ''
            } ${
              transitionTarget === 'showreel' ? transitionPair.enterClass : ''
            } ${inViewSections.showreel ? 'is-in-view' : ''}`}
          >
            <ShowreelSection onSelectVideo={handleSelectVideo} />
          </div>

          {/* BRAND SPONSORS MARQUEE matching Work.png */}
          <BrandMarquee brands={CREATOR.brands} />

          {/* 5. CONTACT & FAQS SECTION matching Contact.png */}
          <div
            id="contact"
            class={`section-anchor cinematic-section ${
              activeTab === 'contact' ? 'is-active' : ''
            } ${
              transitionTarget === 'contact' ? transitionPair.enterClass : ''
            } ${inViewSections.contact ? 'is-in-view' : ''}`}
          >
            <ContactSection />
          </div>
        </CinematicTransitionWrapper>
      </main>

      {/* FOOTER matching all wireframes */}
      <Footer onNavigate={(id) => handleNavigate(id, true)} />

      {/* Video Lightbox Cinema Modal */}
      {selectedVideo && (
        <VideoModal video={selectedVideo} onClose={handleCloseVideo} />
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
