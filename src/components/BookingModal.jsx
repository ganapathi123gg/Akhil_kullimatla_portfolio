import { useState, useEffect } from 'preact/hooks'
import { CREATOR } from '../data/creatorConfig'

export function BookingModal({ isOpen, onClose }) {
  const [projectType, setProjectType] = useState('Commercial / Brand Film')
  const [budget, setBudget] = useState('Medium ($2,000 - $5,000)')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [timeline, setTimeline] = useState('Within 1 month')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState('idle') // idle, sending, success

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'auto'
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const projectTypes = [
    'Commercial / Brand Film',
    'Fashion & Editorial Modeling',
    'YouTube Production',
    'Instagram Reels Series',
    'Short Film Direction',
    'Creative Direction',
  ]

  const budgetTiers = [
    'Standard ($1,000 - $2,500)',
    'Medium ($2,500 - $5,000)',
    'Premium ($5,000 - $15,000)',
    'Enterprise / Large Scale ($15,000+)',
  ]

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name || !email) return
    setStatus('sending')
    setTimeout(() => {
      setStatus('success')
    }, 1200)
  }

  const resetForm = () => {
    setName('')
    setEmail('')
    setMessage('')
    setStatus('idle')
    onClose()
  }

  return (
    <div class="booking-modal-backdrop" onClick={onClose}>
      <div class="booking-modal-sheet" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button class="booking-close-btn" onClick={onClose} aria-label="Close Booking Window">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {status === 'success' ? (
          <div class="booking-success-view">
            <div class="success-gold-icon">✓</div>
            <h3 class="success-title">Project Inquiry Received</h3>
            <p class="success-desc">
              Thank you, <strong>{name}</strong>. Your project proposal for <strong>{projectType}</strong> has been logged. Akhil or his management team will review your creative brief and reach out within 24 hours.
            </p>
            <div class="success-summary-box">
              <div><span>Client:</span> <strong>{email}</strong></div>
              <div><span>Tier:</span> <strong>{budget}</strong></div>
              <div><span>Target:</span> <strong>{timeline}</strong></div>
            </div>
            <button class="btn-gold-fill" onClick={resetForm}>
              DONE
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} class="booking-form-content">
            <div class="booking-header">
              <span class="section-tag">RESERVATIONS & BOOKINGS</span>
              <h2 class="booking-title">Collaborate With {CREATOR.name}</h2>
              <p class="booking-subtitle">
                Reserve dates for directing, editorial modeling, or high-impact video campaigns.
              </p>
            </div>

            {/* Service / Project Type Selector */}
            <div class="booking-field-group">
              <label class="booking-field-label">SELECT COLLABORATION TYPE</label>
              <div class="booking-pills-grid">
                {projectTypes.map((type) => (
                  <button
                    type="button"
                    key={type}
                    class={`booking-pill ${projectType === type ? 'selected' : ''}`}
                    onClick={() => setProjectType(type)}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Budget Tier */}
            <div class="booking-field-group">
              <label class="booking-field-label">ESTIMATED PRODUCTION BUDGET</label>
              <select
                class="booking-select"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
              >
                {budgetTiers.map((tier) => (
                  <option key={tier} value={tier}>{tier}</option>
                ))}
              </select>
            </div>

            {/* Name & Email inputs */}
            <div class="booking-two-col">
              <div class="booking-input-wrap">
                <label class="booking-field-label">YOUR NAME *</label>
                <input
                  type="text"
                  placeholder="e.g. Sarah Jenkins"
                  required
                  value={name}
                  onInput={(e) => setName(e.target.value)}
                  class="booking-input"
                />
              </div>

              <div class="booking-input-wrap">
                <label class="booking-field-label">EMAIL ADDRESS *</label>
                <input
                  type="email"
                  placeholder="e.g. sarah@brand.com"
                  required
                  value={email}
                  onInput={(e) => setEmail(e.target.value)}
                  class="booking-input"
                />
              </div>
            </div>

            {/* Target Timeline */}
            <div class="booking-field-group">
              <label class="booking-field-label">TARGET TIMELINE</label>
              <div class="timeline-radios">
                {['Immediate (1-2 weeks)', 'Within 1 month', '2-3 months', 'Flexible'].map((time) => (
                  <label key={time} class="timeline-radio-item">
                    <input
                      type="radio"
                      name="timeline"
                      value={time}
                      checked={timeline === time}
                      onChange={() => setTimeline(time)}
                    />
                    <span>{time}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Project Notes */}
            <div class="booking-field-group">
              <label class="booking-field-label">BRIEF OR VISION DETAILS</label>
              <textarea
                rows="3"
                placeholder="Share links, moodboard ideas, location details or deliverables..."
                value={message}
                onInput={(e) => setMessage(e.target.value)}
                class="booking-textarea"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              class="btn-gold-fill booking-submit-btn"
              disabled={status === 'sending'}
            >
              {status === 'sending' ? (
                <span>SENDING INQUIRY...</span>
              ) : (
                <>
                  <span>CONFIRM & SEND INQUIRY</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
