// Utility functions for parsing and embedding YouTube and Instagram media safely

/**
 * Extracts a YouTube Video ID from any standard YouTube URL
 * Handles watch?v=, youtu.be/, embed/, shorts/
 */
export function getYoutubeId(url) {
  if (!url) return null
  const regExp = /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/
  const match = url.match(regExp)
  return match && match[1] ? match[1] : null
}

/**
 * Generates an official YouTube embed player URL
 * - Uses youtube-nocookie for privacy & performance
 * - Enables JS API for state tracking
 * - autoplay=1 for intentional user clicks
 */
export function getYoutubeEmbedUrl(url, autoplay = true) {
  const videoId = getYoutubeId(url)
  if (!videoId) return null
  const autoPlayParam = autoplay ? '1' : '0'
  return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=${autoPlayParam}&enablejsapi=1&rel=0&modestbranding=1&playsinline=1`
}

/**
 * Extracts Instagram Reel/Post ID from standard Instagram URLs
 * Handles /reel/ID/ and /p/ID/
 */
export function getInstagramId(url) {
  if (!url) return null
  const match = url.match(/instagram\.com\/(?:reel|p)\/([A-Za-z0-9_-]+)/)
  return match && match[1] ? match[1] : null
}

/**
 * Generates an official Instagram embed iframe URL
 */
export function getInstagramEmbedUrl(url) {
  const reelId = getInstagramId(url)
  if (!reelId) return null
  return `https://www.instagram.com/reel/${reelId}/embed/`
}
