/**
 * Formats milliseconds as "MM:SS".
 * @param {number} ms
 * @returns {string}
 */
export function formatTime(ms) {
  const minutes = Math.floor(ms / 60000)
  const seconds = Math.floor((ms % 60000) / 1000)
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}
