import React from 'react'
import '../styles/DirectorsCutJourney.css'

const CHAPTERS = [
  {
    id: 'chapter-01',
    act: 'ACT I',
    scene: 'SCENE 01',
    timecode: 'TC 00:01:24:00',
    phase: 'THE GENESIS',
    theme: 'THE VIRAL SPARK',
    shortName: 'THE GENESIS',
    year: '2024',
    title: 'Created Youtube Account and Created first reel',
    desc: 'A 30-second cinematic reel that crossed a million views and set the journey in motion.',
    metaPills: [
      { label: 'FORMAT', value: '9:16 VERTICAL CINEMA' },
      { label: 'RUNTIME', value: '30 SECONDS' },
      { label: 'REACH', value: '1,000,000+ VIEWS' },
      { label: 'PLATFORM', value: 'YOUTUBE & REELS' },
    ],
  },
  {
    id: 'chapter-02',
    act: 'ACT II',
    scene: 'SCENE 02',
    timecode: 'TC 00:02:25:00',
    phase: 'BEHIND THE CAMERA',
    theme: 'DIRECTORIAL DEBUT',
    shortName: 'DIRECTORIAL DEBUT',
    year: '2025',
    title: 'Directed First Short Film',
    desc: "Made my directorial debut with 'Cooli Disco', taking on the roles of Director and Actor and bringing his first short film to the screen.",
    metaPills: [
      { label: 'PROJECT', value: "'COOLI DISCO'" },
      { label: 'ROLES', value: 'DIRECTOR & ACTOR' },
      { label: 'FORMAT', value: 'INDEPENDENT SHORT' },
      { label: 'MILESTONE', value: 'FIRST DIRECTED WORK' },
    ],
  },
  {
    id: 'chapter-03',
    act: 'ACT III',
    scene: 'SCENE 03',
    timecode: 'TC 00:03:25:12',
    phase: 'RECOGNITION',
    theme: 'INTERNATIONAL ACCLAIM',
    shortName: 'FESTIVAL ACCLAIM',
    year: '2025',
    title: 'Best Short Film Award for Akirodeka',
    desc: 'Directed and acted in the short film “Akirodeka,” which was recognized as a Best Short Film at the Kerala International Indie Film Awards 2026, standing out among 9,532 entries from filmmakers and creators.',
    metaPills: [
      { label: 'FESTIVAL', value: 'KERALA INDIE FILM AWARDS 2026' },
      { label: 'HONOUR', value: 'BEST SHORT FILM WINNER' },
      { label: 'FIELD', value: 'SELECTED FROM 9,532 ENTRIES' },
      { label: 'WORK', value: '"AKIRODEKA"' },
    ],
  },
  {
    id: 'chapter-04',
    act: 'ACT IV',
    scene: 'SCENE 04',
    timecode: 'TC 00:04:26:00',
    phase: 'THE BIG SCREEN',
    theme: 'THEATRICAL HORIZON',
    shortName: 'FEATURE FILM',
    year: '2026',
    title: 'Junior Acting Debut',
    desc: 'A proud milestone — made my debut as a junior actor in my first feature film alongside Narne Nithin. Grateful for the opportunity to step onto the big screen and begin my journey as an actor.',
    metaPills: [
      { label: 'PRODUCTION', value: 'THEATRICAL FEATURE FILM' },
      { label: 'CO-STAR', value: 'NARNE NITHIN' },
      { label: 'ROLE', value: 'JUNIOR ACTOR DEBUT' },
      { label: 'TRAJECTORY', value: 'BIG SCREEN THEATRICAL' },
    ],
  },
]

