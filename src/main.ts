import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import { createAppRouter } from './router'
import { useSettingsStore } from './stores/settingsStore'
import { pageFromPath } from './lib/pageMeta'
import './styles/main.css'

const app = createApp(App)
const pinia = createPinia()
const router = createAppRouter()

app.use(pinia)
app.use(router)

// Title, canonical and hreflang follow the page. The first navigation resolves
// after mount, so App.vue has already adopted the SSI nav's language by then.
const settings = useSettingsStore(pinia)
router.afterEach((to) => settings.setPage(pageFromPath(to.path)))

app.mount('#app')
