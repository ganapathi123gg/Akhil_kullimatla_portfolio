import { useEffect, useRef, useState } from 'preact/hooks'
import '../styles/DirectorsCutJourney.css'

const MILESTONES = [
  {
    id: 'milestone-1',
    year: '2024',
    title: 'Created Youtube Account and Created first reel',
    description:
      'A 30-second cinematic reel that crossed a million views and set the journey in motion.',
    cardType: 'genesis',
  },
  {
    id: 'milestone-2',
    year: '2025',
    title: 'Directed First Short Film',
    description:
      "Made me directorial debut with 'Cooli Disco', taking on the roles of Director and Actor and bringing his first short film to the screen.",
    cardType: 'debut',
  },
  {
    id: 'milestone-3',
    year: '2025',
    title: 'Best Short Film Award for Akirodeka',
    description:
      'Directed and acted in the short film “Akirodeka,” which was recognized as a Best Short Film at the Kerala International Indie Film Awards 2026, standing out among 9,532 entries from filmmakers and creators.',
    cardType: 'award',
  },
  {
    id: 'milestone-4',
    year: '2026',
    title: 'Junior Acting Debut',
    description:
      'A proud milestone — made my debut as a junior actor in my first feature film alongside Narne Nithin. Grateful for the opportunity to step onto the big screen and begin my journey as an actor.',
    cardType: 'theatrical',
  },
]

