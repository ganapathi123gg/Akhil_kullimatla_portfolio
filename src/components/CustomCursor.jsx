import { useEffect, useRef, useState } from 'preact/hooks'
import '../styles/CustomCursor.css'

export function CustomCursor() {
  const dotRef = useRef(null)
  const followerRef = useRef(null)
  const labelRef = useRef(null)

  const mousePos = useRef({ x: -100, y: -100 })
  const followerPos = useRef({ x: -100, y: -100 })
  const animFrame = useRef(null)

  const [hoverState, setHoverState] = useState({ active: false, type: 'default', label: '' })
  const [isClicking, setIsClicking] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    document.body.classList.add('custom-cursor-active')

    const detectHover = (target) => {
      if (!target || typeof target.closest !== 'function') {
        setHoverState({ active: false, type: 'default', label: '' })
        return
      }

      const interactive = target.closest('[data-cursor], a, button, .work-card, .watch-card, .master-player-card, .featured-film-media, .deck-3d-card, .award-modern-card, .modern-testi-card')
      if (interactive) {
        const customType = interactive.getAttribute('data-cursor') || 'hover'
        const customLabel = interactive.getAttribute('data-cursor-label') || (customType === 'play' ? 'PLAY' : customType === 'view' ? 'VIEW' : '')
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
      if (!isVisible) setIsVisible(true)
    }

    // Mouse events (Desktop)
    const onMouseMove = (e) => {
      updatePosition(e.clientX, e.clientY)
      detectHover(e.target)
    }

    const onMouseDown = () => setIsClicking(true)
    const onMouseUp = () => setIsClicking(false)
    const onMouseLeave = () => setIsVisible(false)
    const onMouseEnter = () => setIsVisible(true)

    // Touch events (Mobile & Tablet)
    const onTouchStart = (e) => {
      if (e.touches && e.touches.length > 0) {
        const t = e.touches[0]
        updatePosition(t.clientX, t.clientY)
        setIsClicking(true)
        detectHover(e.target)
      }
    }

    const onTouchMove = (e) => {
      if (e.touches && e.touches.length > 0) {
        const t = e.touches[0]
        updatePosition(t.clientX, t.clientY)
        const elem = document.elementFromPoint(t.clientX, t.clientY)
        if (elem) detectHover(elem)
      }
    }

    const onTouchEnd = () => {
      setIsClicking(false)
    }

    window.addEventListener('mousemove', onMouseMove, { passive: true })
    window.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mouseup', onMouseUp)
    document.addEventListener('mouseleave', onMouseLeave)
    document.addEventListener('mouseenter', onMouseEnter)

    // Mobile touch listeners with passive mode for 60fps performance
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: true })
    window.addEventListener('touchend', onTouchEnd, { passive: true })
    window.addEventListener('touchcancel', onTouchEnd, { passive: true })

    // Silky smooth trailing interpolation loop (lerp factor 0.22)
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
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('touchend', onTouchEnd)
      window.removeEventListener('touchcancel', onTouchEnd)
      if (animFrame.current) cancelAnimationFrame(animFrame.current)
      document.body.classList.remove('custom-cursor-active')
    }
  }, [isVisible])

  if (!isVisible) return null

  const isMedia = hoverState.type === 'play'
  const isHovered = hoverState.active

  return (
    <>
      {/* Precision Core Dot */}
      <div
        ref={dotRef}
        class={`custom-cursor-dot ${isHovered ? 'is-hovered' : ''} ${isMedia ? 'is-media' : ''}`}
      />

      {/* Smooth Trailing Follower Ring */}
      <div
        ref={followerRef}
        class={`custom-cursor-follower ${isHovered ? 'is-hovered' : ''} ${isMedia ? 'is-media' : ''} ${isClicking ? 'is-clicking' : ''}`}
      >
        <span ref={labelRef} class="cursor-label">
          {hoverState.label}
        </span>
      </div>
    </>
  )
}
