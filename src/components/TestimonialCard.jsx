import '../styles/TestimonialCard.css'

export function TestimonialCard({ testimonial }) {
  const { quote, author, role, avatar, instagram, handle } = testimonial

  return (
    <div class="modern-testi-card" data-cursor="hover">
      {/* Top Header: Rating Stars & Modern Quote Crest */}
      <div class="modern-testi-top">
        <div class="modern-testi-rating" aria-label="5 out of 5 stars">
          <span>★</span>
          <span>★</span>
          <span>★</span>
          <span>★</span>
          <span>★</span>
          <span class="modern-testi-stars-count">5.0</span>
        </div>

        <svg
          class="modern-testi-quote-icon"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
        </svg>
      </div>

      {/* Quote Body with Refined Font & Typography */}
      <div class="modern-testi-quote-wrap">
        <p class="modern-testi-quote">"{quote}"</p>
      </div>

      {/* Footer: Circle Profile Picture, Name, Role & Instagram Link */}
      <div class="modern-testi-footer">
        <div class="modern-testi-profile-row">
          <div class="modern-testi-author-info">
            {/* Circle Profile Picture with Radiant Gold Ring */}
            <div class="modern-testi-avatar-wrap">
              <img
                src={avatar}
                alt={`${author} profile`}
                class="modern-testi-avatar-img"
                loading="lazy"
              />
            </div>

            {/* Author Name & Role */}
            <div class="modern-testi-meta">
              <h4 class="modern-testi-name">{author}</h4>
              <span class="modern-testi-role-badge">{role}</span>
            </div>
          </div>

          {/* Direct Instagram Social Media Link */}
          {instagram && (
            <a
              href={instagram}
              target="_blank"
              rel="noopener noreferrer"
              class="modern-testi-instagram-btn"
              aria-label={`Visit ${author}'s Instagram`}
            >
              {/* Instagram Glyph */}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
              <span>{handle || 'Instagram'}</span>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <line x1="7" y1="17" x2="17" y2="7" />
                <polyline points="7 7 17 7 17 17" />
              </svg>
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
