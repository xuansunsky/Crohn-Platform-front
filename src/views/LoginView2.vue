<template>
  <div class="page">
    <!-- 动态星空背景 -->
    <div class="bg"></div>
    <div class="stars"></div>
    <div class="overlay"></div>
    <CyberAlert
        v-if="showSuccessAlert"
        title="身份验证通过"
        msg="welcome back to Kingdom,Architect-Xuan！"
    />
    <!-- 登录卡片 -->
    <main class="login-card" :class="{ 'floating': isHovered }">
      <div class="hero-container" @mouseenter="heroHover = true" @mouseleave="heroHover = false">
        <img src="/img/hero-boy.png" alt="Hero" class="hero-art" :class="{ 'hover': heroHover }" />
        <div class="glow"></div>
      </div>

      <h1 class="title">
        <span class="gradient-text">Crohn Disease Kingdom</span>
      </h1>
      <p class="sub">欢迎勇士，开启你的星辉之旅 ✨</p>

      <form @submit.prevent="submit" class="form">
        <!-- 手机号 -->
        <div class="input-group">
          <input
              v-model.trim="phone"
              type="tel"
              inputmode="numeric"
              pattern="[0-9]{11}"
              required
              id="phone"
              class="input"
              :class="{ 'filled': phone }"
          />
          <label for="phone" class="label">手机号</label>
          <div class="focus-line"></div>
        </div>

        <!-- 密码 -->
        <div class="input-group">
          <input
              :type="showPass ? 'text' : 'password'"
              v-model="password"
              required
              id="password"
              class="input"
              :class="{ 'filled': password }"
          />
          <label for="password" class="label">密码</label>
          <div class="focus-line"></div>
          <button type="button" class="eye-toggle" @click="showPass = !showPass">
            <i :class="showPass ? 'ri-eye-off-line' : 'ri-eye-line'"></i>
          </button>
        </div>

        <!-- 提交按钮 -->
        <button class="primary-btn" :disabled="!canSubmit || loading" type="submit">
          <span v-if="!loading" class="btn-text">
            <span>进入王国</span>
            <i class="ri-arrow-right-line"></i>
          </span>
          <span v-else class="loading">
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="dot"></span>
          </span>
        </button>

        <p v-if="error" class="error-msg">
          <i class="ri-error-warning-line"></i> {{ error }}
        </p>
        <div class="links">
          <p>还没有账号？</p>
          <button type="button" class="register-btn" @click="goRegister">
            去注册 🌈
          </button>
        </div>
      </form>
    </main>

  </div>

</template>
<script setup>
import {loginUser} from "@/api/user.js";

const showSuccessAlert = ref(false)
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router' // 引入路由
import axios from 'axios'
import CyberAlert from "@/components/CyberAlert.vue"; // 引入 axios (确保你 npm install axios 了)

const router = useRouter()

// 表单状态
const phone = ref('')
const password = ref('')
const showPass = ref(false)
const loading = ref(false)
const error = ref('')
const isHovered = ref(false)
const heroHover = ref(false)

// 校验规则
const canSubmit = computed(() =>
    /^1[3-9]\d{9}$/.test(phone.value) && password.value.length >= 6
)

// 跳转注册页
function goRegister() {
  router.push('/register')
}

// ✅ 真正的登录逻辑
async function submit() {
  if (!canSubmit.value || loading.value) return

  // 1. 重置状态
  error.value = ''
  loading.value = true

  try {
    // 2. 发送请求给你的 Spring Boot 后端
    // 注意：这里用 '/api' 是假设你配置了 vite 代理，如果没有，就写 'http://localhost:8080/users/login'
    const response = await loginUser( {
      phoneNumber: phone.value, // ⚠️ 关键：后端 User 对象里叫 phoneNumber，前端变量叫 phone，这里要对应上！
      password: password.value
    })

     // 拿到 ApiResponse

    // 3. 判断后端返回的状态码 (假设你后端成功是 200)
    if (response.status === 200) {
      // 🎉 登录成功！
      // A. 把 Token 存进保险箱 (LocalStorage)
      const res = response.data // 你的 ApiResponse 把 token 放在 data
      localStorage.setItem('token', res.token)
      localStorage.setItem('roleId', res.roleId)
      localStorage.setItem('userId', res.userId)
      showSuccessAlert.value = true

      // C. 穿越！前往仪表盘
      setTimeout(async () => {
        await router.push('/dashboard')
      }, 1500)

    } else {
      // 😭 业务逻辑失败 (比如密码错了)
      error.value = response.message || '登录失败，请检查账号密码'
    }

  } catch (err) {
    // 💥 网络崩了，或者后端报错 500
    console.error(err)
    error.value = '连接王国的通道拥堵，请稍后再试 (网络错误)'
  } finally {
    // 4. 无论成功失败，都要停止转圈圈
    loading.value = false
  }
}
</script>
<style scoped>
/* 主题色 */
:root {
  --ink: #0f172a;
  --card-bg: rgba(25, 30, 50, 0.6);
  --primary-1: #ffb86c;
  --primary-2: #ff6b6b;
  --accent-glow: rgba(255, 184, 108, 0.4);
}

/* 页面布局 */
.page {
  min-height: 100vh;
  position: relative;
  display: grid;
  place-items: center;
  padding: 20px;
  overflow: hidden;
  font-family: 'Segoe UI', 'PingFang SC', sans-serif;
}