export function DirectorsCutJourney() {
  const sectionRef = useRef(null)
  const [visibleItems, setVisibleItems] = useState({})
  const [headerVisible, setHeaderVisible] = useState(false)
  const [activeProgress, setActiveProgress] = useState(0)

  useEffect(() => {
    // Respect prefers-reduced-motion
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (prefersReducedMotion) {
      setHeaderVisible(true)
      const allVisible = {}
      MILESTONES.forEach((_, idx) => {
        allVisible[idx] = true
      })
      setVisibleItems(allVisible)
      setActiveProgress(100)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const indexAttr = entry.target.getAttribute('data-index')
            if (indexAttr === 'header') {
              setHeaderVisible(true)
            } else if (indexAttr !== null) {
              const idx = parseInt(indexAttr, 10)
              setVisibleItems((prev) => {
                const next = { ...prev, [idx]: true }
                // Compute progress percentage to the highest visible node
                const highestVisible = Math.max(
                  ...Object.keys(next).map(Number)
                )
                const pct = ((highestVisible + 1) / MILESTONES.length) * 100
                setActiveProgress(pct)
                return next
              })
            }
          }
        })
      },
      {
        root: null,
        rootMargin: '0px 0px -12% 0px',
        threshold: 0.15,
      }
    )

    if (sectionRef.current) {
      const headerEl = sectionRef.current.querySelector(
        '[data-index="header"]'
      )
      if (headerEl) observer.observe(headerEl)

      const rowEls = sectionRef.current.querySelectorAll('.editorial-milestone-row')
      rowEls.forEach((el) => observer.observe(el))
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section
      class="editorial-journey-section journey-subsection"
      id="the-journey"
      ref={sectionRef}
      aria-label="The Journey"
    >
      {/* Background Ambient Radial Light */}
      <div class="editorial-journey-glow" aria-hidden="true" />

      {/* 1. SECTION HEADER */}
      <header
        class={`editorial-journey-header ${headerVisible ? 'is-visible' : ''}`}
        data-index="header"
      >
        <h2 class="editorial-journey-title">THE JOURNEY</h2>

        <div class="editorial-journey-divider" aria-hidden="true">
          <span class="editorial-journey-divider-line left" />
          <span class="editorial-journey-divider-diamond" />
          <span class="editorial-journey-divider-line right" />
        </div>

        <p class="editorial-journey-subtitle">
          From First Reel to Director's Chair
        </p>
      </header>

      {/* 2. CONNECTED MILESTONES TRACK */}
      <div class="editorial-milestones-track">
        {/* Continuous Connecting Spine Line */}
        <div class="editorial-timeline-spine" aria-hidden="true">
          <div
            class="editorial-timeline-progress"
            style={{ height: `${activeProgress}%` }}
          />
        </div>

        {/* Four Milestone Rows */}
        {MILESTONES.map((item, index) => {
          const isCardLeft = index % 2 === 0
          const isItemVisible = !!visibleItems[index]

          return (
            <article
              key={item.id}
              data-index={index}
              class={`editorial-milestone-row ${
                isCardLeft ? 'card-left' : 'card-right'
              } milestone-${item.cardType} ${isItemVisible ? 'is-visible' : ''}`}
            >
              {/* Central Geometric Node */}
              <div
                class={`editorial-timeline-node ${
                  isItemVisible ? 'node-active' : ''
                }`}
                aria-hidden="true"
              >
                <div class="editorial-node-halo" />
                <div class="editorial-node-diamond" />
              </div>

              {/* Horizontal Connector Arm linking Node to Card */}
              <div class="editorial-connector-arm" aria-hidden="true" />

              {/* Left Column Content */}
              {isCardLeft ? (
                <>
                  <div class="editorial-card-col">
                    <div
                      class="editorial-card"
                      data-cursor="hover"
                    >
                      {/* Top Accent Gradient Border */}
                      <div class="editorial-card-top-bar" aria-hidden="true" />

                      {/* Corner Accents */}
                      <span class="editorial-corner-bracket top-left" aria-hidden="true" />
                      <span class="editorial-corner-bracket bottom-right" aria-hidden="true" />

                      {/* Optional Decorative Geometric Icon for Award milestone */}
                      {item.cardType === 'award' && (
                        <div class="editorial-award-crest" aria-hidden="true">
                          <svg viewBox="0 0 40 40" fill="none">
                            <path
                              d="M13 30 C 8 22, 8 13, 16 6 M14 25 C 9 21, 6 18, 3 17 M15 19 C 11 15, 7 13, 3 12 M17 13 C 13 10, 10 7, 7 4"
                              stroke="var(--gold)"
                              strokeWidth="1.6"
                              strokeLinecap="round"
                            />
                            <path
                              d="M27 30 C 32 22, 32 13, 24 6 M26 25 C 31 21, 34 18, 37 17 M25 19 C 29 15, 33 13, 37 12 M23 13 C 27 10, 30 7, 33 4"
                              stroke="var(--gold)"
                              strokeWidth="1.6"
                              strokeLinecap="round"
                            />
                            <polygon
                              points="20 10 22 15 27 16 23 20 24 25 20 22 16 25 17 20 13 16 18 15"
                              fill="var(--gold)"
                            />
                          </svg>
                        </div>
                      )}

                      <div class="editorial-card-year-wrap">
                        <span class="editorial-card-year">{item.year}</span>
                        <span class="editorial-card-year-rule" aria-hidden="true" />
                      </div>

                      <h3 class="editorial-card-title">{item.title}</h3>

                      <p class="editorial-card-desc">{item.description}</p>
                    </div>
                  </div>

                  {/* Right Column: Massive Watermark Year Display */}
                  <div class="editorial-watermark-col" aria-hidden="true">
                    <span class="editorial-year-watermark">{item.year}</span>
                  </div>
                </>
              ) : (
                <>
                  {/* Left Column: Massive Watermark Year Display */}
                  <div class="editorial-watermark-col" aria-hidden="true">
                    <span class="editorial-year-watermark">{item.year}</span>
                  </div>

                  {/* Right Column Content */}
                  <div class="editorial-card-col">
                    <div
                      class="editorial-card"
                      data-cursor="hover"
                    >
                      {/* Top Accent Gradient Border */}
                      <div class="editorial-card-top-bar" aria-hidden="true" />

                      {/* Corner Accents */}
                      <span class="editorial-corner-bracket top-left" aria-hidden="true" />
                      <span class="editorial-corner-bracket bottom-right" aria-hidden="true" />

                      <div class="editorial-card-year-wrap">
                        <span class="editorial-card-year">{item.year}</span>
                        <span class="editorial-card-year-rule" aria-hidden="true" />
                      </div>

                      <h3 class="editorial-card-title">{item.title}</h3>

                      <p class="editorial-card-desc">{item.description}</p>
                    </div>
                  </div>
                </>
              )}
            </article>
          )
        })}
      </div>
    </section>
  )
}
