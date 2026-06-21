import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useRecorderStore = defineStore('recorder', () => {
  const isRecording = ref(false)
  const recordingDuration = ref(60000)
  const remainingTime = ref(0)

  return { isRecording, recordingDuration, remainingTime }
})
