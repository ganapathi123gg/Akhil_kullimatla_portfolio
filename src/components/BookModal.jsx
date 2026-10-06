import { useState, useEffect } from 'preact/hooks'
import { CREATOR } from '../data/creatorConfig'
import { sendContactEmail, validateContactForm } from '../utils/emailService'
import '../styles/BookModal.css'

export function BookModal({ isOpen, onClose }) {
  const [budget, setBudget] = useState('Under ₹10,000/-')
  const [customBudget, setCustomBudget] = useState('')
  const [status, setStatus] = useState('idle') // idle, sending, success, error
  const [errorMessage, setErrorMessage] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    details: '',
  })

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
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const budgets = [
    'Under ₹10,000/-',
    '₹20,000/-',
    '₹50,000/-',
    '₹1,00,000/-',
    'Above ₹1,00,000/-'
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()

    const validation = validateContactForm({
      name: formData.name,
      email: formData.email,
      message: formData.details,
    })

    if (!validation.isValid) {
      setStatus('error')
      setErrorMessage(validation.error)
      return
    }

    setStatus('sending')
    setErrorMessage('')

    const effectiveBudget = customBudget.trim() ? customBudget.trim() : (budget || 'Not Specified')

    try {
      await sendContactEmail({
        name: formData.name,
        email: formData.email,
        purpose: `Collaboration Booking (Budget: ${effectiveBudget})`,
        description: `Estimated Budget: ${effectiveBudget}\n\nProject Scope & Timeline Details:\n${formData.details}`,
      })

      setStatus('success')
      setFormData({
        name: '',
        email: '',
        details: '',
      })
      setCustomBudget('')
    } catch (err) {
      console.error('Failed to send booking inquiry:', err)
      setStatus('error')
      setErrorMessage(
        err?.text || err?.message || 'Something went wrong while sending your inquiry. Please try again.'
      )
    }
  }

  const handleReset = () => {
    setStatus('idle')
    setErrorMessage('')
    onClose()
  }

  return (
    <div
      class="book-modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Book a Project Consultation"
    >
      <div class="book-modal-container">
        {/* Top Back and Close Buttons */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            type="button"
            class="book-modal-back-btn"
            onClick={onClose}
            data-cursor="hover"
            aria-label="Back to main page"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
            <span>BACK</span>
          </button>

          <button
            type="button"
            class="modal-close-btn"
            onClick={onClose}
            aria-label="Close booking modal"
            data-cursor="hover"
            style={{ position: 'relative', top: '-10px', right: '0' }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div class="book-modal-header">
          <div class="section-tag">DIRECT INQUIRY</div>
          <h3 class="book-modal-title">Book a Collaboration with {CREATOR.name}</h3>
          <p class="about-p" style={{ fontSize: '13px', marginTop: '6px' }}>
            Directing, cinematography, commercial modeling, or high-impact YouTube production.
          </p>
        </div>

        {status === 'success' ? (
          <div>
            <div class="form-success-banner" role="alert" style={{ marginBottom: '20px' }}>
              <span>✓</span>
              <span>Your booking inquiry has been sent successfully! We will review your brief and reply within 24 hours.</span>
            </div>
            <button
              type="button"
              class="btn-gold-fill"
              style={{ width: '100%', marginTop: '10px' }}
              onClick={handleReset}
              data-cursor="hover"
            >
              <span>RETURN TO PORTFOLIO</span>
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {status === 'error' && (
              <div class="form-error-banner" role="alert" style={{ marginBottom: '20px' }}>
                <span>⚠</span>
                <span>{errorMessage}</span>
              </div>
            )}

            <div class="form-group">
              <label class="form-label">SELECT ESTIMATED BUDGET</label>
              <div class="book-budget-grid">
                {budgets.map((b) => (
                  <button
                    key={b}
                    type="button"
                    class={`budget-btn ${budget === b && !customBudget ? 'active' : ''}`}
                    onClick={() => {
                      setBudget(b)
                      setCustomBudget('')
                    }}
                    disabled={status === 'sending'}
                  >
                    {b}
                  </button>
                ))}
              </div>

              {/* User Custom Budget Input */}
              <div style={{ marginTop: '8px' }}>
                <label class="form-label" htmlFor="bm-custom-budget" style={{ fontSize: '9px', opacity: 0.85 }}>
                  OR ENTER YOUR CUSTOM BUDGET
                </label>
                <input
                  id="bm-custom-budget"
                  type="text"
                  class="form-input"
                  placeholder="e.g. ₹35,000/- or custom budget"
                  value={customBudget}
                  onInput={(e) => setCustomBudget(e.target.value)}
                  disabled={status === 'sending'}
                />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label" htmlFor="bm-name">YOUR NAME</label>
                <input
                  id="bm-name"
                  type="text"
                  required
                  class="form-input"
                  placeholder="e.g. Maya Patel"
                  value={formData.name}
                  onInput={(e) => setFormData({ ...formData, name: e.target.value })}
                  disabled={status === 'sending'}
                />
              </div>
              <div class="form-group">
                <label class="form-label" htmlFor="bm-email">EMAIL ADDRESS</label>
                <input
                  id="bm-email"
                  type="email"
                  required
                  class="form-input"
                  placeholder="name@company.com"
                  value={formData.email}
                  onInput={(e) => setFormData({ ...formData, email: e.target.value })}
                  disabled={status === 'sending'}
                />
              </div>
            </div>

            <div class="form-group">
              <label class="form-label" htmlFor="bm-details">PROJECT SCOPE & TIMELINE</label>
              <textarea
                id="bm-details"
                required
                class="form-textarea"
                style={{ minHeight: '90px' }}
                placeholder="Give us a brief overview of the project, shoot dates or delivery deadlines..."
                value={formData.details}
                onInput={(e) => setFormData({ ...formData, details: e.target.value })}
                disabled={status === 'sending'}
              />
            </div>

            <button
              type="submit"
              class="btn-gold-fill"
              style={{ width: '100%', marginTop: '10px' }}
              data-cursor="hover"
              disabled={status === 'sending'}
            >
              <span>{status === 'sending' ? '⏳' : '✈'}</span>
              <span>{status === 'sending' ? 'SENDING INQUIRY...' : 'CONFIRM BOOKING REQUEST'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
