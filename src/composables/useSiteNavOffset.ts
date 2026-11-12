import { onMounted, onUnmounted } from 'vue'

/** CSS variable with the height of the global SSI navigation while it stays on screen. */
export const SITE_NAV_VAR = '--site-nav-height'

/**
 * The global navigation (SSI partial nav.html) sits before #app. If it is sticky or
 * fixed, it covers the top of the page, so sticky elements in the app need its height.
 * Returns 0 for a navigation that scrolls away (or none at all).
 */
export function measureSiteNav(doc: Document = document): number {
  const app = doc.getElementById('app')
  if (!app) return 0
  let height = 0
  for (const el of Array.from(doc.body.children)) {
    if (el === app) break
    if (!(el instanceof HTMLElement) || el.tagName === 'SCRIPT' || el.tagName === 'NOSCRIPT') {
      continue
    }
    // Wrapper (z. B. <div><nav>) oder die Navigation selbst
    const nav = el.matches('nav, header') ? el : el.querySelector<HTMLElement>('nav, header')
    const target = nav ?? el
    const position = getComputedStyle(target).position
    const wrapperPosition = getComputedStyle(el).position
    if (['sticky', 'fixed'].includes(position) || ['sticky', 'fixed'].includes(wrapperPosition)) {
      height = Math.max(height, Math.round(target.getBoundingClientRect().height))
    }
  }
  return height
}

/**
 * Keeps --site-nav-height on <html> in sync with the global navigation (resize,
 * mobile menu). Removes the variable again on unmount.
 */
export function useSiteNavOffset() {
  let observer: ResizeObserver | null = null

  const update = () => {
    document.documentElement.style.setProperty(SITE_NAV_VAR, `${measureSiteNav()}px`)
  }

  onMounted(() => {
    update()
    window.addEventListener('resize', update)
    if (window.ResizeObserver) {
      observer = new ResizeObserver(update)
      for (const el of Array.from(document.body.children)) {
        if (el.id === 'app') break
        if (el instanceof HTMLElement) observer.observe(el)
      }
    }
  })

  onUnmounted(() => {
    window.removeEventListener('resize', update)
    observer?.disconnect()
    document.documentElement.style.removeProperty(SITE_NAV_VAR)
  })

  return { update }
}
