import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import '@/style.css'

import 'vant/lib/index.css'
import Vant from 'vant'
// 仅在开发环境或 Mock 测试环境下呼出移动端控制台
if (process.env.NODE_ENV === 'development' || window.location.hostname.includes('192.168')) {
    import('eruda').then((eruda) => {
      eruda.default.init();
    });
  }
const app = createApp(App)

app.use(router)
app.use(Vant)

app.mount('#app')