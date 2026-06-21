import { ref } from 'vue'
import { useAlarmStore } from '@/stores/alarmStore'

const TIMER_INTERVAL_MS = 100

export function useRecordingTimer() {
  const store = useAlarmStore()
  const intervalId = ref(null)
  const timeoutId = ref(null)

  function start(durationMs, onExpire) {
    const endTime = Date.now() + durationMs

    intervalId.value = setInterval(() => {
      const remaining = endTime - Date.now()
      if (remaining <= 0) {
        store.remainingTime = 0
        clearInterval(intervalId.value)
        intervalId.value = null
        return
      }
      store.remainingTime = remaining
    }, TIMER_INTERVAL_MS)

    timeoutId.value = setTimeout(() => {
      clear()
      store.isRecording = false
      store.remainingTime = 0
      onExpire()
    }, durationMs)
  }

  function clear() {
    if (timeoutId.value) {
      clearTimeout(timeoutId.value)
      timeoutId.value = null
    }
    if (intervalId.value) {
      clearInterval(intervalId.value)
      intervalId.value = null
    }
  }

  return { start, clear }
}
