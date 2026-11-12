/**
 * Aufnahmeformate des MediaRecorders und die Auswahl, die die Oberfläche anbietet.
 */

/** Alle Formate, die das Tool kennt, mit MIME-Typ für MediaRecorder.isTypeSupported. */
export const RECORDING_FORMATS = Object.freeze([
  { value: 'webm-opus', labelKey: 'rec_format_webm', mimeType: 'audio/webm;codecs=opus' },
  { value: 'ogg-opus', labelKey: 'rec_format_ogg', mimeType: 'audio/ogg;codecs=opus' },
  { value: 'wav', labelKey: 'rec_format_wav', mimeType: 'audio/wav' },
])

const AUTO = Object.freeze({ value: 'auto', labelKey: 'rec_format_auto' })

/** Prüft per MediaRecorder, ob der Browser einen MIME-Typ aufnehmen kann. */
export function browserSupports(mimeType) {
  return typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported(mimeType)
}

/**
 * Formate für die Auswahlliste: bei mehreren unterstützten Formaten zuerst „Automatisch“,
 * bei genau einem nur dieses, bei keinem nur „Automatisch“.
 * @param {(mimeType: string) => boolean} [isSupported]
 */
export function availableRecordingFormats(isSupported = browserSupports) {
  const supported = RECORDING_FORMATS.filter((fmt) => isSupported(fmt.mimeType))
  if (supported.length > 1) return [AUTO, ...supported]
  return supported.length > 0 ? supported : [AUTO]
}
