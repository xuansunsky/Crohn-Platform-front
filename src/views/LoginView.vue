<template xmlns="http://www.w3.org/1999/html">
  <div class="page">
    <!-- 背景 & 渐变遮罩 -->
    <div class="bg"></div>
    <div class="overlay"></div>

    <!-- 内容 -->
    <main class="wrap">
      <!-- 左侧：插画 + 文案（小屏会自动排到上面） -->
      <section class="hero">

        <h1>welcome to crohn disease <br>👑✨kingdom✨👑</h1>
        <p class="sub">这里有最坚强，最智慧，最深刻的灵魂一起记录， 互相支持！</p>
        <p class="sub"><span class="clickable" @click="goToLoginView2">🌹点击进入！</span></p>
      </section>

    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const phone = ref('')
const password = ref('')
const showPass = ref(false)
const loading = ref(false)
const error = ref('')
const year = new Date().getFullYear()

// 跳转到新版登录页
const goToLoginView2 = () => {
  router.push({ name: 'LoginView2' })
}

const canSubmit = computed(() => phone.value.length === 11 && password.value.length > 0)

async function submit () {
  if (!canSubmit.value || loading.value) return
  error.value = ''
  loading.value = true
  try {
    const resp = await fetch('/api/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phoneNumber: phone.value, password: password.value })
    })
    const data = await resp.json().catch(() => ({}))

    if (resp.ok) {
      if (data?.data) localStorage.setItem('token', data.data) // 如果后端返回 token
      router.push('/dashboard') // 之后新建仪表盘页面
    } else {
      error.value = data?.message || '手机号或密码错误'
    }
  } catch (e) {
    error.value = '网络异常，请稍后重试'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* 主题色 */
:root{
  --ink:#0f172a;           /* 深色文字 */
  --card-bg: rgba(255,255,255,1);
  --blur: 12px;
  --primary-1:#ffb86c;     /* 暖橙 */
  --primary-2:#ff6b6b;     /* 珊瑚红 */
}

.page{
  min-height:100vh;
  position:relative;
  color:var(--ink);
  font-family: "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif;
}

.bg{
  position: fixed;
  inset: 0;
  z-index: -2;
  background-color: #0b1220; /* 边缘留黑/深色基底 */
}

/* 背景图 */
.bg::before{
  content: "";
  position: absolute; inset: 0;
  background: url("/img/bg-stars.png") center no-repeat;
  background-size: cover;
}

/* 暖色罩层 */
.overlay{
  position: fixed; inset: 0; z-index: -1;
  background:
      radial-gradient(1200px circle at 10% 20%, rgba(255,237,213,.55), transparent 60%),
      linear-gradient(120deg, rgba(255,184,108,.28), rgba(255,107,107,.18));
}

/* 页面布局 */
.wrap{
  display:grid;
  grid-template-columns: 1fr min(460px, 92vw);
  gap: clamp(16px, 4vw, 36px);
  align-items:center;
  min-height:100vh;
  padding: clamp(16px, 4vw, 40px);
}
@media (max-width: 900px){
  .wrap{ grid-template-columns: 1fr; place-items:center; }
}

.hero {
  color: #fff;
  transform:translate(300px,10px);
  text-align: center; /* 文本水平居中 */
  display: flex; /* 使用 flexbox 让内容居中 */
  flex-direction: column;
  justify-content: center; /* 垂直居中 */
  align-items: center; /* 水平居中 */
  max-width: 720px;
  margin: 0 auto;
  height: 100vh; /* 让容器高度充满屏幕 */
}
.hero-art{
  width: clamp(160px, 24vw, 260px);
  filter: drop-shadow(0 12px 30px rgba(0,0,0,.35));
  margin-bottom: 12px;
}
.hero h1 {
  margin-bottom: 30px;
  font-size: clamp(3px, 6vw, 50px); /* 字更大 */
  font-weight: 700; /* 更有力量 */
  letter-spacing: 1px; /* 稍微拉开字距 */

}

.hero .sub {
  margin-bottom: 30px;
  opacity: 0.95;
  font-size: clamp(18px, 3vw, 22px); /* 字更大一点 */
  font-weight: 500;
  line-height: 1;
}
/* 玻璃拟态登录卡 */
.card{
  background: var(--card-bg);
  transform:translate(-200px,-100px);
  backdrop-filter: blur(var(--blur));
  -webkit-backdrop-filter: blur(var(--blur));
  border:1px solid rgba(255,255,255,.35);
  box-shadow: 0 18px 40px rgba(0,0,0,1);
  border-radius: 18px;
  padding: 26px 22px 18px;
  color:#0b1220;
}
.card h2{ margin:0 0 10px; }

.field{ display:block; margin: 12px 0; }
.field span{ display:block; font-size:13px; opacity:1; margin-bottom:6px; }
.field input{
  width:80%; padding:12px 14px;
  background: var(--card-bg);
  border:1px solid rgba(0,0,0,.08);
  border-radius: 12px;
  outline:none;
}
.field input:focus{ border-color: rgba(255,107,107,.55); box-shadow: 0 0 0 4px rgba(255,107,107,.15); }

/* 密码显示切换 */
.pass{ position:relative; }
.eye{
  position:absolute; right:6px; top:50%; transform: translateY(-50%);
  border:0; background:transparent; cursor:pointer; font-size:18px;
  padding:4px 8px;
}

.primary{
  width:100%; border:0; cursor:pointer;
  margin-top:8px; padding:12px 14px; border-radius:12px; color:#fff;
  background: linear-gradient(135deg, var(--primary-1), var(--primary-2));
  font-weight:600;
}
.primary:disabled{ opacity:.6; cursor:not-allowed; }

.error{ color:#b91c1c; font-size:13px; margin:8px 2px 0; }
.links{
  display:flex; justify-content:space-between; margin-top:10px;
  font-size:13px;
}
.links a{ color:#0b1220; opacity:.8; text-decoration: underline; }
.card footer{
  text-align:center; font-size:12px; opacity:.7; margin-top:12px;
}
</style>