/* 背景 */
.bg {
  position: fixed;
  inset: 0;
  z-index: -3;
  background: radial-gradient(ellipse at top, #1a2332 0%, #0b1220 70%);
}

.stars {
  position: fixed;
  inset: 0;
  z-index: -2;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><circle fill="%23ffffff" opacity="0.8" cx="10" cy="10" r="1"/><circle fill="%23ffffff" opacity="0.6" cx="50" cy="30" r="0.8"/><circle fill="%23ffffff" opacity="0.9" cx="80" cy="70" r="1.2"/><circle fill="%23ffffff" opacity="0.5" cx="30" cy="80" r="0.7"/></svg>') repeat;
  background-size: 80px;
  animation: twinkle 8s infinite;
}

@keyframes twinkle {
  0%, 100% { opacity: 0.7; }
  50% { opacity: 1; }
}

.overlay {
  position: fixed;
  inset: 0;
  z-index: -1;
  background:
      radial-gradient(800px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(255, 184, 108, 0.15), transparent 50%),
      linear-gradient(120deg, rgba(255, 184, 108, .1), rgba(255, 107, 107, .08));
  transition: background 0.3s ease;
}

/* 登录卡片 */
.login-card {
  position: relative;
  width: 100%;
  max-width: 460px;
  border-radius: 28px;
  padding: 32px 28px;
  text-align: center;
  color: #fff;
  background: var(--card-bg);
  backdrop-filter: blur(20px) saturate(150%);
  -webkit-backdrop-filter: blur(20px) saturate(150%);
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow:
      0 20px 40px rgba(0, 0, 0, 0.3),
      0 0 0 1px rgba(255, 255, 255, 0.05) inset;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.1);
  transform: translateY(0);
}

.login-card.floating {
  transform: translateY(-8px);
  box-shadow:
      0 32px 64px rgba(0, 0, 0, 0.4),
      0 0 0 1px rgba(255, 184, 108, 0.2) inset,
      0 0 30px var(--accent-glow);
}

/* 英雄插画 */
.hero-container {
  position: relative;
  display: inline-block;
  margin: -100px auto 16px;
  padding: 20px;
}

.hero-art {
  width: clamp(140px, 35vw, 200px);
  filter: drop-shadow(0 16px 40px rgba(0, 0, 0, .5));
  transition: all 0.3s ease;
  transform: translateY(0) scale(1);
}

.hero-art.hover {
  transform: translateY(-8px) scale(1.05);
}

.glow {
  position: absolute;
  inset: -20px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 184, 108, 0.3), transparent 70%);
  opacity: 0;
  transition: opacity 0.3s;
  pointer-events: none;
}

.hero-container:hover .glow {
  opacity: 1;
}

/* 标题 */
.title {
  font-size: clamp(26px, 6vw, 36px);
  font-weight: 800;
  margin: 0 0 12px;
  background: linear-gradient(135deg, #fff, #ffb86c);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 2px 10px rgba(255, 184, 108, 0.3);
}

.sub {
  font-size: 15px;
  opacity: 0.85;
  margin-bottom: 28px;
  font-weight: 500;
}

/* 输入组 */
.input-group {
  position: relative;
  margin: 24px 0;
}

.input {
  width: 100%;
  padding: 16px 16px 16px 0;
  border: none;
  border-bottom: 2px solid rgba(255, 255, 255, 0.2);
  background: transparent;
  color: #fff;
  font-size: 16px;
  outline: none;
  transition: all 0.3s ease;
}

.input::placeholder {
  color: transparent;
}

.label {
  position: absolute;
  left: 0;
  top: 16px;
  font-size: 16px;
  color: rgba(255, 255, 255, 0.6);
  pointer-events: none;
  transition: all 0.3s ease;
  font-weight: 500;
}

.input:focus ~ .label,
.input.filled ~ .label {
  top: -8px;
  font-size: 13px;
  color: var(--primary-1);
}

.focus-line {
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, var(--primary-1), var(--primary-2));
  transition: all 0.4s ease;
  transform: translateX(-50%);
}

.input:focus ~ .focus-line {
  width: 100%;
}

/* 眼睛按钮 */
.eye-toggle {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.5);
  font-size: 20px;
  cursor: pointer;
  padding: 4px;
  transition: color 0.2s;
}

.eye-toggle:hover {
  color: #fff;
}

/* 登录按钮 */
.primary-btn {
  width: 100%;
  margin-top: 32px;
  padding: 16px;
  border: none;
  border-radius: 16px;
  background: linear-gradient(135deg, var(--primary-1), var(--primary-2));
  color: #fff;
  font-weight: 600;
  font-size: 17px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.primary-btn::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transform: translateX(-100%);
  transition: transform 0.6s;
}

.primary-btn:hover::before {
  transform: translateX(100%);
}

.primary-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none !important;
}

.btn-text {
  display: flex;
  align-items: center;
  gap: 8px;
  transition: transform 0.2s;
}

.primary-btn:hover .btn-text {
  transform: translateX(4px);
}

.loading {
  display: flex;
  gap: 4px;
}

.dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #fff;
  animation: pulse 1.2s infinite;
}

.dot:nth-child(2) { animation-delay: 0.2s; }
.dot:nth-child(3) { animation-delay: 0.4s; }

@keyframes pulse {
  0%, 100% { transform: scale(0.8); opacity: 0.5; }
  50% { transform: scale(1.2); opacity: 1; }
}

/* 错误信息 */
.error-msg {
  color: #ffb86c;
  font-size: 14px;
  margin-top: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  animation: shake 0.3s ease;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-4px); }
  75% { transform: translateX(4px); }
}

/* 响应式 */
@media (max-width: 480px) {
  .login-card {
    padding: 24px 20px;
    margin: 10px;
  }
  .hero-container {
    margin-top: -80px;
  }
}
/* 注册区 */
.links {
  margin-top: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
}

.register-btn {
  background: none;
  border: none;
  color: #ffb86c;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 15px;
}

.register-btn:hover {
  color: #ffdba1;
  text-shadow: 0 0 10px rgba(255, 184, 108, 0.4);
  transform: translateY(-2px);
}

</style>