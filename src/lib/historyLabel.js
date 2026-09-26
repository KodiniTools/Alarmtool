/**
 * Human-readable description of an undo-history action,
 * e.g. "Frequenz (Hz) · Oszillator 4" or "Preset laden · Luftalarm".
 * @param {import('@/composables/useUndoRedo').HistoryAction | null} action
 * @param {(key: string) => string} t translation function
 * @returns {string}
 */
export function describeHistoryAction(action, t) {
  if (!action) return ''
  const parts = [t(action.labelKey ?? 'history_change')]
  if (action.detailKey) parts.push(t(action.detailKey))
  if (Number.isInteger(action.oscId)) parts.push(`${t('osc_title_prefix')} ${action.oscId + 1}`)
  return parts.join(' · ')
}
