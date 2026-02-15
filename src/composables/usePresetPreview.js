import { ref, onUnmounted } from 'vue'
import { createReverbImpulse } from './useReverbImpulse'

/**
 * Self-contained preset preview player.
 * Uses its own AudioContext so it never interferes with the main alarm player.
 * Only one preset can play at a time – starting a new one stops the previous.
 */

// Shared across all component instances so only one preview plays at a time
let _audioCtx = null
let _masterGain = null
let _filterNode = null
let _delayNode = null
let _feedbackGain = null
let _convolverNode = null
let _reverbGain = null
let _oscNodes = []        // { osc, gain, pan }
let _patternTimeouts = [] // setTimeout IDs
let _activePresetId = ref(null)
let _isPlaying = ref(false)
let _isPaused = ref(false)
let _volume = ref(0.6)

export function usePresetPreview() {

  // ── helpers ───────────────────────────────────────────────────────────

  function _initCtx() {
    if (_audioCtx && _audioCtx.state !== 'closed') return
    const AC = window.AudioContext || window.webkitAudioContext
    _audioCtx = new AC()
    _masterGain = _audioCtx.createGain()
    _masterGain.gain.value = _volume.value

    // Delay with feedback (matches main player)
    _delayNode = _audioCtx.createDelay()
    _delayNode.delayTime.value = 0.3
    _feedbackGain = _audioCtx.createGain()
    _feedbackGain.gain.value = 0.5
    _delayNode.connect(_feedbackGain).connect(_delayNode)

    // Reverb via ConvolverNode (matches main player)
    _convolverNode = _audioCtx.createConvolver()
    _createReverbImpulse()
    _reverbGain = _audioCtx.createGain()
    _reverbGain.gain.value = 0.5
    _delayNode.connect(_convolverNode)
    _convolverNode.connect(_reverbGain)

    // Chain: MasterGain → Filter(placeholder) → Delay → ReverbGain → Destination
    // Filter is inserted per-preset in _applyFilter, so connect delay→reverb→dest here
    _delayNode.connect(_reverbGain)
    _reverbGain.connect(_audioCtx.destination)
  }

  function _createReverbImpulse() {
    if (!_audioCtx || !_convolverNode) return
    const impulse = createReverbImpulse(_audioCtx)
    if (impulse) {
      _convolverNode.buffer = impulse
    }
  }

  function _applyFilter(filterCfg) {
    if (!_audioCtx) return
    _filterNode = _audioCtx.createBiquadFilter()
    const type = filterCfg.type === 'none' ? 'allpass' : filterCfg.type
    _filterNode.type = type
    _filterNode.frequency.setValueAtTime(filterCfg.frequency, _audioCtx.currentTime)
    _filterNode.Q.setValueAtTime(filterCfg.Q, _audioCtx.currentTime)
    // Chain: Oscillators → Filter → MasterGain → Delay → ReverbGain → Destination
    _filterNode.connect(_masterGain)
    _masterGain.connect(_delayNode)
  }

  function _parsePattern(patternStr) {
    try {
      const nums = patternStr.split(',').map(x => parseFloat(x.trim())).filter(n => !isNaN(n) && n > 0)
      return nums.length >= 2 && nums.length % 2 === 0 ? nums : [1500, 300]
    } catch {
      return [1500, 300]
    }
  }

  function _setTone(entry, on) {
    if (!_audioCtx || !entry.gain) return
    const now = _audioCtx.currentTime
    const g = entry.gain.gain
    g.cancelScheduledValues(now)
    if (on) {
      const attackSec = (entry.cfg.attack || 20) / 1000
      const decaySec = (entry.cfg.decay ?? 50) / 1000
      const sustainLevel = entry.cfg.sustain ?? 0.8
      const peak = entry.cfg.volume
      g.setValueAtTime(g.value, now)
      g.linearRampToValueAtTime(peak, now + attackSec)
      g.linearRampToValueAtTime(sustainLevel * peak, now + attackSec + decaySec)
    } else {
      const relSec = (entry.cfg.release || 80) / 1000
      g.setValueAtTime(g.value, now)
      g.linearRampToValueAtTime(0, now + relSec)
    }
  }

  function _runPattern(entry) {
    if (!_isPlaying.value || _isPaused.value) return
    const steps = entry.steps
    if (!steps || !steps.length) return

    const toneOn = !entry.toneIsOn
    _setTone(entry, toneOn)
    entry.toneIsOn = toneOn

    const dur = steps[entry.stepIdx]
    entry.stepIdx = (entry.stepIdx + 1) % steps.length

    const tid = setTimeout(() => _runPattern(entry), dur)
    _patternTimeouts.push(tid)
    entry.timeoutId = tid
  }

  // ── public API ────────────────────────────────────────────────────────

  function playPreset(preset) {
    // If same preset is paused, resume instead
    if (_activePresetId.value === preset.id && _isPaused.value) {
      resumePreview()
      return
    }

    // Stop any currently playing preview
    stopPreview()

    _initCtx()
    if (_audioCtx.state === 'suspended') _audioCtx.resume()

    _masterGain.gain.setValueAtTime(_volume.value, _audioCtx.currentTime)

    const data = preset.data

    // Filter
    _applyFilter(data.globalFilter || { type: 'none', frequency: 1000, Q: 1 })

    // Create oscillators for non-default entries only
    const defaultPattern = '1500,300'
    data.oscillators.forEach((oscCfg) => {
      // Skip default/placeholder oscillators (volume 0.5 + freq 440 + default pattern)
      if (oscCfg.frequency === 440 && oscCfg.volume === 0.5 && oscCfg.pattern === defaultPattern) {
        return
      }

      try {
        const osc = _audioCtx.createOscillator()
        const gainNode = _audioCtx.createGain()
        const panNode = _audioCtx.createStereoPanner()

        osc.type = oscCfg.waveType
        osc.frequency.setValueAtTime(oscCfg.frequency, _audioCtx.currentTime)
        panNode.pan.setValueAtTime(oscCfg.pan, _audioCtx.currentTime)
        gainNode.gain.setValueAtTime(0, _audioCtx.currentTime)

        osc.connect(gainNode).connect(panNode).connect(_filterNode)
        osc.start()

        const entry = {
          osc,
          gain: gainNode,
          pan: panNode,
          cfg: oscCfg,
          steps: _parsePattern(oscCfg.pattern),
          stepIdx: 0,
          toneIsOn: false,
          timeoutId: null
        }

        _oscNodes.push(entry)
      } catch (e) {
        // Oscillator creation failed — skip this one
      }
    })

    _activePresetId.value = preset.id
    _isPlaying.value = true
    _isPaused.value = false

    // Start patterns
    _oscNodes.forEach(entry => _runPattern(entry))
  }

  function pausePreview() {
    if (!_isPlaying.value || _isPaused.value) return
    _isPaused.value = true

    // Silence gain
    if (_masterGain && _audioCtx) {
      _masterGain.gain.setValueAtTime(0, _audioCtx.currentTime)
    }

    // Clear pattern timeouts
    _patternTimeouts.forEach(tid => clearTimeout(tid))
    _patternTimeouts = []
  }

  function resumePreview() {
    if (!_isPlaying.value || !_isPaused.value) return
    _isPaused.value = false

    if (_masterGain && _audioCtx) {
      _masterGain.gain.setValueAtTime(_volume.value, _audioCtx.currentTime)
    }

    // Re-start patterns
    _oscNodes.forEach(entry => _runPattern(entry))
  }

  function stopPreview() {
    // Clear all pattern timeouts
    _patternTimeouts.forEach(tid => clearTimeout(tid))
    _patternTimeouts = []

    // Stop & disconnect oscillators
    _oscNodes.forEach(entry => {
      try {
        if (entry.gain && _audioCtx) {
          const now = _audioCtx.currentTime
          entry.gain.gain.cancelScheduledValues(now)
          entry.gain.gain.setValueAtTime(entry.gain.gain.value, now)
          entry.gain.gain.linearRampToValueAtTime(0, now + 0.05)
        }
        setTimeout(() => {
          try {
            entry.osc.stop()
            entry.osc.disconnect()
            entry.gain.disconnect()
            entry.pan.disconnect()
          } catch {}
        }, 80)
      } catch {}
    })
    _oscNodes = []

    // Disconnect effect chain nodes
    for (const node of [_filterNode, _masterGain, _delayNode, _feedbackGain, _convolverNode, _reverbGain]) {
      if (node) { try { node.disconnect() } catch {} }
    }
    _filterNode = null
    _delayNode = null
    _feedbackGain = null
    _convolverNode = null
    _reverbGain = null

    // Close audio context
    if (_audioCtx && _audioCtx.state !== 'closed') {
      const ctx = _audioCtx
      _audioCtx = null
      _masterGain = null
      setTimeout(() => {
        try { ctx.close() } catch {}
      }, 200)
    }

    _activePresetId.value = null
    _isPlaying.value = false
    _isPaused.value = false
  }

  function setPreviewVolume(val) {
    _volume.value = val
    if (_masterGain && _audioCtx && _isPlaying.value && !_isPaused.value) {
      _masterGain.gain.setValueAtTime(val, _audioCtx.currentTime)
    }
  }

  // Clean up when the component using this composable is destroyed
  onUnmounted(() => {
    stopPreview()
  })

  return {
    activePresetId: _activePresetId,
    isPlaying: _isPlaying,
    isPaused: _isPaused,
    previewVolume: _volume,
    playPreset,
    pausePreview,
    resumePreview,
    stopPreview,
    setPreviewVolume
  }
}
