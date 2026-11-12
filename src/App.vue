<template>
  <RouterView />
</template>

<script setup lang="ts">
  import { onMounted, onUnmounted } from 'vue'
  import { RouterView } from 'vue-router'
  import { useAlarmStore } from '@/stores/alarmStore'
  import { normalizeLang } from '@/i18n'

  // Shell for both pages: keeps language and theme in sync with the SSI navigation.
  const store = useAlarmStore()

  // Unsupported locales are ignored so the UI never falls back to raw keys.
  const applyLocale = (locale: unknown) => {
    const lang = normalizeLang(locale)
    if (lang && lang !== store.currentLang) store.setLanguage(lang)
  }

  const applyTheme = (theme: unknown) => {
    if (theme && theme !== store.currentTheme) store.setTheme(theme)
  }

  // Events of the SSI navigation: detail = { locale } or { theme }
  type NavEvent = CustomEvent<{ locale?: string; theme?: string } | undefined>
  const onLocaleChanged = (e: Event) => applyLocale((e as NavEvent).detail?.locale)
  const onThemeChanged = (e: Event) => applyTheme((e as NavEvent).detail?.theme)

  onMounted(() => {
    // Sync with the SSI nav's current state. The nav is included before the
    // (deferred) app module, so its lang/data-theme attributes are already set.
    // store.currentLang/currentTheme are read-only getters — go through the
    // store actions instead of assigning them.
    applyTheme(document.documentElement.getAttribute('data-theme'))
    applyLocale(document.documentElement.getAttribute('lang'))

    window.addEventListener('locale-changed', onLocaleChanged)
    window.addEventListener('theme-changed', onThemeChanged)
  })

  onUnmounted(() => {
    window.removeEventListener('locale-changed', onLocaleChanged)
    window.removeEventListener('theme-changed', onThemeChanged)
  })
</script>
