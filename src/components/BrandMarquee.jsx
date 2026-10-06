import '../styles/BrandMarquee.css'

export function RoleMarquee({ roles }) {
  const list = roles || [
    'DIRECTOR',
    'YOUTUBER',
    'MODEL',
    'EDITOR',
    'STORYTELLER',
    'CINEMATOGRAPHER',
  ]

  return (
    <section class="marquee-section" aria-label="Creator Roles">
      <div class="marquee-label-wrap">
        <span class="marquee-subhead">MORE THAN A CREATOR</span>
      </div>
      <div class="marquee-track scroll-left">
        <div class="marquee-group">
          {list.map((role, idx) => (
            <span class="role-item" key={`g1-${idx}`}>
              <span>{role}</span>
              <span class="role-cube" />
            </span>
          ))}
        </div>
        <div class="marquee-group" aria-hidden="true">
          {list.map((role, idx) => (
            <span class="role-item" key={`g2-${idx}`}>
              <span>{role}</span>
              <span class="role-cube" />
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}

export function BrandMarquee({ brands }) {
  const brandList = brands || ['LUMEN', 'NOIR', 'VANTA', 'ARCLIGHT', 'MERIDIAN', 'STUDIO 9', 'SONY', 'CANON', 'ZARA']

  return (
    <section class="marquee-section" aria-label="Brand Partnerships">
      <div class="marquee-label-wrap">
        <span class="marquee-subhead">TRUSTED BY CREATORS & BRANDS</span>
      </div>
      <div class="marquee-track scroll-left">
        <div class="marquee-group">
          {brandList.map((brand, idx) => (
            <span class="brand-item" key={`b1-${idx}`}>
              {brand}
            </span>
          ))}
        </div>
        <div class="marquee-group" aria-hidden="true">
          {brandList.map((brand, idx) => (
            <span class="brand-item" key={`b2-${idx}`}>
              {brand}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
