// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref, nextTick } from 'vue'
import { createPinia, setActivePinia } from 'pinia'

const recorder = {
  startRecording: vi.fn(),
  downloadUrl: ref(''),
  downloadFilename: ref(''),
  showDownload: ref(false),
  resetDownload: vi.fn(),
  recordedBlob: ref(null),
}
vi.mock('@/composables/useRecorder', () => ({ useRecorder: () => recorder }))

const convertBlob = vi.fn()
const resetConversion = vi.fn()
vi.mock('@/composables/useFormatConverter', async () => {
  const { ref } = await import('vue')
  return {
    useFormatConverter: () => ({
      isConverting: ref(false),
      conversionProgress: ref(0),
      convertedUrl: ref(''),
      convertedFilename: ref(''),
      convertBlob,
      resetConversion,
    }),
  }
})

import RecorderControl from '@/components/RecorderControl.vue'

describe('RecorderControl', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
    recorder.showDownload.value = false
    recorder.recordedBlob.value = null
  })

  it('zeigt die Umwandlung erst, wenn eine Aufnahme bereitsteht', async () => {
    const w = mount(RecorderControl)
    expect(w.find('.convert-section').exists()).toBe(false)
    recorder.showDownload.value = true
    await nextTick()
    expect(w.find('.convert-section').exists()).toBe(true)
  })

  it('wandelt die Aufnahme mit Dateiname und Mono-Einstellung um', async () => {
    recorder.showDownload.value = true
    recorder.recordedBlob.value = new Blob(['x'], { type: 'audio/webm' })
    recorder.downloadFilename.value = 'alarm.webm'
    const w = mount(RecorderControl)
    await w.findAll('.convert-actions button')[0].trigger('click')
    expect(convertBlob).toHaveBeenCalledWith(recorder.recordedBlob.value, 'mp3', 'alarm.webm', true)
  })

  it('verwirft beim Verwerfen auch die Umwandlung', async () => {
    recorder.showDownload.value = true
    const w = mount(RecorderControl)
    const dismiss = w.findAll('.recorder-actions button').find((b) => b.classes('btn-danger'))
    await dismiss.trigger('click')
    expect(resetConversion).toHaveBeenCalled()
    expect(recorder.resetDownload).toHaveBeenCalled()
  })
})
