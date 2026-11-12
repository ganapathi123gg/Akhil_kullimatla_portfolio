import { useState } from 'preact/hooks'
import { CREATOR } from '../data/creatorConfig'
import { AwardModernCard } from './AwardModernCard'
import '../styles/AwardsCards.css'

export function AwardsShowcase({ customAwards, onInspectTrophy }) {
  const allAwards = customAwards || CREATOR.awards || []
  const [activeFilter, setActiveFilter] = useState('all')

  // Filter categories
  const filteredAwards = allAwards.filter((award) => {
    if (activeFilter === 'all') return true
    return award.filterType === activeFilter
  })

  const trophyCount = allAwards.filter((a) => a.filterType === 'trophy').length
  const letterCount = allAwards.filter((a) => a.filterType === 'letter').length
  const recognitionCount = allAwards.filter((a) => a.filterType === 'recognition').length

  const handleCardInspect = (cardIdx) => {
    const targetAward = filteredAwards[cardIdx]
    if (onInspectTrophy) {
      onInspectTrophy(targetAward)
    }
  }

  return (
    <div class="awards-modern-container">
      {/* Category Filter Buttons */}
      <div class="awards-filter-bar" role="tablist" aria-label="Awards & Recognition Category Filters">
        <button
          type="button"
          role="tab"
          aria-selected={activeFilter === 'all'}
          class={`awards-filter-pill awards-filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
          onClick={() => setActiveFilter('all')}
          data-cursor="hover"
        >
          <span>All Recognitions</span>
          <span class="awards-filter-count">{allAwards.length}</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeFilter === 'trophy'}
          class={`awards-filter-pill awards-filter-btn ${activeFilter === 'trophy' ? 'active' : ''}`}
          onClick={() => setActiveFilter('trophy')}
          data-cursor="hover"
        >
          <span>🏆 Official Trophies</span>
          <span class="awards-filter-count">{trophyCount}</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeFilter === 'letter'}
          class={`awards-filter-pill awards-filter-btn ${activeFilter === 'letter' ? 'active' : ''}`}
          onClick={() => setActiveFilter('letter')}
          data-cursor="hover"
        >
          <span>📜 Selection Letters</span>
          <span class="awards-filter-count">{letterCount}</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeFilter === 'recognition'}
          class={`awards-filter-pill awards-filter-btn ${activeFilter === 'recognition' ? 'active' : ''}`}
          onClick={() => setActiveFilter('recognition')}
          data-cursor="hover"
        >
          <span>🌐 Digital & Press</span>
          <span class="awards-filter-count">{recognitionCount}</span>
        </button>
      </div>

      {/* 3D Modern Grid of Cards (Clicking inspect navigates to dedicated Trophy Details Page) */}
      <div class="awards-modern-grid">
        {filteredAwards.map((award, idx) => (
          <AwardModernCard
            key={award.id || idx}
            award={award}
            index={idx}
            onInspect={handleCardInspect}
          />
        ))}
      </div>
    </div>
  )
}
