import { createRouter, createWebHistory } from 'vue-router'
import LoginView2 from '../views/LoginView2.vue'
import RegisterView from '../views/RegisterView.vue'
import DashboardView from '../components/tabs/DashboardView.vue'
import ExperienceCard from '@/components/ExperienceCard.vue'
import InsuranceMap from '@/components/tabs/PolicyMapTab.vue'
import SocialTab from '@/components/tabs/SocialTab.vue'
import LiuShi666 from '@/components/ui/LiuShi666.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/login2' },
    { path: '/login', redirect: '/login2' },
    { path: '/login2', name: 'LoginView2', component: LoginView2 },
    { path: '/register', name: 'register', component: RegisterView },
    { path: '/dashboard', name: 'dashboard', component: DashboardView },
    { path: '/insuranceMap', name: 'insuranceMap', component: InsuranceMap },
    { path: '/ExperienceCard', name: 'ExperienceCard', component: ExperienceCard },
    { path: '/Liushi666', name: 'Liu666', component: LiuShi666 },
    { path: '/SocialTab', name: 'SocialTab', component: SocialTab },
    {
      path: '/AdminConsole',
      name: 'AdminConsole',
      component: () => import('@/components/tabs/AdminConsoleTab.vue'),
      meta: { requiresAuth: true, role: 1 }
    }
  ]
})

router.beforeEach((to, from, next) => {
  const roleId = localStorage.getItem('roleId')

  if (to.meta.role === 1 && parseInt(roleId) !== 1) {
    console.warn('非国王身份，试图越权访问大殿，已重定向至普通仪表盘。')
    next('/dashboard')
  } else {
    next()
  }
})

export default router