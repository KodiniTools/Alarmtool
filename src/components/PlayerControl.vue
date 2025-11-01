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
          title="Abspielen"
        >
          <i class="fas fa-play"></i>
        </button>

        <!-- Pause Button -->
        <button
          id="playerPause"
          class="btn btn-secondary player-btn"
          :disabled="!store.isPlaying || store.isPaused"
          @click="pauseAlarm"
          title="Pause"
        >
          <i class="fas fa-pause"></i>
        </button>

        <!-- Stop Button -->
        <button
          id="playerStop"
          class="btn btn-danger player-btn"
          :disabled="!store.isPlaying"
          @click="stopAlarm"
          title="Stoppen"
        >
          <i class="fas fa-stop"></i>
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
            title="Fortschritt"
          />
          <span class="player-time">{{ formatTime(store.currentTime) }}</span>
        </div>

        <!-- Volume Container -->
        <div class="player-volume-container">
          <button
            id="playerMute"
            class="btn btn-outline-secondary player-btn"
            :title="store.isMuted ? 'Ton einschalten' : 'Stumm schalten'"
            @click="toggleMute"
          >
            <i :class="store.isMuted ? 'fas fa-volume-mute' : 'fas fa-volume-up'"></i>
          </button>
          <input
            id="playerVolume"
            type="range"
            class="form-range player-volume"
            min="0"
            max="1"
            step="0.01"
            :value="store.volume"
            :title="`Lautstärke: ${Math.round(store.volume * 100)}%`"
            @input="updateVolume($event.target.value)"
          />
        </div>

        <!-- Loop Button -->
        <button
          id="playerLoop"
          class="btn btn-outline-secondary player-btn"
          :class="{ active: store.isLooping }"
          :title="store.isLooping ? 'Loop deaktivieren' : 'Loop aktivieren'"
          @click="toggleLoop"
        >
          <i class="fas fa-repeat"></i>
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

const progressValue = computed(() => {
  // For continuous alarm: progress as cycle (e.g., every 30 seconds)
  const cycleLength = 30000 // 30 seconds
  return (store.currentTime % cycleLength) / cycleLength * 100
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
}
</style>
