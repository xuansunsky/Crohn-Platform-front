import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import '@/style.css'

import 'vant/lib/index.css'
import Vant from 'vant'

const app = createApp(App)

app.use(router)
app.use(Vant)

app.mount('#app')