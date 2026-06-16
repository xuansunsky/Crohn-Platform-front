import { createRouter, createWebHistory } from 'vue-router'
import { getValidToken } from '@/utils/authToken'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/login2' },
    { path: '/login', redirect: '/login2' },
    { path: '/login2', name: 'LoginView2', component: () => import('../views/LoginView2.vue') },
    { path: '/register', name: 'register', component: () => import('../views/RegisterView.vue') },
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
  const roleId = localStorage.getItem('roleId')
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

export default router
