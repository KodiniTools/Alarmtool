import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useRecorderStore = defineStore('recorder', () => {
  const isRecording = ref(false)
  const remainingTime = ref(0)

  return { isRecording, remainingTime }
})
