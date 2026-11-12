// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { SliderField, UiSwitch } from '@/components/ui'

const updateFilter = vi.fn()
const recordChange = vi.fn()
vi.mock('@/composables/useAudioContext', () => ({
  useAudioContext: () => ({ updateFilter }),
}))
vi.mock('@/composables/useUndoRedo', () => ({
  useUndoRedo: () => ({ recordChange }),
}))

describe('SliderField', () => {
  const base = { modelValue: 440, label: 'Frequenz', min: 50, max: 2000 }

  it('verknüpft das Label mit dem Slider und benennt das Zahlfeld', () => {
    const w = mount(SliderField, { props: base })
    const [range, number] = w.findAll('input')
    expect(range.attributes('type')).toBe('range')
    expect(w.get('label').attributes('for')).toBe(range.attributes('id'))
    expect(range.attributes('id')).toBeTruthy()
    expect(number.attributes('aria-label')).toBe('Frequenz')
  })

  it('übernimmt eine feste id und zeigt den Hilfetext nur wenn gesetzt', async () => {
    const w = mount(SliderField, { props: { ...base, id: 'filterQ' } })
    expect(w.get('input[type="range"]').attributes('id')).toBe('filterQ')
    expect(w.find('.form-text').exists()).toBe(false)
    await w.setProps({ help: 'Hz' })
    expect(w.get('.form-text').text()).toBe('Hz')
  })

  it('meldet Eingaben beider Felder als Zahl', async () => {
    const w = mount(SliderField, { props: base })
    const [range, number] = w.findAll('input')
    await range.setValue('500')
    await number.setValue('600')
    expect(w.emitted('update:modelValue')).toEqual([[500], [600]])
    // setValue löst bei Inputs auch 'change' aus
    expect(w.emitted('change')).toEqual([[500], [600]])
  })

  it('deaktiviert beide Eingaben', () => {
    const w = mount(SliderField, { props: { ...base, disabled: true } })
    for (const i of w.findAll('input')) expect(i.element.disabled).toBe(true)
  })
})

describe('UiSwitch', () => {
  it('rendert einen benannten Schalter mit den Klassen aus form.css', () => {
    const w = mount(UiSwitch, {
      props: { modelValue: true, label: 'Deaktivieren', title: 'Deaktivieren' },
    })
    const input = w.get('input')
    expect(w.classes()).toContain('toggle-switch')
    expect(w.attributes('title')).toBe('Deaktivieren')
    expect(input.attributes('role')).toBe('switch')
    expect(input.attributes('aria-label')).toBe('Deaktivieren')
    expect(input.element.checked).toBe(true)
    expect(w.find('.toggle-slider').exists()).toBe(true)
  })

  it('meldet den neuen Zustand', async () => {
    const w = mount(UiSwitch, { props: { modelValue: true, label: 'x' } })
    await w.get('input').setValue(false)
    expect(w.emitted('update:modelValue')).toEqual([[false]])
  })

  it('setzt ohne title kein title-Attribut', () => {
    const w = mount(UiSwitch, { props: { modelValue: false, label: 'x' } })
    expect(w.attributes('title')).toBeUndefined()
  })
})

describe('FilterControl mit SliderField', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    updateFilter.mockClear()
    recordChange.mockClear()
  })

  it('gibt Frequenz und Q als Zahl an den Audio-Filter weiter', async () => {
    const { default: FilterControl } = await import('@/components/FilterControl.vue')
    const { useAlarmStore } = await import('@/stores/alarmStore')
    const store = useAlarmStore()
    store.updateFilterSettings({ type: 'lowpass', frequency: 2000, Q: 1 })
    const w = mount(FilterControl)
    await w.vm.$nextTick()

    await w.get('#filterFrequency').setValue('1500')
    expect(updateFilter).toHaveBeenLastCalledWith({ type: 'lowpass', frequency: 1500, Q: 1 })
    expect(recordChange).toHaveBeenCalledWith({ labelKey: 'tab_filter' })

    const qNumber = w.findAll('.slider-input-group')[1].findAll('input')[1]
    await qNumber.setValue('3')
    expect(updateFilter).toHaveBeenLastCalledWith({ type: 'lowpass', frequency: 1500, Q: 3 })
    expect(w.find('label[for="filterQ"]').exists()).toBe(true)
  })
})
