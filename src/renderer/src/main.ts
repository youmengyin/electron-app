import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import { router } from '@renderer/router'
import pinia from '@renderer/stores'

const app = createApp(App)

app.use(pinia)
app.use(router)

app.mount('#app')
