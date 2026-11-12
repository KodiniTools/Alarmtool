/**
 * Aufnahmeformate des MediaRecorders und die Auswahl, die die Oberfläche anbietet.
 */

export interface RecordingFormatOption {
  /** Wert für startRecording ('auto' = Browser wählt) */
  value: string
  /** i18n-Schlüssel der Beschriftung */
  labelKey: string
  /** MIME-Typ für MediaRecorder; fehlt bei 'auto' */
  mimeType?: string
}

/** Alle Formate, die das Tool kennt, mit MIME-Typ für MediaRecorder.isTypeSupported. */
export const RECORDING_FORMATS: readonly Required<RecordingFormatOption>[] = Object.freeze([
  { value: 'webm-opus', labelKey: 'rec_format_webm', mimeType: 'audio/webm;codecs=opus' },
  { value: 'ogg-opus', labelKey: 'rec_format_ogg', mimeType: 'audio/ogg;codecs=opus' },
  { value: 'wav', labelKey: 'rec_format_wav', mimeType: 'audio/wav' },
])

const AUTO: RecordingFormatOption = Object.freeze({ value: 'auto', labelKey: 'rec_format_auto' })

/** Prüft per MediaRecorder, ob der Browser einen MIME-Typ aufnehmen kann. */
export function browserSupports(mimeType: string): boolean {
  return typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported(mimeType)
}

/**
 * Formate für die Auswahlliste: bei mehreren unterstützten Formaten zuerst „Automatisch“,
 * bei genau einem nur dieses, bei keinem nur „Automatisch“.
 */
export function availableRecordingFormats(
  isSupported: (mimeType: string) => boolean = browserSupports
): RecordingFormatOption[] {
  const supported = RECORDING_FORMATS.filter((fmt) => isSupported(fmt.mimeType))
  if (supported.length > 1) return [AUTO, ...supported]
  return supported.length > 0 ? supported : [AUTO]
}
