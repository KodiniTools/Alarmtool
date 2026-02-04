import { reactive } from 'vue'
import { useAlarmStore } from '@/stores/alarmStore'
import { translations } from '@/i18n/translations'

const state = reactive({
  toasts: [],
  nextId: 0
})

const TOAST_DEFAULTS = {
  success: { icon: 'fas fa-check-circle', duration: 3500 },
  error: { icon: 'fas fa-exclamation-circle', duration: 6000 },
  warning: { icon: 'fas fa-exclamation-triangle', duration: 5000 },
  info: { icon: 'fas fa-info-circle', duration: 4000 }
}

function t(key) {
  const store = useAlarmStore()
  return translations[store.currentLang]?.[key] || key
}

function addToast(type, messageKey, options = {}) {
  const defaults = TOAST_DEFAULTS[type] || TOAST_DEFAULTS.info
  const id = state.nextId++

  const message = options.raw
    ? messageKey
    : t(messageKey)

  const toast = {
    id,
    type,
    message,
    icon: options.icon || defaults.icon,
    duration: options.duration || defaults.duration,
    visible: false,
    leaving: false
  }

  state.toasts.push(toast)

  // Trigger enter animation on next tick
  requestAnimationFrame(() => {
    const idx = state.toasts.findIndex(t => t.id === id)
    if (idx !== -1) state.toasts[idx].visible = true
  })

  // Auto-dismiss
  if (toast.duration > 0) {
    setTimeout(() => removeToast(id), toast.duration)
  }

  // Limit to 5 visible toasts
  while (state.toasts.length > 5) {
    state.toasts.shift()
  }

  return id
}

function removeToast(id) {
  const idx = state.toasts.findIndex(t => t.id === id)
  if (idx === -1) return

  state.toasts[idx].leaving = true

  setTimeout(() => {
    const removeIdx = state.toasts.findIndex(t => t.id === id)
    if (removeIdx !== -1) state.toasts.splice(removeIdx, 1)
  }, 350)
}

export function useToast() {
  return {
    toasts: state.toasts,

    success(messageKey, options) {
      return addToast('success', messageKey, options)
    },

    error(messageKey, options) {
      return addToast('error', messageKey, options)
    },

    warning(messageKey, options) {
      return addToast('warning', messageKey, options)
    },

    info(messageKey, options) {
      return addToast('info', messageKey, options)
    },

    dismiss(id) {
      removeToast(id)
    },

    clear() {
      state.toasts.splice(0, state.toasts.length)
    }
  }
}
