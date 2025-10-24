<template>
  <div class="page">
    <!-- 背景 & 渐变遮罩 -->
    <div class="bg"></div>
    <div class="overlay"></div>

    <!-- 内容 -->
    <main class="wrap">
      <!-- 左侧：插画 + 文案（小屏会自动排到上面） -->
      <section class="hero">
        <img class="hero-art" src="/img/hero-boy.png" alt="Warm illustration" />
        <h1>welcome to crohn disease <br>👑✨kingdom✨👑</h1>
        <p class="sub">这里有最坚强，最深刻，最智慧的灵魂一起记录， 互相支持</p>
      </section>

      <!-- 右侧：登录卡片 -->
      <section class="card">
        <h2>登录</h2>
        <form @submit.prevent="submit">
          <label class="field">
            <span>手机号</span>
            <input
                v-model.trim="phone"
                type="tel"
                inputmode="numeric"
                pattern="[0-9]{11}"
                placeholder="请输入 11 位手机号"
                required
            />
          </label>

          <label class="field">
            <span>密码</span>
            <div class="pass">
              <input
                  :type="showPass ? 'text' : 'password'"
                  v-model="password"
                  placeholder="请输入密码"
                  required
              />
              <button type="button" class="eye" @click="showPass = !showPass">
                {{ showPass ? '🙈' : '👁️' }}
              </button>
            </div>
          </label>

          <button class="primary" :disabled="!canSubmit || loading">
            <span v-if="!loading">进入王国</span>
            <span v-else>正在进入…</span>
          </button>

          <p v-if="error" class="error">{{ error }}</p>

          <div class="links">
            <a href="javascript:void(0)">忘记密码</a>
            <a href="javascript:void(0)">去注册</a>
          </div>
        </form>
        <footer>© {{ year }} Crohn Kingdom</footer>
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
/* 主题色（想换风格只改这里） */
:root{
  --ink:#0f172a;           /* 深色文字 */
  --card-bg: rgba(255,255,255,.22);
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
  /* 删掉会让画面发软的小放大 */
  /* transform: scale(1.02); */
}

/* 用伪元素放图：限制最大宽度 = 1080，不放大就不糊 */
.bg::before{
  content: "";
  position: absolute; inset: 0;
  background: url("/img/bg-stars.png") center no-repeat;

  /* 把下面这行： */
  /* background-size: clamp(320px, 100vw, 1080px) auto; */

  /* 换成这行： */
  background-size: cover;}

  /* `margin: 0 auto;` 这一行现在也不需要了，可以删掉，cover 会自动处理居中 */
  /* margin: 0 auto; */

/* 暖色罩层：只做颜色，不做模糊（模糊会把后面的图一起糊掉） */
.overlay{
  position: fixed; inset: 0; z-index: -1;
  background:
      radial-gradient(1200px circle at 10% 20%, rgba(255,237,213,.55), transparent 60%),
      linear-gradient(120deg, rgba(255,184,108,.28), rgba(255,107,107,.18));
  /* 不要 blur */
  /* backdrop-filter: blur(2px); */
  /* -webkit-backdrop-filter: blur(2px); */
}

/* 布局：两栏（左文案/右表单），小屏自动一栏居中 */
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

.hero{
  color: #fff;
  text-shadow: 0 2px 18px rgba(0,0,0,.35);
  max-width: 720px;
}
.hero-art{
  width: clamp(160px, 24vw, 260px);
  filter: drop-shadow(0 12px 30px rgba(0,0,0,.35));
  margin-bottom: 12px;
}
.hero h1 {
  font-size: clamp(3px, 6vw, 50px); /* 字更大 */
  font-weight: 700; /* 更有力量 */
  letter-spacing: 1px; /* 稍微拉开字距 */
  margin-bottom: 10px;
}

.hero .sub {
  opacity: 0.95;
  font-size: clamp(18px, 3vw, 22px); /* 字更大一点 */
  font-weight: 500;
  line-height: 1.6;
}
/* 玻璃拟态登录卡 */
.card{
  background: var(--card-bg);
  backdrop-filter: blur(var(--blur));
  -webkit-backdrop-filter: blur(var(--blur));
  border:1px solid rgba(255,255,255,.35);
  box-shadow: 0 18px 40px rgba(0,0,0,.20);
  border-radius: 18px;
  padding: 26px 22px 18px;
  color:#0b1220;
}
.card h2{ margin:0 0 10px; }

.field{ display:block; margin: 12px 0; }
.field span{ display:block; font-size:13px; opacity:.8; margin-bottom:6px; }
.field input{
  width:100%; padding:12px 14px;
  background: rgba(255,255,255,.88);
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
