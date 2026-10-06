import '../styles/QuoteBanner.css'

export function QuoteBanner({ tag, quote, author, bgImage, variant = '' }) {
  return (
    <section class={`quote-banner-section ${variant}`} aria-label={tag || "Signature Quote"}>
      <div class="quote-banner-bg">
        <img
          src={bgImage}
          alt={tag ? `${tag} Background` : "Cinematic background atmosphere"}
          class="quote-banner-img"
          loading="eager"
        />
        <div class="quote-banner-overlay" />
      </div>

      <div class="quote-banner-content">
        {tag && <span class="quote-subtag">{tag}</span>}
        <h2 class="quote-statement">{quote}</h2>
        {author && <p class="quote-author">{author}</p>}
      </div>
    </section>
  )
}
