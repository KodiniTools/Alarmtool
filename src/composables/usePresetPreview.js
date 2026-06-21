import { ref, onUnmounted } from 'vue'
import {
  initCtx,
  applyFilter,
  detachFilter,
  destroyCtx,
  getCtx,
  getMasterGain,
  getFilterNode,
} from './previewAudioGraph'

const DEFAULT_PATTERN = [1500, 300]

const _activePresetId = ref(null)
const _isPlaying = ref(false)
const _isPaused = ref(false)
const _volume = ref(0.6)

// Active oscillator node records shared across all component instances
let _oscNodes = []
let _patternTimeouts = []

function _parsePattern(str) {
  try {
    const nums = str
      .split(',')
      .map((x) => parseFloat(x.trim()))
      .filter((n) => !isNaN(n) && n > 0)
    return nums.length >= 2 && nums.length % 2 === 0 ? nums : DEFAULT_PATTERN
  } catch {
    return DEFAULT_PATTERN
  }
}

function _setTone(entry, on) {
  const ctx = getCtx()
  if (!ctx || !entry.gain) return
  const now = ctx.currentTime
  const g = entry.gain.gain
  g.cancelScheduledValues(now)
  if (on) {
    const attackSec = (entry.cfg.attack || 20) / 1000
    const decaySec = (entry.cfg.decay ?? 50) / 1000
    const peak = entry.cfg.volume
    g.setValueAtTime(g.value, now)
    g.linearRampToValueAtTime(peak, now + attackSec)
    g.linearRampToValueAtTime((entry.cfg.sustain ?? 0.8) * peak, now + attackSec + decaySec)
  } else {
    const relSec = (entry.cfg.release || 80) / 1000
    g.setValueAtTime(g.value, now)
    g.linearRampToValueAtTime(0, now + relSec)
  }
}

function _runPattern(entry) {
  if (!_isPlaying.value || _isPaused.value || !entry.steps?.length) return
  const toneOn = !entry.toneIsOn
  _setTone(entry, toneOn)
  entry.toneIsOn = toneOn
  const dur = entry.steps[entry.stepIdx]
  entry.stepIdx = (entry.stepIdx + 1) % entry.steps.length
  const tid = setTimeout(() => _runPattern(entry), dur)
  _patternTimeouts.push(tid)
  entry.timeoutId = tid
}

function _clearPatternTimeouts() {
  _patternTimeouts.forEach(clearTimeout)
  _patternTimeouts = []
}

export function usePresetPreview() {
  function playPreset(preset) {
    if (_activePresetId.value === preset.id && _isPaused.value) {
      resumePreview()
      return
    }

    stopPreview()
    initCtx(_volume.value)

    const ctx = getCtx()
    if (ctx.state === 'suspended') ctx.resume()
    getMasterGain().gain.setValueAtTime(_volume.value, ctx.currentTime)

    const data = preset.data
    applyFilter(data.globalFilter || { type: 'none', frequency: 1000, Q: 1 })

    const filterNode = getFilterNode()
    const defaultPattern = '1500,300'

    data.oscillators.forEach((oscCfg) => {
      if (oscCfg.frequency === 440 && oscCfg.volume === 0.5 && oscCfg.pattern === defaultPattern)
        return
      try {
        const osc = ctx.createOscillator()
        const gainNode = ctx.createGain()
        const panNode = ctx.createStereoPanner()
        osc.type = oscCfg.waveType
        osc.frequency.setValueAtTime(oscCfg.frequency, ctx.currentTime)
        panNode.pan.setValueAtTime(oscCfg.pan, ctx.currentTime)
        gainNode.gain.setValueAtTime(0, ctx.currentTime)
        osc.connect(gainNode).connect(panNode).connect(filterNode)
        osc.start()
        _oscNodes.push({
          osc,
          gain: gainNode,
          pan: panNode,
          cfg: oscCfg,
          steps: _parsePattern(oscCfg.pattern),
          stepIdx: 0,
          toneIsOn: false,
          timeoutId: null,
        })
      } catch {
        /* ignore — oscillator creation failed */
      }
    })

    _activePresetId.value = preset.id
    _isPlaying.value = true
    _isPaused.value = false
    _oscNodes.forEach((entry) => _runPattern(entry))
  }

  function pausePreview() {
    if (!_isPlaying.value || _isPaused.value) return
    _isPaused.value = true
    const ctx = getCtx()
    const master = getMasterGain()
    if (master && ctx) master.gain.setValueAtTime(0, ctx.currentTime)
    _clearPatternTimeouts()
  }

  function resumePreview() {
    if (!_isPlaying.value || !_isPaused.value) return
    _isPaused.value = false
    const ctx = getCtx()
    const master = getMasterGain()
    if (master && ctx) master.gain.setValueAtTime(_volume.value, ctx.currentTime)
    _oscNodes.forEach((entry) => _runPattern(entry))
  }

  function stopPreview() {
    _clearPatternTimeouts()

    const ctx = getCtx()
    _oscNodes.forEach((entry) => {
      try {
        if (entry.gain && ctx) {
          const now = ctx.currentTime
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
          } catch {
            /* ignore */
          }
        }, 80)
      } catch {
        /* ignore */
      }
    })
    _oscNodes = []

    detachFilter()
    _activePresetId.value = null
    _isPlaying.value = false
    _isPaused.value = false
  }

  function setPreviewVolume(val) {
    _volume.value = val
    const ctx = getCtx()
    const master = getMasterGain()
    if (master && ctx && _isPlaying.value && !_isPaused.value) {
      master.gain.setValueAtTime(val, ctx.currentTime)
    }
  }

  onUnmounted(() => {
    destroyCtx()
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
    setPreviewVolume,
  }
}
