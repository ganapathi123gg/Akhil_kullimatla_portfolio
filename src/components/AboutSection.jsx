import { CREATOR } from '../data/creatorConfig'
import aboutDirectorImg from '../assets/akhil_directer_img.png'
import { AwardsShowcase } from './AwardsShowcase'
import '../styles/AboutSection.css'

export function AboutSection() {
  return (
    <section class="about-section" id="about">
      <div class="container">
        {/* Main 2-Column Grid */}
        <div class="about-main-grid">
          {/* Left Column: Framed Image with DIRECTOR Badge */}
          <div class="about-visual-col">
            <div class="about-frame-wrapper">
              <div class="about-frame-border" />
              <div class="about-image-wrap">
                <img
                  src={aboutDirectorImg}
                  alt="Akhil directing on camera set"
                  class="about-director-img"
                  loading="lazy"
                />
              </div>
              <div class="about-role-badge">DIRECTOR</div>
            </div>
          </div>

          {/* Right Column: Bio & Skills */}
          <div class="about-content-col">
            <div class="section-tag">ABOUT ME</div>
            <h2 class="hero-title about-heading" style={{ fontSize: 'clamp(36px, 4.5vw, 64px)', marginBottom: '16px' }}>
              {CREATOR.aboutHeading}{' '}
              <span class="hero-highlight">{CREATOR.aboutHighlight}</span>
            </h2>

            <p class="about-sub">{CREATOR.aboutSub}</p>

            <div class="about-paragraphs">
              <p class="about-p">{CREATOR.aboutBio1}</p>
              <p class="about-p">{CREATOR.aboutBio2}</p>
              <p class="about-p">{CREATOR.aboutBio3}</p>
            </div>

            {/* Skills Pills */}
            <div class="skills-block">
              <div class="skills-title">CORE DISCIPLINES & SKILLS</div>
              <div class="skills-pills">
                {CREATOR.skills.map((skill, idx) => (
                  <span class="skill-pill" key={idx} data-cursor="hover">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Signature Logo */}
            <div class="about-signature-text">UGESH KULLIMATLA</div>
          </div>
        </div>

        {/* The Journey Section */}
        <div class="journey-subsection">
          <div class="journey-header">
            <div class="section-tag">THE JOURNEY</div>
            <h3 class="journey-title">From First Reel to Director's Chair</h3>
            <div class="journey-divider" />
          </div>

          <div class="journey-grid">
            {CREATOR.journey.map((item, idx) => (
              <div class="journey-item" key={idx}>
                <div class="journey-year">{item.year}</div>
                <h4 class="journey-item-title">{item.title}</h4>
                <p class="journey-item-desc">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Awards & Recognition Section */}
        <div class="awards-subsection">
          <div class="section-tag">AWARDS & RECOGNITION</div>
          <h3 class="awards-creative-heading">
            Recognition for <span class="awards-heading-highlight">Creative Vision & Direction</span>
          </h3>

          <AwardsShowcase />
        </div>
      </div>
    </section>
  )
}
