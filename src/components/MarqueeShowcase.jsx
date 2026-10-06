import { LOOKBOOK_MARQUEE } from '../data/creatorConfig'

export function MarqueeShowcase({ onSelectImage, setCursorState }) {
  // Duplicate arrays for continuous infinite marquee loops
  const rowOne = [...LOOKBOOK_MARQUEE, ...LOOKBOOK_MARQUEE]
  const rowTwo = [...LOOKBOOK_MARQUEE.slice().reverse(), ...LOOKBOOK_MARQUEE.slice().reverse()]

  return (
    <section class="marquee-section">
      <div class="marquee-header-wrap container">
        <span class="section-tag">EDITORIAL & PRODUCTION ARCHIVE</span>
        <h3 class="marquee-heading">Visuals That Define The Brand</h3>
      </div>

      <div class="marquee-wrapper">
        {/* Row 1: Scrolling Left */}
        <div class="marquee-row-track track-left">
          {rowOne.map((item, idx) => (
            <div
              key={`r1-${item.id}-${idx}`}
              class="showcase-card"
              onClick={() => onSelectImage(item, idx % LOOKBOOK_MARQUEE.length)}
              onMouseEnter={() => setCursorState?.({ type: 'view' })}
              onMouseLeave={() => setCursorState?.(null)}
            >
              <img src={item.img} alt={item.title} loading="lazy" />
              <div class="showcase-card-overlay">
                <span class="showcase-tag">{item.tag}</span>
                <h4 class="showcase-title">{item.title}</h4>
              </div>
            </div>
          ))}
        </div>

        {/* Row 2: Scrolling Right */}
        <div class="marquee-row-track track-right">
          {rowTwo.map((item, idx) => (
            <div
              key={`r2-${item.id}-${idx}`}
              class="showcase-card"
              onClick={() => onSelectImage(item, idx % LOOKBOOK_MARQUEE.length)}
              onMouseEnter={() => setCursorState?.({ type: 'view' })}
              onMouseLeave={() => setCursorState?.(null)}
            >
              <img src={item.img} alt={item.title} loading="lazy" />
              <div class="showcase-card-overlay">
                <span class="showcase-tag">{item.tag}</span>
                <h4 class="showcase-title">{item.title}</h4>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
