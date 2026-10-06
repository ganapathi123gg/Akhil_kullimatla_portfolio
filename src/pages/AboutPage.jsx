import { CREATOR } from '../data/creatorConfig'
import aboutDirector from '../assets/akhil_directer_img.png'
import signatureBanner from '../assets/signature_baner_updated.png'
import { AwardsShowcase } from '../components/AwardsShowcase'

export function AboutPage({ setActivePage, setCursorState, onSelectImage }) {
  return (
    <div class="page-view about-page page-transition">
      <div class="container">
        {/* Header */}
        <header class="page-header">
          <span class="section-tag">ABOUT ME</span>
          <h1 class="page-title">
            {CREATOR.aboutHeading} <span class="shimmer-text">{CREATOR.aboutHighlight}</span>
          </h1>
          <p class="page-subtitle">{CREATOR.aboutSub}</p>
        </header>

        {/* Main Bio Grid */}
        <section class="about-grid-section">
          {/* Left: Director & Model Visual */}
          <div class="about-visual-wrap">
            <div
              class="about-photo-card"
              onClick={() => onSelectImage({ img: aboutDirector, title: `${CREATOR.name} on Cinema Set` }, 0)}
              onMouseEnter={() => setCursorState?.({ type: 'view' })}
              onMouseLeave={() => setCursorState?.(null)}
            >
              <div class="card-gold-frame-accent" />
              <img src={aboutDirector} alt="Director on set" class="about-photo-img" />
              <div class="about-photo-badge">DIRECTOR / MODEL</div>
            </div>
          </div>

          {/* Right: Detailed Story & Skills */}
          <div class="about-content-wrap">
            <div class="about-narrative">
              <p class="about-lead-para">{CREATOR.aboutBio1}</p>
              <p>{CREATOR.aboutBio2}</p>
              <p>{CREATOR.aboutBio3}</p>
            </div>

            {/* Skills Pills */}
            <div class="about-skills-block">
              <h4 class="skills-block-title">SKILLS & CAPABILITIES</h4>
              <div class="skills-tag-cloud">
                {CREATOR.skills.map((skill) => (
                  <span key={skill} class="skill-tag-pill">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Signature Watermark */}
            <div class="about-signature-watermark">
              <span>UGESH KULLIMATLA</span>
            </div>
          </div>
        </section>

        {/* The Journey Timeline */}
        <section class="journey-section">
          <span class="section-tag">THE JOURNEY</span>
          <h2 class="journey-main-heading">From First Reel to Director's Chair</h2>

          <div class="timeline-row">
            {CREATOR.journey.map((item, idx) => (
              <div key={idx} class="timeline-step">
                <div class="step-year-bar">
                  <span class="step-year">{item.year}</span>
                  <span class="step-line" />
                </div>
                <h3 class="step-title">{item.title}</h3>
                <p class="step-desc">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Director's Note Banner */}
      <section class="directors-note-section">
        <div class="directors-note-bg">
          <img src={signatureBanner} alt="Atmospheric Set" class="directors-note-img" />
          <div class="directors-note-overlay" />
        </div>

        <div class="container directors-note-content">
          <span class="section-tag note-tag">DIRECTOR'S NOTE</span>
          <blockquote class="note-quote">
            "{CREATOR.directorNote}"
          </blockquote>
        </div>
      </section>

      {/* Awards & Recognition Section */}
      <section class="awards-section">
        <div class="container">
          <span class="section-tag">AWARDS & RECOGNITION</span>
          <h2 class="awards-creative-heading">Recognition for <span class="awards-heading-highlight">Creative Vision & Direction</span></h2>
          <AwardsShowcase />
        </div>
      </section>
    </div>
  )
}
