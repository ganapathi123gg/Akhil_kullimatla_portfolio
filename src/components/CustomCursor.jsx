import { useEffect, useRef, useState } from 'preact/hooks'
import '../styles/CustomCursor.css'

export function CustomCursor() {
  const dotRef = useRef(null)
  const followerRef = useRef(null)
  const labelRef = useRef(null)

  const mousePos = useRef({ x: -100, y: -100 })
  const followerPos = useRef({ x: -100, y: -100 })
  const animFrame = useRef(null)
  const isEnabledRef = useRef(true)

  const [hoverState, setHoverState] = useState({ active: false, type: 'default', label: '' })
  const [isClicking, setIsClicking] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Only enable on desktop pointer devices (never simulate on touchscreens / mobile)
    const isTouchOnly =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(hover: none) and (pointer: coarse)').matches

    if (isTouchOnly) {
      isEnabledRef.current = false
      return
    }

    document.body.classList.add('custom-cursor-active')

    const detectHover = (target) => {
      if (!target || typeof target.closest !== 'function') {
        setHoverState({ active: false, type: 'default', label: '' })
        return
      }

      // Broad interactive selector supporting all portfolio sections & dedicated pages
      const interactive = target.closest(
        '[data-cursor], a, button, input, select, textarea, [role="button"], [role="tab"], [tabindex="0"], ' +
        '.work-card, .watch-card, .master-player-card, .featured-film-media, .deck-3d-card, .award-modern-card, ' +
        '.modern-testi-card, .vlib-project-card, .vlib-category-tab, .trophy-stage-frame, .stage-nav-btn, ' +
        '.trophy-back-action-btn, .trophy-close-x-btn, .vlib-close-x-btn, .trophy-media-container'
      )

      if (interactive) {
        const customType = interactive.getAttribute('data-cursor') || 'hover'
        const customLabel =
          interactive.getAttribute('data-cursor-label') ||
          (customType === 'play' ? 'PLAY' : customType === 'view' ? 'VIEW' : '')
        setHoverState({ active: true, type: customType, label: customLabel })
      } else {
        setHoverState({ active: false, type: 'default', label: '' })
      }
    }

    const updatePosition = (clientX, clientY) => {
      mousePos.current = { x: clientX, y: clientY }
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${clientX}px, ${clientY}px, 0) translate(-50%, -50%)`
      }
      setIsVisible(true)
    }

    // High performance mouse tracking across entire viewport (including dedicated full-page overlays)
    const onMouseMove = (e) => {
      updatePosition(e.clientX, e.clientY)
      detectHover(e.target)
    }

    const onMouseDown = () => setIsClicking(true)
    const onMouseUp = () => setIsClicking(false)
    const onMouseLeave = () => setIsVisible(false)
    const onMouseEnter = (e) => {
      setIsVisible(true)
      updatePosition(e.clientX, e.clientY)
    }

    window.addEventListener('mousemove', onMouseMove, { passive: true })
    window.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mouseup', onMouseUp)
    document.addEventListener('mouseleave', onMouseLeave)
    document.addEventListener('mouseenter', onMouseEnter)

    // Silky smooth trailing interpolation loop (lerp factor 0.22 for tactile luxury feel)
    const smoothLoop = () => {
      followerPos.current.x += (mousePos.current.x - followerPos.current.x) * 0.22
      followerPos.current.y += (mousePos.current.y - followerPos.current.y) * 0.22

      if (followerRef.current) {
        followerRef.current.style.transform = `translate3d(${followerPos.current.x}px, ${followerPos.current.y}px, 0) translate(-50%, -50%)`
      }

      animFrame.current = requestAnimationFrame(smoothLoop)
    }
    animFrame.current = requestAnimationFrame(smoothLoop)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mouseup', onMouseUp)
      document.removeEventListener('mouseleave', onMouseLeave)
      document.removeEventListener('mouseenter', onMouseEnter)
      if (animFrame.current) cancelAnimationFrame(animFrame.current)
      document.body.classList.remove('custom-cursor-active')
    }
  }, []) // Empty dependency array: runs once, never tears down on visibility change

  const isMedia = hoverState.type === 'play'
  const isHovered = hoverState.active

  return (
    <>
      {/* Precision Core Dot */}
      <div
        ref={dotRef}
        class={`custom-cursor-dot ${isVisible ? 'is-visible' : ''} ${isHovered ? 'is-hovered' : ''} ${isMedia ? 'is-media' : ''}`}
        aria-hidden="true"
      />

      {/* Smooth Trailing Follower Ring */}
      <div
        ref={followerRef}
        class={`custom-cursor-follower ${isVisible ? 'is-visible' : ''} ${isHovered ? 'is-hovered' : ''} ${isMedia ? 'is-media' : ''} ${isClicking ? 'is-clicking' : ''}`}
        aria-hidden="true"
      >
        <span ref={labelRef} class="cursor-label">
          {hoverState.label}
        </span>
      </div>
    </>
  )
}
