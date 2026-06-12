import axios from 'axios'
import router from '@/router'
import { Capacitor } from '@capacitor/core'
import { clearAuthSession, getValidToken, isAuthExpiredError } from '@/utils/authToken'

const isLocalNetworkHost = (hostname) => {
  if (!hostname) return false
  return (
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    hostname.startsWith('192.168.') ||
    hostname.startsWith('10.') ||
    /^172\.(1[6-9]|2\d|3[0-1])\./.test(hostname)
  )
}

// 甩手掌柜专属黑科技：动态智能识别 Web (Nginx 转发) 与 App 原生环境
const getBaseURL = () => {
  if (Capacitor.isNativePlatform()) {
    return 'http://106.55.249.7/api'
  }

  if (typeof window !== 'undefined') {
    const { hostname, origin, protocol } = window.location
    // 如果是在本地开发环境/局域网真机调试，或者云服务器 Web 端访问 (106.55.249.7)
    // 则继续使用相对路径 '/api'，这样你的 Nginx 代理和 Vite 开发代理都完美工作！
    if (
      origin.includes('106.55.249.7') ||
      ((protocol === 'http:' || protocol === 'https:') && isLocalNetworkHost(hostname))
    ) {
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
    const token = getValidToken()
    const publicPaths = ['/login', '/login2', '/register']
    const currentPath = router.currentRoute.value.path

    if (token) {
      config.headers['Authorization'] = 'Bearer ' + token
    } else if (!publicPaths.includes(currentPath)) {
      router.replace('/login2')
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
    if (isAuthExpiredError(error)) {
      clearAuthSession()
      const publicPaths = ['/login', '/login2', '/register']
      if (!publicPaths.includes(router.currentRoute.value.path)) {
        router.replace('/login2')
      }
    }
    return Promise.reject(error)
  }
)

export default service
