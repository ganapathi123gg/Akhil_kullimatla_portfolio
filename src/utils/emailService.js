import emailjs from '@emailjs/browser'

/**
 * Validate email format
 * @param {string} email
 * @returns {boolean}
 */
export function isValidEmail(email) {
  if (!email || typeof email !== 'string') return false
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email.trim())
}

/**
 * Validate contact form fields
 * @param {Object} fields
 * @param {string} fields.name
 * @param {string} fields.email
 * @param {string} fields.message
 * @returns {{ isValid: boolean, error: string | null }}
 */
export function validateContactForm({ name, email, message }) {
  if (!name || !name.trim()) {
    return { isValid: false, error: 'Please enter your name.' }
  }
  if (name.trim().length < 2) {
    return { isValid: false, error: 'Name must be at least 2 characters long.' }
  }
  if (!email || !email.trim()) {
    return { isValid: false, error: 'Please enter your email address.' }
  }
  if (!isValidEmail(email)) {
    return { isValid: false, error: 'Please enter a valid email address.' }
  }
  if (!message || !message.trim()) {
    return { isValid: false, error: 'Please enter your message or project description.' }
  }
  if (message.trim().length < 5) {
    return { isValid: false, error: 'Message must be at least 5 characters long.' }
  }
  return { isValid: true, error: null }
}

/**
 * Send contact email using EmailJS
 * @param {Object} data
 * @param {string} data.name
 * @param {string} data.email
 * @param {string} data.purpose
 * @param {string} data.description
 * @returns {Promise<{ success: boolean, message: string }>}
 */
export async function sendContactEmail({ name, email, purpose, description }) {
  const serviceId = (import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_p4cgkwi')?.trim()
  const templateId = (import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'template_aiq99k3')?.trim()
  const publicKey = (import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'QcBCV3L0y5wmSgusL')?.trim()

  if (!serviceId || !templateId || !publicKey) {
    const missingVars = []
    if (!serviceId) missingVars.push('VITE_EMAILJS_SERVICE_ID')
    if (!templateId) missingVars.push('VITE_EMAILJS_TEMPLATE_ID')
    if (!publicKey) missingVars.push('VITE_EMAILJS_PUBLIC_KEY')
    console.error(`EmailJS configuration missing: ${missingVars.join(', ')}`)
    throw new Error('Email service is not configured yet. Please configure EmailJS environment variables.')
  }

  // Template parameters mapped to match requested template {{name}}, {{email}}, {{purpose}}, {{description}}
  // along with standard EmailJS template variable aliases.
  const templateParams = {
    name: name.trim(),
    email: email.trim(),
    purpose: purpose || 'General Inquiry',
    description: description.trim(),
    // Standard aliases for EmailJS templates
    from_name: name.trim(),
    from_email: email.trim(),
    reply_to: email.trim(),
    message: description.trim(),
    project_type: purpose || 'General Inquiry',
    // Primary recipient and CC reference
    to_email: 'kullimetlaugesh@gmail.com, guggarapuganapathi@gmail.com',
  }

  const response = await emailjs.send(serviceId, templateId, templateParams, publicKey)

  return {
    success: true,
    status: response.status,
    message: 'Your request has been sent successfully. Thank you for reaching out.',
  }
}
