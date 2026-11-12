/// <reference types="vite/client" />

interface Window {
  /** Safari < 14.1 */
  webkitAudioContext?: typeof AudioContext
}
