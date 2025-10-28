<template>
  <div class="page">
    <!-- 背景 & 渐变遮罩 -->
    <div class="bg"></div>
    <div class="overlay"></div>

    <main class="wrap">
      <!-- 左侧：插画 -->
      <section class="hero-image">
        <img src="/img/hero-boy.png" alt="Hero Image" class="hero-art" />
      </section>

      <!-- 右侧：登录卡片 -->
      <section class="login-card">
        <h1>欢迎来到 Crohn Disease Kingdom</h1>
        <p class="sub">这里是一个全新的登录界面，带给你更好的体验！</p>

        <!-- 登录表单 -->
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
        </form>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const phone = ref('')
const password = ref('')
const showPass = ref(false)
const loading = ref(false)
const error = ref('')

const canSubmit = computed(() => phone.value.length === 11 && password.value.length > 0)

async function submit() {
  if (!canSubmit.value || loading.value) return
  error.value = ''
  loading.value = true
  // 这里可以添加登录请求逻辑
}
</script>

<style scoped>
/* 主题色（想换风格只改这里） */
:root {
  --ink: #0f172a; /* 深色文字 */
  --card-bg: rgba(255, 255, 255, 1);
  --blur: 12px;
  --primary-1: #ffb86c; /* 暖橙 */
  --primary-2: #ff6b6b; /* 珊瑚红 */
}

.page {
  min-height: 100vh;
  position: relative;
  color: var(--ink);
  font-family: "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif;
}

.bg {
  position: fixed;
  inset: 0;
  z-index: -2;
  background-color: #0b1220; /* 边缘留黑/深色基底 */
}

/* 背景图片 */
.bg::before {
  content: "";
  position: absolute;
  inset: 0;
  background: url("/img/bg-stars.png") center no-repeat;
  background-size: cover;
}

/* 暖色罩层 */
.overlay {
  position: fixed;
  inset: 0;
  z-index: -1;
  background: radial-gradient(1200px circle at 10% 20%, rgba(255, 237, 213, .55), transparent 60%),
  linear-gradient(120deg, rgba(255, 184, 108, .28), rgba(255, 107, 107, .18));
}

/* 布局：两栏（左图片/右表单） */
.wrap {
  display: grid;
  grid-template-columns: 1fr min(460px, 92vw);
  gap: clamp(16px, 4vw, 36px);
  align-items: center;
  min-height: 100vh;
  padding: clamp(16px, 4vw, 40px);
}

@media (max-width: 900px) {
  .wrap {
    grid-template-columns: 1fr;
    place-items: center;
  }
}

/* 左侧插画 */
.hero-image {
  display: flex;
  justify-content: center;
  align-items: center;
}

.hero-art {
  width: clamp(160px, 24vw, 260px);
  filter: drop-shadow(0 12px 30px rgba(0, 0, 0, .35));
  margin-bottom: 12px;
}

/* 右侧登录框 */
.login-card {
  color: #fff;
  background: rgba(0, 0, 0, .6);
  padding: 20px;
  border-radius: 18px;
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.3);
  max-width: 500px;
}

.login-card h1 {
  font-size: 36px;
  font-weight: 700;
  margin-bottom: 20px;
}

.login-card .sub {
  font-size: 18px;
  margin-bottom: 20px;
}

.primary {
  width: 100%;
  border: 0;
  cursor: pointer;
  padding: 12px 14px;
  border-radius: 12px;
  background: linear-gradient(135deg, var(--primary-1), var(--primary-2));
  color: #fff;
  font-weight: 600;
  margin-top: 20px;
}

.primary:disabled {
  opacity: .6;
  cursor: not-allowed;
}

.field {
  display: block;
  margin: 12px 0;
}

.field input {
  width: 100%;
  padding: 12px 14px;
  background: rgba(255, 255, 255, .88);
  border: 1px solid rgba(0, 0, 0, .08);
  border-radius: 12px;
  outline: none;
}

.field input:focus {
  border-color: rgba(255, 107, 107, .55);
  box-shadow: 0 0 0 4px rgba(255, 107, 107, .15);
}

.eye {
  position: absolute;
  right: 6px;
  top: 50%;
  transform: translateY(-50%);
  border: 0;
  background: transparent;
  cursor: pointer;
  font-size: 18px;
  padding: 4px 8px;
}

.error {
  color: #b91c1c;
  font-size: 13px;
  margin-top: 8px;
}

.links {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  font-size: 13px;
}

.links a {
  color: #0b1220;
  opacity: .8;
  text-decoration: underline;
}

.card footer {
  text-align: center;
  font-size: 12px;
  opacity: .7;
  margin-top: 12px;
}
</style>
