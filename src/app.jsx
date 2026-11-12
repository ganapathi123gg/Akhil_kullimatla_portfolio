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
import { TrophyDetailsPage } from './components/TrophyDetailsPage'
import { VideoLibraryPage } from './components/VideoLibraryPage'
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

  // One-time forward scroll transition tracking scoped to current page load
  const [revealedSections, setRevealedSections] = useState({ home: true })
  const revealedSectionsRef = useRef(new Set(['home']))
  const pendingRevealedRef = useRef(new Set())

  const hasSectionBeenRevealed = (id) => {
    return revealedSectionsRef.current.has(id)
  }

  const markSectionRevealed = (id) => {
    revealedSectionsRef.current.add(id)
    pendingRevealedRef.current.delete(id)
    setRevealedSections((prev) => (prev[id] ? prev : { ...prev, [id]: true }))
  }

  const [theme, setTheme] = useState('dark')
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [selectedVideo, setSelectedVideo] = useState(null)
  const [lastClickedVideoId, setLastClickedVideoId] = useState(null)
  const [isBookModalOpen, setIsBookModalOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState('')

  // Dedicated Full-Page Views State (Modification 5)
  const [inspectedAward, setInspectedAward] = useState(null)
  const [isVideoLibraryOpen, setIsVideoLibraryOpen] = useState(false)
  const [videoLibraryCategory, setVideoLibraryCategory] = useState('All')
  const savedScrollYRef = useRef(0)
  const savedTabRef = useRef('home')

  const exitTimerRef = useRef(null)
  const isTransitioningRef = useRef(false)
  const activeTabRef = useRef(activeTab)
  const lastTransitionTimeRef = useRef(0)
  const lastTransitionFinishTimeRef = useRef(0)
  const scrollTransitionsReadyRef = useRef(false)

  // Keep activeTabRef synchronized
  useEffect(() => {
    activeTabRef.current = activeTab
  }, [activeTab])

  // Allow initial smoke animation to finish before enabling scroll-triggered transitions
  useEffect(() => {
    const timer = setTimeout(() => {
      scrollTransitionsReadyRef.current = true
    }, 1800)
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
  const handleNavigate = (targetId, updateHistory = true, forceTransition = false) => {
    const validTarget = VALID_ROUTES.includes(targetId) ? targetId : 'home'
    if (isTransitioningRef.current && validTarget === transitionTarget) return

    const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768
    const isAlreadyRevealed = hasSectionBeenRevealed(validTarget)

    // ONE-TIME FORWARD NAVIGATION TRANSITION:
    // If a section has already been revealed during this page load,
    // do NOT replay the screen transition or veil. Perform smooth scroll.
    if (isAlreadyRevealed && !forceTransition) {
      const headerHeight = isMobile ? 72 : 84
      if (validTarget === 'home') {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      } else {
        const el = document.getElementById(validTarget)
        if (el) {
          const targetTop = el.getBoundingClientRect().top + window.scrollY - headerHeight
          window.scrollTo({ top: Math.max(0, targetTop), behavior: 'smooth' })
        }
      }

      activeTabRef.current = validTarget
      setActiveTab(validTarget)

      if (updateHistory && window.history && window.history.pushState) {
        window.history.pushState(null, '', `#${validTarget}`)
      }
      return
    }

    // FIRST TIME FORWARD NAVIGATION:
    // Play the full cinematic veil wipe with enhanced smooth timing
    pendingRevealedRef.current.add(validTarget)
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

    // Trigger full smoke effect on Home scene activation
    if (validTarget === 'home') {
      setIsHomeSmokeActive(true)
    }

    // Coordinate scroll at the apex of the luxury transition veil (when screen is fully masked)
    const isSlatsOrHome = validTarget === 'about' || validTarget === 'home'
    const scrollTiming = isSlatsOrHome ? (isMobile ? 340 : 400) : (isMobile ? 480 : 540)
    const duration = isSlatsOrHome ? (isMobile ? 900 : 1020) : (isMobile ? 1200 : 1320)

    setTimeout(() => {
      if (validTarget === 'home') {
        window.scrollTo({ top: 0, behavior: 'auto' })
      } else {
        const el = document.getElementById(validTarget)
        if (el) {
          const headerHeight = isMobile ? 72 : 84
          const targetTop = el.getBoundingClientRect().top + window.scrollY - headerHeight
          window.scrollTo({ top: Math.max(0, targetTop), behavior: 'auto' })
        }
      }

      // Update active tab references at the apex when the next page becomes active behind the veil
      activeTabRef.current = validTarget
      setActiveTab(validTarget)

      if (updateHistory && window.history && window.history.pushState) {
        window.history.pushState(null, '', `#${validTarget}`)
      }
    }, scrollTiming)

    if (exitTimerRef.current) clearTimeout(exitTimerRef.current)

    exitTimerRef.current = setTimeout(() => {
      setIsTransitioning(false)
      setTransitionTarget(null)
      isTransitioningRef.current = false
      lastTransitionFinishTimeRef.current = Date.now()

      // Mark the target section and any preceding sections in sequence as revealed
      const targetIdx = VALID_ROUTES.indexOf(validTarget)
      if (targetIdx !== -1) {
        for (let i = 0; i <= targetIdx; i++) {
          markSectionRevealed(VALID_ROUTES[i])
        }
      } else {
        markSectionRevealed(validTarget)
      }
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

    const getSectionRect = (id) => {
      const el = document.getElementById(id)
      return el ? el.getBoundingClientRect() : null
    }

    // 2. Real-time 60fps Scroll Spy for Navbar Active Indicator
    let rafId = null
    const updateActiveSectionOnScroll = () => {
      if (isTransitioningRef.current) return

      const scrollY = window.scrollY || window.pageYOffset || 0
      const windowHeight = window.innerHeight
      const docHeight = document.documentElement.scrollHeight
      const headerOffset = window.innerWidth <= 768 ? 72 : 84

      // Extreme Top: window.scrollY <= 80 is always 'home'
      if (scrollY <= 80) {
        if (activeTabRef.current !== 'home') {
          activeTabRef.current = 'home'
          setActiveTab('home')
        }
        return
      }

      // Extreme Bottom: within 80px of page bottom is always 'contact'
      if (windowHeight + scrollY >= docHeight - 80) {
        if (activeTabRef.current !== 'contact') {
          activeTabRef.current = 'contact'
          setActiveTab('contact')
        }
        return
      }

      // Middle sections: find the section that occupies the primary reading area (35% down viewport)
      const triggerY = headerOffset + (windowHeight - headerOffset) * 0.35
      let bestId = null
      let maxVisible = -1

      for (let i = 0; i < sectionIds.length; i++) {
        const id = sectionIds[i]
        const el = document.getElementById(id)
        if (!el) continue

        const rect = el.getBoundingClientRect()
        // Primary check: section containing trigger line
        if (rect.top <= triggerY && rect.bottom >= triggerY) {
          bestId = id
          break
        }
        // Fallback: calculate visible height of section in viewport
        const visibleTop = Math.max(headerOffset, rect.top)
        const visibleBottom = Math.min(windowHeight, rect.bottom)
        const visibleHeight = Math.max(0, visibleBottom - visibleTop)
        if (visibleHeight > maxVisible) {
          maxVisible = visibleHeight
          bestId = id
        }
      }

      if (bestId && activeTabRef.current !== bestId) {
        activeTabRef.current = bestId
        setActiveTab(bestId)
        if (window.history && window.history.replaceState) {
          window.history.replaceState(null, '', `#${bestId}`)
        }
      }
    }

    const handleScroll = () => {
      if (rafId) cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(updateActiveSectionOnScroll)
    }

    // 3. Mouse Wheel Boundary Navigation
    // Allows full natural scrolling through section content.
    // Triggers forward transition ONLY ONCE when user reaches the complete ending of a section.
    let wheelAcc = 0
    let wheelTimer = null

    const handleWheel = (e) => {
      if (!scrollTransitionsReadyRef.current) return
      if (isTransitioningRef.current) return
      if (Date.now() - lastTransitionFinishTimeRef.current < 500) return

      const currentId = activeTabRef.current
      const currentIndex = sectionIds.indexOf(currentId)
      if (currentIndex === -1) return

      const currentRect = getSectionRect(currentId)
      if (!currentRect) return

      const windowHeight = window.innerHeight

      // Scrolling Down -> Forward Navigation (Next Section)
      if (e.deltaY > 0) {
        if (currentIndex < sectionIds.length - 1) {
          // Check if current section has reached its complete bottom ending
          const isAtBottom = currentRect.bottom <= windowHeight + 50
          if (!isAtBottom) {
            wheelAcc = 0
            return // Allow natural scroll through section
          }

          const nextTarget = sectionIds[currentIndex + 1]

          // ONE-TIME FORWARD CHECK:
          // If the next section has ALREADY been revealed during this page load,
          // do NOT trigger the page navigation transition effect.
          // Allow normal natural downward scrolling.
          if (hasSectionBeenRevealed(nextTarget) || pendingRevealedRef.current.has(nextTarget)) {
            wheelAcc = 0
            return
          }

          // User is at the ending of the section and scrolling down -> trigger one-time forward transition
          wheelAcc += e.deltaY
          if (wheelTimer) clearTimeout(wheelTimer)
          wheelTimer = setTimeout(() => {
            wheelAcc = 0
          }, 200)

          if (wheelAcc >= 35) {
            wheelAcc = 0
            pendingRevealedRef.current.add(nextTarget)
            handleNavigate(nextTarget, true, true)
          }
        }
      }
      // Scrolling Up -> Reverse Navigation (Bottom to Top)
      else if (e.deltaY < 0) {
        // REVERSE SCROLLING:
        // Requirement C: Do NOT trigger page navigation transition effect.
        // Do NOT replay page reveal animation. Allow normal reverse scrolling.
        wheelAcc = 0
        return
      }
    }

    // 4. Mobile / Tablet Touch Swipe Navigation
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
      if (isTransitioningRef.current) return
      if (Date.now() - lastTransitionFinishTimeRef.current < 500) return
      if (!e.changedTouches || !e.changedTouches[0]) return

      const deltaY = touchStartY - e.changedTouches[0].clientY
      const deltaX = Math.abs(touchStartX - e.changedTouches[0].clientX)

      if (Math.abs(deltaY) < deltaX * 1.2) return
      if (Math.abs(deltaY) < 40) return

      const currentId = activeTabRef.current
      const currentIndex = sectionIds.indexOf(currentId)
      if (currentIndex === -1) return

      const currentRect = getSectionRect(currentId)
      if (!currentRect) return

      const windowHeight = window.innerHeight

      // Swipe Up -> Scrolling Down (Forward Navigation)
      if (deltaY > 40 && currentIndex < sectionIds.length - 1) {
        const isAtBottom = currentRect.bottom <= windowHeight + 45
        if (isAtBottom) {
          const nextTarget = sectionIds[currentIndex + 1]
          if (!hasSectionBeenRevealed(nextTarget) && !pendingRevealedRef.current.has(nextTarget)) {
            pendingRevealedRef.current.add(nextTarget)
            handleNavigate(nextTarget, true, true)
          }
        }
      }
      // Swipe Down -> Scrolling Up (Reverse Navigation)
      else if (deltaY < -40 && currentIndex > 0) {
        // REVERSE SCROLLING: Do NOT trigger any transition! Allow normal upward touch scrolling.
        return
      }
    }

    // 5. Keyboard Navigation (ArrowDown / ArrowUp / PageDown / PageUp / Space)
    const handleKeyDown = (e) => {
      if (!scrollTransitionsReadyRef.current) return
      const activeTag = document.activeElement ? document.activeElement.tagName.toLowerCase() : ''
      if (activeTag === 'input' || activeTag === 'textarea' || activeTag === 'select') return
      if (isTransitioningRef.current) return
      if (Date.now() - lastTransitionFinishTimeRef.current < 500) return

      const currentId = activeTabRef.current
      const currentIndex = sectionIds.indexOf(currentId)
      if (currentIndex === -1) return

      const currentRect = getSectionRect(currentId)
      if (!currentRect) return

      const windowHeight = window.innerHeight

      if (e.key === 'ArrowDown' || e.key === 'PageDown' || (e.key === ' ' && !e.shiftKey)) {
        if (currentIndex < sectionIds.length - 1) {
          const isAtBottom = currentRect.bottom <= windowHeight + 50
          if (isAtBottom) {
            const nextTarget = sectionIds[currentIndex + 1]
            if (!hasSectionBeenRevealed(nextTarget) && !pendingRevealedRef.current.has(nextTarget)) {
              e.preventDefault()
              pendingRevealedRef.current.add(nextTarget)
              handleNavigate(nextTarget, true, true)
            }
          }
        }
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp' || (e.key === ' ' && e.shiftKey)) {
        // REVERSE SCROLLING: Do NOT trigger transition! Allow normal scrolling up.
        return
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('wheel', handleWheel, { passive: true })
    window.addEventListener('touchstart', handleTouchStart, { passive: true })
    window.addEventListener('touchend', handleTouchEnd, { passive: true })
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      observers.forEach((obs) => obs.disconnect())
      if (rafId) cancelAnimationFrame(rafId)
      if (wheelTimer) clearTimeout(wheelTimer)
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('wheel', handleWheel)
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchend', handleTouchEnd)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  // Initial Hash Navigation on page load
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash) {
      const hash = window.location.hash.replace('#', '').toLowerCase()
      if (VALID_ROUTES.includes(hash) && hash !== 'home') {
        setActiveTab(hash)
        activeTabRef.current = hash
        // Mark target and all preceding sections as already revealed
        const targetIdx = VALID_ROUTES.indexOf(hash)
        const initRevealed = { home: true }
        for (let i = 0; i <= targetIdx; i++) {
          revealedSectionsRef.current.add(VALID_ROUTES[i])
          initRevealed[VALID_ROUTES[i]] = true
        }
        setRevealedSections(initRevealed)
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
      if (isTransitioningRef.current) return
      const hash = (typeof window !== 'undefined' && window.location.hash)
        ? window.location.hash.replace('#', '').toLowerCase()
        : ''

      // Handle dedicated views history navigation
      if (hash === 'video-library' || hash === 'archive' || hash === 'complete-archive' || hash === 'all-videos') {
        if (!isVideoLibraryOpen) {
          savedScrollYRef.current = window.scrollY
          savedTabRef.current = activeTabRef.current
          setIsVideoLibraryOpen(true)
        }
        return
      } else if (isVideoLibraryOpen && !hash.includes('video-library') && !hash.includes('archive')) {
        setIsVideoLibraryOpen(false)
        window.scrollTo({ top: savedScrollYRef.current, behavior: 'instant' })
      }

      if (hash.startsWith('trophy')) {
        // Keep trophy open if already active, or default to first award
        if (!inspectedAward && CREATOR.awards && CREATOR.awards.length > 0) {
          savedScrollYRef.current = window.scrollY
          savedTabRef.current = activeTabRef.current
          setInspectedAward(CREATOR.awards[0])
        }
        return
      } else if (inspectedAward && !hash.startsWith('trophy')) {
        setInspectedAward(null)
        window.scrollTo({ top: savedScrollYRef.current, behavior: 'instant' })
      }

      const target = getInitialRoute()
      if (target !== activeTabRef.current) {
        handleNavigate(target, false)
      }
    }

    window.addEventListener('popstate', handleLocationChange)
    window.addEventListener('hashchange', handleLocationChange)
    return () => {
      window.removeEventListener('popstate', handleLocationChange)
      window.removeEventListener('hashchange', handleLocationChange)
    }
  }, [isVideoLibraryOpen, inspectedAward])

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

  // Open / Close Dedicated Trophy Inspection Page (Modification 5)
  const handleOpenTrophyDetails = (award) => {
    savedScrollYRef.current = window.scrollY
    savedTabRef.current = activeTabRef.current
    setInspectedAward(award)
    soundManager.playChime()
    if (window.history && window.history.pushState) {
      window.history.pushState({ modal: 'trophy', id: award?.id }, '', '#trophy-details')
    }
  }

  const handleCloseTrophyDetails = () => {
    setInspectedAward(null)
    soundManager.playPop()
    const savedY = savedScrollYRef.current
    const savedTab = savedTabRef.current
    if (window.history && window.location.hash.startsWith('#trophy')) {
      window.history.replaceState(null, '', `#${savedTab}`)
    }
    setTimeout(() => {
      window.scrollTo({ top: savedY, behavior: 'instant' })
    }, 20)
  }

  // Open / Close Dedicated Video Library Page (Modification 5)
  const handleOpenVideoLibrary = (category = 'All') => {
    savedScrollYRef.current = window.scrollY
    savedTabRef.current = activeTabRef.current
    setVideoLibraryCategory(category)
    setIsVideoLibraryOpen(true)
    soundManager.playChime()
    if (window.history && window.history.pushState) {
      window.history.pushState({ modal: 'video-library' }, '', '#video-library')
    }
  }

  const handleCloseVideoLibrary = () => {
    setIsVideoLibraryOpen(false)
    soundManager.playPop()
    const savedY = savedScrollYRef.current
    const savedTab = savedTabRef.current
    if (window.history && window.location.hash.startsWith('#video-library')) {
      window.history.replaceState(null, '', `#${savedTab}`)
    }
    setTimeout(() => {
      window.scrollTo({ top: savedY, behavior: 'instant' })
    }, 20)
  }

  // Global listener for open-video-archive event
  useEffect(() => {
    const onOpenArchive = (e) => {
      handleOpenVideoLibrary(e?.detail?.category || 'All')
    }
    window.addEventListener('open-video-archive', onOpenArchive)
    return () => window.removeEventListener('open-video-archive', onOpenArchive)
  }, [])

  return (
    <div class="app-wrapper">
      {/* 1. Initial Page Load Volumetric Gold Smoke & Mist Reveal */}
      {isInitialSmokeActive && (
        <SmokeRevealOverlay
          isActive={isInitialSmokeActive}
          isInitial={true}
          onComplete={() => {
            setIsInitialSmokeActive(false)
            scrollTransitionsReadyRef.current = true
          }}
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
            } ${
              transitionTarget === 'home' && !hasSectionBeenRevealed('home')
                ? transitionPair.enterClass
                : ''
            } ${inViewSections.home ? 'is-in-view' : ''} ${
              revealedSections.home ? 'is-revealed' : ''
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
            } ${
              transitionTarget === 'about' && !hasSectionBeenRevealed('about')
                ? transitionPair.enterClass
                : ''
            } ${inViewSections.about ? 'is-in-view' : ''} ${
              revealedSections.about ? 'is-revealed' : ''
            }`}
          >
            <AboutSection onInspectTrophy={handleOpenTrophyDetails} />
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
            } ${
              transitionTarget === 'work' && !hasSectionBeenRevealed('work')
                ? transitionPair.enterClass
                : ''
            } ${inViewSections.work ? 'is-in-view' : ''} ${
              revealedSections.work ? 'is-revealed' : ''
            }`}
          >
            <WorkSection
              onSelectVideo={handleSelectVideo}
              onOpenAllWorks={() => handleOpenVideoLibrary('All')}
            />
          </div>

          {/* 4. SHOWREEL SECTION matching Showreel.png */}
          <div
            id="showreel"
            class={`section-anchor cinematic-section ${
              activeTab === 'showreel' ? 'is-active' : ''
            } ${
              transitionTarget === 'showreel' && !hasSectionBeenRevealed('showreel')
                ? transitionPair.enterClass
                : ''
            } ${inViewSections.showreel ? 'is-in-view' : ''} ${
              revealedSections.showreel ? 'is-revealed' : ''
            }`}
          >
            <ShowreelSection onSelectVideo={handleSelectVideo} />
            {/* BRAND SPONSORS MARQUEE matching Work.png */}
            <BrandMarquee brands={CREATOR.brands} />
          </div>

          {/* 5. CONTACT & FAQS SECTION matching Contact.png */}
          <div
            id="contact"
            class={`section-anchor cinematic-section ${
              activeTab === 'contact' ? 'is-active' : ''
            } ${
              transitionTarget === 'contact' && !hasSectionBeenRevealed('contact')
                ? transitionPair.enterClass
                : ''
            } ${inViewSections.contact ? 'is-in-view' : ''} ${
              revealedSections.contact ? 'is-revealed' : ''
            }`}
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

      {/* Dedicated Full-Page Trophy Details Page (Modification 5 - Part 1) */}
      {inspectedAward && (
        <TrophyDetailsPage
          award={inspectedAward}
          allAwards={CREATOR.awards}
          onClose={handleCloseTrophyDetails}
          onSelectAward={(a) => setInspectedAward(a)}
          onExploreVideo={() => {
            handleCloseTrophyDetails()
            handleOpenVideoLibrary('Shortfilms')
          }}
        />
      )}

      {/* Dedicated Full-Page Video Library Page (Modification 5 - Part 2) */}
      {isVideoLibraryOpen && (
        <VideoLibraryPage
          isOpen={isVideoLibraryOpen}
          onClose={handleCloseVideoLibrary}
          onSelectVideo={handleSelectVideo}
          initialCategory={videoLibraryCategory}
        />
      )}

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
