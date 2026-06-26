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

export const getApiBaseURL = () => getBaseURL()

export const getWsBaseURL = (userId) => {
  if (typeof window === 'undefined') {
    return `wss://crohn.pobifighting.tech/ws/${userId}`
  }

  const { hostname, protocol, host } = window.location

  if (isLocalNetworkHost(hostname)) {
    const wsHost = hostname === 'localhost' ? 'localhost' : hostname
    return `ws://${wsHost}:8080/ws/${userId}`
  }

  const wsProtocol = protocol === 'https:' ? 'wss' : 'ws'
  return `${wsProtocol}://${host}/ws/${userId}`
}

// 动态识别 Web / App 环境，避免 HTTPS 页面请求 HTTP 接口被浏览器拦截
const getBaseURL = () => {
  if (Capacitor.isNativePlatform()) {
    return 'https://crohn.pobifighting.tech/api'
  }

  if (typeof window !== 'undefined') {
    const { protocol } = window.location
    // 浏览器里一律走同源 /api，交给 Vite 开发代理或 Nginx 反代到后端
    if (protocol === 'http:' || protocol === 'https:') {
      return '/api'
    }
  }

  return 'https://crohn.pobifighting.tech/api'
}

const service = axios.create({
  baseURL: getBaseURL(),
  timeout: 12000
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
