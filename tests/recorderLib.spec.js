import { describe, it, expect } from 'vitest'
import { RECORDING_FORMATS, availableRecordingFormats } from '@/lib/recordingFormats'
import { FILTER_DEFAULTS, filterLimits, filterTextKey } from '@/lib/filterConfig'
import de from '@/i18n/de'

describe('availableRecordingFormats', () => {
  const values = (list) => list.map((f) => f.value)

  it('stellt bei mehreren unterstützten Formaten „auto“ voran', () => {
    expect(values(availableRecordingFormats(() => true))).toEqual([
      'auto',
      'webm-opus',
      'ogg-opus',
      'wav',
    ])
  })

  it('bietet bei genau einem Format nur dieses an', () => {
    const only = (mime) => mime === 'audio/ogg;codecs=opus'
    expect(values(availableRecordingFormats(only))).toEqual(['ogg-opus'])
  })

  it('fällt ohne Unterstützung auf „auto“ zurück (auch ohne MediaRecorder)', () => {
    expect(values(availableRecordingFormats(() => false))).toEqual(['auto'])
    expect(values(availableRecordingFormats())).toEqual(['auto'])
  })

  it('hat für jedes Format einen Text', () => {
    for (const f of [...RECORDING_FORMATS, { labelKey: 'rec_format_auto' }]) {
      expect(de[f.labelKey], f.labelKey).toBeTruthy()
    }
  })
})

describe('filterConfig', () => {
  it('liefert die Grenzen je Typ und Tiefpass als Rückfall', () => {
    expect(filterLimits('notch')).toBe(FILTER_DEFAULTS.notch)
    expect(filterLimits('none')).toBe(FILTER_DEFAULTS.lowpass)
  })

  it('hält die Startwerte innerhalb der Grenzen', () => {
    for (const [type, d] of Object.entries(FILTER_DEFAULTS)) {
      expect(d.frequency, type).toBeGreaterThanOrEqual(d.freqMin)
      expect(d.frequency, type).toBeLessThanOrEqual(d.freqMax)
      expect(d.Q, type).toBeGreaterThanOrEqual(d.qMin)
      expect(d.Q, type).toBeLessThanOrEqual(d.qMax)
    }
  })

  it('wählt Text-Schlüssel je Typ mit Rückfall', () => {
    expect(filterTextKey('frequencyLabel', 'bandpass')).toBe('filter_freq_center')
    expect(filterTextKey('qLabel', 'notch')).toBe('filter_q_width')
    expect(filterTextKey('frequencyLabel', 'none')).toBe('filter_frequency')
    expect(filterTextKey('qHelp', 'fallback')).toBe('filter_q_help')
  })

  it('verweist nur auf vorhandene Texte für die echten Filtertypen', () => {
    for (const text of ['frequencyLabel', 'frequencyHelp', 'qLabel', 'qHelp']) {
      for (const type of Object.keys(FILTER_DEFAULTS)) {
        expect(de[filterTextKey(text, type)], `${text}/${type}`).toBeTruthy()
      }
    }
  })
})
