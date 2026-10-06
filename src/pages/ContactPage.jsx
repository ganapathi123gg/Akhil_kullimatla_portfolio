import { useState } from 'preact/hooks'
import { CREATOR, FAQS } from '../data/creatorConfig'
import { sendContactEmail, validateContactForm } from '../utils/emailService'

export function ContactPage({ setCursorState }) {
  const [openFaq, setOpenFaq] = useState(0) // Default first open as in wireframe
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [projectType, setProjectType] = useState('Short film / Reel / YouTube / Other')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState('idle') // idle, sending, success, error
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()

    const validation = validateContactForm({ name, email, message })
    if (!validation.isValid) {
      setStatus('error')
      setErrorMessage(validation.error)
      return
    }

    setStatus('sending')
    setErrorMessage('')

    try {
      await sendContactEmail({
        name,
        email,
        purpose: projectType,
        description: message,
      })
      setStatus('success')
    } catch (err) {
      console.error('Failed to send contact email:', err)
      setStatus('error')
      setErrorMessage(
        err?.text || err?.message || 'Something went wrong while sending your request. Please try again.'
      )
    }
  }

  const toggleFaq = (idx) => {
    setOpenFaq(openFaq === idx ? null : idx)
  }

  return (
    <div class="page-view contact-page page-transition">
      <div class="container">
        {/* Header */}
        <header class="contact-header">
          <span class="section-tag">GET IN TOUCH</span>
          <h1 class="contact-main-title">
            Let's Create Something <span class="shimmer-text">Cinematic.</span>
          </h1>
          <p class="contact-subtitle">
            Tell me about your film, brand or channel. I bring the vision — you bring the story.
          </p>

          <div class="availability-badge">
            <span class="status-pulse-dot" />
            <span class="availability-text">{CREATOR.availability}</span>
          </div>
        </header>

        {/* Contact Split Row */}
        <section class="contact-split-section">
          {/* Left Column: Direct Info */}
          <div class="contact-info-col">
            <div class="contact-info-block">
              <span class="info-label">EMAIL</span>
              <a href={`mailto:${CREATOR.contactEmail}`} class="info-value-email">
                {CREATOR.contactEmail}
              </a>
              <div class="response-time">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                <span>{CREATOR.responseGuarantee}</span>
              </div>
            </div>

            <div class="contact-info-block">
              <span class="info-label">OFFICIAL CHANNELS & SOCIAL</span>
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

            <div class="contact-info-block">
              <span class="info-label">BASED IN</span>
              <div class="info-value-text">{CREATOR.location}</div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div class="contact-form-col">
            <div class="contact-form-card">
              {status === 'success' ? (
                <div class="form-success-state">
                  <div class="success-gold-icon">✓</div>
                  <h3 class="success-title">Message Dispatched</h3>
                  <p class="success-desc">
                    Your request has been sent successfully. Thank you for reaching out, <strong>{name}</strong>! Your message has been routed directly to Akhil's inbox.
                  </p>
                  <button
                    class="btn-gold-fill"
                    onClick={() => {
                      setStatus('idle')
                      setName('')
                      setEmail('')
                      setMessage('')
                    }}
                  >
                    SEND ANOTHER MESSAGE
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  {status === 'error' && (
                    <div class="form-error-banner" role="alert">
                      <span>⚠</span>
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  <div class="form-two-col">
                    <div class="form-group">
                      <label class="form-label">NAME</label>
                      <input
                        type="text"
                        placeholder="Your name"
                        required
                        value={name}
                        onInput={(e) => setName(e.target.value)}
                        class="contact-input"
                        disabled={status === 'sending'}
                      />
                    </div>

                    <div class="form-group">
                      <label class="form-label">EMAIL</label>
                      <input
                        type="email"
                        placeholder="you@example.com"
                        required
                        value={email}
                        onInput={(e) => setEmail(e.target.value)}
                        class="contact-input"
                        disabled={status === 'sending'}
                      />
                    </div>
                  </div>

                  <div class="form-group">
                    <label class="form-label">PROJECT TYPE</label>
                    <select
                      class="contact-select"
                      value={projectType}
                      onChange={(e) => setProjectType(e.target.value)}
                      disabled={status === 'sending'}
                    >
                      <option value="Short film / Reel / YouTube / Other">Short film / Reel / YouTube / Other</option>
                      <option value="Short Film Direction">Short Film Direction</option>
                      <option value="Brand / Commercial Campaign">Brand / Commercial Campaign</option>
                      <option value="Fashion & Editorial Modeling">Fashion & Editorial Modeling</option>
                      <option value="YouTube Video Production">YouTube Video Production</option>
                      <option value="Instagram Reel Series">Instagram Reel Series</option>
                      <option value="Creative Direction & Consulting">Creative Direction & Consulting</option>
                    </select>
                  </div>

                  <div class="form-group">
                    <label class="form-label">MESSAGE</label>
                    <textarea
                      rows="4"
                      placeholder="Tell me about your project, timeline and goals..."
                      required
                      value={message}
                      onInput={(e) => setMessage(e.target.value)}
                      class="contact-textarea"
                      disabled={status === 'sending'}
                    />
                  </div>

                  <button
                    type="submit"
                    class="btn-gold-fill form-submit-btn"
                    disabled={status === 'sending'}
                    onMouseEnter={() => setCursorState?.({ type: 'pointer' })}
                    onMouseLeave={() => setCursorState?.(null)}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <line x1="22" y1="2" x2="11" y2="13" />
                      <polygon points="22 2 15 22 11 13 2 9 22 2" />
                    </svg>
                    <span>{status === 'sending' ? 'SENDING...' : 'SEND MESSAGE'}</span>
                  </button>

                  <p class="form-note">No spam. Just good conversations.</p>
                </form>
              )}
            </div>
          </div>
        </section>

        {/* FAQs Accordion */}
        <section class="faq-section">
          <span class="section-tag">FAQS</span>
          <h2 class="faq-main-heading">Questions, Answered</h2>

          <div class="faq-accordion-list">
            {FAQS.map((faq, idx) => (
              <div key={idx} class={`faq-item ${openFaq === idx ? 'open' : ''}`}>
                <button class="faq-question-btn" onClick={() => toggleFaq(idx)}>
                  <span class="faq-question-text">{faq.question}</span>
                  <span class="faq-toggle-icon">{openFaq === idx ? '—' : '+'}</span>
                </button>
                {openFaq === idx && (
                  <div class="faq-answer-pane">
                    <p class="faq-answer-text">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
