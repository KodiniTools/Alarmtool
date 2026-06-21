<template>
  <div class="oscillator-item" :class="{ 'oscillator-disabled': !settings.enabled }">
    <OscillatorHeader
      :oscillator-id="oscillatorId"
      :enabled="settings.enabled"
      :has-clipboard="!!store.oscClipboard"
      :show-advanced="showAdvanced"
      @toggle-enabled="updateParameter('enabled', $event)"
      @copy="copySettings"
      @paste="pasteSettings"
      @toggle-advanced="showAdvanced = !showAdvanced"
    />

    <WaveformControl
      :wave-type="settings.waveType"
      :frequency="settings.frequency"
      :volume="settings.volume"
      :pan="settings.pan"
      :disabled="!settings.enabled"
      @update:wave-type="updateParameter('waveType', $event)"
      @update:frequency="updateParameter('frequency', $event)"
      @update:volume="updateParameter('volume', $event)"
      @update:pan="updateParameter('pan', $event)"
    />

    <ADSRControl
      v-show="showAdvanced && settings.enabled"
      :attack="settings.attack"
      :decay="settings.decay"
      :sustain="settings.sustain"
      :release="settings.release"
      :pattern="settings.pattern"
      @update:attack="updateParameter('attack', $event)"
      @update:decay="updateParameter('decay', $event)"
      @update:sustain="updateParameter('sustain', $event)"
      @update:release="updateParameter('release', $event)"
      @update:pattern="updateParameter('pattern', $event)"
    />
  </div>
</template>

<script setup>
  import { ref, watch } from 'vue'
  import { useAlarmStore } from '@/stores/alarmStore'
  import { useOscillators } from '@/composables/useOscillators'
  import { useToast } from '@/composables/useToast'
  import OscillatorHeader from './oscillator/OscillatorHeader.vue'
  import WaveformControl from './oscillator/WaveformControl.vue'
  import ADSRControl from './oscillator/ADSRControl.vue'

  const props = defineProps({
    oscillatorId: { type: Number, required: true },
    oscillator: { type: Object, required: true },
  })

  const store = useAlarmStore()
  const { updateOscillatorParameter, parsePattern } = useOscillators()
  const toast = useToast()

  const showAdvanced = ref(false)

  const settings = ref({ ...props.oscillator })

  watch(
    () => props.oscillator,
    (newOsc) => {
      settings.value = { ...newOsc }
    },
    { deep: true }
  )

  function updateParameter(param, value) {
    settings.value[param] = value
    updateOscillatorParameter(props.oscillatorId, param, value)
  }

  const CLIPBOARD_PARAMS = [
    'waveType',
    'frequency',
    'volume',
    'pan',
    'attack',
    'decay',
    'sustain',
    'release',
    'pattern',
  ]

  function copySettings() {
    store.oscClipboard = Object.fromEntries(CLIPBOARD_PARAMS.map((p) => [p, settings.value[p]]))
    toast.success('toast_osc_copied')
  }

  function pasteSettings() {
    if (!store.oscClipboard) return
    CLIPBOARD_PARAMS.forEach((param) => {
      updateOscillatorParameter(props.oscillatorId, param, store.oscClipboard[param])
    })
    parsePattern(props.oscillatorId)
    toast.success('toast_osc_pasted')
  }
</script>
