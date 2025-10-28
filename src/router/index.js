import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import LoginView2 from "@/views/LoginView2.vue";

export default createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/login', name: 'login', component: LoginView },
        { path: '/', redirect: '/login' },
        { path: '/login2', component: LoginView2, name: 'LoginView2' } // 兜底，防迷路
    ]
})
