<template>
  <div class="player">
    <!-- Status bar -->
    <div class="player-status-bar">
      <div class="player-status-indicator" :class="statusClass">
        <span class="player-status-dot"></span>
        <span class="player-status-label">{{ statusLabel }}</span>
      </div>
      <span v-if="trackLabel" class="player-track-name" :title="trackLabel">
        <i class="fas fa-music" aria-hidden="true"></i>
        <span class="player-track-name-text">{{ trackLabel }}</span>
      </span>
      <span class="player-time-display" aria-live="off">{{ formatTime(store.currentTime) }}</span>
    </div>

    <!-- Progress bar -->
    <div class="player-progress-track" :title="t('player_progress')">
      <div class="player-progress-fill" :style="{ width: progressValue + '%' }"></div>
    </div>

    <!-- Controls row -->
    <div class="player-controls-row">
      <!-- Transport group -->
      <div class="player-transport" role="group" :aria-label="t('player_title')">
        <button
          class="transport-btn transport-btn--play"
          :class="{ 'transport-btn--active': store.isPlaying && !store.isPaused }"
          :disabled="store.isPlaying && !store.isPaused"
          :title="store.isPaused ? t('player_resume') : t('player_play')"
          :aria-label="store.isPaused ? t('player_resume') : t('player_play')"
          @click="handlePlay"
        >
          <i class="fas fa-play" aria-hidden="true"></i>
        </button>
        <button
          class="transport-btn transport-btn--pause"
          :disabled="!store.isPlaying || store.isPaused"
          :title="t('player_pause')"
          :aria-label="t('player_pause')"
          @click="pauseAlarm"
        >
          <i class="fas fa-pause" aria-hidden="true"></i>
        </button>
        <button
          class="transport-btn transport-btn--stop"
          :disabled="!store.isPlaying"
          :title="t('player_stop')"
          :aria-label="t('player_stop')"
          @click="stopAlarm"
        >
          <i class="fas fa-stop" aria-hidden="true"></i>
        </button>
      </div>

      <!-- Spacer -->
      <div class="player-controls-gap"></div>

      <!-- Loop toggle -->
      <button
        class="player-aux-btn"
        :class="{ 'player-aux-btn--active': store.isLooping }"
        :title="store.isLooping ? t('player_loop_on') : t('player_loop_off')"
        :aria-label="store.isLooping ? t('player_loop_on') : t('player_loop_off')"
        :aria-pressed="store.isLooping"
        @click="toggleLoop"
      >
        <i class="fas fa-repeat" aria-hidden="true"></i>
      </button>

      <!-- Volume group -->
      <div class="player-volume-group">
        <button
          class="player-aux-btn"
          :title="store.isMuted ? t('player_mute_on') : t('player_mute_off')"
          :aria-label="store.isMuted ? t('player_mute_on') : t('player_mute_off')"
          :aria-pressed="store.isMuted"
          @click="toggleMute"
        >
          <i
            :class="
              store.isMuted
                ? 'fas fa-volume-mute'
                : store.volume < 0.4
                  ? 'fas fa-volume-down'
                  : 'fas fa-volume-up'
            "
            aria-hidden="true"
          ></i>
        </button>
        <input
          type="range"
          class="form-range player-volume-slider"
          min="0"
          max="1"
          step="0.01"
          :value="store.volume"
          :class="{ 'player-volume-slider--muted': store.isMuted }"
          :title="`${t('player_volume')}: ${Math.round(store.volume * 100)}%`"
          :aria-label="t('player_volume')"
          :aria-valuetext="`${Math.round(store.volume * 100)}%`"
          @input="updateVolume(+$event.target.value)"
        />
        <span class="player-volume-pct">{{ Math.round(store.volume * 100) }}%</span>
      </div>
    </div>

    <!-- Keyboard hint -->
    <p class="player-hint">{{ t('player_info') }}</p>
  </div>
</template>

<script setup>
  import { computed } from 'vue'
  import { useAlarmStore } from '@/stores/alarmStore'
  import { usePlayer } from '@/composables/usePlayer'
  import { translations } from '@/i18n/translations'

  const store = useAlarmStore()
  const {
    startAlarm,
    pauseAlarm,
    resumeAlarm,
    stopAlarm,
    updateVolume,
    toggleMute,
    toggleLoop,
    formatTime,
  } = usePlayer()

  const t = (key) => translations[store.currentLang]?.[key] ?? key

  const PROGRESS_CYCLE_MS = 30000

  const progressValue = computed(
    () => ((store.currentTime % PROGRESS_CYCLE_MS) / PROGRESS_CYCLE_MS) * 100
  )

  const statusClass = computed(() => {
    if (store.isPlaying && !store.isPaused) return 'player-status--playing'
    if (store.isPaused) return 'player-status--paused'
    return 'player-status--stopped'
  })

  const statusLabel = computed(() => {
    if (store.isPlaying && !store.isPaused) return t('player_status_playing')
    if (store.isPaused) return t('player_status_paused')
    return t('player_status_stopped')
  })

  // Name of the sound currently loaded in the player: the active preset, or
  // "Benutzerdefiniert" for a hand-tuned sound. Shown only while playing/paused.
  const trackLabel = computed(() => {
    if (!store.isPlaying) return ''
    return store.activePresetKey ? t(store.activePresetKey) : t('player_custom')
  })

  function handlePlay() {
    store.isPaused ? resumeAlarm() : startAlarm()
  }
</script>
