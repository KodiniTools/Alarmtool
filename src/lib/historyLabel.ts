/** One step of the undo history, as recorded by useUndoRedo().recordChange. */
export interface HistoryAction {
  /** translation key naming the change (e.g. 'osc_frequency') */
  labelKey?: string
  /** affected oscillator, if any */
  oscId?: number
  /** extra translation key (e.g. a preset name) */
  detailKey?: string
}

/**
 * Human-readable description of an undo-history action,
 * e.g. "Frequenz (Hz) · Oszillator 4" or "Preset laden · Luftalarm".
 */
export function describeHistoryAction(
  action: HistoryAction | null | undefined,
  t: (key: string) => string
): string {
  if (!action) return ''
  const parts = [t(action.labelKey ?? 'history_change')]
  if (action.detailKey) parts.push(t(action.detailKey))
  if (Number.isInteger(action.oscId)) parts.push(`${t('osc_title_prefix')} ${action.oscId! + 1}`)
  return parts.join(' · ')
}
