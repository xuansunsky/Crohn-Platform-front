import { createRouter, createWebHistory } from 'vue-router'
import { getAuthItem, getValidToken } from '@/utils/authToken'
import LoginView2 from '../views/LoginView2.vue'
import RegisterView from '../views/RegisterView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/login2' },
    { path: '/login', redirect: '/login2' },
    { path: '/login2', name: 'LoginView2', component: LoginView2 },
    { path: '/register', name: 'register', component: RegisterView },
    { path: '/dashboard', name: 'dashboard', component: () => import('../components/tabs/DashboardView.vue') },
    { path: '/insuranceMap', name: 'insuranceMap', component: () => import('@/components/tabs/PolicyMapTab.vue') },
    { path: '/ExperienceCard', name: 'ExperienceCard', component: () => import('@/components/ExperienceCard.vue') },
    { path: '/Liushi666', name: 'Liu666', component: () => import('@/components/ui/LiuShi666.vue') },
    { path: '/SocialTab', name: 'SocialTab', component: () => import('@/components/tabs/SocialTab.vue') },
    {
      path: '/AdminConsole',
      name: 'AdminConsole',
      component: () => import('@/components/tabs/AdminConsoleTab.vue'),
      meta: { requiresAuth: true, role: 1 }
    }
  ]
})

router.beforeEach((to, from, next) => {
  const token = getValidToken()
  const roleId = getAuthItem('roleId')
  const publicPaths = ['/login', '/login2', '/register']

  if (!token && !publicPaths.includes(to.path)) {
    next({ path: '/login2', query: { redirect: to.fullPath }, replace: true })
    return
  }

  if (token && publicPaths.includes(to.path)) {
    next({ path: '/dashboard', replace: true })
    return
  }

  if (to.meta.role === 1 && parseInt(roleId) !== 1) {
    console.warn('非国王身份，试图越权访问大殿，已重定向至普通仪表盘。')
    next({ path: '/dashboard', replace: true })
  } else {
    next()
  }
})

// 发版后旧 index.html 可能还指向已删除的 chunk，动态 import 会拿到 HTML 导致白屏
const CHUNK_RELOAD_KEY = 'crohn_chunk_reload_once'

router.onError((error) => {
  const message = String(error?.message || error || '')
  const isChunkError = /Loading chunk|Failed to fetch dynamically imported module|Importing a module script failed/i.test(message)
  if (!isChunkError) return

  if (!sessionStorage.getItem(CHUNK_RELOAD_KEY)) {
    sessionStorage.setItem(CHUNK_RELOAD_KEY, '1')
    window.location.reload()
    return
  }

  sessionStorage.removeItem(CHUNK_RELOAD_KEY)
  window.alert('页面资源加载失败，可能是缓存或部署不完整。请清缓存后重试，或联系管理员重新发布前端。')
})

export default router
