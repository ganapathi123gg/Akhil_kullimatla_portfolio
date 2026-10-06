import { useEffect, useState, useRef } from 'preact/hooks'
import { CREATOR } from '../data/creatorConfig'
import '../styles/StatsCounter.css'

export function StatsCounter() {
  const [animated, setAnimated] = useState(false)
  const containerRef = useRef(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setAnimated(true)
          observer.disconnect()
        }
      },
      { threshold: 0.2 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const handleScrollDown = () => {
    const nextElem = document.getElementById('about') || document.querySelector('.quote-banner-section')
    if (nextElem) {
      nextElem.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section class="stats-bar-section" ref={containerRef} aria-label="Creator Statistics">
      <div class="stats-grid">
        {CREATOR.stats.map((stat, idx) => (
          <div class="stat-item" key={idx}>
            <div class="stat-value">
              {animated ? stat.value : '0'}
            </div>
            <div class="stat-label">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Mobile-only Scroll Indicator: Appears below statistics on mobile view */}
      <div class="stats-scroll-mobile-wrap">
        <div
          class="scroll-indicator-wrap"
          onClick={handleScrollDown}
          role="button"
          tabIndex={0}
          aria-label="Scroll down"
        >
          <span class="scroll-arrow">⌄</span>
          <span>SCROLL</span>
          <span class="scroll-divider" />
        </div>
      </div>
    </section>
  )
}