export function DirectorsCutJourney() {
  const scrollToChapter = (id) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }

  return (
    <div class="dc-journey-wrapper journey-subsection" id="the-journey-chronicle">
      {/* 1. EDITORIAL HEADER: DIRECTOR'S LEDGER */}
      <header class="dc-header">
        <div class="dc-header-eyebrow">
          <span class="dc-archive-badge">ARCHIVE REEL // 2024 — 2026</span>
          <span class="dc-eyebrow-divider" aria-hidden="true" />
          <span class="dc-status-indicator">
            <span class="dc-pulse-dot" aria-hidden="true" />
            DIRECTOR'S CUT
          </span>
        </div>

        <h3 class="dc-heading">
          THE JOURNEY
          <span class="dc-heading-sub">From First Reel to Director's Chair</span>
        </h3>

        <p class="dc-prologue">
          A four-chapter cinematic retrospective chronicling the creative progression from an
          independent million-view vertical reel to auteur direction, international festival jury
          validation, and the feature-film silver screen.
        </p>

        {/* Chapter Quick-Jump Navigation Bar */}
        <nav class="dc-chapter-nav" aria-label="Chapter quick navigation">
          {CHAPTERS.map((ch, idx) => (
            <button
              type="button"
              key={ch.id}
              class="dc-nav-pill"
              onClick={() => scrollToChapter(ch.id)}
              data-cursor="hover"
            >
              <span class="dc-nav-index">{`0${idx + 1}`}</span>
              <span class="dc-nav-year">{ch.year}</span>
              <span class="dc-nav-phase">{ch.shortName}</span>
            </button>
          ))}
        </nav>
      </header>

      {/* 2. THE FOUR CINEMATIC CHAPTER SPREADS */}
      <div class="dc-chapters-sequence">
        {/* ===================================================================
            CHAPTER 01: 2024 — THE GENESIS (9:16 Vertical Reel Canvas)
            =================================================================== */}
        <section class="dc-chapter dc-chapter-01 journey-item" id="chapter-01">
          <div class="dc-chapter-inner">
            {/* Left Monumental Typography Block */}
            <div class="dc-chapter-typography">
              <div class="dc-chapter-numeral-wrap">
                <span class="dc-huge-numeral">01</span>
                <span class="dc-numeral-bracket">[ ACT I ]</span>
              </div>
              <div class="dc-chapter-meta-stack">
                <span class="dc-chapter-timecode">TC 00:01:24:00</span>
                <h4 class="dc-chapter-year">2024</h4>
                <div class="dc-phase-callout">
                  <span class="dc-phase-title">THE BEGINNING</span>
                  <span class="dc-phase-desc">The Viral Spark & Kinetic Inception</span>
                </div>
              </div>
            </div>

            {/* Right: The 9:16 Vertical Reel Film Slate Canvas */}
            <article class="dc-canvas dc-vertical-reel-canvas" data-cursor="hover">
              {/* Celluloid Filmstrip Sprockets */}
              <div class="dc-sprocket-strip top" aria-hidden="true">
                {[...Array(8)].map((_, i) => (
                  <span class="dc-sprocket-hole" key={i} />
                ))}
              </div>

              <div class="dc-canvas-header">
                <div class="dc-slate-tag-group">
                  <span class="dc-tag-pill gold">VERTICAL CINEMA</span>
                  <span class="dc-tag-pill outline">REEL 01</span>
                </div>
                <span class="dc-lens-indicator">REC ● 9:16 4K</span>
              </div>

              <div class="dc-canvas-body">
                <h5 class="dc-milestone-title">
                  Created Youtube Account and Created first reel
                </h5>
                <blockquote class="dc-milestone-desc">
                  "A 30-second cinematic reel that crossed a million views and set the journey in motion."
                </blockquote>
              </div>

              {/* Telemetry Matrix Grid */}
              <div class="dc-telemetry-grid">
                <div class="dc-telemetry-cell">
                  <span class="dc-telemetry-label">RUNTIME</span>
                  <span class="dc-telemetry-val">30 SECONDS</span>
                </div>
                <div class="dc-telemetry-cell highlight">
                  <span class="dc-telemetry-label">AUDIENCE REACH</span>
                  <span class="dc-telemetry-val">1,000,000+ VIEWS</span>
                </div>
                <div class="dc-telemetry-cell">
                  <span class="dc-telemetry-label">PLATFORM</span>
                  <span class="dc-telemetry-val">YOUTUBE & REELS</span>
                </div>
                <div class="dc-telemetry-cell">
                  <span class="dc-telemetry-label">IMPACT</span>
                  <span class="dc-telemetry-val">VIRAL FOUNDATION</span>
                </div>
              </div>

              <div class="dc-sprocket-strip bottom" aria-hidden="true">
                {[...Array(8)].map((_, i) => (
                  <span class="dc-sprocket-hole" key={i} />
                ))}
              </div>
            </article>
          </div>

          {/* Sequence Bridge */}
          <div class="dc-sequence-bridge" aria-hidden="true">
            <span class="dc-bridge-line" />
            <span class="dc-bridge-tag">
              SEQUENCE TRANSITION // FROM VIRAL CREATOR TO INDEPENDENT AUTEUR
            </span>
            <span class="dc-bridge-line" />
          </div>
        </section>

        {/* ===================================================================
            CHAPTER 02: 2025 — BEHIND THE CAMERA (Director's Clapper Slate)
            =================================================================== */}
        <section class="dc-chapter dc-chapter-02 journey-item" id="chapter-02">
          <div class="dc-chapter-inner inverted">
            {/* Left: Director's Production Slate */}
            <article class="dc-canvas dc-clapper-canvas" data-cursor="hover">
              {/* Clapper Hazard Chevron Top Bar */}
              <div class="dc-clapper-topbar">
                <div class="dc-clapper-stripes" aria-hidden="true">
                  {[...Array(12)].map((_, i) => (
                    <span class="dc-chevron-stripe" key={i} />
                  ))}
                </div>
                <div class="dc-clapper-slate-title">
                  SCENE: 01 &bull; TAKE: 01 &bull; SOUND: SYNC &bull; PROD: COOLI DISCO
                </div>
              </div>

              <div class="dc-canvas-header">
                <div class="dc-slate-tag-group">
                  <span class="dc-tag-pill gold">DIRECTORIAL DEBUT</span>
                  <span class="dc-tag-pill outline">INDEPENDENT SHORT</span>
                </div>
                <span class="dc-lens-indicator">AUTEUR TAKES</span>
              </div>

              <div class="dc-canvas-body">
                <div class="dc-project-badge-bar">
                  <span class="dc-project-label">FEATURED TITLE</span>
                  <span class="dc-project-name">'COOLI DISCO'</span>
                </div>
                <h5 class="dc-milestone-title">Directed First Short Film</h5>
                <blockquote class="dc-milestone-desc">
                  "Made my directorial debut with 'Cooli Disco', taking on the roles of Director and Actor and bringing his first short film to the screen."
                </blockquote>
              </div>

              {/* Production Callouts */}
              <div class="dc-telemetry-grid">
                <div class="dc-telemetry-cell">
                  <span class="dc-telemetry-label">PROJECT NAME</span>
                  <span class="dc-telemetry-val">'COOLI DISCO'</span>
                </div>
                <div class="dc-telemetry-cell highlight">
                  <span class="dc-telemetry-label">DUAL ROLES</span>
                  <span class="dc-telemetry-val">DIRECTOR & ACTOR</span>
                </div>
                <div class="dc-telemetry-cell">
                  <span class="dc-telemetry-label">MEDIUM</span>
                  <span class="dc-telemetry-val">INDIE SHORT FILM</span>
                </div>
                <div class="dc-telemetry-cell">
                  <span class="dc-telemetry-label">MILESTONE</span>
                  <span class="dc-telemetry-val">DIRECTORIAL SCREEN DEBUT</span>
                </div>
              </div>
            </article>

            {/* Right: Monumental Typography Block */}
            <div class="dc-chapter-typography right-aligned">
              <div class="dc-chapter-numeral-wrap">
                <span class="dc-numeral-bracket">[ ACT II ]</span>
                <span class="dc-huge-numeral">02</span>
              </div>
              <div class="dc-chapter-meta-stack">
                <span class="dc-chapter-timecode">TC 00:02:25:00</span>
                <h4 class="dc-chapter-year">2025</h4>
                <div class="dc-phase-callout">
                  <span class="dc-phase-title">BEHIND THE CAMERA</span>
                  <span class="dc-phase-desc">Directorial Vision & Screen Craft</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sequence Bridge */}
          <div class="dc-sequence-bridge" aria-hidden="true">
            <span class="dc-bridge-line" />
            <span class="dc-bridge-tag">
              SEQUENCE TRANSITION // FROM LOCAL DEBUT TO INTERNATIONAL FESTIVAL RECOGNITION
            </span>
            <span class="dc-bridge-line" />
          </div>
        </section>

        {/* ===================================================================
            CHAPTER 03: 2025 — RECOGNITION (Grand Laurel Pavilion Centerpiece)
            =================================================================== */}
        <section class="dc-chapter dc-chapter-03 journey-item" id="chapter-03">
          <div class="dc-laurel-pavilion-canvas" data-cursor="hover">
            {/* Ambient Radial Spotlight */}
            <div class="dc-pavilion-spotlight" aria-hidden="true" />

            {/* Pavilion Top Header */}
            <div class="dc-pavilion-topbar">
              <span class="dc-act-badge">ACT III &bull; SCENE 03</span>
              <span class="dc-laurel-year">2025</span>
              <span class="dc-jury-timecode">TC 00:03:25:12</span>
            </div>

            {/* Laurel Wreath Crest & Trophy Emblem */}
            <div class="dc-laurel-crest-wrapper" aria-hidden="true">
              <svg class="dc-laurel-svg" viewBox="0 0 160 80" fill="none">
                {/* Left Laurel Branch */}
                <path
                  d="M40 70 C 30 50, 32 30, 48 12 M42 62 C 34 52, 26 44, 18 42 M44 48 C 34 38, 24 32, 16 28 M48 34 C 38 26, 30 18, 24 10 M52 22 C 46 14, 40 8, 36 2"
                  stroke="var(--gold)"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
                {/* Center Star / Trophy Diamond */}
                <polygon points="80 18 84 28 95 30 87 38 89 49 80 44 71 49 73 38 65 30 76 28" fill="var(--gold)" />
                {/* Right Laurel Branch */}
                <path
                  d="M120 70 C 130 50, 128 30, 112 12 M118 62 C 126 52, 134 44, 142 42 M116 48 C 126 38, 136 32, 144 28 M112 34 C 122 26, 130 18, 136 10 M108 22 C 114 14, 120 8, 124 2"
                  stroke="var(--gold)"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            <div class="dc-pavilion-headings">
              <span class="dc-festival-pretitle">KERALA INTERNATIONAL INDIE FILM AWARDS 2026</span>
              <h5 class="dc-pavilion-title">Best Short Film Award for Akirodeka</h5>
              <p class="dc-pavilion-quote">
                "Directed and acted in the short film “Akirodeka,” which was recognized as a Best Short
                Film at the Kerala International Indie Film Awards 2026, standing out among 9,532 entries
                from filmmakers and creators."
              </p>
            </div>

            {/* Official Festival Verification Ledger */}
            <div class="dc-pavilion-ledger">
              <div class="dc-ledger-row">
                <span class="dc-ledger-cell-title">OFFICIAL SELECTION</span>
                <span class="dc-ledger-cell-content">KERALA INTERNATIONAL INDIE FILM AWARDS</span>
              </div>
              <div class="dc-ledger-row highlight">
                <span class="dc-ledger-cell-title">AWARD STATUS</span>
                <span class="dc-ledger-cell-content gold">WINNER — BEST SHORT FILM</span>
              </div>
              <div class="dc-ledger-row">
                <span class="dc-ledger-cell-title">COMPETITION POOL</span>
                <span class="dc-ledger-cell-content highlight-bold">9,532 GLOBAL ENTRIES</span>
              </div>
              <div class="dc-ledger-row">
                <span class="dc-ledger-cell-title">HONOURED PROJECT</span>
                <span class="dc-ledger-cell-content">“AKIRODEKA” (DIRECTOR & LEAD ACTOR)</span>
              </div>
            </div>
          </div>

          {/* Sequence Bridge */}
          <div class="dc-sequence-bridge" aria-hidden="true">
            <span class="dc-bridge-line" />
            <span class="dc-bridge-tag">
              SEQUENCE TRANSITION // FROM INDEPENDENT SHORTS TO FEATURE FILM SILVER SCREEN
            </span>
            <span class="dc-bridge-line" />
          </div>
        </section>

        {/* ===================================================================
            CHAPTER 04: 2026 — THE BIG SCREEN (2.39:1 Cinemascope Marquee)
            =================================================================== */}
        <section class="dc-chapter dc-chapter-04 journey-item" id="chapter-04">
          <div class="dc-chapter-inner">
            {/* Left Monumental Typography Block */}
            <div class="dc-chapter-typography">
              <div class="dc-chapter-numeral-wrap">
                <span class="dc-huge-numeral">04</span>
                <span class="dc-numeral-bracket">[ ACT IV ]</span>
              </div>
              <div class="dc-chapter-meta-stack">
                <span class="dc-chapter-timecode">TC 00:04:26:00</span>
                <h4 class="dc-chapter-year">2026</h4>
                <div class="dc-phase-callout">
                  <span class="dc-phase-title">THE BIG SCREEN</span>
                  <span class="dc-phase-desc">Feature Film Theatrical Debut</span>
                </div>
              </div>
            </div>

            {/* Right: Cinemascope 2.39:1 Letterbox Frame */}
            <article class="dc-canvas dc-cinemascope-canvas" data-cursor="hover">
              {/* Top Velvet Matte Letterbox Bar */}
              <div class="dc-letterbox-bar top">
                <span class="dc-aspect-tag">ASPECT RATIO 2.39:1 ANAMORPHIC WIDESCREEN</span>
                <span class="dc-aspect-tag">DCI THEATRICAL MASTER</span>
              </div>

              <div class="dc-canvas-header">
                <div class="dc-slate-tag-group">
                  <span class="dc-tag-pill gold">FEATURE FILM DEBUT</span>
                  <span class="dc-tag-pill outline">SILVER SCREEN</span>
                </div>
                <span class="dc-lens-indicator">PRIME ANAMORPHIC</span>
              </div>

              <div class="dc-canvas-body">
                <div class="dc-costar-marquee-strip">
                  <span class="dc-costar-lead">CO-STARRING ALONGSIDE</span>
                  <span class="dc-costar-name">NARNE NITHIN</span>
                </div>

                <h5 class="dc-milestone-title">Junior Acting Debut</h5>
                <blockquote class="dc-milestone-desc">
                  "A proud milestone — made my debut as a junior actor in my first feature film alongside
                  Narne Nithin. Grateful for the opportunity to step onto the big screen and begin my journey
                  as an actor."
                </blockquote>
              </div>

              {/* Theatrical Production Credits */}
              <div class="dc-telemetry-grid">
                <div class="dc-telemetry-cell">
                  <span class="dc-telemetry-label">MEDIUM</span>
                  <span class="dc-telemetry-val">THEATRICAL FEATURE FILM</span>
                </div>
                <div class="dc-telemetry-cell highlight">
                  <span class="dc-telemetry-label">ACTING BILLING</span>
                  <span class="dc-telemetry-val">JUNIOR ACTOR DEBUT</span>
                </div>
                <div class="dc-telemetry-cell">
                  <span class="dc-telemetry-label">CAST ENSEMBLE</span>
                  <span class="dc-telemetry-val">WITH NARNE NITHIN</span>
                </div>
                <div class="dc-telemetry-cell">
                  <span class="dc-telemetry-label">HORIZON</span>
                  <span class="dc-telemetry-val">BIG SCREEN COMMENCEMENT</span>
                </div>
              </div>

              {/* Bottom Velvet Matte Letterbox Bar */}
              <div class="dc-letterbox-bar bottom">
                <span class="dc-aspect-tag">STATUS: PRODUCTION CHRONICLE ACTIVE</span>
                <span class="dc-aspect-tag">CONTINUOUS DIRECTORIAL PURSUIT</span>
              </div>
            </article>
          </div>

          {/* Sequence Conclusion Coda */}
          <footer class="dc-coda">
            <div class="dc-coda-emblem" aria-hidden="true">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <polygon points="12 2 15 9 22 12 15 15 12 22 9 15 2 12 9 9 12 2" fill="var(--gold)" />
              </svg>
            </div>
            <span class="dc-coda-text">
              THE JOURNEY CONTINUES &bull; NEW PRODUCTIONS IN CONTINUOUS DEVELOPMENT
            </span>
          </footer>
        </section>
      </div>
    </div>
  )
}

