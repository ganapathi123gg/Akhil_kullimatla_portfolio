import { useState } from 'preact/hooks'
import { CREATOR, FAQS } from '../data/creatorConfig'
import { sendContactEmail, validateContactForm } from '../utils/emailService'
import '../styles/ContactSection.css'

export function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    projectType: 'Short Film',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState('idle') // 'idle' | 'success' | 'error'
  const [statusMessage, setStatusMessage] = useState('')
  const [openFaq, setOpenFaq] = useState(0)

  const handleSubmit = async (e) => {
    e.preventDefault()

    const validation = validateContactForm({
      name: formData.name,
      email: formData.email,
      message: formData.message,
    })

    if (!validation.isValid) {
      setStatus('error')
      setStatusMessage(validation.error)
      return
    }

    setIsSubmitting(true)
    setStatus('idle')
    setStatusMessage('')

    try {
      const res = await sendContactEmail({
        name: formData.name,
        email: formData.email,
        purpose: formData.projectType,
        description: formData.message,
      })

      setStatus('success')
      setStatusMessage(res.message || 'Your request has been sent successfully. Thank you for reaching out.')
      setFormData({
        name: '',
        email: '',
        projectType: 'Short Film',
        message: '',
      })
    } catch (err) {
      console.error('Failed to send contact email:', err)
      setStatus('error')
      setStatusMessage(
        err?.text || err?.message || 'Something went wrong while sending your request. Please try again.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? -1 : index)
  }

  return (
    <section class="contact-section" id="contact">
      <div class="container">
        {/* Main Grid */}
        <div class="contact-main-grid">
          {/* Left Column: Direct Info */}
          <div class="contact-left-col">
            <div class="section-tag">GET IN TOUCH</div>
            <h2 class="hero-title contact-heading" style={{ fontSize: 'clamp(36px, 4.5vw, 64px)', marginBottom: '16px' }}>
              Let's Create Something <span class="hero-highlight">Cinematic.</span>
            </h2>
            <p class="about-p" style={{ marginBottom: '16px' }}>
              Tell me about your film, brand or channel. I bring the vision — you bring the story.
            </p>

            {/* Availability Badge */}
            <div class="status-badge">
              <span class="status-dot" />
              <span>{CREATOR.availability}</span>
            </div>

            {/* Email & 24hr Reply Guarantee */}
            <div class="contact-meta-group">
              <div class="contact-meta-label">EMAIL</div>
              <a href={`mailto:${CREATOR.contactEmail}`} class="contact-big-email" data-cursor="hover">
                {CREATOR.contactEmail}
              </a>
              <div class="contact-reply-guarantee">
                <span>⏱</span>
                <span>{CREATOR.responseGuarantee}</span>
              </div>
            </div>

            {/* Social Links */}
            <div class="contact-meta-group">
              <div class="contact-meta-label">OFFICIAL CHANNELS & SOCIAL</div>
              <div class="contact-social-grid">
                <a
                  href={CREATOR.socials.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="hero-social-pill youtube"
                  data-cursor="hover"
                  data-cursor-label="YOUTUBE"
                >
                  <div class="social-icon-box">
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                  </div>
                  <div class="social-text-box">
                    <span class="social-platform">YOUTUBE</span>
                    <span class="social-handle">@ugeshcreator</span>
                  </div>
                  <span class="social-arrow-hint">↗</span>
                </a>

                <a
                  href={CREATOR.socials.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="hero-social-pill instagram"
                  data-cursor="hover"
                  data-cursor-label="INSTAGRAM"
                >
                  <div class="social-icon-box">
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                    </svg>
                  </div>
                  <div class="social-text-box">
                    <span class="social-platform">INSTAGRAM</span>
                    <span class="social-handle">@_ugesshhh_</span>
                  </div>
                  <span class="social-arrow-hint">↗</span>
                </a>

                <a
                  href={CREATOR.socials.snapchat}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="hero-social-pill snapchat"
                  data-cursor="hover"
                  data-cursor-label="SNAPCHAT"
                >
                  <div class="social-icon-box">
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12.001 2c-3.79 0-6.27 2.68-6.27 5.68 0 .82.19 1.83.54 2.62.15.34.05.51-.25.71-.58.38-1.57.85-1.93 1.5-.26.47-.07.94.49 1.14.77.27 1.87.16 2.53.07.25-.03.42.09.47.33.24 1.15.99 2.06 2.39 2.45.2.06.31.18.25.39-.24.78-1.52 1.34-2.83 1.55-.42.07-.63.29-.53.64.12.44.62.67 1.25.68 1.1.02 2.36-.36 3.49-.91.24-.12.45-.11.66 0 1.13.55 2.39.93 3.49.91.63-.01 1.13-.24 1.25-.68.1-.35-.11-.57-.53-.64-1.31-.21-2.59-.77-2.83-1.55-.06-.21.05-.33.25-.39 1.4-.39 2.15-1.3 2.39-2.45.05-.24.22-.36.47-.33.66.09 1.76.2 2.53-.07.56-.2.75-.67.49-1.14-.36-.65-1.35-1.12-1.93-1.5-.3-.2-.4-.37-.25-.71.35-.79.54-1.8.54-2.62 0-3-2.48-5.68-6.27-5.68z"/>
                    </svg>
                  </div>
                  <div class="social-text-box">
                    <span class="social-platform">SNAPCHAT</span>
                    <span class="social-handle">@ugessshhh</span>
                  </div>
                  <span class="social-arrow-hint">↗</span>
                </a>

                <a
                  href={`mailto:${CREATOR.contactEmail}`}
                  class="hero-social-pill email"
                  data-cursor="hover"
                  data-cursor-label="EMAIL"
                >
                  <div class="social-icon-box">
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                  </div>
                  <div class="social-text-box">
                    <span class="social-platform">EMAIL</span>
                    <span class="social-handle">{CREATOR.contactEmail}</span>
                  </div>
                  <span class="social-arrow-hint">↗</span>
                </a>
              </div>
            </div>

            {/* Location */}
            <div class="contact-meta-group">
              <div class="contact-meta-label">BASED IN</div>
              <p class="about-p" style={{ fontSize: '14px' }}>{CREATOR.location}</p>
            </div>
          </div>

          {/* Right Column: Interactive Form */}
          <div class="contact-form-box">
            {status === 'success' && (
              <div class="form-success-banner" role="alert">
                <span>✓</span>
                <span>{statusMessage}</span>
              </div>
            )}

            {status === 'error' && (
              <div class="form-error-banner" role="alert">
                <span>⚠</span>
                <span>{statusMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label" htmlFor="client-name">NAME</label>
                  <input
                    id="client-name"
                    type="text"
                    required
                    class="form-input"
                    placeholder="Your name"
                    value={formData.name}
                    onInput={(e) => setFormData({ ...formData, name: e.target.value })}
                    disabled={isSubmitting}
                  />
                </div>

                <div class="form-group">
                  <label class="form-label" htmlFor="client-email">EMAIL</label>
                  <input
                    id="client-email"
                    type="email"
                    required
                    class="form-input"
                    placeholder="you@example.com"
                    value={formData.email}
                    onInput={(e) => setFormData({ ...formData, email: e.target.value })}
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div class="form-group">
                <label class="form-label" htmlFor="project-type">PROJECT TYPE</label>
                <select
                  id="project-type"
                  class="form-select"
                  value={formData.projectType}
                  onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                  disabled={isSubmitting}
                >
                  <option value="Short Film">Short Film / Narrative Cinema</option>
                  <option value="Brand Reel / Commercial">Brand Reel / Commercial Campaign</option>
                  <option value="YouTube Production">YouTube Production & Editing</option>
                  <option value="Modeling / Editorial">Modeling & High-Fashion Editorial</option>
                  <option value="Creative Direction">Full Creative Direction & Color Grading</option>
                  <option value="Other">Other Creative Inquiry</option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label" htmlFor="client-msg">MESSAGE</label>
                <textarea
                  id="client-msg"
                  required
                  class="form-textarea"
                  placeholder="Tell me about your project, timeline, deliverables and vision..."
                  value={formData.message}
                  onInput={(e) => setFormData({ ...formData, message: e.target.value })}
                  disabled={isSubmitting}
                />
              </div>

              <button
                type="submit"
                class="btn-gold-fill"
                style={{ width: '100%' }}
                data-cursor="hover"
                data-cursor-label={isSubmitting ? 'SENDING' : 'SEND'}
                disabled={isSubmitting}
              >
                <span>{isSubmitting ? '⏳' : '✈'}</span>
                <span>{isSubmitting ? 'SENDING...' : 'SEND MESSAGE'}</span>
              </button>

              <div class="form-subnote">No spam. Just good conversations.</div>
            </form>
          </div>
        </div>

        {/* FAQs Accordion */}
        <div class="faqs-section">
          <div class="section-tag">FAQS</div>
          <h3 class="journey-title">Questions, Answered</h3>

          <div class="faqs-list">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx
              return (
                <div class={`faq-item ${isOpen ? 'open' : ''}`} key={idx}>
                  <button
                    type="button"
                    class="faq-question-btn"
                    onClick={() => toggleFaq(idx)}
                    aria-expanded={isOpen}
                    data-cursor="hover"
                  >
                    <span>{faq.question}</span>
                    <span class="faq-icon-sign">{isOpen ? '—' : '+'}</span>
                  </button>
                  <div class="faq-answer-wrap">
                    <p class="faq-answer-text">{faq.answer}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
