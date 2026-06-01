import axios from 'axios'
import router from '@/router'

// 甩手掌柜专属黑科技：动态智能识别 Web (Nginx 转发) 与 App 原生环境
const getBaseURL = () => {
  if (typeof window !== 'undefined') {
    const origin = window.location.origin;
    // 如果是在本地开发环境 (localhost) 或者云服务器 Web 端访问 (106.55.249.7)
    // 则继续使用相对路径 '/api'，这样你的 Nginx 代理和 Vite 开发代理都完美工作！
    if (origin.includes('106.55.249.7') || origin.includes('localhost:5173')) {
      return '/api'
    }
  }
  // 如果在手机 App 端运行（Capacitor 容器，其 origin 是 localhost 或 file:// 等）
  // 手机端没有 Nginx 做就地代理，直接请求公网绝对地址！
  return 'http://106.55.249.7/api'
}

const service = axios.create({
  baseURL: getBaseURL(),
  timeout: 5000
})

service.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')

    if (token) {
      config.headers['Authorization'] = 'Bearer ' + token
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

service.interceptors.response.use(
  response => {
    return response.data
  },
  error => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token')
      router.push('/login2')
    }
    return Promise.reject(error)
  }
)

export default service