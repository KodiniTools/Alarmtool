// Singleton module — only one preview context exists at a time.
// Manages the AudioContext and effect chain for preset previews.
import { createReverbImpulse } from './useReverbImpulse'

let audioCtx = null
let masterGain = null
let filterNode = null
let delayNode = null
let feedbackGain = null
let convolverNode = null
let reverbGain = null

function _safeDisconnect(node) {
  if (node)
    try {
      node.disconnect()
    } catch {
      /* ignore */
    }
}

export function initCtx(volume) {
  if (audioCtx && audioCtx.state !== 'closed') return
  const AC = window.AudioContext || window.webkitAudioContext
  audioCtx = new AC()
  masterGain = audioCtx.createGain()
  masterGain.gain.value = volume

  delayNode = audioCtx.createDelay()
  delayNode.delayTime.value = 0.3
  feedbackGain = audioCtx.createGain()
  feedbackGain.gain.value = 0.5
  delayNode.connect(feedbackGain).connect(delayNode)

  convolverNode = audioCtx.createConvolver()
  const impulse = createReverbImpulse(audioCtx)
  if (impulse) convolverNode.buffer = impulse

  reverbGain = audioCtx.createGain()
  reverbGain.gain.value = 0.5
  delayNode.connect(convolverNode)
  convolverNode.connect(reverbGain)
  delayNode.connect(reverbGain)
  reverbGain.connect(audioCtx.destination)
}

export function applyFilter(filterCfg) {
  if (!audioCtx) return
  filterNode = audioCtx.createBiquadFilter()
  filterNode.type = filterCfg.type === 'none' ? 'allpass' : filterCfg.type
  filterNode.frequency.setValueAtTime(filterCfg.frequency, audioCtx.currentTime)
  filterNode.Q.setValueAtTime(filterCfg.Q, audioCtx.currentTime)
  filterNode.connect(masterGain)
  masterGain.connect(delayNode)
}

export function detachFilter() {
  _safeDisconnect(filterNode)
  filterNode = null
}

export function destroyCtx() {
  for (const node of [masterGain, delayNode, feedbackGain, convolverNode, reverbGain]) {
    _safeDisconnect(node)
  }
  delayNode = feedbackGain = convolverNode = reverbGain = null

  if (audioCtx && audioCtx.state !== 'closed') {
    const ctx = audioCtx
    audioCtx = null
    masterGain = null
    try {
      ctx.close()
    } catch {
      /* ignore */
    }
  }
}

export function getCtx() {
  return audioCtx
}
export function getMasterGain() {
  return masterGain
}
export function getFilterNode() {
  return filterNode
}
