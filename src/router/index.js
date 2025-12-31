import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import LoginView2 from "../views/LoginView2.vue"
import RegisterView from "../views/RegisterView.vue"
import DashboardView from "../views/DashboardView.vue"
import insuranceMap from "@/components/tabs/PolicyMapTab.vue"
import ExperienceCard from "@/components/ExperienceCard.vue"
import TestTab from "@/components/tabs/TestTab.vue"

// 创建路由实例
const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', redirect: '/login' },
        { path: '/login', name: 'login', component: LoginView },
        { path: '/login2', name: 'LoginView2', component: LoginView2 },
        { path: '/register', name: 'register', component: RegisterView },
        { path: '/dashboard', name: 'dashboard', component: DashboardView },
        { path: '/insuranceMap', name: 'insuranceMap', component: insuranceMap },
        { path: '/ExperienceCard', name: 'ExperienceCard', component: ExperienceCard },
        { path: '/TestTab', name: 'TestTab', component: TestTab },
        {
            path: '/AdminConsole',
            name: 'AdminConsole',
            // 使用懒加载提高首页性能
            component: () => import('@/views/AdminConsole.vue'),
            meta: { requiresAuth: true, role: 1 } // 标记：需要鉴权且必须是国王权限
        }
    ]
})

// 全局前置守卫：身份校验逻辑
router.beforeEach((to, from, next) => {
    // 从缓存获取当前用户的角色 ID
    const roleId = localStorage.getItem('roleId')

    // 如果目标路由明确要求“国王”权限（role === 1）
    // 且当前登录用户的 roleId 不匹配，则强制拦截并重定向
    if (to.meta.role === 1 && parseInt(roleId) !== 1) {
        console.warn('非国王身份，试图越权访问大殿，已重定向至普通仪表盘。')
        next('/dashboard')
    } else {
        // 验证通过，放行
        next()
    }
})

export default router