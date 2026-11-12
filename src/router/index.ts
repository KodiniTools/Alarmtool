import { createRouter, createWebHistory, type Router, type RouterHistory } from 'vue-router'
import LandingPage from '@/views/LandingPage.vue'
import { PAGE_PATHS } from '@/lib/pageMeta'

// Höhe der globalen SSI-Navigation (sticky), damit Anker-Ziele nicht darunter liegen
const HASH_OFFSET = 88

/**
 * Router des Alarmtools: Landing-Page unter /alarmtool/, die App unter /alarmtool/app/.
 * `history` ist für Tests austauschbar (createMemoryHistory).
 */
export function createAppRouter(
  history: RouterHistory = createWebHistory(import.meta.env.BASE_URL)
): Router {
  return createRouter({
    history,
    routes: [
      { path: PAGE_PATHS.landing, name: 'landing', component: LandingPage },
      // Lazy: Audio-Stores und Komponenten lädt erst die App-Seite
      { path: PAGE_PATHS.app, name: 'app', component: () => import('@/views/AppPage.vue') },
      // Alte oder falsche Pfade landen auf der Landing-Page
      { path: '/:pathMatch(.*)*', redirect: PAGE_PATHS.landing },
    ],
    scrollBehavior(to, _from, savedPosition) {
      if (savedPosition) return savedPosition
      if (to.hash) return { el: to.hash, top: HASH_OFFSET }
      return { top: 0 }
    },
  })
}
