<template>
  <div>
    <h2>{{ t('player_title') }}</h2>
    <div class="player-container">
      <div class="player-controls">
        <!-- Play Button -->
        <button
          id="playerPlay"
          class="btn btn-primary player-btn"
          :disabled="store.isPlaying && !store.isPaused"
          @click="handlePlay"
          :title="store.isPaused ? t('player_resume') : t('player_play')"
          :aria-label="store.isPaused ? t('player_resume') : t('player_play')"
        >
          <i class="fas fa-play" aria-hidden="true"></i>
        </button>

        <!-- Pause Button -->
        <button
          id="playerPause"
          class="btn btn-secondary player-btn"
          :disabled="!store.isPlaying || store.isPaused"
          @click="pauseAlarm"
          :title="t('player_pause')"
          :aria-label="t('player_pause')"
        >
          <i class="fas fa-pause" aria-hidden="true"></i>
        </button>

        <!-- Stop Button -->
        <button
          id="playerStop"
          class="btn btn-danger player-btn"
          :disabled="!store.isPlaying"
          @click="stopAlarm"
          :title="t('player_stop')"
          :aria-label="t('player_stop')"
        >
          <i class="fas fa-stop" aria-hidden="true"></i>
        </button>

        <!-- Progress Container -->
        <div class="player-progress-container">
          <input
            id="playerProgress"
            type="range"
            class="form-range player-progress"
            min="0"
            max="100"
            :value="progressValue"
            :title="t('player_progress')"
            :aria-label="t('player_progress')"
            aria-readonly="true"
          />
          <span class="player-time" aria-live="off">{{ formatTime(store.currentTime) }}</span>
        </div>

        <!-- Volume Container -->
        <div class="player-volume-container">
          <button
            id="playerMute"
            class="btn btn-outline-secondary player-btn"
            :title="store.isMuted ? t('player_mute_on') : t('player_mute_off')"
            :aria-label="store.isMuted ? t('player_mute_on') : t('player_mute_off')"
            :aria-pressed="store.isMuted"
            @click="toggleMute"
          >
            <i :class="store.isMuted ? 'fas fa-volume-mute' : 'fas fa-volume-up'" aria-hidden="true"></i>
          </button>
          <input
            id="playerVolume"
            type="range"
            class="form-range player-volume"
            min="0"
            max="1"
            step="0.01"
            :value="store.volume"
            :title="`${t('player_volume')}: ${Math.round(store.volume * 100)}%`"
            :aria-label="t('player_volume')"
            :aria-valuetext="`${Math.round(store.volume * 100)}%`"
            @input="updateVolume($event.target.value)"
          />
        </div>

        <!-- Loop Button -->
        <button
          id="playerLoop"
          class="btn btn-outline-secondary player-btn"
          :class="{ active: store.isLooping }"
          :title="store.isLooping ? t('player_loop_on') : t('player_loop_off')"
          :aria-label="store.isLooping ? t('player_loop_on') : t('player_loop_off')"
          :aria-pressed="store.isLooping"
          @click="toggleLoop"
        >
          <i class="fas fa-repeat" aria-hidden="true"></i>
        </button>
      </div>

      <div class="player-info">
        <small class="text-muted">{{ t('player_info') }}</small>
      </div>
    </div>
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
  formatTime
} = usePlayer()

const t = (key) => translations[store.currentLang]?.[key] || key

const PROGRESS_CYCLE_MS = 30000

const progressValue = computed(() => {
  return (store.currentTime % PROGRESS_CYCLE_MS) / PROGRESS_CYCLE_MS * 100
})

function handlePlay() {
  if (store.isPaused) {
    resumeAlarm()
  } else {
    startAlarm()
  }
}
</script>

<style scoped>
.player-btn.active {
  background-color: var(--titaniumgraphite-1) !important;
  color: var(--titaniumgraphite-4) !important;
  box-shadow: 0 2px 8px rgba(201, 152, 77, 0.3);
}

[data-theme="light"] .player-btn.active {
  box-shadow: 0 2px 8px rgba(201, 152, 77, 0.25);
}

</style>
