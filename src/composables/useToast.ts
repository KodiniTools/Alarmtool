import { reactive } from 'vue'
import { useAlarmStore } from '@/stores/alarmStore'
import { translate } from '@/i18n'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface Toast {
  id: number
  type: ToastType
  message: string
  icon: string
  duration: number
  visible: boolean
  leaving: boolean
}

export interface ToastOptions {
  /** messageKey is already the text (no translation) */
  raw?: boolean
  icon?: string
  /** ms until auto-dismiss; 0 keeps the toast */
  duration?: number
}

const state = reactive<{ toasts: Toast[]; nextId: number }>({
  toasts: [],
  nextId: 0,
})

const TOAST_DEFAULTS: Record<ToastType, { icon: string; duration: number }> = {
  success: { icon: 'fas fa-check-circle', duration: 3500 },
  error: { icon: 'fas fa-exclamation-circle', duration: 6000 },
  warning: { icon: 'fas fa-exclamation-triangle', duration: 5000 },
  info: { icon: 'fas fa-info-circle', duration: 4000 },
}

function t(key: string): string {
  return translate(useAlarmStore().currentLang, key)
}

function addToast(type: ToastType, messageKey: string, options: ToastOptions = {}): number {
  const defaults = TOAST_DEFAULTS[type] || TOAST_DEFAULTS.info
  const id = state.nextId++

  const message = options.raw ? messageKey : t(messageKey)

  const toast: Toast = {
    id,
    type,
    message,
    icon: options.icon || defaults.icon,
    duration: options.duration || defaults.duration,
    visible: false,
    leaving: false,
  }

  state.toasts.push(toast)

  // Trigger enter animation on next tick
  requestAnimationFrame(() => {
    const idx = state.toasts.findIndex((t) => t.id === id)
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

function removeToast(id: number) {
  const idx = state.toasts.findIndex((t) => t.id === id)
  if (idx === -1) return

  state.toasts[idx].leaving = true

  setTimeout(() => {
    const removeIdx = state.toasts.findIndex((t) => t.id === id)
    if (removeIdx !== -1) state.toasts.splice(removeIdx, 1)
  }, 350)
}

export function useToast() {
  return {
    toasts: state.toasts,

    success(messageKey: string, options?: ToastOptions) {
      return addToast('success', messageKey, options)
    },

    error(messageKey: string, options?: ToastOptions) {
      return addToast('error', messageKey, options)
    },

    warning(messageKey: string, options?: ToastOptions) {
      return addToast('warning', messageKey, options)
    },

    info(messageKey: string, options?: ToastOptions) {
      return addToast('info', messageKey, options)
    },

    dismiss(id: number) {
      removeToast(id)
    },
  }
}
