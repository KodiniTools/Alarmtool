/**
 * Creates a synthetic reverb impulse response buffer.
 * Shared between the main audio context and the preset preview.
 *
 * @param {AudioContext} audioCtx - The audio context to create the buffer for
 * @param {number} [duration=3] - Impulse duration in seconds
 * @returns {AudioBuffer|null} The impulse response buffer, or null on failure
 */
export function createReverbImpulse(audioCtx, duration = 3) {
  if (!audioCtx) return null

  const rate = audioCtx.sampleRate
  const length = rate * duration
  const impulse = audioCtx.createBuffer(2, length, rate)

  for (let ch = 0; ch < 2; ch++) {
    const data = impulse.getChannelData(ch)
    for (let i = 0; i < length; i++) {
      const t = i / rate
      // Exponential decay for natural room feel
      const decay = Math.exp(-2.5 * t)
      // Early reflections in first 80ms add spatial depth
      const early = t < 0.08 ? 0.4 * Math.exp(-30 * t) : 0
      data[i] = (Math.random() * 2 - 1) * (decay + early)
    }
  }

  return impulse
}
