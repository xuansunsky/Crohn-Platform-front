import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import '@/style.css' // 你原本的 Tailwind 样式

// 1. 引入 Vant 样式 (这步你做对了)
import 'vant/lib/index.css';
// 2. 引入 Vant 组件库 (这步你也做对了)
import Vant from 'vant';

const app = createApp(App);

// 3. 关键一步：告诉 Vue 使用 Vant！
app.use(router);
app.use(Vant); // <--- 兄弟，就是缺了这一句！

app.mount('#app');