import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'

export default createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/login', name: 'login', component: LoginView },
        { path: '/', redirect: '/login' },
        { path: '/:pathMatch(.*)*', redirect: '/login' } // 兜底，防迷路
    ]
})
